from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    type = Column(String(10), nullable=False)
    description = Column(String(255), default="")
    balance_after = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
