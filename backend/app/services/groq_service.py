"""
Section 6 of the Adaptive Template spec: Groq's EXACT output contract.
Groq classifies and structures what the owner provided — it never designs layout, never touches
code (section 2: that was evaluated and explicitly rejected as the core architecture).

Section 8.1's reliability guardrail: response is validated against a Pydantic schema before
anything downstream trusts it. Malformed output is retried once, then raised — never silently
passed into the render pipeline.

Section 6.1: because content/theme and code are separated, edits are cheap — regenerate_theme()
and regenerate_content() re-ask Groq for only the narrow slice that changed, no file rewriting.
"""
import json
from groq import Groq
from pydantic import ValidationError
from app.config import settings
from app.schemas.business import BusinessIn
from app.schemas.groq_contract import GroqSiteConfig, GroqTheme, GroqHero, GroqAbout

_client: Groq | None = None
MAX_ATTEMPTS = 2


def _get_client() -> Groq:
    global _client
    if _client is None:
        _client = Groq(api_key=settings.groq_api_key)
    return _client


FULL_CONFIG_SYSTEM_PROMPT = """You are a content/config generator for small-business websites.
Respond with ONLY valid JSON matching this exact shape, nothing else — no markdown fences, no preamble:

{
  "business_type": "restaurant | salon | local_services",
  "template": "the template id given to you",
  "theme": {"primary": "#hex", "secondary": "#hex", "accent": "#hex", "font": "Inter | Playfair Display | Poppins | Montserrat"},
  "available_features": ["instagram", "whatsapp", "maps", "opening_hours", ...only ones the business data actually shows],
  "recommended_sections": ["hero", "about", "menu", "gallery", "opening_hours", "location", "social", "contact"],
  "hero": {"title": "...", "subtitle": "...", "cta": "..."},
  "about": {"title": "...", "description": "..."}
}

Rules based on our MASTER BUSINESS UI/UX SPECIALIST guidelines:
1. DESIGN PHILOSOPHY: Do NOT create generic AI-looking websites. Act as a senior designer focusing on trust, branding, clarity, conversion, speed, and premium feel.
2. COLOR & TYPOGRAPHY: Pick color values that suit the business domain and personality (e.g. Luxury -> elegant darks and gold; Cafe -> warm and inviting; Construction -> strong and reliable; Professional Services -> clean and authoritative). Select fonts that establish readability and premium hierarchy.
3. CONVERSION COPYWRITING: Write clean, specific, concise, and persuasive human copy. hero.title must be under 8 words and express the core value proposition. Primary and secondary CTAs must align with user buying intent (e.g. "Reserve a Table", "Book an Appointment", "Get a Free Quote" - never generic "Learn More" or "Get Started" everywhere).
4. available_features and recommended_sections must only include what the business data you were given actually supports.
"""

THEME_ONLY_SYSTEM_PROMPT = """You are a premium Brand Designer. Respond with ONLY valid JSON: {"primary": "#hex", "secondary": "#hex", "accent": "#hex", "font": "..."}.
Pick colors and a font that reinforce the business's personality (Luxury -> elegant; Cafe -> inviting; tech -> precise). No other text."""

CONTENT_ONLY_SYSTEM_PROMPT = """You are a senior Conversion Copywriter. Respond with ONLY valid JSON:
{"hero": {"title": "...", "subtitle": "...", "cta": "..."}, "about": {"title": "...", "description": "..."}}
Write persuasive, human, concise text. hero.title must be under 8 words. Do not use generic CTAs like "Learn More" - use specific actions (e.g. "Book Consultation", "Reserve a Table"). No other text, no code."""


def _business_summary(business: BusinessIn) -> str:
    items = business.menu if business.category == "restaurant" else business.services
    return (
        f"Business category: {business.category}\n"
        f"Name: {business.name}\n"
        f"Description: {business.description or 'N/A'}\n"
        f"Has images: {bool(business.images)} ({len(business.images)})\n"
        f"Has menu/services: {bool(items)} ({len(items)})\n"
        f"Has opening hours: {bool(business.hours)}\n"
        f"Has instagram: {bool(business.instagram)}\n"
        f"Has whatsapp: {bool(business.whatsapp)}\n"
        f"Has address/maps: {bool(business.address or business.maps)}\n"
    )


def _call_groq_json(system_prompt: str, user_prompt: str, model: str | None = None) -> dict:
    completion = _get_client().chat.completions.create(
        model=model or settings.groq_model,
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    return json.loads(completion.choices[0].message.content)


def generate_site_config(business: BusinessIn, template_id: str, model: str | None = None) -> GroqSiteConfig:
    """Full contract — used on initial site creation and on scope='full' regeneration."""
    user_prompt = _business_summary(business) + f"Template id: {template_id}\nGenerate the JSON now."

    last_error: Exception | None = None
    for _ in range(MAX_ATTEMPTS):
        try:
            data = _call_groq_json(FULL_CONFIG_SYSTEM_PROMPT, user_prompt, model=model)
            return GroqSiteConfig(**data)
        except (json.JSONDecodeError, ValidationError) as e:
            last_error = e
            continue
    raise ValueError(f"Groq returned invalid site config after {MAX_ATTEMPTS} attempts: {last_error}")


def regenerate_theme(business: BusinessIn, model: str | None = None) -> GroqTheme:
    """Section 6.1: 'I don't like the colors' -> re-ask for theme only -> re-render, no file rewriting."""
    user_prompt = _business_summary(business) + "Generate the theme JSON now."
    last_error: Exception | None = None
    for _ in range(MAX_ATTEMPTS):
        try:
            data = _call_groq_json(THEME_ONLY_SYSTEM_PROMPT, user_prompt, model=model)
            return GroqTheme(**data)
        except (json.JSONDecodeError, ValidationError) as e:
            last_error = e
            continue
    raise ValueError(f"Groq returned invalid theme after {MAX_ATTEMPTS} attempts: {last_error}")


def regenerate_content(business: BusinessIn, model: str | None = None) -> tuple[GroqHero, GroqAbout]:
    """Section 6.1: 'Make my restaurant sound more premium' -> re-ask for content only."""
    user_prompt = _business_summary(business) + "Generate the hero/about JSON now."
    last_error: Exception | None = None
    for _ in range(MAX_ATTEMPTS):
        try:
            data = _call_groq_json(CONTENT_ONLY_SYSTEM_PROMPT, user_prompt, model=model)
            return GroqHero(**data["hero"]), GroqAbout(**data["about"])
        except (json.JSONDecodeError, ValidationError, KeyError) as e:
            last_error = e
            continue
    raise ValueError(f"Groq returned invalid content after {MAX_ATTEMPTS} attempts: {last_error}")


def enhance_business_field(field_name: str, current_value: str, category: str, context: dict, model: str | None = None) -> str:
    client = _get_client()
    context_str = "\n".join([f"{k}: {v}" for k, v in context.items() if v])
    system_prompt = (
        f"You are a professional copywriting assistant. Your task is to enhance/autofill the business field '{field_name}' "
        f"for a business of category '{category}'. Return ONLY the enhanced value as plain text. Do not include any quotes, "
        f"introductory text, or markdown formatting. Be highly professional, engaging, and concise."
    )
    user_prompt = (
        f"Current business context:\n{context_str}\n\n"
        f"Field to enhance: '{field_name}'\n"
        f"Current value (can be empty): '{current_value}'\n\n"
        f"Enhance this field now and return ONLY the enhanced string."
    )
    completion = client.chat.completions.create(
        model=model or settings.groq_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.7,
        max_tokens=250
    )
    return completion.choices[0].message.content.strip().strip('"').strip("'")


def parse_raw_offerings(raw_text: str, category: str, model: str | None = None) -> list[dict]:
    import re
    client = _get_client()
    if category == "restaurant":
        system_prompt = (
            "You are a structured data extractor. Convert the following raw menu text into structured JSON matching this schema:\n"
            "[\n"
            "  {\n"
            "    \"name\": \"Item Name\",\n"
            "    \"price\": \"$10.00 or 150 (always extract price as a string including currency if present)\",\n"
            "    \"description\": \"Item description or ingredients list\",\n"
            "    \"category\": \"Starters | Mains | Desserts | Drinks\"\n"
            "  }\n"
            "]\n"
            "Return ONLY a valid JSON list. Do not include markdown fences, preamble, or explain anything."
        )
    else:
        system_prompt = (
            "You are a structured data extractor. Convert the following raw service list text into structured JSON matching this schema:\n"
            "[\n"
            "  {\n"
            "    \"name\": \"Service Name\",\n"
            "    \"price\": \"$50 or 500 (always extract price as a string including currency if present)\",\n"
            "    \"duration\": \"30 mins or 1 hour (duration of service)\",\n"
            "    \"description\": \"Short description of the service\",\n"
            "    \"category\": \"Category name (e.g. Hair, Skin, Plumbing, Electrical)\"\n"
            "  }\n"
            "]\n"
            "Return ONLY a valid JSON list. Do not include markdown fences, preamble, or explain anything."
        )
    
    completion = client.chat.completions.create(
        model=model or settings.groq_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Raw text list:\n{raw_text}"}
        ],
        temperature=0.2,
        response_format={"type": "json_object"}
    )
    
    content = completion.choices[0].message.content.strip()
    if content.startswith("```"):
        content = re.sub(r"^```[a-zA-Z]*\n", "", content)
        content = re.sub(r"\n```$", "", content)
        content = content.strip()
    
    try:
        data = json.loads(content)
        if isinstance(data, dict):
            for k, v in data.items():
                if isinstance(v, list):
                    return v
            return []
        return data if isinstance(data, list) else []
    except Exception:
        return []

