from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class AddFundsRequest(BaseModel):
    amount: int
    description: str = "Added funds"


class WalletTransactionOut(BaseModel):
    id: int
    amount: int
    type: str
    description: str
    balance_after: int
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class WalletOut(BaseModel):
    balance: int = 0
    transactions: list[WalletTransactionOut] = []
