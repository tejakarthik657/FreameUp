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
    tone: Optional[str] = "friendly & professional"
    auto_responder_enabled: Optional[bool] = True
    greeting_message: Optional[str] = "Hello! How can I help you today?"
    custom_faqs: Optional[List[Dict[str, str]]] = []


@router.get("/config/{business_id}")
async def get_agent_config(business_id: str):
    config = await ai_config_collection.find_one({"business_id": business_id})
    if not config:
        # Default config
        return {
            "business_id": business_id,
            "tone": "friendly & professional",
            "auto_responder_enabled": True,
            "greeting_message": "Hello! How can I help you today? Ask me about our menu, services, hours, or reservations!",
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
    return {"status": "success", "message": "AI Agent configuration updated successfully"}


@router.post("/chat")
async def ai_chat(payload: ChatRequest):
    # Retrieve business info for RAG context
    try:
        b_doc = await businesses_collection.find_one({"_id": ObjectId(payload.business_id)})
    except Exception:
        b_doc = None

    if not b_doc:
        # Fallback query by slug or name
        b_doc = await businesses_collection.find_one({"name": payload.business_id})

    # Get custom FAQs / config
    config = await ai_config_collection.find_one({"business_id": payload.business_id}) or {}
    tone = config.get("tone", "friendly and helpful")

    # Build RAG System Prompt
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

    system_prompt = f"""You are the 24/7 AI Customer Support & Booking Assistant for "{business_name}" ({category}).
Tone: {tone}.

BUSINESS KNOWLEDGE BASE:
- Name: {business_name}
- Category: {category}
- Phone / Contact: {phone} | WhatsApp: {whatsapp}
- Address / Location: {address}
- Opening Hours: {hours_str}
- Offerings / Catalog: {items_str}
- Custom FAQs:
{faqs_str}

YOUR RESPONSIBILITIES:
1. Answer customer Q&A (pricing, location, parking, hours, items) accurately based on the business details above.
2. If the user wants to place an order or book an appointment, collect their Name, Contact Number, and Request details, then respond with a confirmation summary and include the key JSON tag `[ACTION: BOOKING_REQUESTED]`.
3. Be concise, polite, and helpful. Do not make up facts outside the provided business knowledge base.
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
        reply = f"Thank you for reaching out to {business_name}! We are experiencing high traffic right now. Please call or WhatsApp us directly at {whatsapp or phone}."

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
