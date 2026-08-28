from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class LeadIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=5, max_length=20)
    message: Optional[str] = Field(None, max_length=1000)
    business_id: str

class LeadOut(BaseModel):
    id: str
    name: str
    email: EmailStr
    phone: str
    message: Optional[str]
    business_id: str
    created_at: str
