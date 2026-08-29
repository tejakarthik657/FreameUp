import httpx
from app.config import settings

async def send_verification_email(to_email: str, token: str):
    if not settings.resend_api_key:
        print("Resend API Key is missing. Email skipped.")
        return False

    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {settings.resend_api_key}",
        "Content-Type": "application/json"
    }
    
    verify_link = f"{settings.frontend_url}/verify-email?token={token}"
    
    # Render rich HTML email template
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeae8; border-radius: 12px;">
      <h2 style="color: #4F46E5; margin-bottom: 10px;">Welcome to FrameUp!</h2>
      <p style="font-size: 14px; color: #4b5563; line-height: 1.5;">
        Thank you for signing up. Please verify your email address to activate your account and start generating your business websites and posters.
      </p>
      <div style="margin: 25px 0;">
        <a href="{verify_link}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 14px; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 12px; color: #9ca3af;">
        If you did not request this email, you can safely ignore it. The verification link is valid for 24 hours.
      </p>
      <hr style="border: none; border-top: 1px solid #eaeae8; margin: 20px 0;" />
      <p style="font-size: 10px; color: #9ca3af; font-family: monospace;">
        FrameUp Platform &middot; Designed by DevFrames
      </p>
    </div>
    """

    from_sender = "onboarding@resend.dev"
    if "localhost" not in settings.frontend_url:
        from_sender = "noreply@devframes.in"

    payload = {
        "from": f"FrameUp <{from_sender}>",
        "to": [to_email],
        "subject": "Verify your email address - FrameUp",
        "html": html_content
    }

    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, headers=headers, json=payload)
            if res.status_code != 200:
                print(f"Failed to send email via Resend API: {res.status_code} - {res.text}")
                # Fallback sandbox send attempt
                if from_sender != "onboarding@resend.dev":
                    payload["from"] = "FrameUp <onboarding@resend.dev>"
                    res_fallback = await client.post(url, headers=headers, json=payload)
                    return res_fallback.status_code == 200
                return False
            return True
    except Exception as e:
        print(f"Resend service request error: {str(e)}")
        return False
