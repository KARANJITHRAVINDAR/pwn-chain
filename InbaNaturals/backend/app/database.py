from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


def _build_engine():
    url = settings.DATABASE_URL
    kwargs = {"echo": settings.DEBUG}

    if url.startswith("sqlite"):
        # SQLite needs connect_args for thread safety
        kwargs["connect_args"] = {"check_same_thread": False}
    else:
        # MySQL / PostgreSQL — enable connection-pool health checks
        kwargs["pool_pre_ping"] = True
        kwargs["pool_recycle"] = 3600

    return create_engine(url, **kwargs)


engine = _build_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
