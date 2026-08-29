from pydantic import BaseModel
from datetime import datetime

class PosterCreate(BaseModel):
    business_id: str
    goal: str         # e.g., 'Hiring', 'Promotion', 'Grand Opening'
    aspect_ratio: str # '1:1' | '9:16' | 'A4'
    promo_details: str | None = None # e.g. "Get 20% off all haircuts this weekend"
    logo_url: str | None = None
    image_url: str | None = None

class PosterOut(BaseModel):
    id: str
    business_id: str
    template_id: str
    goal: str
    content: dict
    aspect_ratio: str
    created_at: datetime
