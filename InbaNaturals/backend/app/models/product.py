from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    tagline = Column(String(200), default="")
    description = Column(Text, default="")
    price = Column(Integer, nullable=False)
    original_price = Column(Integer, nullable=True)
    category = Column(String(20), nullable=False)
    sizes = Column(Text, default="[]")
    ingredients = Column(Text, default="")
    how_to_use = Column(Text, default="")
    image_url = Column(String(500), default="")
    in_stock = Column(Boolean, default=True)
    stock_quantity = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
