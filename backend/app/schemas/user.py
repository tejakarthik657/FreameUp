from pydantic import BaseModel, EmailStr, Field

class UserSettings(BaseModel):
    model: str = "openai/gpt-oss-20b"
    base_domain: str = "localhost:3000"
    static_deploy: str = "local-db"
    enable_ai: bool = True

class UserProfileOut(BaseModel):
    id: str
    email: EmailStr
    name: str = "Store Owner"
    settings: UserSettings = Field(default_factory=UserSettings)

class UserProfileUpdate(BaseModel):
    name: str
    email: EmailStr
    password: str | None = None

class UserSettingsUpdate(BaseModel):
    model: str
    base_domain: str
    static_deploy: str
    enable_ai: bool
