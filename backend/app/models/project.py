from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ProjectCreate(BaseModel):
    title: str
    slug: Optional[str] = ""
    shortDescription: str
    fullDescription: str
    imageUrl: str
    cloudinaryPublicId: Optional[str] = None
    category: str = "Full Stack"
    techStack: List[str] = []
    liveUrl: Optional[str] = ""
    githubUrl: Optional[str] = ""
    featured: bool = False
    order: int = 0

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    shortDescription: Optional[str] = None
    fullDescription: Optional[str] = None
    imageUrl: Optional[str] = None
    cloudinaryPublicId: Optional[str] = None
    category: Optional[str] = None
    techStack: Optional[List[str]] = None
    liveUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    featured: Optional[bool] = None
    order: Optional[int] = None

class ProjectResponse(BaseModel):
    id: str
    title: str
    slug: str
    shortDescription: str
    fullDescription: str
    imageUrl: str
    cloudinaryPublicId: Optional[str] = None
    category: str
    techStack: List[str]
    liveUrl: Optional[str] = ""
    githubUrl: Optional[str] = ""
    featured: bool
    order: int
    createdAt: str
    updatedAt: str
