from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database import db, businesses_collection
import urllib.parse
import uuid

router = APIRouter(prefix="/invoices", tags=["invoices"])

invoices_collection = db["invoices"]


class InvoiceItem(BaseModel):
    description: str
    quantity: int = 1
    unit_price: float = 0.0


class InvoiceCreate(BaseModel):
    business_id: str
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = ""
    customer_address: Optional[str] = ""
    items: List[InvoiceItem]
    tax_percent: Optional[float] = 0.0
    discount_percent: Optional[float] = 0.0
    notes: Optional[str] = "Thank you for doing business with us!"
    status: Optional[str] = "Pending"  # 'Paid', 'Pending', 'Overdue'


class InvoiceStatusUpdate(BaseModel):
    status: str  # 'Paid', 'Pending', 'Overdue'


@router.get("/{business_id}")
async def list_invoices(business_id: str):
    docs = await invoices_collection.find({"business_id": business_id}).sort("created_at", -1).to_list(50)
    res = []
    for d in docs:
        d["id"] = str(d.pop("_id"))
        res.append(d)
    return res


@router.post("")
async def create_invoice(payload: InvoiceCreate):
    # Calculate financial totals
    subtotal = sum(item.quantity * item.unit_price for item in payload.items)
    discount_amount = subtotal * (payload.discount_percent / 100.0)
    taxable_amount = subtotal - discount_amount
    tax_amount = taxable_amount * (payload.tax_percent / 100.0)
    total_amount = taxable_amount + tax_amount

    # Count existing for invoice number increment
    count = await invoices_collection.count_documents({"business_id": payload.business_id})
    inv_number = f"INV-{datetime.utcnow().strftime('%Y')}-{(count + 1):04d}"

    doc = {
        "business_id": payload.business_id,
        "invoice_number": inv_number,
        "customer_name": payload.customer_name,
        "customer_phone": payload.customer_phone,
        "customer_email": payload.customer_email,
        "customer_address": payload.customer_address,
        "items": [item.model_dump() for item in payload.items],
        "subtotal": round(subtotal, 2),
        "discount_percent": payload.discount_percent,
        "discount_amount": round(discount_amount, 2),
        "tax_percent": payload.tax_percent,
        "tax_amount": round(tax_amount, 2),
        "total_amount": round(total_amount, 2),
        "notes": payload.notes,
        "status": payload.status,
        "created_at": datetime.utcnow().isoformat(),
        "due_date": datetime.utcnow().isoformat(),
    }

    result = await invoices_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)

    # WhatsApp share message generator
    b_doc = await businesses_collection.find_one({"_id": ObjectId(payload.business_id)}) if payload.business_id else None
    business_name = b_doc.get("name", "our store") if b_doc else "our store"
    
    wa_msg = (
        f"Hi {payload.customer_name}, here is your invoice {inv_number} from {business_name}.\n"
        f"Total Amount: ${doc['total_amount']:.2f} ({payload.status}).\n"
        f"Thank you for choosing us!"
    )
    clean_phone = "".join(filter(str.isdigit, payload.customer_phone))
    doc["whatsapp_url"] = f"https://wa.me/{clean_phone}?text={urllib.parse.quote(wa_msg)}" if clean_phone else None

    return doc


@router.patch("/{invoice_id}/status")
async def update_invoice_status(invoice_id: str, payload: InvoiceStatusUpdate):
    try:
        oid = ObjectId(invoice_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid invoice ID")

    inv = await invoices_collection.find_one({"_id": oid})
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    await invoices_collection.update_one(
        {"_id": oid},
        {"$set": {"status": payload.status, "updated_at": datetime.utcnow().isoformat()}}
    )

    return {"status": "success", "invoice_id": invoice_id, "new_status": payload.status}
