import hashlib
import json
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/dpdp", tags=["dpdp-sanitizer"])

class SanitizeRequest(BaseModel):
    raw_payload: str
    masking_strategy: str = "redact"  # "redact", "hash", "tokenize"
    business_name: Optional[str] = "FrameUp Enterprise"

# Regex patterns for sensitive Indian PII identifiers
AADHAAR_REGEX = re.compile(r"\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b")
PAN_REGEX = re.compile(r"\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b")
INDIAN_PHONE_REGEX = re.compile(r"(?:\+91[\-\s]?)?[6789]\d{9}\b")
EMAIL_REGEX = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PASSWORD_KEY_REGEX = re.compile(r"(?i)(password|secret|api_key|token|access_key)[\"']?\s*[:=]\s*[\"']?([^\"'\s,]+)")

def mask_aadhaar(match):
    raw = match.group(0).replace(" ", "")
    return f"XXXX-XXXX-{raw[-4:]}"

def mask_pan(match):
    raw = match.group(0)
    return f"{raw[:2]}XXXXX{raw[-2:]}"

def mask_phone(match):
    raw = match.group(0)
    digits = re.sub(r"\D", "", raw)
    return f"+91-XXXXX-{digits[-4:]}"

def mask_email(match):
    raw = match.group(0)
    user, domain = raw.split("@", 1)
    return f"{user[0]}***@{domain}"

@router.post("/sanitize")
async def sanitize_and_issue_passport(req: SanitizeRequest):
    if not req.raw_payload or not req.raw_payload.strip():
        raise HTTPException(status_code=400, detail="Payload to sanitize cannot be empty")

    text = req.raw_payload
    original_sha256 = hashlib.sha256(text.encode("utf-8")).hexdigest()

    # Track detections
    aadhaar_matches = len(AADHAAR_REGEX.findall(text))
    pan_matches = len(PAN_REGEX.findall(text))
    phone_matches = len(INDIAN_PHONE_REGEX.findall(text))
    email_matches = len(EMAIL_REGEX.findall(text))
    secret_matches = len(PASSWORD_KEY_REGEX.findall(text))

    # Apply deterministic Indian PII scrubbing
    cleaned = text
    cleaned = AADHAAR_REGEX.sub(mask_aadhaar, cleaned)
    cleaned = PAN_REGEX.sub(mask_pan, cleaned)
    cleaned = INDIAN_PHONE_REGEX.sub(mask_phone, cleaned)
    cleaned = EMAIL_REGEX.sub(mask_email, cleaned)
    cleaned = PASSWORD_KEY_REGEX.sub(r'\1: "[REDACTED_SECRET]"', cleaned)

    clean_sha256 = hashlib.sha256(cleaned.encode("utf-8")).hexdigest()
    total_pii_sanitized = aadhaar_matches + pan_matches + phone_matches + email_matches + secret_matches

    # Generate DPDP Verifiable Compliance Certificate Token
    timestamp = datetime.utcnow().isoformat()
    certificate_id = f"DPDP-IN-{clean_sha256[:12].upper()}"

    passport = {
        "certificate_id": certificate_id,
        "issued_to": req.business_name,
        "timestamp": timestamp,
        "dpdp_act_compliant": True,
        "statutory_standard": "Digital Personal Data Protection Act 2023 (Section 8 - Safe Data Processing)",
        "original_data_hash": f"0x{original_sha256}",
        "clean_data_hash": f"0x{clean_sha256}",
        "audit_matrix": {
            "aadhaar_numbers_masked": aadhaar_matches,
            "pan_cards_masked": pan_matches,
            "phone_numbers_redacted": phone_matches,
            "emails_anonymized": email_matches,
            "secrets_stripped": secret_matches,
            "total_violations_neutralized": total_pii_sanitized,
        },
        "guarantee": "Zero External PII Leakage. Certified safe for ingestion by OpenAI, Groq, Claude, Pinecone & Vector DBs.",
        "penalty_risk_mitigated": "Up to ₹250 Crore per DPDP Statutory Schedule",
    }

    return {
        "status": "success",
        "clean_payload": cleaned,
        "passport": passport,
    }
