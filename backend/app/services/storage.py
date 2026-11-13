import uuid
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.database import get_database, db_instance
from app.models.content import PortfolioContent
from app.models.project import ProjectResponse, ProjectCreate, ProjectUpdate
from app.models.form_config import EnquiryFormConfig
from app.services.auth_service import hash_password
from app.config import settings

logger = logging.getLogger("uvicorn.error")

# Initial projects dataset (high quality, professional, zero emojis)
INITIAL_PROJECTS = [
    {
        "id": "proj-1",
        "title": "CloudMetrics - Distributed Telemetry Engine",
        "slug": "cloudmetrics-distributed-telemetry",
        "shortDescription": "High-throughput telemetry ingestion backend processing 150k+ events/sec with sub-millisecond aggregations.",
        "fullDescription": "Engineered an asynchronous time-series metric collector and analytics dashboard. Utilized Python FastAPI with uvloop, MongoDB time-series collections, and Redis pub/sub. Features multi-tenant workspace isolation, live websocket streaming, and automated anomaly detection.",
        "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        "cloudinaryPublicId": None,
        "category": "Backend & Cloud",
        "techStack": ["FastAPI", "Python", "MongoDB", "Redis", "Docker", "Timeseries"],
        "liveUrl": "https://example.com/demo/cloudmetrics",
        "githubUrl": "https://github.com/example/cloudmetrics",
        "featured": True,
        "order": 1,
        "createdAt": "2026-01-15T10:00:00Z",
        "updatedAt": "2026-01-15T10:00:00Z"
    },
    {
        "id": "proj-2",
        "title": "Aura Commerce - Next-Gen Headless Storefront",
        "slug": "aura-commerce-headless-storefront",
        "shortDescription": "Modern headless e-commerce frontend architecture with sub-second page loads and dynamic checkout workflows.",
        "fullDescription": "Designed a composable React application using Tailwind CSS and Vite. Integrated with Cloudinary for automated next-gen image transformations (WebP/AVIF) and dynamic media optimization. Reduced First Contentful Paint by 42%.",
        "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        "cloudinaryPublicId": None,
        "category": "Frontend & UI",
        "techStack": ["React 18", "Tailwind CSS", "Vite", "Cloudinary", "REST API", "Zustand"],
        "liveUrl": "https://example.com/demo/aura",
        "githubUrl": "https://github.com/example/aura-commerce",
        "featured": True,
        "order": 2,
        "createdAt": "2026-02-10T12:00:00Z",
        "updatedAt": "2026-02-10T12:00:00Z"
    },
    {
        "id": "proj-3",
        "title": "Nexus Workflow - Enterprise Task Orchestration",
        "slug": "nexus-workflow-enterprise-orchestration",
        "shortDescription": "Role-based workflow engine with asynchronous job scheduling and dynamic Google SMTP email dispatches.",
        "fullDescription": "Full-stack enterprise application orchestrating business workflows across multi-stage approvals. Features JWT authentication with granular permissions, asynchronous email notification queues via Google SMTP, and customizable dynamic forms.",
        "imageUrl": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80",
        "cloudinaryPublicId": None,
        "category": "Full Stack",
        "techStack": ["FastAPI", "React", "MongoDB", "Google SMTP", "Pydantic", "Tailwind"],
        "liveUrl": "https://example.com/demo/nexus",
        "githubUrl": "https://github.com/example/nexus-workflow",
        "featured": True,
        "order": 3,
        "createdAt": "2026-03-01T09:00:00Z",
        "updatedAt": "2026-03-01T09:00:00Z"
    },
    {
        "id": "proj-4",
        "title": "Synthetix API - Automated Asset Pipeline",
        "slug": "synthetix-api-asset-pipeline",
        "shortDescription": "Automated media transcoding, watermarking, and secure Cloudinary delivery microservice.",
        "fullDescription": "Microservice engineered for rapid batch asset intake, validation, Cloudinary remote transformations, and structured metadata cataloging in MongoDB. Implemented HMAC signature verification and webhooks.",
        "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
        "cloudinaryPublicId": None,
        "category": "Backend & Cloud",
        "techStack": ["Python", "FastAPI", "Cloudinary SDK", "AsyncIO", "MongoDB"],
        "liveUrl": "https://example.com/demo/synthetix",
        "githubUrl": "https://github.com/example/synthetix-pipeline",
        "featured": False,
        "order": 4,
        "createdAt": "2026-04-18T14:00:00Z",
        "updatedAt": "2026-04-18T14:00:00Z"
    }
]

# In-memory storage for seamless fallback if MongoDB cluster is being configured
_memory_store = {
    "content": PortfolioContent().model_dump(),
    "projects": list(INITIAL_PROJECTS),
    "form_config": EnquiryFormConfig().model_dump(),
    "enquiries": [],
    "admin_user": {
        "email": settings.ADMIN_EMAIL,
        "password_hash": hash_password(settings.ADMIN_INITIAL_PASSWORD),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
}

class StorageRepository:
    # ----------------- CONTENT -----------------
    @staticmethod
    async def get_content() -> Dict[str, Any]:
        db = get_database()
        if db is not None:
            doc = await db.content.find_one({"doc_type": "portfolio_content"})
            if doc:
                doc.pop("_id", None)
                doc.pop("doc_type", None)
                return doc
        return _memory_store["content"]

    @staticmethod
    async def update_content(new_content: Dict[str, Any]) -> Dict[str, Any]:
        _memory_store["content"] = new_content
        db = get_database()
        if db is not None:
            payload = new_content.copy()
            payload["doc_type"] = "portfolio_content"
            await db.content.update_one(
                {"doc_type": "portfolio_content"},
                {"$set": payload},
                upsert=True
            )
        return new_content

    # ----------------- PROJECTS -----------------
    @staticmethod
    async def get_projects(category: Optional[str] = None, featured: Optional[bool] = None) -> List[Dict[str, Any]]:
        db = get_database()
        if db is not None:
            query = {}
            if category:
                query["category"] = category
            if featured is not None:
                query["featured"] = featured
            cursor = db.projects.find(query).sort("order", 1)
            projects = []
            async for p in cursor:
                p.pop("_id", None)
                projects.append(p)
            return projects
        
        # Memory fallback
        projs = _memory_store["projects"]
        if category:
            projs = [p for p in projs if p["category"].lower() == category.lower()]
        if featured is not None:
            projs = [p for p in projs if p["featured"] == featured]
        return sorted(projs, key=lambda x: x.get("order", 0))

    @staticmethod
    async def get_project_by_id(project_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        if db is not None:
            doc = await db.projects.find_one({"id": project_id})
            if doc:
                doc.pop("_id", None)
                return doc
        for p in _memory_store["projects"]:
            if p["id"] == project_id:
                return p
        return None

    @staticmethod
    async def create_project(data: ProjectCreate) -> Dict[str, Any]:
        new_id = f"proj-{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc).isoformat()
        slug = data.slug or data.title.lower().replace(" ", "-").replace("/", "-")
        project_dict = data.model_dump()
        project_dict["id"] = new_id
        project_dict["slug"] = slug
        project_dict["createdAt"] = now
        project_dict["updatedAt"] = now

        db = get_database()
        if db is not None:
            await db.projects.insert_one(project_dict.copy())
        _memory_store["projects"].append(project_dict)
        return project_dict

    @staticmethod
    async def update_project(project_id: str, data: ProjectUpdate) -> Optional[Dict[str, Any]]:
        update_fields = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
        if not update_fields:
            return await StorageRepository.get_project_by_id(project_id)

        update_fields["updatedAt"] = datetime.now(timezone.utc).isoformat()
        
        db = get_database()
        if db is not None:
            await db.projects.update_one({"id": project_id}, {"$set": update_fields})
            doc = await db.projects.find_one({"id": project_id})
            if doc:
                doc.pop("_id", None)
                return doc

        # Fallback memory
        for idx, p in enumerate(_memory_store["projects"]):
            if p["id"] == project_id:
                _memory_store["projects"][idx].update(update_fields)
                return _memory_store["projects"][idx]
        return None

    @staticmethod
    async def delete_project(project_id: str) -> bool:
        db = get_database()
        if db is not None:
            res = await db.projects.delete_one({"id": project_id})
            if res.deleted_count > 0:
                _memory_store["projects"] = [p for p in _memory_store["projects"] if p["id"] != project_id]
                return True

        orig_len = len(_memory_store["projects"])
        _memory_store["projects"] = [p for p in _memory_store["projects"] if p["id"] != project_id]
        return len(_memory_store["projects"]) < orig_len

    # ----------------- FORM CONFIG -----------------
    @staticmethod
    async def get_form_config() -> Dict[str, Any]:
        db = get_database()
        if db is not None:
            doc = await db.form_config.find_one({"doc_type": "enquiry_form"})
            if doc:
                doc.pop("_id", None)
                doc.pop("doc_type", None)
                return doc
        return _memory_store["form_config"]

    @staticmethod
    async def update_form_config(new_config: Dict[str, Any]) -> Dict[str, Any]:
        _memory_store["form_config"] = new_config
        db = get_database()
        if db is not None:
            payload = new_config.copy()
            payload["doc_type"] = "enquiry_form"
            await db.form_config.update_one(
                {"doc_type": "enquiry_form"},
                {"$set": payload},
                upsert=True
            )
        return new_config

    # ----------------- ENQUIRIES -----------------
    @staticmethod
    async def save_enquiry(data: Dict[str, Any]) -> Dict[str, Any]:
        enquiry_id = f"enq-{uuid.uuid4().hex[:10]}"
        now = datetime.now(timezone.utc).isoformat()
        
        # Extract common identifiable fields for summary view
        client_name = data.get("fullName") or data.get("name") or data.get("client_name") or "Anonymous"
        email = data.get("email") or data.get("emailAddress") or ""
        subject = data.get("subject") or data.get("topic") or "General Inquiry"
        message = data.get("message") or data.get("details") or ""

        doc = {
            "id": enquiry_id,
            "clientName": client_name,
            "email": email,
            "subject": subject,
            "message": message,
            "data": data,
            "status": "unread",
            "createdAt": now
        }

        db = get_database()
        if db is not None:
            await db.enquiries.insert_one(doc.copy())
        _memory_store["enquiries"].insert(0, doc)
        return doc

    @staticmethod
    async def get_enquiries(status: Optional[str] = None) -> List[Dict[str, Any]]:
        db = get_database()
        if db is not None:
            query = {}
            if status:
                query["status"] = status
            cursor = db.enquiries.find(query).sort("createdAt", -1)
            enquiries = []
            async for e in cursor:
                e.pop("_id", None)
                enquiries.append(e)
            return enquiries

        items = _memory_store["enquiries"]
        if status:
            items = [e for e in items if e["status"] == status]
        return items

    @staticmethod
    async def update_enquiry_status(enquiry_id: str, new_status: str) -> bool:
        db = get_database()
        if db is not None:
            res = await db.enquiries.update_one({"id": enquiry_id}, {"$set": {"status": new_status}})
            if res.modified_count > 0:
                for e in _memory_store["enquiries"]:
                    if e["id"] == enquiry_id:
                        e["status"] = new_status
                return True
        for e in _memory_store["enquiries"]:
            if e["id"] == enquiry_id:
                e["status"] = new_status
                return True
        return False

    @staticmethod
    async def delete_enquiry(enquiry_id: str) -> bool:
        db = get_database()
        if db is not None:
            await db.enquiries.delete_one({"id": enquiry_id})
        _memory_store["enquiries"] = [e for e in _memory_store["enquiries"] if e["id"] != enquiry_id]
        return True

    # ----------------- ADMIN USER -----------------
    @staticmethod
    async def get_admin_user(email: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        if db is not None:
            user = await db.users.find_one({"email": email.lower()})
            if user:
                return user
        if _memory_store["admin_user"]["email"].lower() == email.lower():
            return _memory_store["admin_user"]
        return None

    @staticmethod
    async def update_admin_password(email: str, new_password_hash: str) -> bool:
        db = get_database()
        if db is not None:
            await db.users.update_one(
                {"email": email.lower()},
                {"$set": {"password_hash": new_password_hash}},
                upsert=True
            )
        if _memory_store["admin_user"]["email"].lower() == email.lower():
            _memory_store["admin_user"]["password_hash"] = new_password_hash
        return True

async def seed_initial_database():
    """Seeds MongoDB collections if empty"""
    db = get_database()
    if db is None:
        logger.info("MongoDB not connected yet. Fallback repository loaded with complete initial portfolio dataset.")
        return

    try:
        # Seed Content
        content_count = await db.content.count_documents({"doc_type": "portfolio_content"})
        if content_count == 0:
            default_content = PortfolioContent().model_dump()
            default_content["doc_type"] = "portfolio_content"
            await db.content.insert_one(default_content)
            logger.info("MongoDB: Seeded default portfolio content.")

        # Seed Projects
        projects_count = await db.projects.count_documents({})
        if projects_count == 0:
            for p in INITIAL_PROJECTS:
                await db.projects.insert_one(p.copy())
            logger.info(f"MongoDB: Seeded {len(INITIAL_PROJECTS)} initial projects.")

        # Seed Form Config
        form_count = await db.form_config.count_documents({"doc_type": "enquiry_form"})
        if form_count == 0:
            default_form = EnquiryFormConfig().model_dump()
            default_form["doc_type"] = "enquiry_form"
            await db.form_config.insert_one(default_form)
            logger.info("MongoDB: Seeded dynamic enquiry form configuration.")

        # Seed Admin User
        admin_count = await db.users.count_documents({"email": settings.ADMIN_EMAIL.lower()})
        if admin_count == 0:
            admin_doc = {
                "email": settings.ADMIN_EMAIL.lower(),
                "password_hash": hash_password(settings.ADMIN_INITIAL_PASSWORD),
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(admin_doc)
            logger.info(f"MongoDB: Seeded initial admin account ({settings.ADMIN_EMAIL}).")
            
    except Exception as e:
        logger.error(f"Error during MongoDB seeding: {e}")
