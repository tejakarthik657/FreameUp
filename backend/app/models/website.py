from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from app.schemas.groq_contract import GroqSiteConfig
from app.schemas.render_manifest import RenderManifest


class WebsiteDB(BaseModel):
    business_id: str
    template: str
    generated_content: GroqSiteConfig     # raw, validated Groq output — kept for regeneration/debugging
    render_manifest: RenderManifest       # fully resolved output of render_resolver — what the engine renders
    slug: str
    published_url: str
    qr_url: str
    static_html: Optional[str] = None          # pre-rendered HTML — set by /generate-static
    static_generated_at: Optional[str] = None  # ISO timestamp of last static generation
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

