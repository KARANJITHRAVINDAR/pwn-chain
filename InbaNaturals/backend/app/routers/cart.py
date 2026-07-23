import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.models.user import User
from app.schemas.cart import CartItemCreate, CartItemOut, CartItemUpdate, CartOut
from app.utils.dependencies import get_current_user

router = APIRouter()


def _parse_sizes(product: Product) -> list[str]:
    try:
        sizes = json.loads(product.sizes) if isinstance(product.sizes, str) else product.sizes
        return sizes if isinstance(sizes, list) else []
    except (json.JSONDecodeError, TypeError):
        return []


def _cart_item_to_out(item: CartItem, product: Product) -> CartItemOut:
    sizes = _parse_sizes(product)
    size_label = sizes[item.size] if item.size < len(sizes) else ""
    return CartItemOut(
        id=item.id,
        product_id=item.product_id,
        size=item.size,
        quantity=item.quantity,
        product_name=product.name,
        product_slug=product.slug,
        product_price=product.price,
        product_original_price=product.original_price,
        product_image=product.image_url,
        product_category=product.category,
        size_label=size_label,
    )


@router.get("/cart", response_model=CartOut)
def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    result = []
    total = 0
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            continue
        out = _cart_item_to_out(item, product)
        result.append(out)
        total += product.price * item.quantity

    return CartOut(items=result, total=total)


@router.post("/cart", response_model=CartOut, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = (
        db.query(CartItem)
        .filter(
            CartItem.user_id == current_user.id,
            CartItem.product_id == payload.product_id,
            CartItem.size == payload.size,
        )
        .first()
    )
    if existing:
        existing.quantity += payload.quantity
    else:
        existing = CartItem(
            user_id=current_user.id,
            product_id=payload.product_id,
            size=payload.size,
            quantity=payload.quantity,
        )
        db.add(existing)

    db.commit()
    return _build_cart(current_user.id, db)


@router.put("/cart/{item_id}", response_model=CartOut)
def update_cart_item(
    item_id: int,
    payload: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    item.quantity = payload.quantity
    db.commit()
    return _build_cart(current_user.id, db)


@router.delete("/cart/{item_id}", response_model=CartOut)
def remove_cart_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(CartItem)
        .filter(CartItem.id == item_id, CartItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    db.delete(item)
    db.commit()
    return _build_cart(current_user.id, db)


def _build_cart(user_id: int, db: Session) -> CartOut:
    items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    result = []
    total = 0
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            continue
        out = _cart_item_to_out(item, product)
        result.append(out)
        total += product.price * item.quantity

    return CartOut(items=result, total=total)
