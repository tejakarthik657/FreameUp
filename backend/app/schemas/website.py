from typing import Optional
from pydantic import BaseModel
from app.schemas.groq_contract import GroqSiteConfig


class WebsiteCreate(BaseModel):
    business_id: str
    template: str          # e.g. "restaurant-premium"
    style_choice_image_id: str   # what the owner actually clicked — never the internal label
    palette_id: str | None = None   # marketplace override for Groq's auto-picked theme colors
    font_id: str | None = None      # marketplace override for Groq's auto-picked font pairing


class WebsiteOut(BaseModel):
    id: str
    business_id: str
    template: str
    generated_content: GroqSiteConfig
    slug: str
    published_url: str
    qr_url: str
    is_static: bool = False            # True if static_html has been generated
    static_generated_at: Optional[str] = None



class RegenerateRequest(BaseModel):
    """Section 6.1: cheap, scoped regeneration — no full re-render pipeline needed for a color tweak.
    'palette' and 'font' are pure catalog swaps — no Groq call at all, so they're instant and free."""
    scope: str  # "theme" | "content" | "full" | "palette" | "font"
    palette_id: str | None = None   # required when scope == "palette"
    font_id: str | None = None      # required when scope == "font"


class WebsiteManifestUpdate(BaseModel):
    render_manifest: dict

