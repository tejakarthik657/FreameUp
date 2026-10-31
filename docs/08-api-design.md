# 08. API Design & Complete Route Directory

## 8. API Design

### 8.1 API Standards & Conventions
- **Protocol:** HTTP/1.1 & HTTP/2 over TLS 1.3
- **Serialization:** JSON (`application/json`) / Multipart Form (`multipart/form-data`)
- **Base Production URL:** `https://freameup.onrender.com`
- **Resource Naming:** Plural nouns (e.g. `/api/invoices`, `/api/inventory`).
- **HTTP Status Codes:**
  - `200 OK`: Successful read or sync update.
  - `201 Created`: Successful creation with URI in payload.
  - `400 Bad Request`: Validation failure (malformed JSON, schema violation).
  - `401 Unauthorized`: Missing or invalid session token.
  - `403 Forbidden`: Insufficient role permissions.
  - `404 Not Found`: Entity does not exist or belongs to another tenant.
  - `409 Conflict`: Unique constraint violation (slug collision).
  - `422 Unprocessable Entity`: Pydantic validation error.
  - `500 Internal Server Error`: Unhandled server exception (preserves CORS).

---

### 8.2 Comprehensive Route Directory (80+ Endpoints across 18 Routers)

#### 1. Authentication & Identity (`/api/auth` & `/api/auth/google`)
| Method | Endpoint | Auth | Request Body | Response (200/201) | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | `{email, password, full_name, business_name}` | `{user_id, token, email}` | Creates user & initial business document; sets cookie. |
| `POST` | `/api/auth/login` | Public | `{email, password}` | `{token, user: {...}}` | Validates bcrypt hash; returns JWT & sets HttpOnly cookie. |
| `POST` | `/api/auth/logout` | Public | Empty | `{message: "Logged out"}` | Clears `devframes_token` cookie. |
| `GET` | `/api/auth/me` | Bearer/Cookie | Empty | User Object `{id, email, role}` | Returns currently authenticated user context. |
| `GET` | `/api/auth/google/login` | Public | Query: `?redirect_uri=...` | HTTP 307 Redirect | Initiates Google OAuth2 authorization flow. |
| `GET` | `/api/auth/google/callback` | Public | Query: `?code=...&state=...` | HTTP 307 Redirect + Cookie | Exchanges code for Google profile; signs in user. |

#### 2. Multi-Tenant Storefronts (`/api/sites`)
| Method | Endpoint | Auth | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/sites` | Bearer/Cookie | None | `Array<Website>` | Lists websites owned by current user. |
| `POST` | `/api/sites` | Bearer/Cookie | `{name, vertical, template_id}` | `Website` | Creates draft site with vertical seed data. |
| `GET` | `/api/sites/{id}` | Bearer/Cookie | None | `Website` | Retrieves site details for editor workshop. |
| `PUT` | `/api/sites/{id}` | Bearer/Cookie | Complete Website Payload | `Website` | Full update of site content, fonts, and theme. |
| `PATCH` | `/api/sites/{id}/publish` | Bearer/Cookie | `{is_published: bool}` | `{status, public_url}` | Toggles public accessibility and updates edge DNS cache. |
| `GET` | `/api/sites/public/{slug}` | Public | None | `Website` (Sanitized) | High-speed cached endpoint consumed by Next.js RSC. |
| `DELETE` | `/api/sites/{id}` | Bearer/Cookie | None | `{status: "deleted"}` | Removes site record and frees up slug. |

#### 3. AI Importer Wedge (`/api/importer`)
| Method | Endpoint | Auth | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/importer/upload` | Bearer/Cookie | `multipart/form-data` (file) | `{batch_id, columns, sample_rows}` | Ingests CSV/Excel/Image; stores raw batch. |
| `POST` | `/api/importer/analyze` | Bearer/Cookie | `{batch_id}` | `{suggested_mapping, confidence}` | Invokes Groq LPU to infer column semantics. |
| `POST` | `/api/importer/commit` | Bearer/Cookie | `{batch_id, confirmed_mapping}` | `{imported_count, errors}` | Commits normalized records to Inventory/Services. |
| `GET` | `/api/importer/batches` | Bearer/Cookie | None | `Array<BatchSummary>` | Lists historical data ingestion jobs. |

#### 4. DPDP Statutory Compliance Gateway (`/api/dpdp`)
| Method | Endpoint | Auth | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/dpdp/consent` | Public | `{business_id, phone, aadhaar, purpose}` | `{certificate_id, proof_hash}` | Validates via Verhoeff, redacts PII, issues certificate. |
| `GET` | `/api/dpdp/verify/{cert_id}`| Public | None | `{status, timestamp, masked_id}` | Public verification portal for data auditors. |
| `GET` | `/api/dpdp/logs` | Bearer/Cookie | Query: `?page=1&limit=50` | `{logs: [...], total}` | Merchant statutory compliance audit trail. |
| `POST` | `/api/dpdp/erasure-request` | Public | `{phone, token}` | `{status: "acknowledged"}` | Data Principal right to be forgotten trigger. |

#### 5. GST Invoicing Engine (`/api/invoices`)
| Method | Endpoint | Auth | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/invoices` | Bearer/Cookie | Query: `?status=PAID` | `Array<Invoice>` | Lists tenant invoices with pagination. |
| `POST` | `/api/invoices` | Bearer/Cookie | `{customer, items: [...], tax_rate}`| `Invoice` | Computes CGST/SGST/IGST, assigns invoice sequence. |
| `GET` | `/api/invoices/{id}` | Bearer/Cookie | None | `Invoice` | Retrieves full invoice detail. |
| `GET` | `/api/invoices/{id}/pdf` | Bearer/Cookie | None | `application/pdf` | Compiles print-ready GST tax invoice. |
| `PATCH`| `/api/invoices/{id}/status`| Bearer/Cookie | `{status: "PAID" \| "CANCELLED"}` | `Invoice` | Updates billing status and triggers inventory depletion. |

#### 6. Inventory & SKU Management (`/api/inventory`)
| Method | Endpoint | Auth | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/inventory` | Bearer/Cookie | Query: `?low_stock=true` | `Array<InventoryItem>` | Lists inventory stock with reorder threshold flags. |
| `POST` | `/api/inventory` | Bearer/Cookie | `{sku, name, quantity, unit, price}` | `InventoryItem` | Creates SKU item. |
| `PUT` | `/api/inventory/{id}` | Bearer/Cookie | Item Payload | `InventoryItem` | Updates SKU pricing, description, or supplier association. |
| `PATCH`| `/api/inventory/{id}/adjust`| Bearer/Cookie| `{delta: number, reason: string}` | `InventoryItem` | Increments or decrements stock on hand with audit note. |
| `DELETE`| `/api/inventory/{id}` | Bearer/Cookie | None | `{status: "deleted"}` | Deletes SKU item. |

#### 7. Pure CSS Poster Synthesis (`/api/posters`)
| Method | Endpoint | Auth | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/posters/templates` | Bearer/Cookie | Query: `?vertical=restaurant` | `Array<PosterTemplate>` | Returns 18 CSS template manifests and layouts. |
| `POST` | `/api/posters/generate` | Bearer/Cookie | `{template_id, headline, discount, cta}`| `{html_manifest, css_variables}` | Injects merchant branding into poster layout. |

#### 8. AI Marketing & Localization (`/api/ai` & `/api/localization`)
| Method | Endpoint | Auth | Request Body | Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/generate-copy` | Bearer/Cookie | `{topic, tone, language}` | `{copy: string}` | High-speed vernacular marketing copy from Groq LPU. |
| `POST` | `/api/localization/translate`| Bearer/Cookie| `{content: object, target_lang: "hi"}`| `{translated_content: object}`| Translates entire website JSON into regional languages. |

---

### 8.3 Standard Error Response Structure
```json
{
  "detail": "Invalid GSTIN format. Expected 15-character alphanumeric string matching state code regex.",
  "error_code": "INVALID_GSTIN_FORMAT",
  "timestamp": "2026-08-30T14:32:00.123Z",
  "path": "/api/invoices"
}
```
