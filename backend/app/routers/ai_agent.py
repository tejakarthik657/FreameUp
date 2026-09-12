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
