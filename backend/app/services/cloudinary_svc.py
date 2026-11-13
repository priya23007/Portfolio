import os
import uuid
import asyncio
import logging
from typing import Dict, Any, Optional
import aiofiles
from fastapi import UploadFile
import cloudinary
import cloudinary.uploader
import cloudinary.api
from app.config import settings

logger = logging.getLogger("uvicorn.error")

# Fallback storage when Cloudinary is not configured. On Vercel only /tmp is writable
# (and it is wiped between invocations), so configure Cloudinary in production.
if os.environ.get("VERCEL"):
    LOCAL_UPLOAD_DIR = "/tmp/uploads"
else:
    LOCAL_UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(LOCAL_UPLOAD_DIR, exist_ok=True)

def is_cloudinary_configured() -> bool:
    return bool(
        settings.CLOUDINARY_CLOUD_NAME 
        and settings.CLOUDINARY_API_KEY 
        and settings.CLOUDINARY_API_SECRET
    )

def init_cloudinary():
    if is_cloudinary_configured():
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True
        )
        logger.info("Cloudinary service initialized successfully.")
    else:
        logger.info("Cloudinary credentials not set in .env. Falling back to local upload storage.")

init_cloudinary()

async def upload_file_to_cloudinary(
    file: UploadFile,
    folder: str = "portfolio",
    resource_type: str = "auto"
) -> Dict[str, Any]:
    """
    Uploads a file (image or PDF document/resume) to Cloudinary.
    Falls back to local file storage if Cloudinary credentials are not configured.
    """
    contents = await file.read()
    await file.seek(0)
    
    # Check if Cloudinary is configured
    if is_cloudinary_configured():
        try:
            # Re-initialize just in case settings were updated
            init_cloudinary()
            
            def _sync_upload():
                options = dict(
                    folder=folder,
                    resource_type=resource_type,
                    use_filename=True,
                    unique_filename=True,
                )
                # Raw files keep their extension in the URL (e.g. ".pdf") only when
                # Cloudinary knows the original filename.
                if file.filename:
                    options["filename_override"] = file.filename
                return cloudinary.uploader.upload(contents, **options)
            
            result = await asyncio.to_thread(_sync_upload)
            logger.info(f"File uploaded to Cloudinary: {result.get('secure_url')}")
            return {
                "url": result.get("secure_url"),
                "public_id": result.get("public_id"),
                "format": result.get("format"),
                "bytes": result.get("bytes"),
                "resource_type": result.get("resource_type"),
                "storage": "cloudinary"
            }
        except Exception as e:
            logger.error(f"Cloudinary upload failed: {e}. Falling back to local storage.")
    
    # Local fallback
    ext = os.path.splitext(file.filename or "")[1].lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"
    local_path = os.path.join(LOCAL_UPLOAD_DIR, unique_name)
    
    async with aiofiles.open(local_path, "wb") as f:
        await f.write(contents)
        
    url = f"/api/uploads/{unique_name}"
    logger.info(f"File saved to local storage: {url}")
    return {
        "url": url,
        "public_id": unique_name,
        "format": ext.replace(".", ""),
        "bytes": len(contents),
        "resource_type": resource_type,
        "storage": "local"
    }

async def delete_file_from_cloudinary(public_id: str, resource_type: str = "image") -> bool:
    if is_cloudinary_configured():
        try:
            def _sync_destroy():
                return cloudinary.uploader.destroy(public_id, resource_type=resource_type)
            result = await asyncio.to_thread(_sync_destroy)
            return result.get("result") == "ok"
        except Exception as e:
            logger.error(f"Cloudinary delete failed: {e}")
            return False
    else:
        local_path = os.path.join(LOCAL_UPLOAD_DIR, public_id)
        if os.path.exists(local_path):
            try:
                os.remove(local_path)
                return True
            except Exception as e:
                logger.error(f"Local file delete failed: {e}")
                return False
    return False
