from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CreateOrderRequest(BaseModel):
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    notes: str = ""


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    size: str
    quantity: int
    unit_price: int

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    order_number: str
    user_id: int
    items: str
    subtotal: int
    discount: int
    total: int
    status: str
    shipping_name: str
    shipping_phone: str
    shipping_address: str
    notes: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class OrderListOut(BaseModel):
    id: int
    order_number: str
    total: int
    status: str
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
