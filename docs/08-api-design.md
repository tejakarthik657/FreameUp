# 08. API Design & Complete Route Directory: The Nervous System of FrameUp

> **The Mentor's Note:** An API is not just a list of URLs. It is a contractual agreement between your frontend and your backend. A poorly designed API forces the frontend to make 5 round-trips just to show one dashboard card. 
> 
> In this guide, you will master the **80+ REST endpoints across our 18 routers**, understand our resource-oriented REST conventions, see how errors are standardized using RFC 7807, and learn how to defend your API design in a system design interview.

---

## 1. REST Conventions & Standards

Every endpoint in FrameUp follows four foundational design rules:

```
+-----------------------------------------------------------------------------------+
|                        FRAMEUP API DESIGN INVARIANTS                              |
+-----------------------------------------------------------------------------------+
| 1. PLURAL NOUNS: We use /api/invoices, /api/inventory, /api/sites (never verbs).  |
| 2. HTTP VERBS DICTATE ACTION:                                                     |
|    - GET: Fetch resource (idempotent, safe, zero side effects).                   |
|    - POST: Create a new resource or trigger an AI execution pipeline.             |
|    - PUT: Replace an existing resource completely.                                |
|    - PATCH: Partial update (e.g. toggle is_published, mark invoice as PAID).      |
|    - DELETE: Remove a resource idempotently.                                      |
| 3. ERROR INTEGRITY: Errors return RFC 7807 JSON with error_code, detail, and path.|
| 4. UNIFIED AUTH: All private endpoints depend on the get_current_user_id guard.   |
+-----------------------------------------------------------------------------------+
```

---

## 2. Complete Route Directory Grouped by Business Capability

### Group A: Identity & Authentication (`routers/auth.py` & `routers/auth_google.py`)

| Method | Endpoint | Auth | Purpose in Plain English |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Registers a new merchant, creates their default business record, and sets session cookie. |
| `POST` | `/api/auth/login` | Public | Verifies email & Bcrypt password hash; returns JWT and injects `devframes_token` cookie. |
| `POST` | `/api/auth/logout` | Public | Instructs browser to delete `devframes_token` cookie (`Max-Age=0`). |
| `GET` | `/api/auth/me` | Dual-Auth | Returns currently logged-in user profile (`id`, `email`, `role`). |
| `GET` | `/api/auth/google/login` | Public | Redirects browser to Google's consent screen with OAuth2 client ID. |
| `GET` | `/api/auth/google/callback` | Public | Exchanges Google code for access token, extracts profile email, and signs user in. |

---

### Group B: Multi-Tenant Storefront Engine (`routers/sites.py`)

| Method | Endpoint | Auth | Purpose in Plain English |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/sites` | Dual-Auth | Fetches all websites owned by the logged-in merchant. |
| `POST` | `/api/sites` | Dual-Auth | Generates a new storefront with pre-seeded vertical data (Restaurant / Salon / Services). |
| `GET` | `/api/sites/{id}` | Dual-Auth | Retrieves full site draft for the live editor workshop. |
| `PUT` | `/api/sites/{id}` | Dual-Auth | Saves updated theme, custom colors, fonts, or menu sections. |
| `PATCH` | `/api/sites/{id}/publish` | Dual-Auth | Toggles `is_published: true/false`, making the site publicly accessible or taking it offline. |
| `GET` | `/api/sites/public/{slug}` | **Public** | **The high-speed edge endpoint!** Next.js Server Components call this to render public sites. |
| `DELETE` | `/api/sites/{id}` | Dual-Auth | Deletes the website record and releases the unique subdomain slug for others to claim. |

---

### Group C: The AI Importer Wedge (`routers/importer.py`)

| Method | Endpoint | Auth | Purpose in Plain English |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/importer/upload` | Dual-Auth | Accepts raw file upload (CSV, TSV, image) via `multipart/form-data`; stores raw batch. |
| `POST` | `/api/importer/analyze` | Dual-Auth | Sends sampled rows to Groq LPU `llama-3.3-70b` to infer fuzzy column mappings. |
| `POST` | `/api/importer/commit` | Dual-Auth | Takes the merchant's approved column mapping and writes normalized SKUs into Inventory. |
| `GET` | `/api/importer/batches` | Dual-Auth | Lists historical data import batches and their success rates. |

---

### Group D: Statutory DPDP Act Privacy Gateway (`routers/dpdp_gateway.py`)

| Method | Endpoint | Auth | Purpose in Plain English |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/dpdp/consent` | **Public** | Validates Aadhaar via Verhoeff, masks PII, and stores SHA-256 signed consent record. |
| `GET` | `/api/dpdp/verify/{cert_id}`| **Public** | Public audit portal allowing customers to verify what consent they granted. |
| `GET` | `/api/dpdp/logs` | Dual-Auth | Merchant compliance ledger showing all active and expired customer consent records. |
| `POST` | `/api/dpdp/erasure-request` | **Public** | Triggers statutory "Right to be Forgotten", purging customer records upon request. |

---

### Group E: GST Invoicing & Inventory Operations (`routers/invoices.py` & `routers/inventory.py`)

| Method | Endpoint | Auth | Purpose in Plain English |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/invoices` | Dual-Auth | Lists invoices with pagination and status filters (`PAID`, `PENDING`, `CANCELLED`). |
| `POST` | `/api/invoices` | Dual-Auth | Creates invoice, auto-calculates CGST/SGST/IGST, and decrements stock atomically. |
| `GET` | `/api/invoices/{id}` | Dual-Auth | Fetches single invoice details. |
| `GET` | `/api/invoices/{id}/pdf` | Dual-Auth | Generates clean, printable HTML/PDF tax invoice with QR code and GSTIN details. |
| `GET` | `/api/inventory` | Dual-Auth | Retrieves all inventory SKUs, highlighting items that hit reorder thresholds. |
| `POST` | `/api/inventory` | Dual-Auth | Adds new stock item with cost price, selling price, and supplier ID. |
| `PATCH` | `/api/inventory/{id}/adjust`| Dual-Auth | Manually increments/decrements stock quantity with an audit reason note. |

---

### Group F: Pure CSS Poster Studio (`routers/posters.py`)

| Method | Endpoint | Auth | Purpose in Plain English |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posters/templates` | Dual-Auth | Returns manifests for all 18 pure CSS layouts (fonts, color slots, aspect ratios). |
| `POST` | `/api/posters/generate` | Dual-Auth | Injects merchant store data, discount %, and offer headline into selected layout manifest. |

---

## 3. Anatomy of a Real Request & Response

Let's look at what the payload looks like when issuing a GST tax invoice:

#### Request: `POST /api/invoices`
```json
{
  "customer_name": "Rohan Gupta",
  "customer_phone": "+919988776655",
  "is_interstate": false,
  "items": [
    {
      "item_id": "SKU-GALOUTI-01",
      "name": "Galouti Kebab (4 pcs)",
      "qty": 2,
      "unit_price": 420.0,
      "tax_rate": 5.0,
      "hsn": "2106"
    }
  ],
  "payment_mode": "UPI"
}
```

#### Response: `HTTP 201 Created`
```json
{
  "id": "66d1e520e1b2c3d4e5f60005",
  "invoice_number": "INV-2026-0042",
  "subtotal": 840.0,
  "cgst": 21.0,
  "sgst": 21.0,
  "igst": 0.0,
  "total_amount": 882.0,
  "payment_status": "PAID",
  "created_at": "2026-08-30T12:00:00Z"
}
```

---

## 4. Standardized Error Handling (RFC 7807)

When something goes wrong, the backend never returns an ambiguous `"Error occurred"`. It returns a structured error object:

```json
{
  "detail": "Aadhaar checksum failed mathematical validation via Verhoeff algorithm.",
  "error_code": "INVALID_AADHAAR_CHECKSUM",
  "timestamp": "2026-08-30T14:32:00.123Z",
  "path": "/api/dpdp/consent"
}
```

---

## 5. How to Defend Your API Design in an Interview

### 🎤 The Interviewer's Question:
> *"How do you prevent your API from leaking sensitive multi-tenant data when fetching resources by ID?"*

### 💡 Your Killer Answer:
> *"Every state-changing or private query is enforced by what I call **Compound Multi-Tenant Scoping**. 
> 
> When a client calls `GET /api/invoices/66d1e520e1b...`, the controller does NOT do `db.invoices.find_one({"_id": id})`. If an attacker guessed another user's invoice ID, that naive query would leak data.
> 
> Instead, the query strictly includes the authenticated merchant's tenant ID from the injected token:
> `db.invoices.find_one({"_id": ObjectId(id), "business_id": ObjectId(current_user.business_id)})`.
> 
> If the invoice belongs to another tenant, the query returns `None`, and the API cleanly returns a 404 Not Found, making cross-tenant data leakage mathematically impossible."*
