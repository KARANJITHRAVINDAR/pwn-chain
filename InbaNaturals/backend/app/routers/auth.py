from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    TokenResponse,
    UserOut,
)
from app.services.email import send_verification_email
from app.utils.dependencies import get_current_user
from app.utils.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)

router = APIRouter()


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.username == payload.username) | (User.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already registered",
        )

    user = User(
        username=payload.username,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    verify_token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "purpose": "email_verify"},
        expires_delta=None,
    )
    sent = send_verification_email(user.email, verify_token)
    if not sent:
        pass

    return user


@router.get("/verify-email", response_model=MessageResponse)
def verify_email(token: str = Query(...), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None or payload.get("purpose") != "email_verify":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token",
        )
    try:
        user_id = int(payload.get("sub"))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return MessageResponse(message="Email already verified")

    user.is_verified = True
    db.commit()
    return MessageResponse(message="Email verified successfully")


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in",
        )

    token = create_access_token(data={"sub": str(user.id)})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
