from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class HeroSection(BaseModel):
    name: str = "Priya Sharma"
    title: str = "Senior Full Stack & Systems Engineer"
    headline: str = "Architecting resilient digital platforms, modern cloud backends, and pixel-precise interfaces."
    subheadline: str = "Specialized in Python FastAPI, React ecosystem, distributed NoSQL databases, and robust microservices."
    badgeText: str = "Available for high-impact roles & consultancies"
    primaryCtaText: str = "View Projects"
    secondaryCtaText: str = "Get in Touch"
    avatarUrl: str = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    avatarPublicId: Optional[str] = None
    targetRoles: List[str] = Field(default_factory=list)
    availability: Optional[str] = ""
    workMode: Optional[str] = ""

class StatItem(BaseModel):
    label: str
    value: str
    description: Optional[str] = ""

class HighlightItem(BaseModel):
    title: str
    description: str

class AboutSection(BaseModel):
    summary: str = "Experienced full-stack engineer passionate about building clean, production-grade systems from database architecture to elegant, accessible web interfaces."
    bioParagraph1: str = "With a disciplined focus on engineering rigor, I build web solutions that balance performance, developer ergonomics, and intuitive user experiences. My philosophy prioritizes clean abstractions, testability, and modern architectural standards."
    bioParagraph2: str = "From designing asynchronous high-throughput FastAPI microservices and MongoDB data schemas to crafting bespoke responsive React client workflows, I deliver software that scales effortlessly."
    stats: List[StatItem] = Field(default_factory=lambda: [
        StatItem(label="Years Experience", value="5+", description="Production engineering"),
        StatItem(label="Projects Shipped", value="30+", description="High-availability apps"),
        StatItem(label="Code Quality", value="99.9%", description="Uptime & performance SLA"),
        StatItem(label="Tech Stack Focus", value="Full Stack", description="FastAPI, React, NoSQL")
    ])
    highlights: List[HighlightItem] = Field(default_factory=lambda: [
        HighlightItem(title="Scalable Backend Architecture", description="Async Python, clean REST APIs, resilient microservices & schema design."),
        HighlightItem(title="Refined Frontend Engineering", description="Design systems, accessible interfaces, React performance optimization."),
        HighlightItem(title="Cloud & Media Pipelines", description="Cloudinary asset workflows, automated email triggers, serverless deployments.")
    ])

class SkillGroup(BaseModel):
    category: str
    description: Optional[str] = ""
    skills: List[str]

class ExperienceItem(BaseModel):
    id: str
    role: str
    company: str
    period: str
    location: str
    description: str
    technologies: List[str]

class EducationItem(BaseModel):
    id: str
    degree: str
    institution: str
    period: str
    location: Optional[str] = ""
    description: Optional[str] = ""

class AchievementItem(BaseModel):
    id: str
    title: str
    type: Optional[str] = "Achievement"   # Certification | Hackathon | Internship | Award ...
    issuer: Optional[str] = ""
    date: Optional[str] = ""
    description: Optional[str] = ""
    url: Optional[str] = ""

class SocialLinks(BaseModel):
    github: str = "https://github.com"
    linkedin: str = "https://linkedin.com"
    twitter: Optional[str] = "https://twitter.com"
    email: str = "contact@portfolio.com"
    location: str = "Bengaluru, India"
    website: Optional[str] = ""

class ResumeConfig(BaseModel):
    resumeUrl: Optional[str] = ""
    fileName: Optional[str] = "Priya_Sharma_Resume.pdf"
    uploadedAt: Optional[str] = ""
    isVisible: bool = True
    buttonText: str = "Download Resume"

class PortfolioContent(BaseModel):
    hero: HeroSection = Field(default_factory=HeroSection)
    about: AboutSection = Field(default_factory=AboutSection)
    skills: List[SkillGroup] = Field(default_factory=lambda: [
        SkillGroup(
            category="Frontend Engineering",
            description="Component architecture, responsive state management, and modern design systems.",
            skills=["React 18", "Next.js", "JavaScript (ESNext)", "TypeScript", "Tailwind CSS", "Vite", "HTML5/Semantic Web", "State Management (Redux/Zustand)"]
        ),
        SkillGroup(
            category="Backend & APIs",
            description="High-throughput asynchronous web services and scalable API design.",
            skills=["Python 3.12+", "FastAPI", "Uvicorn", "RESTful Architecture", "Asyncio", "Pydantic", "Microservices", "JWT & OAuth2"]
        ),
        SkillGroup(
            category="Database & Storage",
            description="NoSQL schemas, indexing strategies, and transactional consistency.",
            skills=["MongoDB (NoSQL)", "Motor (Async Driver)", "Aggregation Pipelines", "PostgreSQL", "Redis Caching"]
        ),
        SkillGroup(
            category="Cloud & Integrations",
            description="Asset optimization, email delivery, and deployment pipelines.",
            skills=["Cloudinary Media API", "Google SMTP Services", "Docker", "CI/CD Actions", "AWS / Vercel / Render"]
        )
    ])
    experience: List[ExperienceItem] = Field(default_factory=lambda: [
        ExperienceItem(
            id="exp-1",
            role="Senior Full Stack Engineer",
            company="Tech Corp Labs",
            period="2023 - Present",
            location="Bengaluru, India",
            description="Led architecture of core customer-facing applications and asynchronous Python FastAPI backend services handling high concurrent workloads. Built reusable React component libraries and integrated MongoDB clusters.",
            technologies=["React", "FastAPI", "MongoDB", "Cloudinary", "Docker"]
        ),
        ExperienceItem(
            id="exp-2",
            role="Full Stack Developer",
            company="Digital Solutions Inc.",
            period="2021 - 2023",
            location="Bengaluru, India",
            description="Developed dynamic enterprise web applications, real-time dashboards, and secure RESTful endpoints. Implemented third-party integrations and automated notification pipelines.",
            technologies=["React", "Python", "REST APIs", "Tailwind CSS", "MongoDB"]
        )
    ])
    education: List[EducationItem] = Field(default_factory=list)
    achievements: List[AchievementItem] = Field(default_factory=list)
    socials: SocialLinks = Field(default_factory=SocialLinks)
    resume: ResumeConfig = Field(default_factory=ResumeConfig)
