from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import admin, auth, cart, orders, products, reviews, wallet
import app.models  # noqa: F401 — register all models with Base.metadata


import secrets

# Generate STAGE1_FLAG at startup
STAGE1_FLAG = f"STAGE1_FLAG_{secrets.token_hex(8)}"


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
    @app.get("/api/v1/health")
    async def legacy_health_check(session: str = None):
        import time
        import json
        import hmac
        import hashlib
        import httpx

        response_payload = {
            "status": "ok",
            "service": "inbanaturals-api",
            "version": "1.0.4-legacy",
            "internal_flag": STAGE1_FLAG,
            "debug_mode": True,
        }

        if session:
            # VULNERABLE-CHAIN: Stage 1 exploit success auto-reports to platform webhook for session-scoped progression tracking.
            webhook_payload = {
                "session_id": session,
                "stage": 1,
                "proof_token": STAGE1_FLAG,
                "timestamp": float(time.time()),
            }

            try:
                # Serialize payload and calculate HMAC-SHA256 signature
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
                    print(f"[STAGE1] Webhook fired for session {session}, platform responded {r.status_code}")
            except Exception as e:
                print(f"[STAGE1] Webhook failed: {e}")

        return response_payload

    return app


app = create_app()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    print("\n" + "=" * 50)
    print(f"STAGE 1 FLAG: {STAGE1_FLAG}")
    print("=" * 50 + "\n")

