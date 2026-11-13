import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # MongoDB
    MONGODB_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "portfolio_db"

    # Admin Auth
    JWT_SECRET: str = "portfolio_super_secure_jwt_secret_key_change_in_production_123456"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    ADMIN_EMAIL: str = "admin@portfolio.com"
    ADMIN_INITIAL_PASSWORD: str = "Admin@123456"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: Optional[str] = ""
    CLOUDINARY_API_KEY: Optional[str] = ""
    CLOUDINARY_API_SECRET: Optional[str] = ""

    # Google SMTP
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = ""
    SMTP_PASSWORD: Optional[str] = ""
    SMTP_FROM_NAME: str = "Portfolio Enquiry System"
    NOTIFICATION_RECEIVER_EMAIL: Optional[str] = ""

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    class Config:
        # backend/.env locally; on Vercel the values come from Project → Settings → Environment Variables
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
        extra = "ignore"

settings = Settings()
