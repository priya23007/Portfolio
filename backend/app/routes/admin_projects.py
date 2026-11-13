from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.storage import StorageRepository
from app.services.auth_service import get_current_admin

router = APIRouter(prefix="/api/admin/projects", tags=["Admin Projects"])

@router.get("", response_model=List[ProjectResponse])
async def list_admin_projects(admin_email: str = Depends(get_current_admin)):
    return await StorageRepository.get_projects()

@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_new_project(
    data: ProjectCreate,
    admin_email: str = Depends(get_current_admin)
):
    project = await StorageRepository.create_project(data)
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_existing_project(
    project_id: str,
    data: ProjectUpdate,
    admin_email: str = Depends(get_current_admin)
):
    updated = await StorageRepository.update_project(project_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated

@router.delete("/{project_id}")
async def delete_existing_project(
    project_id: str,
    admin_email: str = Depends(get_current_admin)
):
    success = await StorageRepository.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found or already removed")
    return {"message": "Project removed successfully."}

@router.put("/reorder/bulk")
async def reorder_projects(
    order_map: Dict[str, int],
    admin_email: str = Depends(get_current_admin)
):
    for pid, new_order in order_map.items():
        await StorageRepository.update_project(pid, ProjectUpdate(order=new_order))
    return {"message": "Project ordering updated."}
