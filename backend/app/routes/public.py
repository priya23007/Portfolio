import re
from typing import Optional, List

import cloudinary.utils
import httpx
from fastapi import APIRouter, HTTPException, BackgroundTasks, status
from app.services.storage import StorageRepository
from app.services.email_service import send_enquiry_notification_email
from app.models.enquiry import EnquirySubmitRequest, EnquiryResponse
from app.models.content import PortfolioContent
from app.services.cloudinary_svc import is_cloudinary_configured
from fastapi.responses import Response, RedirectResponse

router = APIRouter(prefix="/api", tags=["Client Public"])

@router.get("/portfolio", response_model=PortfolioContent)
async def get_portfolio_content():
    content = await StorageRepository.get_content()
    return content

@router.get("/projects")
async def get_projects(category: Optional[str] = None, featured: Optional[bool] = None):
    return await StorageRepository.get_projects(category=category, featured=featured)

@router.get("/projects/{project_id}")
async def get_project_by_id(project_id: str):
    project = await StorageRepository.get_project_by_id(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/enquiry/form-config")
async def get_enquiry_form_config():
    return await StorageRepository.get_form_config()

@router.post("/enquiry/submit")
async def submit_enquiry(req: EnquirySubmitRequest, background_tasks: BackgroundTasks):
    form_config = await StorageRepository.get_form_config()
    fields = form_config.get("fields", [])
    
    # Validate required enabled fields
    submitted_data = req.data
    for f in fields:
        if f.get("enabled", True) and f.get("required", False):
            val = submitted_data.get(f["name"])
            if val is None or (isinstance(val, str) and not val.strip()):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"Field '{f.get('label', f['name'])}' is required."
                )

    # Save to database (MongoDB / fallback)
    enquiry_record = await StorageRepository.save_enquiry(submitted_data)
    
    # Asynchronously dispatch email notification via Google SMTP
    background_tasks.add_task(
        send_enquiry_notification_email,
        submitted_data,
        enquiry_record["id"]
    )

    return {
        "success": True,
        "message": form_config.get("successMessage", "Enquiry received successfully."),
        "enquiryId": enquiry_record["id"]
    }


# ---------------------------------------------------------------------------
# Resume delivery
# Cloudinary accounts block public delivery of PDF files by default
# (401 "deny or ACL failure"). This endpoint fetches the file through
# Cloudinary's authenticated download API and serves it from our own domain,
# so "View" opens the PDF inline and "Download" saves it with a clean filename.
# ---------------------------------------------------------------------------
_CLOUDINARY_URL = re.compile(
    r"^https://res\.cloudinary\.com/[^/]+/(?P<rtype>image|raw|video)/upload/(?:v\d+/)?(?P<path>.+)$"
)
_resume_cache: dict = {}


@router.get("/resume", include_in_schema=False)
async def get_resume(download: bool = False):
    content = await StorageRepository.get_content()
    resume = content.get("resume") or {}
    url = resume.get("resumeUrl") or ""
    if not url or not resume.get("isVisible", True):
        raise HTTPException(status_code=404, detail="Resume not available")

    match = _CLOUDINARY_URL.match(url)
    if not match or not is_cloudinary_configured():
        return RedirectResponse(url)  # local upload or external link

    if url not in _resume_cache:
        rtype, path = match["rtype"], match["path"]
        if rtype == "raw":
            public_id, fmt = path, ""            # raw public_id keeps its extension
        else:
            public_id, _, fmt = path.rpartition(".")
        signed = cloudinary.utils.private_download_url(public_id, fmt, resource_type=rtype, type="upload")
        async with httpx.AsyncClient(timeout=30, follow_redirects=True) as client:
            res = await client.get(signed)
        if res.status_code != 200:
            raise HTTPException(status_code=502, detail="Could not fetch resume from storage")
        _resume_cache.clear()
        _resume_cache[url] = res.content

    filename = re.sub(r"[^A-Za-z0-9._-]+", "_", resume.get("fileName") or "Resume.pdf")
    if not filename.lower().endswith(".pdf"):
        filename += ".pdf"
    disposition = "attachment" if download else "inline"
    return Response(
        content=_resume_cache[url],
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'{disposition}; filename="{filename}"',
            "Cache-Control": "public, max-age=300",
        },
    )
