from fastapi import APIRouter, HTTPException, Response, Depends, Request
from bson import ObjectId
from app.database import users_collection
from app.models.user import UserDB
from app.services.auth_service import hash_password, verify_password, create_access_token, decode_access_token
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/auth", tags=["auth"])


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


def _set_cookie(response: Response, token: str):
    # HTTP-only secure cookie, per section 7.1's chosen (⚠️ "decide carefully") auth approach.
    response.set_cookie(
        key="devframes_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=True,
        max_age=60 * 60 * 24 * 7,
    )


async def get_current_user_id(request: Request) -> str:
    token = request.cookies.get("devframes_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    return user_id
