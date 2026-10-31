# 05. Codebase Organization & Architecture Boundaries

## 5. Codebase Organization

### 5.1 Repository Top-Level Architecture
FrameUp is organized as an enterprise mono-repository with clear physical separation of concerns across presentation, business services, and asynchronous event processing:

```
devframes/
├── .github/                      # CI/CD Workflows, deploy hooks, and PR templates
│   └── workflows/
│       ├── deploy.yml            # Production Render & Vercel deployment automation
│       └── test.yml              # Pytest & ESLint continuous integration
├── atlasos/                      # Submodule / internal asynchronous task & queue package
├── backend/                      # Asynchronous Python 3.11 FastAPI ASGI Monolith
│   ├── app/
│   │   ├── config.py             # Pydantic BaseSettings, env resolution, CORS regex
│   │   ├── database.py           # Async Motor client, lifespan connection pool
│   │   ├── main.py               # ASGI application entrypoint, middleware, router mount
│   │   ├── data/                 # Catalogs: fonts, palettes, stock imagery
│   │   ├── models/               # Pydantic persistence models & request/response contracts
│   │   ├── routers/              # 18 Modular Sub-Routers
│   │   ├── services/             # Core business logic (Groq LPU, Importer, Jinja2)
│   │   └── templates/            # Base Jinja2 SSR storefront components
│   ├── tests/                    # Pytest test suite (unit, integration, mock fixtures)
│   ├── Dockerfile                # Production multi-stage lightweight Python container
│   └── requirements.txt          # Frozen backend dependencies
├── frontend/                     # Next.js 14 App Router (React 18 + TypeScript)
│   ├── app/                      # App router directory: (auth), create, dashboard, site
│   ├── components/               # Reusable UI component library (modals, charts, nav)
│   ├── lib/                      # API client, auth token helpers, utilities
│   ├── middleware.ts             # Vercel Edge Subdomain resolution & path rewriter
│   ├── public/                   # Static icons, vector seeds, and brand graphics
│   ├── tailwind.config.js        # Design tokens, color palettes, and container rules
│   └── package.json              # Frozen frontend dependencies
└── docs/                         # Production-grade 23-chapter engineering documentation
```

---

### 5.2 Backend Directory Structure & Boundaries

```
backend/app/
├── config.py
│   └── Reads environment variables; exposes typed 'settings' object.
├── database.py
│   └── Initializes AsyncIOMotorClient inside lifespan event; sets up indexes.
├── main.py
│   └── Assembles FastAPI app, CORS middleware regex, exception handlers, and mounts routers.
├── models/
│   ├── user.py          # User schema, roles, and Bcrypt validation
│   ├── business.py      # MSME tenant metadata, address, GSTIN
│   ├── website.py       # Storefront state, theme JSON, sections, and menus
│   └── poster.py        # Graphic manifests, typography, and color schemes
├── routers/
│   ├── auth.py          # Dual-auth cookies & Bearer tokens
│   ├── auth_google.py   # OAuth2 authorization code callback
│   ├── business.py      # Business profile CRUD
│   ├── dpdp_gateway.py  # Verhoeff checksum & PII vault
│   ├── importer.py      # Groq LPU file parsing & batch pipeline
│   ├── inventory.py     # SKU stocks & threshold alerts
│   ├── invoices.py      # Multi-tax GST calculation & billing
│   ├── leads.py         # Customer inquiry lead pipeline
│   ├── localization.py  # Vernacular translation & currency
│   ├── loyalty.py       # Loyalty stamps & rewards
│   ├── marketplace.py   # Template & add-on extensions
│   ├── operations.py    # Consolidated business metrics
│   ├── posters.py       # 18 pure CSS poster layouts
│   ├── qr.py            # UPI & vCard dynamic QR codes
│   ├── sites.py         # Multi-tenant site builder & publishing
│   ├── staff.py         # Employee access control
│   └── suppliers.py     # Supplier chains & purchase orders
└── services/
    ├── groq_service.py      # Groq LPU API client with JSON grammar enforcement
    ├── importer_service.py  # Fuzzy column matching & CSV normalization
    └── template_engine.py   # Jinja2 template compiler & renderer
```

---

### 5.3 Frontend Directory Structure & App Router Conventions

```
frontend/app/
├── (auth)/
│   ├── login/page.tsx         # Login view with Google OAuth & credential inputs
│   └── signup/page.tsx        # MSME onboarding registration flow
├── create/
│   ├── page.tsx               # Storefront onboarding wizard
│   └── style/page.tsx         # Theme, font, and palette selector
├── dashboard/                 # Authenticated merchant portal
│   ├── ai-agent/page.tsx      # Multi-turn business assistant
│   ├── ai-importer/page.tsx   # Drag-and-drop batch file parser
│   ├── dpdp-gateway/page.tsx  # Statutory consent manager & audit certificate log
│   ├── inventory/page.tsx     # Real-time SKU stock manager
│   ├── invoices/page.tsx      # GST billing engine & tax breakdown
│   ├── layout.tsx             # Persistent shell layout & auth verification
│   ├── localization/page.tsx  # Vernacular language switcher
│   ├── loyalty/page.tsx       # Digital stamp cards
│   ├── operations/page.tsx    # Unified operational radar
│   ├── posters/page.tsx       # 18 pure CSS graphic studio
│   ├── staff/page.tsx         # Staff directory
│   └── suppliers/page.tsx     # Vendor directory
├── preview/[slug]/page.tsx    # Authenticated draft preview
├── site/[slug]/page.tsx       # Public edge-rendered storefront (RSC)
├── workshop/[slug]/page.tsx   # Live visual editor & customization sandbox
├── layout.tsx                 # Root HTML shell with font configuration
└── page.tsx                   # Public marketing landing page
```

---

### 5.4 Architectural Boundary Rules
1. **Controllers are Thin:** Routers in `backend/app/routers/` must only validate request payloads, verify permissions, call service methods, and return Pydantic models. No business logic or database loops inside router handlers.
2. **Persistence Scoping:** Every private query to MongoDB must include the authenticated user’s ID (`owner_id` or `business_id`) to ensure absolute multi-tenant data isolation.
3. **Frontend Presentation Independence:** Server Components (`/site/[slug]`) must never import client-only packages (`html-to-image`, `react-dropzone`) to prevent bundling client JavaScript on public storefronts.
