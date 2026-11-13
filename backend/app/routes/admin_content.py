from fastapi import APIRouter, Depends, HTTPException
from app.models.content import PortfolioContent
from app.services.storage import StorageRepository
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/api/admin/content", tags=["Admin Content"])

@router.get("", response_model=PortfolioContent)
async def get_editable_content(admin_email: str = Depends(get_current_admin)):
    return await StorageRepository.get_content()

@router.put("", response_model=PortfolioContent)
async def update_portfolio_content(
    content: PortfolioContent,
    admin_email: str = Depends(get_current_admin)
):
    updated = await StorageRepository.update_content(content.model_dump())
    return updated
