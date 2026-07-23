import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.models.wallet import WalletTransaction
from app.schemas.order import CreateOrderRequest, OrderListOut, OrderOut
from app.utils.dependencies import get_current_user

router = APIRouter()


def _generate_order_number() -> str:
    return "IN" + datetime.utcnow().strftime("%y%m%d%H%M%S%f")[:-3]


@router.post("/orders", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    items_data = []
    subtotal = 0
    for ci in cart_items:
        product = db.query(Product).filter(Product.id == ci.product_id).first()
        if not product:
            continue
        sizes = []
        try:
            sizes = json.loads(product.sizes) if isinstance(product.sizes, str) else product.sizes
        except (json.JSONDecodeError, TypeError):
            pass
        size_label = sizes[ci.size] if isinstance(sizes, list) and ci.size < len(sizes) else ""
        items_data.append({
            "product_id": product.id,
            "product_name": product.name,
            "size": size_label,
            "quantity": ci.quantity,
            "unit_price": product.price,
        })
        subtotal += product.price * ci.quantity

    total = subtotal

    if current_user.wallet_balance < total:
        raise HTTPException(status_code=400, detail="Insufficient wallet balance")

    order_number = _generate_order_number()
    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        items=json.dumps(items_data),
        subtotal=subtotal,
        discount=0,
        total=total,
        status="confirmed",
        shipping_name=payload.shipping_name,
        shipping_phone=payload.shipping_phone,
        shipping_address=payload.shipping_address,
        notes=payload.notes,
    )
    db.add(order)
    db.flush()

    for item in items_data:
        db.add(OrderItem(
            order_id=order.id,
            product_id=item["product_id"],
            product_name=item["product_name"],
            size=item["size"],
            quantity=item["quantity"],
            unit_price=item["unit_price"],
        ))

    current_user.wallet_balance -= total
    db.add(WalletTransaction(
        user_id=current_user.id,
        amount=-total,
        type="debit",
        description=f"Order #{order_number}",
        balance_after=current_user.wallet_balance,
    ))

    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return order


@router.get("/orders", response_model=list[OrderListOut])
def list_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == current_user.id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
