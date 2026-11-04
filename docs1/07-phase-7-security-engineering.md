# Phase 7 — Security Engineering
## System: FrameUp (DevFrames Enterprise MSME Operating System)

> **Architect's Orientation:** This document details the **security architecture designed into every layer** of FrameUp. We cover OWASP Top 10 defenses, API security, encryption standards, the mathematical **Verhoeff Dihedral Checksum ($D_5$)**, DPDP Act 2023 compliance, in-memory PII token vaults, and tenant isolation.

---

## 46. Application Security & OWASP Top 10 Defenses

### 46.1 Threat Mitigation Matrix (STRIDE Model)

| Threat Category | Potential Attack Vector | FrameUp Architectural Defense |
| :--- | :--- | :--- |
| **Spoofing Identity** | Attacker attempts to forge JWT claims or session cookies. | Cryptographic signature verification using secret 256-bit entropy keys; tokens rejected upon single-bit alteration. |
| **Tampering with Data** | Attacker intercepts and modifies GST invoice totals or tax amounts. | Invariant server-side calculation of CGST/SGST/Total; client-supplied invoice totals are strictly ignored and recalculated. |
| **Repudiation** | Merchant or consumer denies granting consent for customer KYC/data collection. | Cryptographic DPDP certificate generation with SHA-256 hash of IP, timestamp, user-agent, and consent statement. |
| **Information Disclosure** | Customer telephone numbers, PAN, or Aadhaar numbers leaked via logs or APIs. | Automatic PII redaction pipeline; phone numbers masked (`+91******3210`); raw Aadhaar numbers never persisted. |
| **Denial of Service (DoS)**| Massive file upload floods or rapid LLM token draining calls. | Strict request body size limits ($10\text{MB}$ max payload) + Nginx ingress rate limiting + Token budgeting per tenant. |
| **Elevation of Privilege**| Standard merchant attempts to read other tenants' financial ledgers. | Multi-tenant scoping enforced at database query level (`find_one({"_id": id, "owner_id": current_user_id})`). |

---

## 47. API Security & CORS Hardening

### 47.1 Dynamic CORS Regex Validation
```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app$|https://frameup\.in$|http://localhost:3000$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 47.2 Global Exception Handler Preserving CORS
Starlette's default error handler strips CORS headers from unhandled 500 error pages, causing the browser to mask internal crashes as CORS errors. We intercept all exceptions to forcefully append origin headers:

```python
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin")
    response = JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )
    if origin and is_allowed_origin(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
```

---

## 48. Data Security & Cryptography

### 48.1 Encryption Standards
- **In Transit:** TLS 1.3 enforced on all public edge connections (Vercel Anycast) and internal wire protocols (MongoDB Atlas connection string with `ssl=true`).
- **At Rest:** MongoDB Atlas disks encrypted via AES-256 with AWS Key Management Service (KMS).
- **Passwords:** Hashed using `bcrypt` with work factor $\ge 12$.

---

## 49. Infrastructure Security & Network Boundaries
- **Container Hardening:** The production Docker container executes as an unprivileged non-root user (`appuser`, UID 1001), preventing container breakout attacks.
- **Secrets Management:** Secrets (`JWT_SECRET`, `GROQ_API_KEY`, `MONGODB_URI`) are injected exclusively via environment variables at runtime, never committed to git repositories.

---

## 50. AI Security & In-Flight PII Redaction
To prevent accidental data leakage when communicating with external AI inference engines:
1. Regex pre-processor tokenizes phone numbers and Aadhaar strings in volatile server memory (`{{PHONE_01}}`).
2. Groq LPU receives only synthetic tokens.
3. Upon response receipt, synthetic tokens are re-hydrated into masked strings before saving to MongoDB Atlas.

---

## 51. Statutory Privacy & DPDP Act 2023 Compliance

### 51.1 The Mathematical Verhoeff Checksum Algorithm ($D_5$)
To protect MSMEs from ₹250 Crore non-compliance penalties under the Digital Personal Data Protection Act 2023, identity numbers must be verified against UIDAI specifications:

```python
# backend/app/routers/dpdp_gateway.py (Production Implementation)

_d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
]

_p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
]

def validate_verhoeff(number_str: str) -> bool:
    """
    Validates a number string using the Verhoeff D5 algorithm.
    Time: O(n) | Space: O(1).
    Detects 100% of single-digit transcription errors and adjacent transpositions.
    """
    if not number_str.isdigit():
        return False
    c = 0
    for i, digit in enumerate(reversed([int(x) for x in number_str])):
        c = _d[c][_p[i % 8][digit]]
    return c == 0
```

### 51.2 Cryptographic Consent Proof
```python
import hashlib
from datetime import datetime, timezone

def generate_dpdp_audit_proof(business_id: str, masked_id: str, purpose: str, client_ip: str) -> str:
    timestamp = datetime.now(timezone.utc).isoformat()
    raw_payload = f"{business_id}|{masked_id}|{purpose}|{client_ip}|{timestamp}"
    return hashlib.sha256(raw_payload.encode('utf-8')).hexdigest()
```

---

## 52. Identity & Access Management (IAM) & Multi-Tenant Isolation
- **Role-Based Access Control (RBAC):** Three discrete roles: `merchant` (full administrative rights to their tenant data), `staff` (restricted to billing and stock entry), and `admin` (system-wide telemetry).
- **Compound Multi-Tenant Scoping:** Private queries strictly scope data:
  `{"business_id": ObjectId(current_user.business_id), "_id": ObjectId(resource_id)}`.
