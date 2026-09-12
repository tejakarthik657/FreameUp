from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database import db, businesses_collection

router = APIRouter(prefix="/staff", tags=["staff"])

staff_collection = db["staff_members"]
attendance_collection = db["staff_attendance"]
goods_allocation_collection = db["staff_goods_allocations"]


class StaffCreate(BaseModel):
    business_id: str
    name: str
    role: str  # e.g., 'Master Chef', 'Senior Stylist', 'Head Technician', 'Helper'
    phone: str
    daily_wage: float = 0.0
    status: Optional[str] = "Present"  # 'Present', 'On Leave', 'Off Shift'
    allocated_goods: Optional[List[str]] = []


class AttendanceRecord(BaseModel):
    staff_id: str
    business_id: str
    status: str  # 'Present', 'Half Day', 'Absent'
    date: Optional[str] = ""
    notes: Optional[str] = ""


class GoodsAllocate(BaseModel):
    staff_id: str
    business_id: str
    item_name: str
    quantity: float = 1.0
    notes: Optional[str] = ""


@router.get("/{business_id}")
async def list_staff(business_id: str):
    docs = await staff_collection.find({"business_id": business_id}).sort("created_at", -1).to_list(50)
    res = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        res.append(d)
    return res


@router.post("")
async def create_staff(payload: StaffCreate):
    doc = {
        "business_id": payload.business_id,
        "name": payload.name,
        "role": payload.role,
        "phone": payload.phone,
        "daily_wage": payload.daily_wage,
        "status": payload.status,
        "allocated_goods": payload.allocated_goods or [],
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await staff_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.post("/attendance")
async def record_attendance(payload: AttendanceRecord):
    try:
        sid = ObjectId(payload.staff_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid staff ID")

    att_date = payload.date or datetime.utcnow().strftime("%Y-%m-%d")
    doc = {
        "staff_id": payload.staff_id,
        "business_id": payload.business_id,
        "status": payload.status,
        "date": att_date,
        "notes": payload.notes,
        "recorded_at": datetime.utcnow().isoformat(),
    }
    await attendance_collection.update_one(
        {"staff_id": payload.staff_id, "date": att_date},
        {"$set": doc},
        upsert=True
    )

    # Update current status on staff doc
    await staff_collection.update_one(
        {"_id": sid},
        {"$set": {"status": payload.status}}
    )

    return {"status": "success", "message": f"Attendance recorded for {att_date}"}


@router.post("/allocate-goods")
async def allocate_goods(payload: GoodsAllocate):
    try:
        sid = ObjectId(payload.staff_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid staff ID")

    staff = await staff_collection.find_one({"_id": sid})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    alloc_str = f"{payload.quantity}x {payload.item_name}"
    current_goods = staff.get("allocated_goods", [])
    current_goods.append(alloc_str)

    await staff_collection.update_one(
        {"_id": sid},
        {"$set": {"allocated_goods": current_goods}}
    )

    # Log record
    await goods_allocation_collection.insert_one({
        "staff_id": payload.staff_id,
        "business_id": payload.business_id,
        "item_name": payload.item_name,
        "quantity": payload.quantity,
        "notes": payload.notes,
        "allocated_at": datetime.utcnow().isoformat(),
    })

    return {"status": "success", "allocated_goods": current_goods, "message": f"Allocated {alloc_str} to {staff.get('name')}"}
