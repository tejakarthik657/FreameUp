from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone
from app.database import leads_collection, businesses_collection
from app.schemas.lead import LeadIn, LeadOut
from app.routers.auth import get_current_user_id

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_lead(payload: LeadIn):
    """Public endpoint to submit a lead from a template site."""
    # Verify business exists
    biz = await businesses_collection.find_one({"_id": ObjectId(payload.business_id)})
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    lead_doc = {
        "name": payload.name,
        "email": payload.email,
        "phone": payload.phone,
        "message": payload.message,
        "business_id": payload.business_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = await leads_collection.insert_one(lead_doc)
    return {"ok": True, "lead_id": str(result.inserted_id)}


@router.get("/business/{business_id}", response_model=list[LeadOut])
async def list_business_leads(business_id: str, user_id: str = Depends(get_current_user_id)):
    """Protected endpoint for owners to list submitted leads for their business."""
    # Verify business belongs to this user
    biz = await businesses_collection.find_one({"_id": ObjectId(business_id), "user_id": user_id})
    if not biz:
        raise HTTPException(status_code=403, detail="Not authorized to access leads for this business")

    cursor = leads_collection.find({"business_id": business_id}).sort("created_at", -1)
    leads = await cursor.to_list(length=500)
    
    return [
        LeadOut(
            id=str(l["_id"]),
            name=l["name"],
            email=l["email"],
            phone=l["phone"],
            message=l.get("message"),
            business_id=l["business_id"],
            created_at=l["created_at"]
        )
        for l in leads
    ]
