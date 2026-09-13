from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database import db

router = APIRouter(prefix="/suppliers", tags=["suppliers"])

suppliers_collection = db["suppliers"]
po_collection = db["purchase_orders"]


class SupplierCreate(BaseModel):
    business_id: str
    name: str
    category: Optional[str] = "Raw Materials"
    phone: str
    email: Optional[str] = ""
    address: Optional[str] = ""
    lead_time_days: Optional[int] = 2
    payment_terms: Optional[str] = "Net 15 Dues"


class POCreate(BaseModel):
    business_id: str
    supplier_id: str
    supplier_name: str
    supplier_phone: str
    items: List[dict]  # [{ item_name: "Flour 50kg", qty: 5, unit_price: 1200 }]
    total_amount: float
    notes: Optional[str] = ""


@router.get("/{business_id}")
async def list_suppliers(business_id: str):
    docs = await suppliers_collection.find({"business_id": business_id}).sort("name", 1).to_list(100)
    res = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        res.append(d)
    return res


@router.post("")
async def create_supplier(payload: SupplierCreate):
    doc = {
        "business_id": payload.business_id,
        "name": payload.name,
        "category": payload.category or "Raw Materials",
        "phone": payload.phone,
        "email": payload.email or "",
        "address": payload.address or "",
        "lead_time_days": payload.lead_time_days or 2,
        "payment_terms": payload.payment_terms or "Net 15 Dues",
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await suppliers_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.get("/pos/{business_id}")
async def list_purchase_orders(business_id: str):
    docs = await po_collection.find({"business_id": business_id}).sort("created_at", -1).to_list(100)
    res = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        res.append(d)
    return res


@router.post("/pos")
async def create_purchase_order(payload: POCreate):
    po_no = f"PO-{datetime.utcnow().strftime('%Y%m%d')}-{await po_collection.count_documents({'business_id': payload.business_id})+1:03d}"
    doc = {
        "business_id": payload.business_id,
        "supplier_id": payload.supplier_id,
        "supplier_name": payload.supplier_name,
        "supplier_phone": payload.supplier_phone,
        "po_number": po_no,
        "items": payload.items,
        "total_amount": payload.total_amount,
        "status": "Draft",  # 'Draft', 'Sent', 'Approved', 'Fulfilled', 'Paid'
        "notes": payload.notes or "",
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await po_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.post("/pos/{po_id}/status")
async def update_po_status(po_id: str, status: str):
    try:
        pid = ObjectId(po_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid PO ID")

    await po_collection.update_one({"_id": pid}, {"$set": {"status": status}})
    return {"status": "success", "po_status": status}
