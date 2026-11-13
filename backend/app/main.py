import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import ensure_connected, close_mongo_connection, db_instance
from app.services.storage import seed_initial_database
from app.services.cloudinary_svc import is_cloudinary_configured, LOCAL_UPLOAD_DIR
from app.services.email_service import is_smtp_configured

from app.routes.auth import router as auth_router
from app.routes.public import router as public_router
from app.routes.admin_content import router as admin_content_router
from app.routes.admin_projects import router as admin_projects_router
from app.routes.admin_enquiry import router as admin_enquiry_router
from app.routes.admin_upload import router as admin_upload_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("portfolio.api")

async def ensure_ready():
    """Connect to MongoDB (and seed it once) if this instance isn't ready yet."""
    connected = await ensure_connected()
    if connected and not db_instance.seeded:
        await seed_initial_database()
        db_instance.seeded = True

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence (runs locally; on Vercel the middleware below covers it)
    logger.info("Initializing Portfolio Backend Service...")
    await ensure_ready()
    logger.info("Portfolio Backend Service initialized.")
    yield
    # Shutdown sequence
    await close_mongo_connection()
    logger.info("Portfolio Backend Service stopped.")

app = FastAPI(
    title="Portfolio API & CMS",
    description="Full-stack FastAPI backend with MongoDB, Cloudinary, and Google SMTP integration",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def ensure_database(request: Request, call_next):
    if request.url.path.startswith("/api"):
        await ensure_ready()
    return await call_next(request)

# Mount local uploads directory for fallback preview
os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=LOCAL_UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router)
app.include_router(public_router)
app.include_router(admin_content_router)
app.include_router(admin_projects_router)
app.include_router(admin_enquiry_router)
app.include_router(admin_upload_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "database": {
            "connected": db_instance.is_connected,
            "type": "MongoDB Atlas / NoSQL",
            "name": settings.MONGODB_DB_NAME
        },
        "services": {
            "cloudinary": is_cloudinary_configured(),
            "google_smtp": is_smtp_configured()
        }
    }


# ---------------------------------------------------------------------------
# Serve the built React app (frontend/dist) with SPA fallback, so that
# deep links like /admin work when the site is opened via http://<ip>:<port>.
# Registered last so every /api route above takes precedence.
# ---------------------------------------------------------------------------
from fastapi import HTTPException
from fastapi.responses import FileResponse

FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.isdir(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="frontend-assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")
        candidate = os.path.abspath(os.path.join(FRONTEND_DIST, full_path))
        if full_path and candidate.startswith(FRONTEND_DIST) and os.path.isfile(candidate):
            return FileResponse(candidate)
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))
