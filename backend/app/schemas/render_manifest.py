"""
Section 8.1/8.3 of the Adaptive Template spec: the render_resolver's ONLY output.
This is the *one* thing the template engine (frontend, in a React setup — Jinja2 here) consumes.
It never sees raw Groq output or raw business data directly for section-presence decisions —
that keeps all adaptive logic in one deterministic place instead of scattered across templates.
"""
from typing import Any
from pydantic import BaseModel, Field
from app.schemas.groq_contract import GroqTheme


class SectionManifest(BaseModel):
    type: str                      # picks which partial to render: "sections/<type>.html",
                                    # or "component:<id>" for a Component Library fallback
    variant: str | None = None     # optional Component Library variant selected by the owner
    density: str | None = None     # e.g. "grid" | "tabs" for menu/services, "standard" | "expanded" for gallery
    data: dict[str, Any] = Field(default_factory=dict)


class RenderManifest(BaseModel):
    template_id: str
    theme: GroqTheme
    section_order: list[str]                    # final, resolved, deterministic order
    sections: dict[str, SectionManifest]
    components_used: list[str] = Field(default_factory=list)   # for debugging/transparency (spec 4.4)
