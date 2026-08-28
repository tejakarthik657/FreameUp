from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.schemas.business import BusinessIn
from app.schemas.groq_contract import GroqSiteConfig
from app.services.groq_service import generate_site_config, enhance_business_field, parse_raw_offerings
from app.routers.auth import get_current_user_id

router = APIRouter(prefix="/ai", tags=["ai"])


class EnhanceFieldRequest(BaseModel):
    field_name: str
    current_value: str
    category: str
    context: dict


class ParseOfferingsRequest(BaseModel):
    raw_text: str
    category: str


@router.post("/generate-content", response_model=GroqSiteConfig)
async def generate_content(business: BusinessIn, template_id: str, user_id: str = Depends(get_current_user_id)):
    """
    Standalone preview endpoint — lets the frontend show generated copy/theme before committing
    to a full site creation. Groq's ONLY job here (spec section 6): return the structured
    business_type/theme/available_features/recommended_sections/hero/about JSON — never HTML.
    """
    return generate_site_config(business, template_id)


@router.post("/enhance-field")
async def enhance_field(payload: EnhanceFieldRequest, user_id: str = Depends(get_current_user_id)):
    enhanced = enhance_business_field(
        field_name=payload.field_name,
        current_value=payload.current_value,
        category=payload.category,
        context=payload.context
    )
    return {"enhanced_value": enhanced}


@router.post("/parse-offerings")
async def parse_offerings(payload: ParseOfferingsRequest, user_id: str = Depends(get_current_user_id)):
    items = parse_raw_offerings(
        raw_text=payload.raw_text,
        category=payload.category
    )
    return {"items": items}
