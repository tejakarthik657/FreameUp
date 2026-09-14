from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from bson import ObjectId
from app.database import db, businesses_collection
from app.services.groq_service import _get_client
from app.config import settings

router = APIRouter(prefix="/ai-agent", tags=["ai-agent"])

ai_config_collection = db["ai_agent_configs"]
chat_history_collection = db["ai_chat_history"]


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

    loc_key = locality.lower()
    dist_key = district.lower()

    base_coords = INDIAN_COORDINATES.get(loc_key) or INDIAN_COORDINATES.get(dist_key) or {"lat": 19.0760, "lng": 72.8777}
    center_lat = base_coords["lat"]
    center_lng = base_coords["lng"]

    # Request Groq AI market analysis & realistic competitor generation
    ask_query_clause = f"\nUser Ask Map Query Intent: '{payload.query}'" if payload.query else ""
    system_prompt = f"""You are the Master AI Market Intelligence & Competitor Strategy Agent for Indian Small & Medium Businesses.
Analyze the local market in "{locality}, {district}, {state}, India" for a business in the "{biz_cat}" category.{ask_query_clause}

Return ONLY a valid JSON object matching this exact structure:
{{
  "market_summary": "Short 2-sentence summary of the market dynamics and user query answer for {locality}.",
  "competitors": [
    {{
      "name": "Competitor 1 Name",
      "rating": 4.6,
      "price_tier": "₹₹",
      "distance_km": 0.4,
      "strengths": "What makes them popular (e.g., 30-min fast delivery, heavy Instagram marketing, loyal footfall)",
      "weaknesses": "Where they lag (e.g., higher prices, poor parking, slow customer service)",
      "customer_hook": "Why local customers choose them first"
    }},
    {{
      "name": "Competitor 2 Name",
      "rating": 4.4,
      "price_tier": "₹",
      "distance_km": 0.8,
      "strengths": "Key advantage",
      "weaknesses": "Key drawback",
      "customer_hook": "Main customer draw"
    }},
    {{
      "name": "Competitor 3 Name",
      "rating": 4.2,
      "price_tier": "₹₹₹",
      "distance_km": 1.2,
      "strengths": "Key advantage",
      "weaknesses": "Key drawback",
      "customer_hook": "Main customer draw"
    }}
  ],
  "why_competitors_win": "Detailed analysis of why these competitors currently attract local customers in {locality}.",
  "actionable_recommendations": [
    "1-click UPI instant cashback or discount for direct WhatsApp orders",
    "Offer 30-minute hyper-local delivery guarantee within 2km radius",
    "Highlight 100% Karigar handcrafted quality and GST input tax credit",
    "Extend evening operating hours by 1 hour when competitors close early"
  ]
}}
Do NOT wrap in markdown or commentary, output ONLY raw valid JSON."""

    client = _get_client()
    import json
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
        # Clean JSON if markdown block returned
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        data = json.loads(raw_text.strip())
    except Exception as e:
        data = {
            "market_summary": f"Strong competitive presence in {locality}, {district} with high demand for premium localized service.",
            "competitors": [
                {
                    "name": f"{locality} Prime Store",
                    "rating": 4.6,
                    "price_tier": "₹₹",
                    "distance_km": 0.4,
                    "strengths": "High brand visibility & instant WhatsApp ordering",
                    "weaknesses": "Higher prices, no customized Karigar services",
                    "customer_hook": "Prime road-front location & quick checkout"
                },
                {
                    "name": "Desi Express Center",
                    "rating": 4.3,
                    "price_tier": "₹",
                    "distance_km": 0.7,
                    "strengths": "Very affordable pricing & bulk discounts",
                    "weaknesses": "Inconsistent stock & long queue waiting times",
                    "customer_hook": "Budget pricing for daily repeat buyers"
                },
                {
                    "name": "Royal Premium Hub",
                    "rating": 4.5,
                    "price_tier": "₹₹₹",
                    "distance_km": 1.1,
                    "strengths": "Luxe store ambiance & celebrity endorsements",
                    "weaknesses": "Inaccessible location & strict no-refund policy",
                    "customer_hook": "Exclusive luxury catalog & VIP lounge"
                }
            ],
            "why_competitors_win": "Competitors leverage high-footfall street locations, WhatsApp instant response, and strong regional marketing.",
            "actionable_recommendations": [
                "Launch instant UPI cashback for direct orders to beat third-party commission costs",
                "Offer 30-minute hyper-local delivery guarantee within 3km radius",
                "Highlight 100% Karigar handcrafted quality and GST tax invoice savings",
                "Keep store open 1 hour later than local competitors during peak evening hours"
            ]
        }

    # Add lat/lng offsets to competitors so they pin accurately around the center on Leaflet map
    offsets = [
        {"lat": 0.0035, "lng": 0.0042},
        {"lat": -0.0041, "lng": -0.0028},
        {"lat": 0.0022, "lng": -0.0051},
        {"lat": -0.0030, "lng": 0.0049},
    ]

    comps = data.get("competitors", [])
    for idx, comp in enumerate(comps):
        offset = offsets[idx % len(offsets)]
        comp["lat"] = round(center_lat + offset["lat"], 6)
        comp["lng"] = round(center_lng + offset["lng"], 6)
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

