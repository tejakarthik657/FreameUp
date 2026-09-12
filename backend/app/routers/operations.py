from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database import db, businesses_collection
import urllib.parse

router = APIRouter(prefix="/operations", tags=["operations"])

orders_collection = db["live_operations_orders"]


class OrderCreate(BaseModel):
    business_id: str
    customer_name: str
    customer_phone: str
    order_type: str = "order"  # 'order' or 'booking'
    items_or_service: str
    notes: Optional[str] = ""


class OrderStatusUpdate(BaseModel):
    status: str  # 'accepted', 'declined', 'preparing', 'completed'
    prep_time_minutes: Optional[int] = 30


@router.get("/orders/{business_id}")
async def list_orders(business_id: str):
    docs = await orders_collection.find({"business_id": business_id}).sort("created_at", -1).to_list(50)
    res = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        res.append(d)
    return res


@router.post("/orders")
async def create_order(payload: OrderCreate):
    doc = {
        "business_id": payload.business_id,
        "customer_name": payload.customer_name,
        "customer_phone": payload.customer_phone,
        "order_type": payload.order_type,
        "items_or_service": payload.items_or_service,
        "notes": payload.notes,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await orders_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.patch("/orders/{order_id}/status")
async def update_order_status(order_id: str, payload: OrderStatusUpdate):
    try:
        oid = ObjectId(order_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid order ID")

    order = await orders_collection.find_one({"_id": oid})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    await orders_collection.update_one(
        {"_id": oid},
        {"$set": {"status": payload.status, "updated_at": datetime.utcnow().isoformat()}}
    )

    # Generate automated WhatsApp confirmation message link
    b_doc = await businesses_collection.find_one({"_id": ObjectId(order["business_id"])}) if order.get("business_id") else None
    business_name = b_doc.get("name", "our store") if b_doc else "our store"

    status_msg = ""
    if payload.status == "accepted":
        status_msg = f"Hi {order['customer_name']}, your {order['order_type']} with {business_name} has been ACCEPTED! Estimated time: {payload.prep_time_minutes} mins."
    elif payload.status == "declined":
        status_msg = f"Hi {order['customer_name']}, unfortunately {business_name} cannot fulfill your {order['order_type']} at this moment."
    elif payload.status == "completed":
        status_msg = f"Hi {order['customer_name']}, your {order['order_type']} at {business_name} is READY/COMPLETED! Thank you!"
    else:
        status_msg = f"Hi {order['customer_name']}, your {order['order_type']} status with {business_name} has updated to: {payload.status}."

    clean_phone = "".join(filter(str.isdigit, order.get("customer_phone", "")))
    whatsapp_url = f"https://wa.me/{clean_phone}?text={urllib.parse.quote(status_msg)}" if clean_phone else None

    return {
        "status": "success",
        "new_status": payload.status,
        "whatsapp_url": whatsapp_url,
        "message": status_msg
    }
