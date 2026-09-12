from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from bson import ObjectId
from app.database import db, businesses_collection
import urllib.parse

router = APIRouter(prefix="/invoices", tags=["invoices"])

invoices_collection = db["invoices"]


class InvoiceItem(BaseModel):
    description: str
    hsn_sac: Optional[str] = ""
    quantity: float = 1.0
    unit_price: float = 0.0
    discount: Optional[float] = 0.0
    tax_rate: Optional[float] = 0.0


class InvoiceCreate(BaseModel):
    business_id: str
    
    # Seller Tax & Bank Details
    business_name_override: Optional[str] = ""
    business_gstin: Optional[str] = ""
    bank_name: Optional[str] = ""
    bank_account_no: Optional[str] = ""
    bank_ifsc: Optional[str] = ""
    upi_id: Optional[str] = ""

    # Customer/Client Details
    customer_name: str
    customer_company: Optional[str] = ""
    customer_gstin: Optional[str] = ""
    customer_phone: str
    customer_email: Optional[str] = ""
    billing_address: Optional[str] = ""
    shipping_address: Optional[str] = ""

    # Metadata & Dates
    invoice_number_override: Optional[str] = ""
    po_number: Optional[str] = ""
    invoice_date: Optional[str] = ""
    due_date: Optional[str] = ""

    # Line Items
    items: List[InvoiceItem]

    # Additional Fees & Adjustments
    tax_percent: Optional[float] = 18.0
    discount_percent: Optional[float] = 0.0
    shipping_fee: Optional[float] = 0.0
    amount_paid: Optional[float] = 0.0

    # Policy & Terms
    notes: Optional[str] = "Thank you for your business!"
    terms: Optional[str] = "Payment due within 15 days of invoice date. Please quote invoice number on payment."
    status: Optional[str] = "Pending"  # Paid, Pending, Partially Paid, Overdue


class InvoiceStatusUpdate(BaseModel):
    status: str
    amount_paid: Optional[float] = None


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
    # Fetch business doc for defaults
    b_doc = await businesses_collection.find_one({"_id": ObjectId(payload.business_id)}) if payload.business_id else None
    biz_name = payload.business_name_override or (b_doc.get("name") if b_doc else "Our Business")
    biz_phone = b_doc.get("phone") if b_doc else ""
    biz_address = b_doc.get("address") if b_doc else ""

    # Calculate itemized amounts
    calculated_items = []
    items_subtotal = 0.0

    for item in payload.items:
        line_raw = item.quantity * item.unit_price
        line_discount_val = item.discount
        line_taxable = line_raw - line_discount_val
        line_total = line_taxable + (line_taxable * (item.tax_rate / 100.0))
        items_subtotal += line_taxable
        
        calculated_items.append({
            "description": item.description,
            "hsn_sac": item.hsn_sac,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "discount": item.discount,
            "tax_rate": item.tax_rate,
            "line_total": round(line_total, 2)
        })

    # Global Calculations
    global_discount_val = items_subtotal * (payload.discount_percent / 100.0)
    taxable_sum = items_subtotal - global_discount_val
    tax_amount = taxable_sum * (payload.tax_percent / 100.0)
    grand_total = taxable_sum + tax_amount + payload.shipping_fee
    balance_due = max(0.0, grand_total - payload.amount_paid)

    # Invoice numbering
    if payload.invoice_number_override:
        inv_number = payload.invoice_number_override
    else:
        count = await invoices_collection.count_documents({"business_id": payload.business_id})
        inv_number = f"INV-{datetime.utcnow().strftime('%Y')}-{(count + 1):04d}"

    inv_date = payload.invoice_date or datetime.utcnow().strftime("%Y-%m-%d")
    due_dt = payload.due_date or datetime.utcnow().strftime("%Y-%m-%d")

    doc = {
        "business_id": payload.business_id,
        "business_name": biz_name,
        "business_phone": biz_phone,
        "business_address": biz_address,
        "business_gstin": payload.business_gstin,
        "bank_name": payload.bank_name,
        "bank_account_no": payload.bank_account_no,
        "bank_ifsc": payload.bank_ifsc,
        "upi_id": payload.upi_id,

        "customer_name": payload.customer_name,
        "customer_company": payload.customer_company,
        "customer_gstin": payload.customer_gstin,
        "customer_phone": payload.customer_phone,
        "customer_email": payload.customer_email,
        "billing_address": payload.billing_address,
        "shipping_address": payload.shipping_address,

        "invoice_number": inv_number,
        "po_number": payload.po_number,
        "invoice_date": inv_date,
        "due_date": due_dt,

        "items": calculated_items,
        "subtotal": round(items_subtotal, 2),
        "discount_percent": payload.discount_percent,
        "discount_amount": round(global_discount_val, 2),
        "tax_percent": payload.tax_percent,
        "tax_amount": round(tax_amount, 2),
        "shipping_fee": round(payload.shipping_fee, 2),
        "total_amount": round(grand_total, 2),
        "amount_paid": round(payload.amount_paid, 2),
        "balance_due": round(balance_due, 2),

        "notes": payload.notes,
        "terms": payload.terms,
        "status": payload.status,
        "created_at": datetime.utcnow().isoformat(),
    }

    result = await invoices_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)

    # WhatsApp share message URL
    wa_msg = (
        f"Tax Invoice {inv_number} from {biz_name}\n"
        f"Client: {payload.customer_name}\n"
        f"Grand Total: ${doc['total_amount']:.2f}\n"
        f"Balance Due: ${doc['balance_due']:.2f}\n"
        f"Status: {payload.status}\n"
        f"Thank you!"
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

    update_fields = {"status": payload.status, "updated_at": datetime.utcnow().isoformat()}
    if payload.amount_paid is not None:
        update_fields["amount_paid"] = payload.amount_paid
        update_fields["balance_due"] = max(0.0, inv.get("total_amount", 0.0) - payload.amount_paid)

    await invoices_collection.update_one({"_id": oid}, {"$set": update_fields})
    return {"status": "success", "invoice_id": invoice_id, "new_status": payload.status}
