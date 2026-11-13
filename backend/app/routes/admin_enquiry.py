from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.enquiry import EnquiryResponse, EnquiryStatusUpdate
from app.models.form_config import EnquiryFormConfig
from app.services.storage import StorageRepository
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Enquiries & Form Builder"])

@router.get("/enquiries", response_model=List[EnquiryResponse])
async def list_client_enquiries(
    status: Optional[str] = None,
    admin_email: str = Depends(get_current_admin)
):
    return await StorageRepository.get_enquiries(status=status)

@router.patch("/enquiries/{enquiry_id}/status")
async def update_enquiry_status(
    enquiry_id: str,
    update: EnquiryStatusUpdate,
    admin_email: str = Depends(get_current_admin)
):
    success = await StorageRepository.update_enquiry_status(enquiry_id, update.status)
    if not success:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": f"Status updated to {update.status}"}

@router.delete("/enquiries/{enquiry_id}")
async def delete_enquiry(
    enquiry_id: str,
    admin_email: str = Depends(get_current_admin)
):
    await StorageRepository.delete_enquiry(enquiry_id)
    return {"message": "Enquiry deleted successfully."}

@router.get("/enquiry-form", response_model=EnquiryFormConfig)
async def get_editable_form_config(admin_email: str = Depends(get_current_admin)):
    return await StorageRepository.get_form_config()

@router.put("/enquiry-form", response_model=EnquiryFormConfig)
async def update_form_config(
    form_config: EnquiryFormConfig,
    admin_email: str = Depends(get_current_admin)
):
    updated = await StorageRepository.update_form_config(form_config.model_dump())
    return updated
