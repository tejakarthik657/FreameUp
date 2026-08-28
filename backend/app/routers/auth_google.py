from fastapi import APIRouter, HTTPException, Response, Depends, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from bson import ObjectId
from datetime import datetime, timezone
from app.config import settings
from app.database import users_collection
from app.services.auth_service import create_access_token
from app.routers.auth import _set_cookie

router = APIRouter(prefix="/auth/google", tags=["google-auth"])

# Initialize Google Client configuration via Authlib
oauth = OAuth()
oauth.register(
    name="google",
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


@router.get("/login")
async def google_login(request: Request):
    """Initiates the Google OAuth authorization flow by redirecting the user to Google."""
    redirect_uri = settings.google_redirect_uri
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/callback")
async def google_callback(request: Request, response: Response):
    """Callback target for Google OAuth validation. Verifies Google token, upserts user, and issues cookie session."""
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to fetch Google profile info")
            
        email = user_info.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Failed to retrieve email scope from Google login")
            
        name = user_info.get("name", email.split("@")[0])
        picture = user_info.get("picture", "")

        # Lookup email in DB
        user = await users_collection.find_one({"email": email})
        if not user:
            # Create user document
            new_user = {
                "email": email,
                "name": name,
                "picture": picture,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            res = await users_collection.insert_one(new_user)
            user_id = str(res.inserted_id)
        else:
            user_id = str(user["_id"])

        # Set jwt cookie and redirect to dashboard
        jwt_token = create_access_token(user_id)
        
        # We redirect users to dashboard on frontend
        # In localhost setup we redirect to port 3000
        # If settings.base_domain contains localhost:3000, redirect to http://localhost:3000/dashboard
        redirect_host = "http://localhost:3000" if "localhost" in settings.base_domain else f"https://{settings.base_domain}"
        
        redirect_response = RedirectResponse(url=f"{redirect_host}/dashboard")
        _set_cookie(redirect_response, jwt_token)
        return redirect_response
        
    except Exception as e:
        # Redirect back to login screen on failure with query code
        redirect_host = "http://localhost:3000" if "localhost" in settings.base_domain else f"https://{settings.base_domain}"
        return RedirectResponse(url=f"{redirect_host}/login?error=google_auth_failed&msg={str(e)}")
