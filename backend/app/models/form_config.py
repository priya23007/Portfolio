from typing import List, Optional
from pydantic import BaseModel, Field

class FormFieldConfig(BaseModel):
    id: str
    name: str                       # e.g., "fullName", "email", "budget", "message"
    label: str                      # e.g., "Your Name", "Email Address"
    type: str = "text"              # "text", "email", "textarea", "select", "tel"
    placeholder: str = ""
    required: bool = True
    options: Optional[List[str]] = []  # For select dropdowns
    order: int = 0
    enabled: bool = True

class EnquiryFormConfig(BaseModel):
    title: str = "Start a Conversation"
    subtitle: str = "Have a prospective project, engineering challenge, or collaboration in mind? Leave a message and I'll respond within 24 hours."
    submitButtonText: str = "Send Enquiry"
    successMessage: str = "Thank you for reaching out. Your enquiry has been received and a confirmation has been logged. I will be in touch shortly."
    fields: List[FormFieldConfig] = Field(default_factory=lambda: [
        FormFieldConfig(
            id="f-1",
            name="fullName",
            label="Full Name",
            type="text",
            placeholder="John Doe",
            required=True,
            order=1,
            enabled=True
        ),
        FormFieldConfig(
            id="f-2",
            name="email",
            label="Email Address",
            type="email",
            placeholder="john@example.com",
            required=True,
            order=2,
            enabled=True
        ),
        FormFieldConfig(
            id="f-3",
            name="subject",
            label="Inquiry Topic / Project Scope",
            type="select",
            placeholder="Select a category",
            required=True,
            options=[
                "Full Stack Web Application",
                "Backend Architecture / API Development",
                "Frontend & Design System Engineering",
                "Database & Cloud Infrastructure",
                "Technical Advisory & Consulting",
                "Other Discussion"
            ],
            order=3,
            enabled=True
        ),
        FormFieldConfig(
            id="f-4",
            name="timeline",
            label="Target Timeline",
            type="select",
            placeholder="Expected timeline",
            required=False,
            options=[
                "Immediate (< 1 month)",
                "1 - 3 months",
                "3 - 6 months",
                "Flexible / Exploring"
            ],
            order=4,
            enabled=True
        ),
        FormFieldConfig(
            id="f-5",
            name="message",
            label="Project Details & Requirements",
            type="textarea",
            placeholder="Please detail your project vision, key deliverables, and any architectural preferences...",
            required=True,
            order=5,
            enabled=True
        )
    ])
