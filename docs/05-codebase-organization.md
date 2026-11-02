# 05. Codebase Organization & Architecture Boundaries: A Guided Tour of Every File

> **The Mentor's Note:** When an interviewer asks you: *"How is your codebase organized? Walk me through what happens when I open the repository,"* they want to see if you understand **architectural boundaries**. 
> 
> Did you just dump everything in a `routes/` folder? Or did you separate presentation, HTTP transport, domain business logic, and database persistence? Let's take a tour of every critical file in FrameUp so you know exactly where everything lives and why it is there.

---

## 1. High-Level Mental Model: The 3 Islands

When you open `c:\Programming\Projects\05_Social-Impact\template_hub\devframes`, you see three primary functional islands:

```
devframes/
├── frontend/   -> The Edge Presentation Layer (Next.js 14 App Router)
├── backend/    -> The Async Business Logic Core (FastAPI Python ASGI)
└── atlasos/    -> The Background Event & Async Task Engine (Submodule)
```

- **Frontend Island:** Does not talk directly to MongoDB. It is responsible for rendering pixels, handling drag-and-drop file uploads, executing edge subdomain rewrites in `middleware.ts`, and rasterizing pure CSS posters on the client GPU.
- **Backend Island:** The single source of truth. It validates JWT tokens, computes GST tax splits, runs the Verhoeff checksum algorithm, talks to Groq LPUs, and performs non-blocking queries on MongoDB Atlas.
- **AtlasOS Island:** Handles asynchronous tasks and event dispatching without blocking the main web server threads.

---

## 2. Deep Dive: Backend Codebase Anatomy (`backend/app/`)

Let's walk through every critical file in `backend/app/` and understand its exact responsibility:

```
backend/app/
├── config.py                 # The System Brain & Environment Gatekeeper
├── database.py               # The Async Database Lifespan & Connection Pool
├── main.py                   # The ASGI Application Entrypoint & Middleware Stack
├── models/                   # Pydantic Contracts (Request / Response / DB Models)
│   ├── business.py           # MSME Tenant Profile & GSTIN schema
│   ├── poster.py             # Graphic manifests & CSS theme tokens
│   ├── user.py               # User credentials & role definitions
│   └── website.py            # Storefront state, themes, menu sections
├── routers/                  # 18 Modular HTTP Controllers (Thin Transport Layer)
│   ├── auth.py               # Dual-Auth: HTTP-Only cookie injection + JWT decode
│   ├── auth_google.py        # Google OAuth2 authorization code callback
│   ├── business.py           # Business profile CRUD
│   ├── dpdp_gateway.py       # Statutory DPDP compliance & Verhoeff validation
│   ├── importer.py           # Groq LPU file parsing & batch ingestion
│   ├── inventory.py          # Real-time SKU tracking & threshold alerts
│   ├── invoices.py           # GST-compliant tax billing & calculations
│   ├── leads.py              # Customer inquiry lead pipeline
│   ├── localization.py       # Vernacular translation & currency
│   ├── loyalty.py            # Digital loyalty stamp cards & rewards
│   ├── marketplace.py        # Add-on integrations & templates
│   ├── operations.py         # Consolidated business metrics
│   ├── posters.py            # 18 pure CSS poster layouts
│   ├── qr.py                 # Dynamic UPI & vCard QR codes
│   ├── sites.py              # Multi-tenant storefront CRUD & publishing
│   ├── staff.py              # Employee access control & roles
│   └── suppliers.py          # Vendor supply chains & purchase orders
└── services/                 # Pure Business Domain Logic
    ├── groq_service.py       # Groq API client with hardware JSON grammar enforcement
    ├── importer_service.py   # Two-stage fuzzy column mapping & normalization
    └── template_engine.py    # Jinja2 template compiler & renderer
```

### Let's Inspect the Key Files & Why They Matter:

#### 1. `backend/app/config.py`
- **What it does:** Uses Pydantic’s `BaseSettings` to read environment variables (`MONGODB_URI`, `JWT_SECRET`, `GROQ_API_KEY`, `PORT`).
- **Why it matters:** If an environment variable is missing in production, Pydantic throws an immediate validation error during startup (`ValidationError`), rather than failing silently halfway through a user's transaction.

#### 2. `backend/app/database.py`
- **What it does:** Initializes the `AsyncIOMotorClient` pool during FastAPI’s `lifespan` startup event, and sets up compound database indexes.
- **Why it matters:** We do **not** open a new database connection on every HTTP request (which causes socket exhaustion and 500ms latency). Instead, a single shared client maintains a pooled set of persistent TCP sockets connected to MongoDB Atlas.

#### 3. `backend/app/main.py`
- **What it does:** Assembles the FastAPI app, injects `CORSMiddleware`, registers the global exception handler, and mounts all 18 sub-routers under `/api/*`.
- **Why it matters:** It is the conductor of the orchestra. It ensures that every incoming request passes through CORS origin validation and security layers before hitting a specific router.

---

## 3. Deep Dive: Frontend Codebase Anatomy (`frontend/app/`)

Next.js 14 uses the **App Router**, where folder paths directly determine browser URLs:

```
frontend/app/
├── (auth)/
│   ├── login/page.tsx         # Unified login (email/pass + Google OAuth button)
│   └── signup/page.tsx        # MSME onboarding registration flow
├── create/
│   ├── page.tsx               # Storefront creation step 1: Name & category
│   └── style/page.tsx         # Storefront creation step 2: Palette & fonts
├── dashboard/                 # The Authenticated Enterprise OS (Protected Routes)
│   ├── layout.tsx             # Shared dashboard shell: Top navigation & sidebar
│   ├── page.tsx               # Analytics command center & operational summary
│   ├── ai-agent/page.tsx      # Multi-turn conversational business assistant
│   ├── ai-importer/page.tsx   # Drag-and-drop batch file upload & schema mapper
│   ├── dpdp-gateway/page.tsx  # Statutory consent manager & audit certificate log
│   ├── inventory/page.tsx     # Real-time SKU stock manager & reorder alerts
│   ├── invoices/page.tsx      # GST billing engine & tax breakdown
│   ├── localization/page.tsx  # Vernacular language switcher
│   ├── loyalty/page.tsx       # Digital stamp cards & reward passes
│   ├── operations/page.tsx    # Unified operational radar & cash flow
│   ├── posters/page.tsx       # 18 pure CSS graphic studio with Canvas export
│   ├── staff/page.tsx         # Staff directory & role assignment
│   └── suppliers/page.tsx     # Vendor directory & purchase orders
├── preview/[slug]/page.tsx    # Authenticated draft preview
├── site/[slug]/page.tsx       # Public edge-rendered storefront (React Server Component)
├── workshop/[slug]/page.tsx   # Live visual editor & WYSIWYG block customizer
├── middleware.ts              # Edge Subdomain interceptor & URL rewriter
└── layout.tsx                 # Root HTML shell with font configuration & providers
```

### The Architectural Beauty of This Structure:
- **Route Groups `(auth)`:** The parentheses `(auth)` mean the folder name does **not** appear in the URL. So `app/(auth)/login/page.tsx` is accessed at `/login`, keeping URLs clean and memorable.
- **RSC vs Client Islands:** Notice `/site/[slug]` is completely separate from `/dashboard`. The public site uses Server Components (shipping 0 KB client JavaScript), while `/dashboard` uses Client Components (`"use client"`) for rich interactive charts, optimistic state, and drag-and-drop file uploaders.

---

## 4. The 3 Inviolable Architectural Boundary Rules

In our codebase, we enforce 3 strict architectural rules:

```
+-----------------------------------------------------------------------------------+
|                     THE 3 ARCHITECTURAL BOUNDARY INVARIANTS                       |
+-----------------------------------------------------------------------------------+
| RULE 1: THIN CONTROLLERS                                                          |
| Routers (backend/app/routers/*) must NEVER execute heavy data parsing, external   |
| AI calls, or raw math directly. They only unwrap HTTP requests, invoke a Service, |
| and return a Pydantic model.                                                      |
+-----------------------------------------------------------------------------------+
| RULE 2: STRICT TENANT SCOPING                                                     |
| Every database query that accesses private business data MUST include the        |
| authenticated user's ID: {"business_id": ObjectId(b_id), "owner_id": user_id}.   |
| No endpoint may ever query by resource ID alone, preventing multi-tenant leaks.   |
+-----------------------------------------------------------------------------------+
| RULE 3: ZERO HEAVY CLIENT IMPORTS ON SERVER STOREFRONTS                           |
| Storefront routes (/site/[slug]) must NEVER import client-only libraries like     |
| html-to-image, canvas, or dropzones. Public pages must stay 100% pure HTML stream.|
+-----------------------------------------------------------------------------------+
```

---

## 5. How to Walk Through the Codebase in an Interview

### 🎤 The Interviewer's Question:
> *"If I gave you 2 minutes to show me your cleanest code boundary in this repository, where would you take me?"*

### 💡 Your Killer Answer:
> *"I would take you to `backend/app/routers/auth.py` and `backend/app/routers/dpdp_gateway.py`.
> 
> In `auth.py`, you'll see our **Dual-Auth Dependency Guard** (`get_current_user_id`). Rather than scattering token inspection across 18 routers, every protected route simply declares `user_id: str = Depends(get_current_user_id)`. The dependency handles reading the HTTP-Only partitioned cookie, falling back to the Bearer header, decoding the HS256 claims, and rejecting malformed tokens in one central, reusable place.
> 
> And in `dpdp_gateway.py`, you'll see how we completely separated mathematical algorithmic verification (the Verhoeff Dihedral Checksum over $D_5$) from the HTTP controller. The controller remains clean, readable, and 100% testable."*
