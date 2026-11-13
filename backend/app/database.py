import asyncio
import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger("uvicorn.error")

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False
    loop: Optional[asyncio.AbstractEventLoop] = None
    seeded: bool = False
    last_error: Optional[str] = None

db_instance = Database()

async def connect_to_mongo():
    logger.info("Connecting to MongoDB...")
    try:
        db_instance.client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            tlsAllowInvalidCertificates=True
        )
        # Test ping to verify cluster access
        await db_instance.client.admin.command('ping')
        db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]
        db_instance.is_connected = True
        db_instance.last_error = None
        logger.info(f"Connected to MongoDB database: {settings.MONGODB_DB_NAME}")
        
        # Create indexes
        await init_db_indexes()
    except Exception as e:
        db_instance.is_connected = False
        db_instance.last_error = type(e).__name__
        logger.warning(f"Could not connect to MongoDB cluster: {e}")
        logger.warning("Backend will run with local fallback storage until MongoDB cluster is connected.")

async def ensure_connected() -> bool:
    """Connect on first use, and reconnect if the event loop changed.

    Serverless platforms (Vercel) may not run FastAPI's startup hook and can serve
    later requests on a new event loop; a Motor client is bound to the loop it was
    created on, so it is recreated when that happens.
    """
    loop = asyncio.get_running_loop()
    if db_instance.is_connected and db_instance.loop is loop:
        return True
    if db_instance.client is not None:
        try:
            db_instance.client.close()
        except Exception:
            pass
        db_instance.client = None
        db_instance.db = None
        db_instance.is_connected = False
    await connect_to_mongo()
    db_instance.loop = loop
    return db_instance.is_connected

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_database() -> Optional[AsyncIOMotorDatabase]:
    return db_instance.db

async def init_db_indexes():
    if not db_instance.is_connected or db_instance.db is None:
        return
    try:
        # Users index
        await db_instance.db.users.create_index("email", unique=True)
        # Projects index
        await db_instance.db.projects.create_index("order")
        # Enquiries index
        await db_instance.db.enquiries.create_index("created_at")
        logger.info("Database indexes initialized successfully.")
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")
