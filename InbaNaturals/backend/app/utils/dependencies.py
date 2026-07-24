from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    # CWE-613: Insufficient Session Expiration & CWE-200: Information Exposure detection logic
    from app.utils.security import ACTIVE_SESSIONS
    from app.config import settings
    import time
    import json
    import hmac
    import hashlib
    import httpx

    if token:
        demo_session = ACTIVE_SESSIONS.get("demo")
        if demo_session and demo_session.get("token") == token:
            # Check idempotency: Only trigger webhook on the FIRST authenticated misuse (Session Hijacking)
            if not demo_session.get("hijacked", False):
                session_id = request.query_params.get("session") or request.headers.get("x-session") or request.headers.get("session")
                if session_id:
                    demo_session["hijacked"] = True
                    # VULNERABLE-CHAIN: Stage 1 exploit validation auto-reports to platform webhook for session-scoped progression tracking.
                    webhook_payload = {
                        "session_id": session_id,
                        "stage": 1,
                        "proof": "session_hijack_confirmed",
                        "proof_token": "session_hijack_confirmed",
                        "artifact_type": "jwt",
                        "victim_user": "demo",
                        "timestamp": float(time.time()),
                    }
                    try:
                        payload_str = json.dumps(webhook_payload)
                        signature = hmac.new(
                            settings.WEBHOOK_SECRET.encode(),
                            payload_str.encode(),
                            hashlib.sha256
                        ).hexdigest()

                        async with httpx.AsyncClient() as client:
                            webhook_url = f"{settings.PLATFORM_URL}/api/webhook/stage-complete"
                            r = await client.post(
                                webhook_url,
                                content=payload_str,
                                headers={
                                    "Content-Type": "application/json",
                                    "x-signature": signature
                                },
                                timeout=5.0
                            )
                            print(f"[STAGE1] Session hijack confirmed for demo user. Webhook fired for session {session_id}, platform responded {r.status_code}")
                    except Exception as e:
                        # Non-blocking error handling: Webhook failure should not break the user-facing API response
                        print(f"[STAGE1] Webhook notification failed: {e}")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user_id: int = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
