from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    slug: str
    tagline: str = ""
    description: str = ""
    price: int
    original_price: Optional[int] = None
    category: str
    sizes: str = "[]"
    ingredients: str = ""
    how_to_use: str = ""
    image_url: str = ""
    in_stock: bool = True
    stock_quantity: int = 0
    is_featured: bool = False


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    original_price: Optional[int] = None
    category: Optional[str] = None
    sizes: Optional[str] = None
    ingredients: Optional[str] = None
    how_to_use: Optional[str] = None
    image_url: Optional[str] = None
    in_stock: Optional[bool] = None
    stock_quantity: Optional[int] = None
    is_featured: Optional[bool] = None


class ProductOut(BaseModel):
    id: int
    name: str
    slug: str
    tagline: str
    description: str
    price: int
    original_price: Optional[int] = None
    category: str
    sizes: str
    ingredients: str
    how_to_use: str
    image_url: str
    in_stock: bool
    stock_quantity: int
    is_featured: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class ProductListOut(BaseModel):
    id: int
    name: str
    slug: str
    tagline: str
    price: int
    original_price: Optional[int] = None
    category: str
    image_url: str
    in_stock: bool
    is_featured: bool
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
