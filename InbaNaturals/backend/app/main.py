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

    return app


app = create_app()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
