from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "InbaNaturals"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "mysql+pymysql://root:Kavin%40123@localhost/inbanaturals"

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

    # Platform Webhook integration
    PLATFORM_URL: str = "http://localhost:8001"
    # TODO: Sync both components to the same .env value before final submission
    WEBHOOK_SECRET: str = "super-secret-webhook-key-12345"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
