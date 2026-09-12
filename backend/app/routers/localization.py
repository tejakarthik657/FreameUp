from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from bson import ObjectId
from app.database import db, businesses_collection
from app.services.groq_service import _get_client
from app.config import settings
import json

router = APIRouter(prefix="/localization", tags=["localization"])

translations_collection = db["translations"]


class TranslateRequest(BaseModel):
    business_id: str
    target_languages: List[str]  # e.g., ['Hindi', 'Telugu', 'Spanish', 'French']


@router.get("/translations/{business_id}")
async def get_translations(business_id: str):
    doc = await translations_collection.find_one({"business_id": business_id})
    if not doc:
        return {"business_id": business_id, "translations": {}}
    doc["_id"] = str(doc["_id"])
    return doc


@router.post("/translate")
async def generate_translations(payload: TranslateRequest):
    # Fetch business doc
    try:
        b_doc = await businesses_collection.find_one({"_id": ObjectId(payload.business_id)})
    except Exception:
        raise HTTPException(status_code=404, detail="Business not found")

    if not b_doc:
        raise HTTPException(status_code=404, detail="Business not found")

    category = b_doc.get("category", "restaurant")
    items = b_doc.get("menu") if category == "restaurant" else b_doc.get("services")
    
    source_payload = {
        "name": b_doc.get("name"),
        "tagline": b_doc.get("tagline"),
        "description": b_doc.get("description"),
        "items": [
            {
                "name": item.get("name"),
                "description": item.get("description", ""),
                "price": item.get("price", "")
            }
            for item in (items or [])[:15]
        ]
    }

    client = _get_client()
    result_translations = {}

    for lang in payload.target_languages:
        system_prompt = f"""You are a professional multi-lingual translator for commercial local business websites.
Translate the JSON content below accurately and naturally into: {lang}.
Maintain exact JSON structure. Do NOT translate brand proper names if unsuitable, but translate taglines, descriptions, and food/service item names and descriptions into {lang}.

Return ONLY valid JSON matching this structure:
{{
  "tagline": "translated tagline",
  "description": "translated description",
  "items": [
    {{"name": "translated item name", "description": "translated item description", "price": "original price"}}
  ]
}}
"""
        try:
            completion = client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": json.dumps(source_payload)}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            parsed = json.loads(completion.choices[0].message.content)
            result_translations[lang] = parsed
        except Exception as e:
            result_translations[lang] = {"error": f"Failed to translate to {lang}: {str(e)}"}

    await translations_collection.update_one(
        {"business_id": payload.business_id},
        {"$set": {"business_id": payload.business_id, "translations": result_translations}},
        upsert=True
    )

    return {
        "status": "success",
        "business_id": payload.business_id,
        "languages": payload.target_languages,
        "translations": result_translations
    }
