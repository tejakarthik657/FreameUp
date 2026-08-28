"""
Section 4.2 of the Adaptive Template spec: every template declares a Capability Contract —
what it natively supports — instead of the backend hardcoding logic per business type.
"""
from pydantic import BaseModel


class TemplateManifestDef(BaseModel):
    id: str                       # e.g. "restaurant-premium" — matches template_engine.TEMPLATE_REGISTRY key
    category: str
    style: str
    version: str
    core_sections: list[str]      # always rendered when data exists; template is "broken" without these
    optional_sections: list[str]  # rendered only if the owner provided the relevant data
    section_order: list[str]      # the template's fixed canonical order (spec 5.1: ordering is bounded, not arbitrary)
