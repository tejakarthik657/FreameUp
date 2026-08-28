from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field


class UserDB(BaseModel):
    email: EmailStr
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
