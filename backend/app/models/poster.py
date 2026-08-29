from datetime import datetime, timezone
from pydantic import BaseModel, Field

class PosterDB(BaseModel):
    user_id: str
    business_id: str
    template_id: str  # e.g., 'promo-bold', 'hiring-clean'
    goal: str         # e.g., 'Hiring', 'Promotion', 'Grand Opening'
    content: dict     # { 'headline': '...', 'tagline': '...', 'cta': '...', 'details': '...' }
    aspect_ratio: str # '1:1' (Square), '9:16' (Story), 'A4' (Print)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
