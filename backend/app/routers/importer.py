import json
import csv
import io
import re
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.database import db, businesses_collection
from app.services.groq_service import _get_client
from app.config import settings

router = APIRouter(prefix="/ai-importer", tags=["ai-importer"])

invoices_collection = db["invoices"]
staff_collection = db["staff_members"]
inventory_collection = db["inventory_items"]
suppliers_collection = db["suppliers"]


class RawParseRequest(BaseModel):
    raw_text: str


class AdoptDataRequest(BaseModel):
    business_id: Optional[str] = None
    business: Optional[Dict[str, Any]] = None
    catalog: Optional[List[Dict[str, Any]]] = []
    staff: Optional[List[Dict[str, Any]]] = []
    invoices: Optional[List[Dict[str, Any]]] = []
    inventory: Optional[List[Dict[str, Any]]] = []
    suppliers: Optional[List[Dict[str, Any]]] = []


class TableCleanRequest(BaseModel):
    headers: List[str]
    rows: List[Dict[str, Any]]
    target_schema: str = "auto"  # "customers", "invoices", "inventory", "auto"


# ── INDIAN LOCALE DATA SANITIZERS & NORMALIZERS ──

def sanitize_indian_phone(val: Any) -> str:
    """Normalize to +91XXXXXXXXXX or valid phone number."""
    if not val:
        return ""
    digits = re.sub(r"\D", "", str(val))
    if len(digits) == 10:
        return f"+91{digits}"
    elif len(digits) == 11 and digits.startswith("0"):
        return f"+91{digits[1:]}"
    elif len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"
    return str(val).strip()


def sanitize_indian_date(val: Any) -> str:
    """Convert DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY to ISO YYYY-MM-DD."""
    if not val:
        return ""
    s = str(val).strip()
    match = re.match(r"^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$", s)
    if match:
        day, month, year = match.groups()
        return f"{year}-{int(month):02d}-{int(day):02d}"
    return s


def validate_gstin(gst: str) -> bool:
    """Validate standard 15-character Indian GSTIN."""
    if not gst:
        return False
    gst = gst.strip().upper()
    pattern = r"^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$"
    return bool(re.match(pattern, gst))


def parse_numeric_amount(val: Any) -> float:
    """Strip ₹, Rs, INR, commas and return float."""
    if val is None or val == "":
        return 0.0
    s = re.sub(r"[₹RsINR,\s]", "", str(val), flags=re.IGNORECASE)
    try:
        return float(s)
    except ValueError:
        return 0.0


# ── FAST STRUCTURED TABLE PARSING & AUTO-MAPPING ──

@router.post("/parse-table")
async def parse_table_stream(payload: TableCleanRequest):
    """Clean and map table columns (Flatfile-style) with Indian locale rules."""
    cleaned_rows = []
    corrections_count = 0
    issues_detected = []

    for idx, r in enumerate(payload.rows):
        cleaned = {}
        for k, v in r.items():
            k_lower = k.lower().strip()
            orig = str(v)
            new_val = orig

            # Phone detection
            if any(p in k_lower for p in ["phone", "mobile", "contact", "cell", "ph"]):
                new_val = sanitize_indian_phone(orig)
                if new_val != orig:
                    corrections_count += 1

            # Date detection
            elif any(d in k_lower for d in ["date", "dob", "created", "invoice_dt", "due"]):
                new_val = sanitize_indian_date(orig)
                if new_val != orig:
                    corrections_count += 1

            # GSTIN detection
            elif "gst" in k_lower:
                new_val = orig.strip().upper()
                if new_val and not validate_gstin(new_val):
                    issues_detected.append(f"Row {idx+1}: Invalid GSTIN '{new_val}'")

            # Currency / Amount detection
            elif any(a in k_lower for a in ["amount", "price", "rate", "total", "cost", "wage", "balance"]):
                new_val = parse_numeric_amount(orig)

            cleaned[k] = new_val

        cleaned_rows.append(cleaned)

    return {
        "status": "success",
        "total_rows": len(cleaned_rows),
        "corrections_count": corrections_count,
        "issues": issues_detected[:10],
        "rows": cleaned_rows,
    }


# ── FILE UPLOAD (CSV / TSV) ──

@router.post("/upload-file")
async def upload_tabular_file(file: UploadFile = File(...)):
    """Upload CSV/TSV and convert to structured table grid with auto-detected types."""
    try:
        contents = await file.read()
        text = contents.decode("utf-8-sig", errors="replace")
        f = io.StringIO(text)
        reader = csv.DictReader(f)
        
        headers = reader.fieldnames or []
        rows = []
        for idx, row in enumerate(reader):
            if idx >= 1000:  # limit to 1000 rows preview
                break
            rows.append(row)

        return {
            "status": "success",
            "filename": file.filename,
            "headers": list(headers),
            "total_rows": len(rows),
            "rows": rows,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")


# ── LLM RAW UNSTRUCTURED TEXT PARSER ──

@router.post("/parse")
async def parse_raw_text(payload: RawParseRequest):
    if not payload.raw_text or not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="Raw text input cannot be empty")

    client = _get_client()

    system_prompt = (
        "You are an expert AI Data Structuring Assistant for Indian Businesses. "
        "Your job is to read raw, unstructured text (which may contain messy WhatsApp notes, staff names, price lists, business contact details, inventory or invoice items) "
        "and convert it into a clean, strictly formatted JSON object with Indian locale sanitization.\n\n"
        "Return ONLY a raw valid JSON object without any markdown codeblocks or explanation. The JSON MUST follow this exact schema:\n"
        "{\n"
        '  "business": {\n'
        '    "name": "Extracted Business Name or empty string",\n'
        '    "category": "restaurant OR salon OR local_services",\n'
        '    "tagline": "Short catchphrase if found",\n'
        '    "phone": "Phone number formatted with +91 if 10-digit",\n'
        '    "email": "Email if found",\n'
        '    "address": "Full address if found",\n'
        '    "upi_id": "UPI ID if found e.g. shop@upi",\n'
        '    "gstin": "GSTIN number if found"\n'
        "  },\n"
        '  "catalog": [\n'
        '    {\n'
        '      "name": "Item or service name",\n'
        '      "price": "150.0",\n'
        '      "description": "Short description",\n'
        '      "category": "Food / Hair Cut / Repair"\n'
        "    }\n"
        "  ],\n"
        '  "staff": [\n'
        '    {\n'
        '      "name": "Staff member name",\n'
        '      "role": "Role e.g. Chef, Technician, Stylist, Helper",\n'
        '      "phone": "Phone number or N/A",\n'
        '      "daily_wage": 800,\n'
        '      "status": "Present"\n'
        "    }\n"
        "  ],\n"
        '  "invoices": [\n'
        '    {\n'
        '      "customer_name": "Customer Name",\n'
        '      "customer_phone": "Phone number",\n'
        '      "total_amount": 1500,\n'
        '      "items": [{ "description": "Item name", "quantity": 1, "unit_price": 1500 }]\n'
        "    }\n"
        "  ],\n"
        '  "inventory": [\n'
        '    {\n'
        '      "name": "Item Name",\n'
        '      "sku": "SKU-001",\n'
        '      "stock_quantity": 50,\n'
        '      "unit": "kg / pcs / box",\n'
        '      "reorder_threshold": 10,\n'
        '      "unit_cost": 100\n'
        "    }\n"
        "  ]\n"
        "}\n"
    )

    try:
        completion = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Extract all business data from this text:\n\n{payload.raw_text}"},
            ],
            temperature=0.1,
            max_tokens=2048,
        )

        content = completion.choices[0].message.content.strip()
        if content.startswith("```json"):
            content = content.replace("```json", "", 1)
        if content.startswith("```"):
            content = content.replace("```", "", 1)
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        parsed = json.loads(content)
        return {"status": "success", "parsed_data": parsed}
    except Exception as e:
        print(f"Error parsing raw text: {e}")
        raise HTTPException(status_code=500, detail=f"AI Data Extraction failed: {str(e)}")


@router.post("/adopt")
async def adopt_parsed_data(payload: AdoptDataRequest):
    target_b_id = payload.business_id

    # 1. Update or Create Business Metadata
    if payload.business:
        b_data = payload.business
        name = b_data.get("name") or "My Business"
        cat = b_data.get("category") or "restaurant"
        
        if target_b_id:
            try:
                bid_obj = ObjectId(target_b_id)
                update_fields = {}
                for key in ["name", "phone", "email", "address", "tagline", "upi_id", "gstin"]:
                    if b_data.get(key):
                        update_fields[key] = b_data[key]
                if payload.catalog:
                    if cat == "restaurant":
                        update_fields["menu"] = payload.catalog
                    else:
                        update_fields["services"] = payload.catalog
                
                await businesses_collection.update_one({"_id": bid_obj}, {"$set": update_fields})
            except Exception as e:
                print(f"Error updating business: {e}")
        else:
            doc = {
                "name": name,
                "category": cat,
                "tagline": b_data.get("tagline", ""),
                "phone": b_data.get("phone", ""),
                "email": b_data.get("email", ""),
                "address": b_data.get("address", ""),
                "upi_id": b_data.get("upi_id", ""),
                "gstin": b_data.get("gstin", ""),
                "menu": payload.catalog if cat == "restaurant" else [],
                "services": payload.catalog if cat != "restaurant" else [],
                "hours": [
                    {"day": "Monday", "open": "09:00 AM", "close": "09:00 PM", "closed": False},
                    {"day": "Tuesday", "open": "09:00 AM", "close": "09:00 PM", "closed": False},
                    {"day": "Wednesday", "open": "09:00 AM", "close": "09:00 PM", "closed": False},
                    {"day": "Thursday", "open": "09:00 AM", "close": "09:00 PM", "closed": False},
                    {"day": "Friday", "open": "09:00 AM", "close": "09:00 PM", "closed": False},
                    {"day": "Saturday", "open": "09:00 AM", "close": "09:00 PM", "closed": False},
                    {"day": "Sunday", "open": "10:00 AM", "close": "08:00 PM", "closed": False},
                ],
                "created_at": datetime.utcnow().isoformat(),
            }
            res = await businesses_collection.insert_one(doc)
            target_b_id = str(res.inserted_id)

    # Fallback to first existing business
    if not target_b_id:
        existing_b = await businesses_collection.find_one({})
        if existing_b:
            target_b_id = str(existing_b["_id"])

    if not target_b_id:
        raise HTTPException(status_code=400, detail="No active business found to adopt data into")

    # 2. Insert Staff Members
    inserted_staff_count = 0
    if payload.staff and isinstance(payload.staff, list):
        for s in payload.staff:
            if s.get("name"):
                doc = {
                    "business_id": target_b_id,
                    "name": s.get("name"),
                    "role": s.get("role", "Specialist"),
                    "phone": sanitize_indian_phone(s.get("phone") or "N/A"),
                    "daily_wage": float(s.get("daily_wage") or 800.0),
                    "status": s.get("status", "Present"),
                    "advance_taken": 0.0,
                    "overtime_hours": 0.0,
                    "allocated_goods": [],
                    "created_at": datetime.utcnow().isoformat(),
                }
                await staff_collection.insert_one(doc)
                inserted_staff_count += 1

    # 3. Insert Invoices
    inserted_invoices_count = 0
    if payload.invoices and isinstance(payload.invoices, list):
        for inv in payload.invoices:
            if inv.get("customer_name"):
                inv_no = f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{inserted_invoices_count+1:03d}"
                tot = float(inv.get("total_amount") or 1500.0)
                doc = {
                    "business_id": target_b_id,
                    "customer_name": inv.get("customer_name"),
                    "customer_phone": sanitize_indian_phone(inv.get("customer_phone") or "N/A"),
                    "invoice_number": inv_no,
                    "invoice_date": datetime.utcnow().strftime("%Y-%m-%d"),
                    "due_date": datetime.utcnow().strftime("%Y-%m-%d"),
                    "items": inv.get("items", []),
                    "subtotal": tot,
                    "total_amount": tot,
                    "amount_paid": 0.0,
                    "balance_due": tot,
                    "status": "Pending",
                    "created_at": datetime.utcnow().isoformat(),
                }
                await invoices_collection.insert_one(doc)
                inserted_invoices_count += 1

    # 4. Insert Inventory Items
    inserted_inventory_count = 0
    if payload.inventory and isinstance(payload.inventory, list):
        for item in payload.inventory:
            if item.get("name"):
                doc = {
                    "business_id": target_b_id,
                    "name": item.get("name"),
                    "sku": item.get("sku") or f"SKU-{inserted_inventory_count+1:03d}",
                    "category": item.get("category", "General"),
                    "stock_quantity": int(item.get("stock_quantity") or 50),
                    "unit": item.get("unit", "units"),
                    "reorder_threshold": int(item.get("reorder_threshold") or 10),
                    "unit_cost": float(item.get("unit_cost") or 100.0),
                    "selling_price": float(item.get("selling_price") or 150.0),
                    "created_at": datetime.utcnow().isoformat(),
                }
                await inventory_collection.insert_one(doc)
                inserted_inventory_count += 1

    return {
        "status": "success",
        "business_id": target_b_id,
        "message": f"Successfully adopted data! Added {inserted_staff_count} staff, {inserted_invoices_count} invoices, and {inserted_inventory_count} inventory items.",
    }
