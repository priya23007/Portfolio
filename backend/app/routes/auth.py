from fastapi import APIRouter, HTTPException, Depends, status
from app.models.auth import LoginRequest, TokenResponse, ChangePasswordRequest
from app.services.auth_service import (
    verify_password,
    hash_password,
    create_access_token,
    get_current_admin
)
from app.services.storage import StorageRepository
from app.services.cloudinary_svc import is_cloudinary_configured
from app.services.email_service import is_smtp_configured
from app.database import db_instance

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    user = await StorageRepository.get_admin_user(req.email)
    if not user or not verify_password(req.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password credentials."
        )

    access_token = create_access_token(data={"sub": user["email"]})
    return TokenResponse(
        accessToken=access_token,
        tokenType="bearer",
        email=user["email"]
    )

@router.get("/me")
async def get_current_user_profile(admin_email: str = Depends(get_current_admin)):
    user = await StorageRepository.get_admin_user(admin_email)
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")
        
    return {
        "email": admin_email,
        "createdAt": user.get("created_at"),
        "systemStatus": {
            "mongodbConnected": db_instance.is_connected,
            "cloudinaryConfigured": is_cloudinary_configured(),
            "smtpConfigured": is_smtp_configured()
        }
    }

@router.post("/change-password")
async def change_password(
    req: ChangePasswordRequest,
    admin_email: str = Depends(get_current_admin)
):
    user = await StorageRepository.get_admin_user(admin_email)
    if not user or not verify_password(req.currentPassword, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password verification failed."
        )

    if len(req.newPassword) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters in length."
        )

    new_hash = hash_password(req.newPassword)
    await StorageRepository.update_admin_password(admin_email, new_hash)
    return {"message": "Admin password updated successfully."}
