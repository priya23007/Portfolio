import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger("uvicorn.error")

class Database:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None
    is_connected: bool = False

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
        logger.info(f"Connected to MongoDB database: {settings.MONGODB_DB_NAME}")
        
        # Create indexes
        await init_db_indexes()
    except Exception as e:
        db_instance.is_connected = False
        logger.warning(f"Could not connect to MongoDB cluster: {e}")
        logger.warning("Backend will run with local fallback storage until MongoDB cluster is connected.")

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
