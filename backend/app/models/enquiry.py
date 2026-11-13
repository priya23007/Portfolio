from typing import Dict, Any, Optional
from pydantic import BaseModel, EmailStr

class EnquirySubmitRequest(BaseModel):
    # Dynamic field values from the form
    data: Dict[str, Any]

class EnquiryResponse(BaseModel):
    id: str
    clientName: Optional[str] = "Anonymous"
    email: Optional[str] = ""
    subject: Optional[str] = ""
    message: Optional[str] = ""
    data: Dict[str, Any]
    status: str = "unread"  # "unread", "read", "archived"
    createdAt: str

class EnquiryStatusUpdate(BaseModel):
    status: str
