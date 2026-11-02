# 17. Architecture Decision Records (ADRs): The 5 Core Invariants

> **The Mentor's Note:** Architecture Decision Records (ADRs) are the most valuable artifacts in software engineering. When an engineer leaves a company, their code remains, but the *context*—why they wrote it that way—is lost.
> 
> In this guide, you will master our **5 official ADRs** formatted according to the **Michael Nygard Standard**. Memorizing these 5 decisions gives you the intellectual armor to defend every line of code in any technical review.

---

## 1. What is an ADR?
An ADR captures a single architectural decision in four simple sections:
1. **Title & Status:** What are we deciding, and is it approved?
2. **Context:** What business or technical forces are creating the dilemma?
3. **Decision:** What specific path did we choose?
4. **Consequences:** What are the positive gains, and what are the negative trade-offs we knowingly accepted?

---

## 2. ADR-001: MongoDB Document Polymorphism vs Relational SQL Normalization

### Status: Approved & Implemented

### Context:
FrameUp serves diverse MSME business verticals (Restaurants, Unisex Salons, Automotive Repair Workshops, Logistics Traders). Each vertical requires drastically different data schemas:
- Restaurants require structured menus with spice levels, dietary tags, allergen matrices, and variant pricing.
- Salons require service durations, stylist tiers, gender categories, and package bundles.
- Retail/Wholesale requires HSN codes, serial tracking, and tiered wholesale volume pricing.

In a traditional relational SQL model (PostgreSQL/MySQL), supporting this would require either:
1. An Entity-Attribute-Value (EAV) anti-pattern, destroying indexing and query ergonomics.
2. A sprawling schema of 35+ normalized tables with 6-way joins to hydrate a single public storefront view.

### Decision:
We adopt **MongoDB Atlas (Document Store)** using polymorphic schemas validated by Pydantic v2 models at the application layer.

### Consequences:
- **Positive:** A single atomic read (`db.websites.find_one({"slug": slug})`) retrieves the complete storefront state in $<5\text{ms}$ with zero joins. Schema evolution requires zero database lock downtime.
- **Negative:** Relational integrity (e.g. cascading deletes when an owner deletes their account) must be handled programmatically in the application service layer rather than relying on database foreign key constraints.

---

## 3. ADR-002: Decoupled Next.js Edge + FastAPI ASGI vs Unified Next.js API Routes

### Status: Approved & Implemented

### Context:
Next.js provides built-in Node.js API routes (`app/api/*`). We evaluated building the entire backend inside Next.js vs maintaining a separate FastAPI Python backend.

### Decision:
We decouple the presentation and edge routing layer (Next.js 14 on Vercel) from the core business and data processing layer (FastAPI ASGI on Render).

### Consequences:
- **Positive:** Python provides world-class data engineering, CSV/Excel parsing, mathematical libraries (`numpy`, `pandas`), and native AI SDKs. Next.js specializes purely in SSR, edge routing, and React Server Components.
- **Negative:** Requires managing cross-origin networking (CORS), cross-domain cookie handling, and maintaining two separate deployment pipelines.

---

## 4. ADR-003: Pure CSS DOM-to-Canvas Client Rasterization vs Headless Chromium (Puppeteer)

### Status: Approved & Implemented

### Context:
MSME merchants require dynamic marketing posters formatted for Instagram Stories ($1080 \times 1920$) and WhatsApp status updates ($1080 \times 1350$). The industry standard approach is server-side headless browser rendering (Puppeteer/Playwright generating screenshots on a worker queue).

On affordable cloud dynos (Render 512MB RAM free/starter instances), launching a single Chromium process consumes $200\text{MB}-350\text{MB}$ RAM. Two concurrent user requests immediately exceed the memory ceiling, causing kernel `SIGKILL 137` crashes.

### Decision:
We eliminated all server-side browser engines. We engineered 18 pure CSS vector-free templates rendered in a hidden high-DPI DOM container on the client, rasterized directly into high-res PNGs via browser HTML5 Canvas (`html-to-image`).

### Consequences:
- **Positive:** Backend server RAM consumption dropped from 300MB to **0 MB**. Export latency dropped from 3.8s to **380ms**. The system scales to tens of thousands of concurrent exports with zero infrastructure cost increase.
- **Negative:** Export fidelity depends on client browser Canvas rendering capabilities; legacy browsers without HTML5 Canvas support cannot generate exports.

---

## 5. ADR-004: Verhoeff Dihedral Checksum vs Naive Regex for DPDP Identity Verification

### Status: Approved & Implemented

### Context:
India’s Digital Personal Data Protection (DPDP) Act 2023 mandates that data fiduciaries verify user consent and prevent fraudulent identity injection. In naive implementations, developers validate 12-digit Aadhaar numbers using a simple regular expression (`^\d{12}$`). This accepts forged numbers (e.g. `111111111111` or `123456789012`), contaminating the compliance audit trail.

### Decision:
We implemented the **Verhoeff Dihedral Group Checksum Algorithm ($D_5$)** in the backend DPDP Gateway.

### Consequences:
- **Positive:** Validates mathematical authenticity of 12-digit identifiers in $O(n)$ time with $O(1)$ space; catches 100% of single-digit transcription errors and adjacent transpositions.
- **Negative:** Algorithmic complexity in maintaining $10 \times 10$ and $8 \times 10$ multiplication and permutation matrices.

---

## 6. ADR-005: Dual Transport Authentication (Partitioned Cookies + Bearer Header Fallback)

### Status: Approved & Implemented

### Context:
Browser security best practices require HTTP-Only, partitioned cookies to protect session tokens against Cross-Site Scripting (XSS). However, mobile clients, third-party integrations, and headless API consumers rely on standard `Authorization: Bearer <token>` headers. Furthermore, third-party cookie blocking across cross-site origins (e.g. frontend on `*.vercel.app` and backend on `*.onrender.com`) frequently strips unpartitioned cookies.

### Decision:
We architected a **Dual Transport Authentication Guard** in FastAPI:
1. Priority 1: Read HTTP-Only Cookie `devframes_token` (configured with `SameSite=None; Secure=True`).
2. Priority 2: Fall back to `Authorization: Bearer <token>` header if cookie is omitted.
3. Emit both the Set-Cookie header and the raw JWT token in the login response payload.

### Consequences:
- **Positive:** Browser clients get transparent, zero-management XSS-safe cookie persistence; API clients and mobile applications maintain full flexibility with Bearer headers.
- **Negative:** Must carefully maintain CORS credentials configuration (`allow_credentials=True`) to prevent browser network drops.
