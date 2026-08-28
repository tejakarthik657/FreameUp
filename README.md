# DevFrames — MVP Scaffold

AI-assisted instant website generator for local businesses (restaurants, salons, local services).
This is a working starter codebase implementing the architecture from the product doc:

Next.js (dashboard) → FastAPI (backend) → MongoDB / Cloudinary / Groq → Template Engine → Generated Website

## What's included

- **backend/** — FastAPI app: auth (stub JWT), business CRUD, Groq-powered structured content generation,
  a Jinja2-based **template engine** (the core "do not let AI write HTML" piece), QR code generation,
  and 3 representative templates (one per category — restaurant/premium, salon/luxury, local_services/professional).
  The other 6 template variants follow the exact same pattern (same data contract, different `templates/<category>/<style>.html` + tokens).
- **frontend/** — Next.js 14 (App Router) + TypeScript + Tailwind dashboard: landing, login/signup, create-website flow,
  style picker (image cards, not labels), and a preview page that calls the backend template-render endpoint.
- **docker-compose.yml** — local MongoDB for dev.
- **.env.example** — every secret/config value referenced in the code.

## What's intentionally NOT fully built (per the doc's own sequencing rules)

Per section 11 (Build Priorities) and section 6 (Sequencing Rule), paid features, all 9 templates, wildcard subdomain
routing infra, and production auth hardening are left as clearly marked TODOs — build order should be:
template engine → intake flow → Groq → QR/URL → auth → free-tier limits → paid tier. Building all of that fully
before validating "will a business owner actually use this" would be premature; the scaffold reflects that discipline.

## Quickstart

### 1. Backend
```bash
cd backend
cp ../.env.example .env   # fill in GROQ_API_KEY, CLOUDINARY_*, MONGO_URI, JWT_SECRET
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Database (local dev)
```bash
docker compose up -d mongo
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on :3000, backend on :8000. `frontend/lib/api.ts` points at `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`).

## Core data contract

Every template — regardless of category/style — consumes the same shape (see `backend/app/schemas/business.py`
and `frontend/lib/types.ts`, which mirror each other):

```
business.name, logo, description, phone, whatsapp, address, maps, instagram, hours, images, services, menu
```

Groq never generates HTML. It only ever returns the structured JSON in `backend/app/services/groq_service.py`
(hero copy, about copy, CTA, theme colors, section order) which the template engine renders into HTML/CSS.

## Adaptive Template & Component System (implemented per the follow-up spec)

The template engine is no longer "fill in a fixed HTML shell." Every generated site now goes through:

```
Business data
     │
     ▼
Groq — classifies only (backend/app/services/groq_service.py)
     │  returns GroqSiteConfig: theme, available_features, recommended_sections, hero, about
     │  validated against a Pydantic schema; malformed output is retried once, then raised —
     │  never passed unvalidated into the render pipeline
     ▼
render_resolver.py — deterministic, rule-based (NOT AI-decided)
     │  checks the template's Capability Contract (templates/<category>/<style>.manifest.json)
     │  decides: which sections render, in what order, at what density
     │  falls back to the Component Library (component_library.py) for data the template
     │  doesn't natively support (e.g. Threads/YouTube links, testimonials) — or omits it
     │  gracefully if nothing in the library covers it
     ▼
RenderManifest — the ONE thing the template engine (Jinja2) ever consumes
     ▼
Generated Website
```

**Key files:**
- `backend/app/schemas/groq_contract.py` — the exact Groq output contract.
- `backend/app/schemas/template_registry.py` / `services/template_registry.py` — loads each
  template's `*.manifest.json` (its Capability Contract: `core_sections`, `optional_sections`,
  canonical `section_order`).
- `backend/app/services/component_library.py` — the fallback registry (ships with 2 generic
  components: `generic_social_link`, `generic_reviews`, per the spec's suggested starting set).
- `backend/app/services/render_resolver.py` — the core adaptive logic: menu/services switch to
  a collapsible "tabs" density at 9+ items, gallery switches to a scrollable "expanded" density
  at 5+ photos, sections with no data simply don't render, unsupported social platforms resolve
  through the Component Library or are dropped without breaking the layout.
- `backend/app/templates/sections/*.html` + `templates/components/*.html` — the shared partial
  library every template's `.html` file loops through via `manifest.section_order`. This is what
  keeps typography/spacing/component design **fixed per template** while content, section
  presence, order, and density stay **adaptive per business** (spec section 5.1/5.2).
- `POST /sites/{id}/regenerate` (`scope: "theme" | "content" | "full"`) — cheap, scoped edits.
  Because Groq output and rendering are separated, changing just the color theme or just the
  copy never touches template files, per spec section 6.1.

**What's NOT implemented from the follow-up spec (flagged, not silently skipped):**
- Only 3 of the 9 templates ship real `.manifest.json` + section wiring (matches the spec's own
  build order in section 8.4: "prove the capability-check flow on one template before doing all 9").
- The `template-references/` (cloned reference repos, kept separate from production code) folder
  isn't included — those are external repos to be cloned locally per section 3.1, not generated code.
- The long-term "AI recommends a template for you" flow (section 7) is explicitly out of scope
  for MVP per the spec itself.

## Owner-uploaded images, richer generated sites, and the Marketplace

Three related additions on top of the Adaptive Template System above:

**Up to 3 featured images per business** (`business.featured_images`, capped via
`Field(max_length=3)` in `schemas/business.py`) — collected in the `/create` intake page, either
by direct upload (proxied through `/business/upload-image` to Cloudinary, same as before) or by
picking from the marketplace's stock photo library. These are placed in **specific** spots by
`render_resolver.py`, not dumped into a generic gallery:
- `featured_images[0]` → hero section background photo (with a themed gradient overlay)
- `featured_images[1]` → about section, switches to a two-column image+text layout
- `featured_images[2]` → highlight image next to the contact/CTA block

This — plus richer base CSS (card hover states, button hover lift, shadowed imagery, a proper
heading/body font pairing, a wider hero) — is what stops a generated site from looking like a
generic template. `business.images` (the general, unbounded gallery) still works exactly as before.

**The Marketplace** (`backend/app/services/marketplace_service.py`, `routers/marketplace.py`,
catalogs in `backend/app/data/`):
- `GET /marketplace/palettes` — 8 curated color palettes.
- `GET /marketplace/fonts` — 6 curated heading/body font pairings.
- `GET /marketplace/stock-images?category=<restaurant|salon|local_services>` — a stock photo
  library per category, so an owner with no photos of their own can still fill their 3 featured
  slots. **These ship as `placehold.co` placeholder images** so the picker flow works end-to-end
  out of the box — swap `backend/app/data/stock_image_catalog/*.json` for a real licensed source
  (Unsplash API, Pexels API, or your own curated Cloudinary folder) before going live.

Picking a palette/font in the `/create/style` step sends `palette_id`/`font_id` on
`POST /sites` — this **overrides** whatever theme Groq would have picked (Groq still writes the
copy; color/typography become the owner's explicit choice when they want that control instead
of "auto"). `POST /sites/{id}/regenerate` also accepts `scope: "palette"` or `"font"` — a pure
catalog swap with **no Groq call at all**, so swapping colors after the fact is instant and free,
consistent with the cheap-regeneration design from the Adaptive Template spec.

## Adding a new template (the other 6 from the matrix)

1. Add `backend/app/templates/<category>/<style>.html` (Jinja2, extends `base/base.html`, loops
   `manifest.section_order` — copy an existing template file as a starting point).
2. Add `backend/app/templates/<category>/<style>.manifest.json` (its Capability Contract).
3. Register it in `TEMPLATE_REGISTRY` in `backend/app/services/template_engine.py`.
4. Add a thumbnail + id to the style picker in `frontend/app/create/style/page.tsx`.
No section-partial code needs to change — every template shares the same `sections/*.html` and
`components/*.html` library. This is the point of the shared data contract.

## Open decisions (flagged, not resolved, per section 12 of the doc)

- Auth: this scaffold uses HTTP-only cookie + JWT as a default choice — swap for Auth.js/Better Auth if preferred.
- Subdomain routing: `paradise.devframes.in` style wildcard routing is stubbed as a slug-based route
  (`/preview/[slug]`) — real wildcard DNS + Vercel domain config is an infra step outside this codebase.
- License verification for the 9 reference repos is a manual legal/compliance step, not something code can do —
  not included here.
#   F r e a m e U p  
 