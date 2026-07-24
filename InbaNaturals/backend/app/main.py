from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import admin, auth, cart, orders, products, reviews, wallet
import app.models  # noqa: F401 — register all models with Base.metadata


def create_app() -> FastAPI:
    app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS.split(","),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(products.router, prefix="/api", tags=["products"])
    app.include_router(cart.router, prefix="/api", tags=["cart"])
    app.include_router(orders.router, prefix="/api", tags=["orders"])
    app.include_router(wallet.router, prefix="/api", tags=["wallet"])
    app.include_router(reviews.router, prefix="/api", tags=["reviews"])
    app.include_router(admin.router, prefix="/api/admin", tags=["admin"])

    @app.get("/api/health")
    def health_check():
        return {"status": "ok", "app": settings.APP_NAME}

    # VULNERABLE: Stage 1 - undocumented legacy endpoint, discoverable via directory brute-force (gobuster/ffuf) or Burp Suite passive scan. Not linked in frontend.
    # CWE-200: Information Exposure / Sensitive Data Exposure
    # CWE-613: Insufficient Session Expiration & Session Hijacking
    # CWE-425: Direct Request (Forced Browsing) / Undocumented Endpoint Exposure
    @app.get("/api/v1/health")
    def legacy_health_check():
        from app.utils.security import ACTIVE_SESSIONS
        from app.database import SessionLocal

        demo_token = ACTIVE_SESSIONS.get("demo", {}).get("token", "")
        if not demo_token:
            db = SessionLocal()
            try:
                demo_token = ensure_demo_session(db)
            finally:
                db.close()

        return {
            "status": "ok",
            "service": "inbanaturals-api",
            "version": "1.0.4-legacy",
            "debug_active_sessions": [{"username": "demo", "token": demo_token}],
            "debug_mode": True,
        }

    return app


app = create_app()


def ensure_demo_session(db):
    from app.models.user import User
    from app.utils.security import create_access_token, get_password_hash, ACTIVE_SESSIONS
    import time

    demo_session = ACTIVE_SESSIONS.get("demo")
    if demo_session and demo_session.get("token"):
        return demo_session["token"]

    demo_user = db.query(User).filter(User.username == "demo").first()
    if not demo_user:
        demo_user = User(
            username="demo",
            email="demo@inbanaturals.com",
            password_hash=get_password_hash("demo123"),
            full_name="Demo User",
            role="user",
            wallet_balance=5000,
            is_verified=True,
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    token = create_access_token(data={"sub": str(demo_user.id)})
    ACTIVE_SESSIONS["demo"] = {
        "token": token,
        "issued_at": time.time(),
        "hijacked": False
    }
    print("\n" + "=" * 50)
    print(f"DEMO ACTIVE SESSION TOKEN (HIJACKABLE): {token}")
    print("=" * 50 + "\n")
    return token


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

    from app.database import SessionLocal
    db = SessionLocal()
    try:
        ensure_demo_session(db)
    finally:
        db.close()

