from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_number = Column(String(20), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    items = Column(Text, default="[]")
    subtotal = Column(Integer, default=0)
    discount = Column(Integer, default=0)
    total = Column(Integer, nullable=False)
    status = Column(String(20), default="confirmed")
    shipping_name = Column(String(100), default="")
    shipping_phone = Column(String(20), default="")
    shipping_address = Column(Text, default="")
    notes = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(100), nullable=False)
    size = Column(String(20), default="")
    quantity = Column(Integer, default=1)
    unit_price = Column(Integer, nullable=False)
