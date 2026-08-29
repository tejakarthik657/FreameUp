from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field

class UserSettingsDB(BaseModel):
    model: str = "openai/gpt-oss-20b"
    base_domain: str = "localhost:3000"
    static_deploy: str = "local-db"
    enable_ai: bool = True

class UserDB(BaseModel):
    email: EmailStr
    password_hash: str
    name: str = "Store Owner"
    settings: UserSettingsDB = Field(default_factory=UserSettingsDB)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_verified: bool = False
    verification_token: str | None = None
