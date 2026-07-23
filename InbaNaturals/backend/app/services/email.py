import smtplib
from email.message import EmailMessage

from app.config import settings


def send_verification_email(to_email: str, token: str) -> bool:
    if not settings.SMTP_USER or not settings.SMTP_PASS:
        return False

    verify_url = f"http://localhost:5173/verify-email?token={token}"

    msg = EmailMessage()
    msg["Subject"] = "Verify your InbaNaturals account"
    msg["From"] = settings.SMTP_USER
    msg["To"] = to_email
    msg.set_content(
        f"Welcome to InbaNaturals!\n\n"
        f"Please verify your email by clicking the link below:\n\n"
        f"{verify_url}\n\n"
        f"This link expires in 24 hours.\n\n"
        f"With love,\nInbaNaturals Team"
    )

    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
        return True
    except Exception:
        return False
