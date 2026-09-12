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
    advance_taken: Optional[float] = 0.0
    overtime_hours: Optional[float] = 0.0
    overtime_rate: Optional[float] = 100.0
    allocated_goods: Optional[List[dict]] = []  # [{ item: "Drill Machine", qty: 1, serial: "DR-09", status: "Issued" }]


class AdvanceSalaryRecord(BaseModel):
    staff_id: str
    amount: float
    notes: Optional[str] = ""


class OvertimeRecord(BaseModel):
    staff_id: str
    hours: float
    rate_per_hour: Optional[float] = 100.0


class GoodsStatusUpdate(BaseModel):
    staff_id: str
    item_index: int
    new_status: str  # 'Issued', 'Returned', 'Damaged/Lost'


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
    serial_no: Optional[str] = ""
    notes: Optional[str] = ""


@router.get("/{business_id}")
async def list_staff(business_id: str):
    docs = await staff_collection.find({"business_id": business_id}).sort("created_at", -1).to_list(50)
    res = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        if "advance_taken" not in d:
            d["advance_taken"] = 0.0
        if "overtime_hours" not in d:
            d["overtime_hours"] = 0.0
        if "overtime_rate" not in d:
            d["overtime_rate"] = 100.0
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
        "advance_taken": payload.advance_taken or 0.0,
        "overtime_hours": payload.overtime_hours or 0.0,
        "overtime_rate": payload.overtime_rate or 100.0,
        "allocated_goods": payload.allocated_goods or [],
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await staff_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    return doc


@router.post("/advance")
async def record_advance(payload: AdvanceSalaryRecord):
    try:
        sid = ObjectId(payload.staff_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid staff ID")

    staff = await staff_collection.find_one({"_id": sid})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    new_advance = float(staff.get("advance_taken", 0.0)) + payload.amount
    await staff_collection.update_one({"_id": sid}, {"$set": {"advance_taken": new_advance}})
    return {"status": "success", "advance_taken": new_advance}


@router.post("/overtime")
async def record_overtime(payload: OvertimeRecord):
    try:
        sid = ObjectId(payload.staff_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid staff ID")

    staff = await staff_collection.find_one({"_id": sid})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")

    new_ot = float(staff.get("overtime_hours", 0.0)) + payload.hours
    await staff_collection.update_one(
        {"_id": sid},
        {"$set": {"overtime_hours": new_ot, "overtime_rate": payload.rate_per_hour}}
    )
    return {"status": "success", "overtime_hours": new_ot}


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

    item_obj = {
        "item": payload.item_name,
        "qty": payload.quantity,
        "serial": payload.serial_no or "N/A",
        "status": "Issued",
        "date": datetime.utcnow().strftime("%Y-%m-%d")
    }
    current_goods = staff.get("allocated_goods", [])
    current_goods.append(item_obj)

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
        "serial": payload.serial_no,
        "notes": payload.notes,
        "allocated_at": datetime.utcnow().isoformat(),
    })

    return {"status": "success", "allocated_goods": current_goods}


@router.post("/goods-status")
async def update_goods_status(payload: GoodsStatusUpdate):
    try:
        sid = ObjectId(payload.staff_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid staff ID")

    staff = await staff_collection.find_one({"_id": sid})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")

    goods = staff.get("allocated_goods", [])
    if 0 <= payload.item_index < len(goods):
        if isinstance(goods[payload.item_index], dict):
            goods[payload.item_index]["status"] = payload.new_status
        else:
            # Handle legacy string items
            goods[payload.item_index] = {"item": str(goods[payload.item_index]), "qty": 1, "status": payload.new_status}
        await staff_collection.update_one({"_id": sid}, {"$set": {"allocated_goods": goods}})

    return {"status": "success", "allocated_goods": goods}

