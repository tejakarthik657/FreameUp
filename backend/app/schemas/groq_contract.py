"""
The EXACT Groq output contract from the Adaptive Template & Component System spec (section 6).
Groq is only ever asked to classify/structure what the owner provided — never to design layout,
never to touch code. This is validated with Pydantic before anything downstream trusts it
(spec section 8.1: "reject/retry on malformed output — never pass unvalidated AI output
into the render pipeline").
"""
from pydantic import BaseModel, Field


class GroqTheme(BaseModel):
    primary: str
    secondary: str
    accent: str
    font: str                      # heading font
    body_font: str = "Inter"       # NEW — body copy font; defaults so old Groq responses still validate


class GroqHero(BaseModel):
    title: str
    subtitle: str
    cta: str


class GroqAbout(BaseModel):
    title: str
    description: str


class GroqSiteConfig(BaseModel):
    business_type: str
    template: str
    theme: GroqTheme
    available_features: list[str] = Field(default_factory=list)
    recommended_sections: list[str] = Field(default_factory=list)
    hero: GroqHero
    about: GroqAbout
