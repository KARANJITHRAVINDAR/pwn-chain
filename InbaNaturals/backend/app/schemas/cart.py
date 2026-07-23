from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CartItemCreate(BaseModel):
    product_id: int
    size: int = 0
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    id: int
    product_id: int
    size: int
    quantity: int
    product_name: str = ""
    product_slug: str = ""
    product_price: int = 0
    product_original_price: Optional[int] = None
    product_image: str = ""
    product_category: str = ""
    size_label: str = ""

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    items: list[CartItemOut] = []
    total: int = 0
