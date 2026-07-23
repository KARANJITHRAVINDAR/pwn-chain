from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "InbaNaturals"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite:///./inbanaturals.db"

    # JWT
    SECRET_KEY: str = "inba-naturals-dev-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    # SMTP (Gmail)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""

    # File uploads
    UPLOAD_DIR: str = "uploads"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
