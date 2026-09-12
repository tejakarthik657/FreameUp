from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database import db
import uuid

router = APIRouter(prefix="/loyalty", tags=["loyalty"])

passes_collection = db["loyalty_passes"]
referrals_collection = db["loyalty_referrals"]


class PunchRequest(BaseModel):
    business_id: str
    customer_phone: str
    customer_name: Optional[str] = "Valued Customer"


class ReferralRequest(BaseModel):
    business_id: str
    referrer_phone: str
    friend_phone: str


@router.get("/passes/{business_id}")
async def list_passes(business_id: str):
    passes = await passes_collection.find({"business_id": business_id}).to_list(50)
    res = []
    for p in passes:
        p["id"] = str(p.pop("_id"))
        res.append(p)
    return res


@router.post("/punch")
async def process_punch(payload: PunchRequest):
    existing = await passes_collection.find_one({
        "business_id": payload.business_id,
        "customer_phone": payload.customer_phone
    })

    if not existing:
        doc = {
            "business_id": payload.business_id,
            "customer_phone": payload.customer_phone,
            "customer_name": payload.customer_name,
            "punches": 1,
            "rewards_earned": 0,
            "created_at": datetime.utcnow().isoformat(),
            "last_punch": datetime.utcnow().isoformat(),
        }
        res = await passes_collection.insert_one(doc)
        doc["id"] = str(res.inserted_id)
        doc.pop("_id", None)
        return {"pass": doc, "message": "First punch recorded! 1/5 punches collected."}

    new_punches = existing.get("punches", 0) + 1
    new_rewards = existing.get("rewards_earned", 0)

    reward_unlocked = False
    if new_punches >= 5:
        new_punches = 0
        new_rewards += 1
        reward_unlocked = True

    await passes_collection.update_one(
        {"_id": existing["_id"]},
        {"$set": {
            "punches": new_punches,
            "rewards_earned": new_rewards,
            "last_punch": datetime.utcnow().isoformat()
        }}
    )

    return {
        "punches": new_punches,
        "rewards_earned": new_rewards,
        "reward_unlocked": reward_unlocked,
        "message": "🎉 REWARD UNLOCKED: 50% Off / Free Gift!" if reward_unlocked else f"Punch recorded! {new_punches}/5 punches collected."
    }


@router.post("/referral")
async def create_referral(payload: ReferralRequest):
    ref_code = f"REF-{str(uuid.uuid4())[:6].upper()}"
    doc = {
        "business_id": payload.business_id,
        "referrer_phone": payload.referrer_phone,
        "friend_phone": payload.friend_phone,
        "ref_code": ref_code,
        "status": "active",
        "created_at": datetime.utcnow().isoformat(),
    }
    res = await referrals_collection.insert_one(doc)
    doc["id"] = str(res.inserted_id)
    doc.pop("_id", None)

    whatsapp_msg = f"Your friend ({payload.referrer_phone}) sent you a referral link for a 15% discount! Use code {ref_code} on your next visit."
    return {
        "referral": doc,
        "whatsapp_share_url": f"https://wa.me/{payload.friend_phone.replace('+', '')}?text={whatsapp_msg}",
        "ref_code": ref_code
    }
