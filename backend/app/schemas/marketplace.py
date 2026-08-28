"""
Marketplace: a curated catalog the owner can pick from directly, instead of only trusting
Groq's AI-picked theme. Selecting a palette/font here OVERRIDES the theme fields in
GroqSiteConfig — Groq still writes the copy, but color/typography become the owner's choice
when they want that control.
"""
from pydantic import BaseModel


class Palette(BaseModel):
    id: str
    name: str
    primary: str
    secondary: str
    accent: str
    font: str          # suggested heading font pairing for this palette


class FontPairing(BaseModel):
    id: str
    name: str
    heading_font: str
    body_font: str


class StockImage(BaseModel):
    id: str
    category: str       # "restaurant" | "salon" | "local_services"
    url: str
    alt: str
