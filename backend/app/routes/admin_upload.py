from datetime import datetime, timezone
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from app.services.cloudinary_svc import (
    upload_file_to_cloudinary,
    delete_file_from_cloudinary,
    is_cloudinary_configured
)
from app.services.auth_service import get_current_admin
from app.services.storage import StorageRepository

router = APIRouter(prefix="/api/admin/upload", tags=["Admin Media & Cloudinary"])

@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    admin_email: str = Depends(get_current_admin)
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a valid image format (JPEG, PNG, WebP, SVG)."
        )

    res = await upload_file_to_cloudinary(file, folder="portfolio/images", resource_type="image")
    return {
        "success": True,
        "url": res["url"],
        "public_id": res["public_id"],
        "storage": res["storage"],
        "cloudinaryActive": is_cloudinary_configured()
    }

@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    admin_email: str = Depends(get_current_admin)
):
    valid_types = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if file.content_type not in valid_types and not (file.filename and file.filename.lower().endswith(".pdf")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume file must be a PDF document."
        )

    # Uploaded as "raw": Cloudinary blocks delivery of PDFs stored as images on
    # default accounts (401 "deny or ACL failure"), while raw files are served as-is.
    res = await upload_file_to_cloudinary(file, folder="portfolio/resumes", resource_type="raw")
    
    # Auto-update resume record in portfolio content
    current_content = await StorageRepository.get_content()
    current_content.setdefault("resume", {})
    current_content["resume"]["resumeUrl"] = res["url"]
    current_content["resume"]["fileName"] = file.filename or "Resume.pdf"
    current_content["resume"]["uploadedAt"] = datetime.now(timezone.utc).isoformat()
    await StorageRepository.update_content(current_content)

    return {
        "success": True,
        "url": res["url"],
        "public_id": res["public_id"],
        "fileName": file.filename,
        "storage": res["storage"],
        "cloudinaryActive": is_cloudinary_configured()
    }

@router.delete("")
async def delete_media_file(
    public_id: str,
    resource_type: str = "image",
    admin_email: str = Depends(get_current_admin)
):
    success = await delete_file_from_cloudinary(public_id, resource_type=resource_type)
    return {"success": success, "public_id": public_id}
