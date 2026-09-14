from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from bson import ObjectId
import httpx
import json
from app.database import db, businesses_collection
from app.services.groq_service import _get_client
from app.config import settings

router = APIRouter(prefix="/ai-agent", tags=["ai-agent"])

ai_config_collection = db["ai_agent_configs"]
chat_history_collection = db["ai_chat_history"]


async def geocode_real_location(query_str: str) -> Optional[Dict[str, float]]:
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"format": "json", "q": query_str, "countrycodes": "in", "limit": 1},
                headers={"User-Agent": "DevFrames-AtlasOS/1.0"}
            )
            if res.status_code == 200:
                data = res.json()
                if data and len(data) > 0:
                    return {"lat": float(data[0]["lat"]), "lng": float(data[0]["lon"])}
    except Exception:
        pass
    return None


async def fetch_real_nearby_pois(locality: str, district: str, category: str) -> List[Dict[str, Any]]:
    query_term = f"{category} in {locality}, {district}"
    pois = []
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            res = await client.get(
                "https://nominatim.openstreetmap.org/search",
                params={"format": "json", "q": query_term, "countrycodes": "in", "limit": 6},
                headers={"User-Agent": "DevFrames-AtlasOS/1.0"}
            )
            if res.status_code == 200:
                data = res.json()
                for idx, item in enumerate(data):
                    name_part = item.get("display_name", "").split(",")[0].strip()
                    if name_part:
                        pois.append({
                            "name": name_part,
                            "lat": float(item["lat"]),
                            "lng": float(item["lon"]),
                            "address": item.get("display_name", "")
                        })
    except Exception:
        pass
    return pois


class ChatRequest(BaseModel):
    business_id: str
    message: str
    session_id: Optional[str] = "default"


class AgentConfigUpdate(BaseModel):
    tone: Optional[str] = "Multilingual Indian Executive Concierge"
    auto_responder_enabled: Optional[bool] = True
    greeting_message: Optional[str] = "नमस्ते / Hello! Welcome to our business. How may I assist you today? (आप हिंदी, తెలుగు, தமிழ் या किसी भी भारतीय भाषा में बात कर सकते हैं!)"
    custom_faqs: Optional[List[Dict[str, str]]] = []


class CompetitorRequest(BaseModel):
    business_id: Optional[str] = ""
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = "Mumbai Suburban"
    locality: Optional[str] = "Bandra West"
    category: Optional[str] = "restaurant"
    query: Optional[str] = ""


@router.get("/config/{business_id}")
async def get_agent_config(business_id: str):
    config = await ai_config_collection.find_one({"business_id": business_id})
    if not config:
        return {
            "business_id": business_id,
            "tone": "Multilingual Indian Executive Concierge",
            "auto_responder_enabled": True,
            "greeting_message": "नमस्ते / Hello! Welcome to our business. How may I assist you today? (आप हिंदी, తెలుగు, தமிழ் या किसी भी भारतीय भाषा में बात कर सकते हैं!)",
            "custom_faqs": [],
        }
    config["_id"] = str(config["_id"])
    return config


@router.post("/config/{business_id}")
async def update_agent_config(business_id: str, payload: AgentConfigUpdate):
    data = payload.model_dump(exclude_unset=True)
    await ai_config_collection.update_one(
        {"business_id": business_id},
        {"$set": {**data, "business_id": business_id}},
        upsert=True,
    )
    return {"status": "success", "message": "Multilingual Intelligent AI Agent configuration updated successfully"}


@router.post("/chat")
async def ai_chat(payload: ChatRequest):
    # Retrieve business info for RAG context
    try:
        b_doc = await businesses_collection.find_one({"_id": ObjectId(payload.business_id)})
    except Exception:
        b_doc = None

    if not b_doc:
        b_doc = await businesses_collection.find_one({"name": payload.business_id})

    # Get custom FAQs / config
    config = await ai_config_collection.find_one({"business_id": payload.business_id}) or {}
    tone = config.get("tone", "Multilingual Indian Executive Concierge")

    # Build RAG System Prompt for Multilingual Indian Intelligent Master Agent
    business_name = b_doc.get("name", "our business") if b_doc else "our business"
    category = b_doc.get("category", "business") if b_doc else "business"
    phone = b_doc.get("phone", "N/A") if b_doc else "N/A"
    whatsapp = b_doc.get("whatsapp", "N/A") if b_doc else "N/A"
    address = b_doc.get("address", "N/A") if b_doc else "N/A"
    hours = b_doc.get("hours", []) if b_doc else []
    items = (b_doc.get("menu") if category == "restaurant" else b_doc.get("services")) if b_doc else []

    hours_str = ", ".join([f"{h.get('day')}: {h.get('open')} - {h.get('close')}" if not h.get('closed') else f"{h.get('day')}: Closed" for h in hours]) or "Contact for hours"
    items_str = ", ".join([f"{i.get('name')} (₹{i.get('price', '')})" for i in (items or [])[:20]]) or "Contact for catalog"
    faqs_str = "\n".join([f"Q: {f.get('q')}\nA: {f.get('a')}" for f in config.get("custom_faqs", [])])

    system_prompt = f"""You are the Master Intelligent AI Operations Agent & VIP Concierge for "{business_name}" ({category}).
Your Tone: {tone} (Warm, polite, executive, and highly helpful).

CRITICAL MULTILINGUAL NATIVE INDIAN CAPABILITY:
- You must AUTOMATICALLY DETECT the language of the user's message.
- You can chat seamlessly in ALL Indian languages: Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Marathi (मराठी), Bengali (বাংলা), Malayalam (മലയാളം), Gujarati (ગુજરાતી), Hinglish, Teluglish, Tanglish, and English!
- Always reply in the EXACT SAME LANGUAGE and script the user used! For example, if the user asks in Hindi ("आपकी दुकान कब खुलती है?"), reply in natural Hindi ("नमस्ते! हमारी दुकान शाम 8 बजे तक खुली है।"). If they ask in Telugu ("మీ ఆఫర్లు ఏంటి?"), reply in Telugu.

BUSINESS KNOWLEDGE BASE & CATALOG:
- Enterprise Name: {business_name}
- Category: {category}
- Direct Phone: {phone} | WhatsApp: {whatsapp}
- Address: {address}
- Working Hours: {hours_str}
- Offerings / Menu & Pricing: {items_str}
- Custom FAQs:
{faqs_str}

OPERATIONAL MANAGEMENT ACTIONS:
1. Answer visitor Q&A on pricing, location, items, and timings accurately in their native language.
2. If the user desires a booking or table reservation, collect their Name, Phone, and Request, then include the tag `[ACTION: BOOKING_REQUESTED]`.
3. If the user desires an order, collect items, then include `[ACTION: ORDER_PLACED]`.
4. If the user requests an invoice, include `[ACTION: INVOICE_REQUESTED]`.
5. Keep responses concise, warm, and highly professional.
"""

    client = _get_client()
    try:
        completion = client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": payload.message},
            ],
            temperature=0.7,
            max_tokens=350,
        )
        reply = completion.choices[0].message.content.strip()
    except Exception as e:
        reply = f"नमस्ते / Hello! Thank you for reaching out to {business_name}. Connect directly on WhatsApp at {whatsapp or phone}."

    # Log chat history
    await chat_history_collection.insert_one({
        "business_id": payload.business_id,
        "session_id": payload.session_id,
        "user_message": payload.message,
        "bot_reply": reply,
    })

    return {
        "reply": reply,
        "business_name": business_name,
        "is_booking": "[ACTION: BOOKING_REQUESTED]" in reply,
        "is_order": "[ACTION: ORDER_PLACED]" in reply,
        "is_invoice": "[ACTION: INVOICE_REQUESTED]" in reply,
    }


INDIAN_COORDINATES: Dict[str, Dict[str, float]] = {
    "bandra west": {"lat": 19.0596, "lng": 72.8295},
    "mumbai suburban": {"lat": 19.0760, "lng": 72.8777},
    "mumbai city": {"lat": 18.9388, "lng": 72.8353},
    "pune": {"lat": 18.5204, "lng": 73.8567},
    "koregaon park": {"lat": 18.5362, "lng": 73.8940},
    "hyderabad": {"lat": 17.3850, "lng": 78.4867},
    "jubilee hills": {"lat": 17.4319, "lng": 78.4071},
    "hitec city": {"lat": 17.4435, "lng": 78.3772},
    "bengaluru": {"lat": 12.9716, "lng": 77.5946},
    "indiranagar": {"lat": 12.9784, "lng": 77.6408},
    "koramangala": {"lat": 12.9352, "lng": 77.6245},
    "delhi ncr": {"lat": 28.6139, "lng": 77.2090},
    "chandni chowk": {"lat": 28.6506, "lng": 77.2303},
    "connaught place": {"lat": 28.6315, "lng": 77.2167},
    "chennai": {"lat": 13.0827, "lng": 80.2707},
    "t. nagar": {"lat": 13.0418, "lng": 80.2341},
    "ahmedabad": {"lat": 23.0225, "lng": 72.5714},
    "satellite": {"lat": 23.0300, "lng": 72.5176},
    "kolkata": {"lat": 22.5726, "lng": 88.3639},
    "park street": {"lat": 22.5532, "lng": 88.3524},
    "lucknow": {"lat": 26.8467, "lng": 80.9462},
    "hazratganj": {"lat": 26.8530, "lng": 80.9450},
    "jaipur": {"lat": 26.9124, "lng": 75.7873},
    "c scheme": {"lat": 26.9080, "lng": 75.7985},
}


@router.post("/competitor-intelligence")
async def get_competitor_intelligence(payload: CompetitorRequest):
    # Retrieve business info
    b_doc = None
    if payload.business_id:
        try:
            b_doc = await businesses_collection.find_one({"_id": ObjectId(payload.business_id)})
        except Exception:
            b_doc = await businesses_collection.find_one({"name": payload.business_id})

    biz_name = b_doc.get("name", "Your Business") if b_doc else "Your Business"
    biz_cat = payload.category or (b_doc.get("category", "restaurant") if b_doc else "restaurant")

    locality = (payload.locality or "Bandra West").strip()
    district = (payload.district or "Mumbai Suburban").strip()
    state = (payload.state or "Maharashtra").strip()

    # 1. REAL GEOLOCATION: Try geocoding business address or selected locality
    real_coords = None
    if b_doc and b_doc.get("address"):
        real_coords = await geocode_real_location(f"{b_doc.get('address')}, {district}, {state}")
    if not real_coords:
        real_coords = await geocode_real_location(f"{locality}, {district}, {state}, India")

    loc_key = locality.lower()
    dist_key = district.lower()
    fallback_coords = INDIAN_COORDINATES.get(loc_key) or INDIAN_COORDINATES.get(dist_key) or {"lat": 19.0760, "lng": 72.8777}

    center_lat = real_coords["lat"] if real_coords else fallback_coords["lat"]
    center_lng = real_coords["lng"] if real_coords else fallback_coords["lng"]

    # 2. REAL NEARBY POIS: Fetch actual commercial places from OpenStreetMap
    real_pois = await fetch_real_nearby_pois(locality, district, biz_cat)
    real_poi_names = [p["name"] for p in real_pois] if real_pois else []
    poi_context_str = f"\nReal Nearby Places in OpenStreetMap database for {locality}: {', '.join(real_poi_names)}" if real_poi_names else ""

    # 3. Groq AI Market Intelligence on Real POIs
    ask_query_clause = f"\nUser Ask Map Query Intent: '{payload.query}'" if payload.query else ""
    system_prompt = f"""You are the Master AI Market Intelligence & Competitor Strategy Agent for Indian Small & Medium Businesses.
Analyze the real local market in "{locality}, {district}, {state}, India" for a business in the "{biz_cat}" category.{poi_context_str}{ask_query_clause}

Return ONLY a valid JSON object matching this exact structure:
{{
  "market_summary": "Short 2-sentence summary of the real market dynamics and user query answer for {locality}.",
  "competitors": [
    {{
      "name": "Real Competitor Name",
      "rating": 4.6,
      "price_tier": "₹₹",
      "distance_km": 0.4,
      "strengths": "Real market strength",
      "weaknesses": "Real market weakness",
      "customer_hook": "Why local customers visit them"
    }}
  ],
  "why_competitors_win": "Detailed analysis of why these real local competitors attract customers in {locality}.",
  "actionable_recommendations": [
    "1-click UPI instant cashback or discount for direct WhatsApp orders",
    "Offer 30-minute hyper-local delivery guarantee within 2km radius",
    "Highlight 100% Karigar handcrafted quality and GST input tax credit",
    "Extend evening operating hours by 1 hour when local rivals close early"
  ]
}}
Do NOT wrap in markdown or commentary, output ONLY raw valid JSON."""

    client = _get_client()
    user_prompt_msg = f"Generate competitor intelligence for {biz_name} in {locality}, {district}, {state}."
    if payload.query:
        user_prompt_msg += f" Process natural language Ask Map query: {payload.query}"

    try:
        completion = client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt_msg}
            ],
            temperature=0.4,
            max_tokens=800,
        )
        raw_text = completion.choices[0].message.content.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        data = json.loads(raw_text.strip())
    except Exception as e:
        data = {
            "market_summary": f"Active commercial zone in {locality}, {district} with strong customer footfall for {biz_cat}.",
            "competitors": [
                {
                    "name": real_pois[i]["name"] if i < len(real_pois) else f"{locality} Commercial Hub {i+1}",
                    "rating": round(4.2 + (i * 0.2), 1),
                    "price_tier": "₹₹",
                    "distance_km": round(0.3 + (i * 0.4), 1),
                    "strengths": "Established local footfall & direct WhatsApp ordering",
                    "weaknesses": "Higher prices, no customized Karigar services",
                    "customer_hook": "Prime street visibility & rapid customer service"
                }
                for i in range(min(4, max(3, len(real_pois))))
            ],
            "why_competitors_win": f"Competitors in {locality} leverage high-footfall street locations, WhatsApp instant response, and regional marketing.",
            "actionable_recommendations": [
                "Launch instant UPI cashback for direct orders to beat third-party commission costs",
                "Offer 30-minute hyper-local delivery guarantee within 3km radius",
                "Highlight 100% Karigar handcrafted quality and GST tax invoice savings",
                "Keep store open 1 hour later than local competitors during peak evening hours"
            ]
        }

    # Map real latitude and longitude from OpenStreetMap POIs to competitors if available
    comps = data.get("competitors", [])
    offsets = [
        {"lat": 0.0035, "lng": 0.0042},
        {"lat": -0.0041, "lng": -0.0028},
        {"lat": 0.0022, "lng": -0.0051},
        {"lat": -0.0030, "lng": 0.0049},
    ]

    for idx, comp in enumerate(comps):
        if idx < len(real_pois):
            comp["lat"] = real_pois[idx]["lat"]
            comp["lng"] = real_pois[idx]["lng"]
            comp["address"] = real_pois[idx].get("address", f"{locality}, {district}")
        else:
            offset = offsets[idx % len(offsets)]
            comp["lat"] = round(center_lat + offset["lat"], 6)
            comp["lng"] = round(center_lng + offset["lng"], 6)
            comp["address"] = f"{locality}, {district}"
        comp["id"] = f"comp_{idx+1}"

    user_biz_pin = {
        "id": "user_biz",
        "name": f"{biz_name} (Your Store)",
        "lat": center_lat,
        "lng": center_lng,
        "is_user": True,
        "category": biz_cat,
    }

    return {
        "status": "success",
        "locality": locality,
        "district": district,
        "state": state,
        "center": {"lat": center_lat, "lng": center_lng, "zoom": 15},
        "user_pin": user_biz_pin,
        "competitors": comps,
        "market_summary": data.get("market_summary", ""),
        "why_competitors_win": data.get("why_competitors_win", ""),
        "actionable_recommendations": data.get("actionable_recommendations", []),
    }

