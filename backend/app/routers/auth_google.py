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


def resolve_redirect_uri(request: Request) -> str:
    """Determine the Google OAuth callback URI registered in Google Cloud Console."""
    host = request.headers.get("host") or ""
    # If request reaches Render backend (freameup.onrender.com)
    if "onrender.com" in host or "freameup" in host or request.url.scheme == "https":
        return "https://freameup.onrender.com/auth/google/callback"
    if settings.google_redirect_uri and "onrender.com" in settings.google_redirect_uri:
        return settings.google_redirect_uri
    return "http://localhost:8000/auth/google/callback"


def resolve_frontend_origin(request: Request) -> str:
    """Determine the exact frontend origin URL (production Vercel vs local localhost)."""
    # 1. State parameter passed through Google OAuth
    state = request.query_params.get("state")
    if state and (state.startswith("http://") or state.startswith("https://")):
        return state.rstrip("/")

    # 2. Referer / Origin header
    referer = request.headers.get("referer") or request.headers.get("origin") or ""
    if "devframes-presence.vercel.app" in referer or "vercel.app" in referer:
        parts = referer.split("/")
        if len(parts) >= 3:
            return f"{parts[0]}//{parts[2]}"
    if "localhost:3000" in referer:
        return "http://localhost:3000"

    # 3. Settings frontend_url override
    if settings.frontend_url and settings.frontend_url != "http://localhost:3000":
        return settings.frontend_url.rstrip("/")

    # 4. Host header check: If running on Render backend, target production Vercel frontend
    host = request.headers.get("host") or ""
    if "onrender.com" in host or "freameup" in host:
        return "https://devframes-presence.vercel.app"

    return "http://localhost:3000"


@router.get("/login")
async def google_login(request: Request):
    """Initiates the Google OAuth authorization flow by redirecting the user to Google."""
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(status_code=500, detail="Google OAuth credentials not configured on server")

    # Determine caller's frontend origin to pass state back through OAuth flow
    referer = request.headers.get("referer") or request.headers.get("origin") or ""
    if "devframes-presence.vercel.app" in referer or "vercel.app" in referer:
        frontend_state = "https://devframes-presence.vercel.app"
    elif "localhost:3000" in referer:
        frontend_state = "http://localhost:3000"
    else:
        frontend_state = resolve_frontend_origin(request)

    redirect_uri = resolve_redirect_uri(request)
    return await oauth.google.authorize_redirect(request, redirect_uri, state=frontend_state)


@router.get("/callback")
async def google_callback(request: Request, response: Response):
    """Callback target for Google OAuth validation. Verifies token, upserts user, and redirects to frontend."""
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(status_code=500, detail="Google OAuth credentials not configured on server")

    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")
        if not user_info:
            resp = await oauth.google.get("https://openidconnect.googleapis.com/v1/userinfo", token=token)
            user_info = resp.json()

        email = user_info.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Failed to retrieve email scope from Google login")

        name = user_info.get("name", email.split("@")[0])
        picture = user_info.get("picture", "")

        # Lookup or create user in MongoDB
        user = await users_collection.find_one({"email": email})
        if not user:
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
            if user.get("name", "Store Owner") == "Store Owner" and name:
                await users_collection.update_one({"_id": user["_id"]}, {"$set": {"name": name, "picture": picture}})

        # Generate JWT session token
        jwt_token = create_access_token(user_id)
        
        # Resolve exact target frontend origin
        frontend_origin = resolve_frontend_origin(request)
        
        # Build redirect response to target frontend /dashboard
        redirect_response = RedirectResponse(url=f"{frontend_origin}/dashboard?token={jwt_token}")
        _set_cookie(redirect_response, jwt_token)
        return redirect_response

    except Exception as e:
        frontend_origin = resolve_frontend_origin(request)
        return RedirectResponse(url=f"{frontend_origin}/login?error=google_auth_failed&msg={str(e)}")
