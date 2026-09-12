import json
from fastapi import APIRouter, HTTPException
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


class RawParseRequest(BaseModel):
    raw_text: str


class AdoptDataRequest(BaseModel):
    business_id: Optional[str] = None
    business: Optional[Dict[str, Any]] = None
    catalog: Optional[List[Dict[str, Any]]] = []
    staff: Optional[List[Dict[str, Any]]] = []
    invoices: Optional[List[Dict[str, Any]]] = []


@router.post("/parse")
async def parse_raw_text(payload: RawParseRequest):
    if not payload.raw_text or not payload.raw_text.strip():
        raise HTTPException(status_code=400, detail="Raw text input cannot be empty")

    client = _get_client()

    system_prompt = (
        "You are an expert AI Data Structuring Assistant for Indian Businesses. "
        "Your job is to read raw, unstructured text (which may contain messy WhatsApp notes, staff names, price lists, business contact details, or invoice items) "
        "and convert it into a clean, strictly formatted JSON object.\n\n"
        "Return ONLY a raw valid JSON object without any markdown codeblocks or explanation. The JSON MUST follow this exact schema:\n"
        "{\n"
        '  "business": {\n'
        '    "name": "Extracted Business Name or empty string",\n'
        '    "category": "restaurant OR salon OR local_services",\n'
        '    "tagline": "Short catchphrase if found",\n'
        '    "phone": "Phone number if found",\n'
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
        # Clean up any potential markdown formatting
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
    # If business_id is passed or business info is extracted, find or update
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

    # If we still don't have target_b_id, pick the first existing business
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
                    "phone": s.get("phone", "N/A"),
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
                    "customer_phone": inv.get("customer_phone", "N/A"),
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

    return {
        "status": "success",
        "business_id": target_b_id,
        "message": f"Successfully adopted data across application! Added {inserted_staff_count} staff members and {inserted_invoices_count} invoices.",
    }
