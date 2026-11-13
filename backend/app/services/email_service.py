import smtplib
import ssl
import asyncio
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from app.config import settings

logger = logging.getLogger("uvicorn.error")

def is_smtp_configured() -> bool:
    return bool(settings.SMTP_USER and settings.SMTP_PASSWORD)

def generate_enquiry_email_html(enquiry_data: Dict[str, Any], enquiry_id: str) -> str:
    timestamp_str = datetime.now(timezone.utc).strftime("%B %d, %Y at %H:%M UTC")
    
    # Generate rows for each field dynamically
    rows_html = ""
    for key, value in enquiry_data.items():
        # Format key as Title Case
        formatted_key = key.replace("_", " ").title()
        val_str = str(value) if value is not None else "-"
        # Multi-line handling
        if "\n" in val_str or len(val_str) > 80:
            val_display = f"<div style='white-space: pre-wrap; font-family: inherit; line-height: 1.6; color: #1e293b;'>{val_str}</div>"
        else:
            val_display = f"<strong style='color: #0f172a; font-weight: 600;'>{val_str}</strong>"
            
        rows_html += f"""
        <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 16px; background-color: #f8fafc; color: #64748b; font-size: 13px; font-weight: 500; width: 30%; vertical-align: top; text-transform: uppercase; letter-spacing: 0.5px;">
                {formatted_key}
            </td>
            <td style="padding: 12px 16px; background-color: #ffffff; color: #0f172a; font-size: 14px; vertical-align: top;">
                {val_display}
            </td>
        </tr>
        """

    client_email = enquiry_data.get("email", enquiry_data.get("emailAddress", "N/A"))
    client_name = enquiry_data.get("fullName", enquiry_data.get("name", "Prospective Client"))

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Portfolio Enquiry</title>
    </head>
    <body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #0f172a;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 620px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px -2px rgba(2, 132, 199, 0.08);">
            <!-- Header with Light Blue Accent -->
            <tr>
                <td style="background-color: #0284c7; padding: 28px 32px; border-bottom: 3px solid #38bdf8;">
                    <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #e0f2fe; font-weight: 700; margin-bottom: 6px;">Portfolio Client Dispatch</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; line-height: 1.3;">New Client Enquiry Received</h1>
                    <p style="margin: 6px 0 0 0; color: #e0f2fe; font-size: 14px;">Inquiry Reference: {enquiry_id[:8]}</p>
                </td>
            </tr>

            <!-- Notice Box -->
            <tr>
                <td style="padding: 24px 32px 16px 32px;">
                    <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 14px 18px;">
                        <p style="margin: 0; font-size: 14px; color: #0369a1; line-height: 1.5;">
                            A new client enquiry has been submitted on your portfolio by <strong>{client_name}</strong> ({client_email}). Full submission parameters are detailed below.
                        </p>
                    </div>
                </td>
            </tr>

            <!-- Form Details Table -->
            <tr>
                <td style="padding: 8px 32px 24px 32px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; border-collapse: collapse;">
                        {rows_html}
                    </table>
                </td>
            </tr>

            <!-- Reply Action Bar -->
            <tr>
                <td style="padding: 0 32px 28px 32px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="left">
                                <a href="mailto:{client_email}?subject=Re:%20Portfolio%20Inquiry%20-%20Priya%20Sharma" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 10px 20px; border-radius: 6px; border: 1px solid #0284c7;">
                                    Reply to Client directly
                                </a>
                            </td>
                            <td align="right" style="color: #64748b; font-size: 12px;">
                                {timestamp_str}
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                        This notification was automatically dispatched by your portfolio FastAPI backend service.<br>
                        Enquiries are securely logged in your MongoDB cluster and viewable in your admin control panel.
                    </p>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

async def send_enquiry_notification_email(enquiry_data: Dict[str, Any], enquiry_id: str) -> bool:
    """
    Sends Google SMTP email notification to the portfolio owner when an enquiry is made.
    """
    receiver_email = settings.NOTIFICATION_RECEIVER_EMAIL or settings.ADMIN_EMAIL or settings.SMTP_USER
    
    if not is_smtp_configured():
        logger.warning(
            f"[Google SMTP Notice] SMTP credentials not set in .env. "
            f"Enquiry from {enquiry_data.get('email', 'unknown')} logged to MongoDB. "
            f"To enable direct email alerts, set SMTP_USER and SMTP_PASSWORD (Google App Password) in backend/.env"
        )
        return False

    def _sync_send_mail() -> bool:
        try:
            subject = f"Portfolio Enquiry: {enquiry_data.get('fullName', 'New Client')} - {enquiry_data.get('subject', 'Project Discussion')}"
            
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_USER}>"
            message["To"] = receiver_email
            
            # If client provided an email, set Reply-To
            client_email = enquiry_data.get("email") or enquiry_data.get("emailAddress")
            if client_email:
                message["Reply-To"] = client_email

            # Plain text fallback
            plain_text_lines = [f"{k.replace('_', ' ').title()}: {v}" for k, v in enquiry_data.items()]
            plain_body = f"New Enquiry on Portfolio:\n\n" + "\n".join(plain_text_lines)
            
            html_body = generate_enquiry_email_html(enquiry_data, enquiry_id)

            part1 = MIMEText(plain_body, "plain", "utf-8")
            part2 = MIMEText(html_body, "html", "utf-8")
            message.attach(part1)
            message.attach(part2)

            context = ssl.create_default_context()
            
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.ehlo()
                server.starttls(context=context)
                server.ehlo()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_USER, receiver_email, message.as_string())

            logger.info(f"Google SMTP notification successfully dispatched to {receiver_email}")
            return True
        except Exception as e:
            logger.error(f"Failed to dispatch Google SMTP email notification: {e}")
            return False

    return await asyncio.to_thread(_sync_send_mail)
