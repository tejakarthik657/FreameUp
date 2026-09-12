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
    tone: Optional[str] = "Executive Concierge"
    auto_responder_enabled: Optional[bool] = True
    greeting_message: Optional[str] = "Good day! Welcome to our establishment. How may I personally assist your experience today?"
    custom_faqs: Optional[List[Dict[str, str]]] = []


@router.get("/config/{business_id}")
async def get_agent_config(business_id: str):
    config = await ai_config_collection.find_one({"business_id": business_id})
    if not config:
        return {
            "business_id": business_id,
            "tone": "Executive Concierge",
            "auto_responder_enabled": True,
            "greeting_message": "Good day! Welcome to our establishment. How may I personally assist your experience today?",
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
    return {"status": "success", "message": "High-End AI Agent configuration updated successfully"}


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
    tone = config.get("tone", "Executive Concierge")

    # Build RAG System Prompt with Executive High-End Persona
    business_name = b_doc.get("name", "our business") if b_doc else "our business"
    category = b_doc.get("category", "business") if b_doc else "business"
    phone = b_doc.get("phone", "N/A") if b_doc else "N/A"
    whatsapp = b_doc.get("whatsapp", "N/A") if b_doc else "N/A"
    address = b_doc.get("address", "N/A") if b_doc else "N/A"
    hours = b_doc.get("hours", []) if b_doc else []
    items = (b_doc.get("menu") if category == "restaurant" else b_doc.get("services")) if b_doc else []

    hours_str = ", ".join([f"{h.get('day')}: {h.get('open')} - {h.get('close')}" if not h.get('closed') else f"{h.get('day')}: Closed" for h in hours]) or "Contact for hours"
    items_str = ", ".join([f"{i.get('name')} ({i.get('price', '')})" for i in (items or [])[:15]]) or "Contact for full catalog"
    faqs_str = "\n".join([f"Q: {f.get('q')}\nA: {f.get('a')}" for f in config.get("custom_faqs", [])])

    system_prompt = f"""You are the VIP Executive Concierge & Customer Relations Director for "{business_name}" ({category}).
Your Tone Style: {tone} (Polished, executive-level, warm hospitality, highly articulate, and conversion-focused).

EXECUTIVE BUSINESS KNOWLEDGE BASE:
- Enterprise Brand Name: {business_name}
- Domain Category: {category}
- Direct Line / VIP Contact: {phone} | WhatsApp: {whatsapp}
- Physical Location: {address}
- Hours of Operation: {hours_str}
- Offerings & Signature Catalog: {items_str}
- Customized Brand FAQs:
{faqs_str}

YOUR RESPONSIBILITIES & RULES OF ENGAGEMENT:
1. Provide polished, high-end, bespoke answers to client questions regarding our menu, signature services, pricing, reservations, and location.
2. Maintain elite business courtesy at all times ("Certainly", "It would be our pleasure", "Allow me to arrange that for you").
3. If the client desires a reservation, order, or consultation, gather their Name, Contact Phone, and Specific Request, then provide a VIP summary tag `[ACTION: BOOKING_REQUESTED]`.
4. Keep responses refined, elegant, and concise. Never fabricate facts outside the knowledge base.
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
        reply = f"Thank you for contacting {business_name}. Our concierge desk is attending to distinguished guests right now. Please connect directly via WhatsApp at {whatsapp or phone}."

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
    }
