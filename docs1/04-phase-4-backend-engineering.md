# Phase 4 — Backend Engineering
## System: FrameUp (DevFrames Enterprise MSME Operating System)

> **Architect's Orientation:** This document details the **business logic and application processing layer**. We explore the FastAPI ASGI framework, Uvicorn uvloop concurrency, Pydantic v2 validation contracts, Dual-Auth security, multi-tier GST billing algorithms, Groq LPU integration, and asynchronous background worker queues.

---

## 18. Backend Architecture

### 18.1 The Asynchronous ASGI Architecture
FrameUp's backend is implemented in Python 3.11 using **FastAPI** on top of **Starlette** and **Uvicorn** with the `uvloop` C-based event loop:
- **Non-Blocking I/O:** When a route handler calls `await db.invoices.find_one(...)` or `await groq_client.chat.completions.create(...)`, the execution yields control back to the event loop. The single worker thread handles hundreds of other incoming HTTP requests concurrently rather than blocking.
- **Dependency Injection (`Depends`):** Used extensively for cross-cutting concerns (extracting tenant identity, injecting database handles, and validating roles).

```mermaid
graph TD
    Client[Incoming HTTP Request] --> Uvicorn[Uvicorn uvloop ASGI Server]
    Uvicorn --> SessionMW[SessionMiddleware]
    SessionMW --> CORSMW[Dynamic CORSMiddleware]
    CORSMW --> ExceptionMW[Global Exception Handler]
    ExceptionMW --> AuthGuard[Dual-Auth Guard: Depends(get_current_user_id)]
    AuthGuard --> Router[18 Feature Routers: routers/*.py]
    Router --> Service[Domain Services: services/*.py]
    Service --> Motor[Async Motor Client Connection Pool]
    Motor --> MongoDB[(MongoDB Atlas)]
```

---

## 19. Business Logic Engineering

### 19.1 Indian GST Tax Calculation Engine
In India, Goods and Services Tax (GST) requires dynamic multi-tier splits based on whether the buyer and seller are registered in the same state:

```python
# backend/app/routers/invoices.py (Business Logic Implementation)

def calculate_gst_breakdown(items: list, is_interstate: bool = False) -> dict:
    """
    Computes Subtotal, CGST, SGST, IGST, and Grand Total.
    - Intra-State (Same State): Tax is split 50/50 into CGST and SGST.
    - Inter-State (Different State): 100% of tax is allocated to IGST.
    """
    subtotal = 0.0
    total_tax = 0.0

    for item in items:
        line_total = float(item["qty"]) * float(item["unit_price"])
        tax_rate = float(item.get("tax_rate", 5.0)) # Default 5% GST bracket
        item_tax = (line_total * tax_rate) / 100.0
        
        subtotal += line_total
        total_tax += item_tax

    if is_interstate:
        cgst = 0.0
        sgst = 0.0
        igst = round(total_tax, 2)
    else:
        cgst = round(total_tax / 2.0, 2)
        sgst = round(total_tax / 2.0, 2)
        igst = 0.0

    total_amount = round(subtotal + total_tax, 2)

    return {
        "subtotal": round(subtotal, 2),
        "cgst": cgst,
        "sgst": sgst,
        "igst": igst,
        "total": total_amount
    }
```

### 19.2 Real-Time Stock Depletion & Low-Stock Alerts
When an invoice is issued, the service decrements stock in the `inventory` collection atomically using `$inc: {"quantity": -item.qty}`. If the new quantity falls below `reorder_threshold`, the item is flagged with `low_stock: true`.

---

## 20. API Engineering

### 20.1 REST Standards & Conventions
- **Plural Resources:** `/api/invoices`, `/api/inventory`, `/api/sites`, `/api/dpdp`.
- **HTTP Methods:**
  - `GET`: Safe, idempotent read operations.
  - `POST`: Non-idempotent creation or AI processing commands.
  - `PUT`: Full document replacement.
  - `PATCH`: Partial modifications (e.g. updating invoice status).
  - `DELETE`: Idempotent resource removal.

---

## 21. API Contract Design & OpenAPI

### 21.1 Pydantic v2 Request & Response Contracts
All HTTP payloads are validated against strict Pydantic v2 schemas. This generates live OpenAPI / Swagger documentation accessible at `/docs`:

```python
# backend/app/models/business.py
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List

class BusinessCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    category: str = Field(..., pattern="^(restaurant|salon|services)$")
    phone: str = Field(..., pattern=r"^\+91[6-9]\d{9}$")
    email: EmailStr
    gstin: Optional[str] = Field(None, pattern=r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")
```

### 21.2 Standardized Error Schemas (RFC 7807)
Failed requests emit a structured error format with a machine-readable `error_code`, human-readable `detail`, and request path:
```json
{
  "detail": "Aadhaar checksum failed mathematical validation via Verhoeff algorithm.",
  "error_code": "INVALID_AADHAAR_CHECKSUM",
  "timestamp": "2026-08-30T14:32:00.123Z",
  "path": "/api/dpdp/consent"
}
```

---

## 22. Authentication & Authorization

### 22.1 Dual-Auth Architecture
To protect web browsers from Cross-Site Scripting (XSS) while enabling mobile apps and headless integrations:
- **Web Browsers:** Authenticate via partitioned HTTP-Only cookies (`devframes_token`) set with `SameSite=None; Secure=True; Path=/`.
- **API & Mobile Clients:** Authenticate via `Authorization: Bearer <JWT>` headers.
- **Tokens:** Cryptographically signed using **HS256** with 256-bit entropy keys and a hard 7-day expiration.

### 22.2 Google OAuth2 Authorization Code Flow
Integrated via `backend/app/routers/auth_google.py`:
1. User clicks "Sign in with Google" -> Backend generates redirect URI with state nonce.
2. User authenticates on Google accounts screen -> Google redirects back to `/api/auth/google/callback` with authorization `code`.
3. Backend exchanges code for Google ID token, verifies email, creates user document if new, and sets `devframes_token` cookie.

---

## 23. Integration Engineering

### 23.1 External Services Matrix
```
+--------------------+-----------------------+-----------------------------------------------+
| External Service   | Protocol / SDK        | Purpose & Integration Scope                   |
+--------------------+-----------------------+-----------------------------------------------+
| Groq Cloud LPUs    | Groq Python SDK       | Low-latency AI unstructured data extraction   |
| Cloudinary CDN     | Cloudinary REST API   | Image optimization, WebP compression, storage |
| Google OAuth2      | HTTP/2 OAuth2 Code    | Federated single sign-on authentication       |
| OpenStreetMap      | Overpass / Nominatim  | Competitor density & reverse geocoding        |
| UPI Deep-Links     | Dynamic VPA QR Engine | Zero-fee Indian direct merchant payments      |
+--------------------+-----------------------+-----------------------------------------------+
```

---

## 24. Asynchronous Processing & Background Tasks

### 24.1 FastAPI Background Tasks & AtlasOS
For operations that would block the HTTP response cycle (e.g. generating multi-resolution poster assets, logging SHA-256 consent audits, or running fuzzy column mapping):
- The controller accepts the request and immediately returns `HTTP 202 Accepted` or `200 OK`.
- Processing is dispatched to `BackgroundTasks.add_task(...)` or the `atlasos` worker queue, running as an asynchronous coroutine on the background event loop.

---

## 25. Real-Time Engineering

### 25.1 Event Polling & Server-Sent Events (SSE)
- Long-running data ingestion jobs emit progress state into `importer_batches`.
- The dashboard polls `/api/importer/batches` with short-interval polling (or reads Server-Sent Event progress streams) to render live extraction percentages (0% -> 100%) as Groq processes unstructured files.
