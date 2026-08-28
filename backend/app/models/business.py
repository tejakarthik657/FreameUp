from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.schemas.business import BusinessIn


class BusinessDB(BusinessIn):
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
