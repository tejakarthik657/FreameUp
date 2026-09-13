from fastapi import APIRouter, HTTPException, Response, Depends, Request
from fastapi.responses import RedirectResponse
from bson import ObjectId
from app.database import users_collection
from app.models.user import UserDB
from app.services.auth_service import hash_password, verify_password, create_access_token, decode_access_token
from app.schemas.user import UserProfileOut, UserProfileUpdate, UserSettingsUpdate
from pydantic import BaseModel, EmailStr
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config as StarletteConfig
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

# Google OAuth setup
oauth = OAuth(StarletteConfig(environ={
    "GOOGLE_CLIENT_ID": settings.google_client_id,
    "GOOGLE_CLIENT_SECRET": settings.google_client_secret,
}))
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


async def get_current_user_id(request: Request) -> str:
    token = request.cookies.get("devframes_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return user_id


class Credentials(BaseModel):
    email: EmailStr
    password: str


@router.post("/signup")
async def signup(payload: Credentials, response: Response):
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = UserDB(email=payload.email, password_hash=hash_password(payload.password))
    result = await users_collection.insert_one(user.model_dump())
    token = create_access_token(str(result.inserted_id))
    _set_cookie(response, token)
    return {"id": str(result.inserted_id), "email": payload.email}


@router.post("/login")
async def login(payload: Credentials, response: Response):
    user = await users_collection.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(str(user["_id"]))
    _set_cookie(response, token)
    return {"id": str(user["_id"]), "email": user["email"]}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("devframes_token")
    return {"ok": True}


@router.get("/me", response_model=UserProfileOut)
async def get_me(user_id: str = Depends(get_current_user_id)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Initialize defaults if fields are missing in old users
    settings_data = user.get("settings", {})
    if not isinstance(settings_data, dict):
        settings_data = {}

    return UserProfileOut(
        id=str(user["_id"]),
        email=user["email"],
        name=user.get("name", "Store Owner"),
        settings={
            "model": settings_data.get("model", settings.groq_model),
            "base_domain": settings_data.get("base_domain", "localhost:3000"),
            "static_deploy": settings_data.get("static_deploy", "local-db"),
            "enable_ai": settings_data.get("enable_ai", True)
        }
    )


@router.put("/profile")
async def update_profile(payload: UserProfileUpdate, user_id: str = Depends(get_current_user_id)):
    # Check if email is already taken by someone else
    existing = await users_collection.find_one({"email": payload.email, "_id": {"$ne": ObjectId(user_id)}})
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    update_data = {
        "name": payload.name,
        "email": payload.email
    }
    if payload.password:
        update_data["password_hash"] = hash_password(payload.password)

    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )
    return {"ok": True}


@router.put("/settings")
async def update_settings(payload: UserSettingsUpdate, user_id: str = Depends(get_current_user_id)):
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "settings": payload.model_dump()
        }}
    )
    return {"ok": True}


def _set_cookie(response: Response, token: str):
    # HTTP-only secure cookie with SameSite=None so it is sent cross-origin
    # (Vercel frontend → Render backend are on different domains in production).
    # SameSite=None REQUIRES Secure=True per browser spec.
    response.set_cookie(
        key="devframes_token",
        value=token,
        httponly=True,
        samesite="none",
        secure=True,
        max_age=60 * 60 * 24 * 7,
    )



