from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database import db

router = APIRouter(prefix="/inventory", tags=["inventory"])

inventory_collection = db["inventory_items"]


class InventoryItemCreate(BaseModel):
    business_id: str
    item_name: str
    category: Optional[str] = "General"
    stock_qty: float = 0.0
    unit: Optional[str] = "pcs"  # pcs, kg, ltr, boxes
    low_stock_threshold: float = 10.0
    unit_price: float = 0.0
    supplier_name: Optional[str] = "Main Wholesale Supplier"


class StockAdjust(BaseModel):
    item_id: str
    qty_change: float  # +ve for restock, -ve for sale/usage
    reason: Optional[str] = "Manual Adjustment"


@router.get("/{business_id}")
async def list_inventory(business_id: str):
    docs = await inventory_collection.find({"business_id": business_id}).sort("item_name", 1).to_list(100)
    res = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        res.append(d)
    return res


@router.post("")
async def create_inventory_item(payload: InventoryItemCreate):
    doc = {
        "business_id": payload.business_id,
        "item_name": payload.item_name,
        "category": payload.category or "General",
        "stock_qty": payload.stock_qty,
        "unit": payload.unit or "pcs",
        "low_stock_threshold": payload.low_stock_threshold,
        "unit_price": payload.unit_price,
        "supplier_name": payload.supplier_name or "Main Wholesale Supplier",
        "last_updated": datetime.utcnow().isoformat(),
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await inventory_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.post("/adjust")
async def adjust_stock(payload: StockAdjust):
    try:
        iid = ObjectId(payload.item_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid inventory item ID")

    item = await inventory_collection.find_one({"_id": iid})
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    new_qty = max(0.0, float(item.get("stock_qty", 0.0)) + payload.qty_change)
    await inventory_collection.update_one(
        {"_id": iid},
        {"$set": {"stock_qty": new_qty, "last_updated": datetime.utcnow().isoformat()}}
    )
    return {"status": "success", "new_stock_qty": new_qty}
