from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.wallet import WalletTransaction
from app.schemas.wallet import AddFundsRequest, WalletOut
from app.utils.dependencies import get_current_user

router = APIRouter()


@router.get("/wallet", response_model=WalletOut)
def get_wallet(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transactions = (
        db.query(WalletTransaction)
        .filter(WalletTransaction.user_id == current_user.id)
        .order_by(WalletTransaction.created_at.desc())
        .limit(50)
        .all()
    )
    return WalletOut(balance=current_user.wallet_balance, transactions=transactions)


@router.post("/wallet/add-funds", response_model=WalletOut)
def add_funds(
    payload: AddFundsRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.amount < 1:
        raise HTTPException(status_code=400, detail="Amount must be positive")

    current_user.wallet_balance += payload.amount
    db.add(WalletTransaction(
        user_id=current_user.id,
        amount=payload.amount,
        type="credit",
        description=payload.description,
        balance_after=current_user.wallet_balance,
    ))
    db.commit()
    db.refresh(current_user)

    transactions = (
        db.query(WalletTransaction)
        .filter(WalletTransaction.user_id == current_user.id)
        .order_by(WalletTransaction.created_at.desc())
        .limit(50)
        .all()
    )
    return WalletOut(balance=current_user.wallet_balance, transactions=transactions)
