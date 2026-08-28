# DevFrames

AI-assisted instant website generator for local businesses. Owners fill in their business details, pick a style, and get a live, production-quality website with a shareable link and QR code — no code required.

## Architecture

```
Owner fills form → Frontend POST /business → Backend stores BusinessIn
                    ↓
Owner picks template + style → Frontend POST /sites
                    ↓
Backend: Groq generates content → render_resolver builds manifest → MongoDB stores Website
                    ↓
Visitor opens /preview/{slug}
                    ↓
Next.js SSR: GET /sites/data/{slug} → {business, manifest}
                    ↓
registry[manifest.template_id] renders React component with data
```

## What's included

**backend/** — FastAPI app with:
- Auth (JWT + HTTP-only cookies)
- Business CRUD
- Groq-powered structured content generation
- Deterministic render resolver (section presence, ordering, density)
- JSON data endpoint for Next.js SSR template rendering
- Legacy Jinja2 template engine kept for backward compatibility
- QR code generation
- Marketplace (palettes, fonts, stock images)
- MongoDB (Motor) + Cloudinary integration

**frontend/** — Next.js 14 (App Router) + TypeScript + Tailwind:
- Landing page
- Login / signup
- Business intake flow (create)
- Style picker
- Dashboard
- Preview page (SSR React rendering via template registry)
- 9 production templates across 3 categories

**docker-compose.yml** — local MongoDB for development

**.env.example** — all required secrets and config values

## Template system

Each template is a self-contained React component that receives `{business, manifest}` and renders sections in the order specified by the manifest. The render resolver decides which sections appear based on actual business data, not AI guesses.

### Shared primitives

**Motion:** InView, TextReveal, ParallaxWrapper (Framer Motion v12)
**UI:** Container, SectionHeader, Button
**Sections:** BusinessHours, GalleryGrid, TestimonialsRow, WhatsAppFAB, SocialLinks

### Templates

| ID | Category | Identity |
|---|---|---|
| restaurant-modern | Restaurant | Warm bistro, Poppins, community feel |
| restaurant-premium | Restaurant | Cinematic noir, Fraunces, champagne gold |
| restaurant-local | Restaurant | Neighborhood trust, WhatsApp-first |
| salon-luxury | Salon | Aurora dark, Playfair, glassmorphism |
| salon-modern | Salon | Bright editorial, split hero, grid-based |
| salon-minimal | Salon | Bold dark, accordion services |
| services-professional | Local Services | Terracotta, numbered service cards |
| services-bold | Local Services | High-contrast, statement hero |
| services-local | Local Services | Community trust, contact-first |

### Data contract

Every template consumes the same Business shape:

```
name, tagline, description, category, phone, whatsapp, email,
address, maps, mapsUrl, instagram, facebook, threads,
bookingUrl, orderUrl, hours, images, logo, services, menu,
team, testimonials, featured_images[]
```

The RenderManifest controls what renders:

```
template_id, theme, section_order[], sections{type, density?, data{}},
components_used[]
```

## Quickstart

### 1. Backend

```bash
cd backend
cp ../.env.example .env   # fill in GROQ_API_KEY, CLOUDINARY_*, MONGO_URI, JWT_SECRET
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
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

## How rendering works

1. Owner submits business details via the create form. Stored as `BusinessIn` in MongoDB.
2. Owner picks a template + style. Frontend calls `POST /sites`.
3. Groq generates structured content (hero copy, about copy, theme, section order). Groq never generates HTML.
4. `render_resolver.py` examines actual business data and produces a `RenderManifest`:
   - Which sections exist (has menu items? show menu. No images? skip gallery)
   - Canonical section order (per template, filtered to what is present)
   - Density (menu <= 8 items → grid, > 8 → tabs; gallery <= 4 → standard, > 4 → expanded)
5. Manifest + business data are stored in MongoDB alongside slug, published_url, qr_url.
6. When a visitor opens `/preview/{slug}`, Next.js fetches `GET /sites/data/{slug}`, looks up the template component via the registry, and renders it server-side with the data.

## Adding a template

1. Create `frontend/templates/<category>/<style>/index.tsx` — a React component implementing `TemplateProps`
2. Create `frontend/templates/<category>/<style>/_register.ts` — register it with `registerTemplate({id, component})`
3. Import the register file in `frontend/templates/index.ts`
4. No backend changes required — the same `/sites/data/{slug}` endpoint serves all templates

## API endpoints

**Public:**
- `GET /sites/templates` — list available template IDs
- `GET /sites/templates/{template_id}/capabilities` — template capability contract
- `GET /sites/render/{slug}` — legacy Jinja2 HTML render (backward compat)
- `GET /sites/data/{slug}` — JSON data for Next.js SSR rendering
- `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`

**Authenticated:**
- `POST /business` — create business
- `GET /business/{id}` — get business
- `POST /business/upload-image` — upload to Cloudinary
- `POST /sites` — create website (triggers Groq + render_resolver)
- `POST /sites/{site_id}/regenerate` — regenerate content/theme/palette/font
- `GET /marketplace/palettes`, `/marketplace/fonts`, `/marketplace/stock-images`

## Tech stack

Backend: FastAPI, Motor (MongoDB), Groq SDK, Pydantic, Jinja2, QRCode, Cloudinary
Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion, Lenis, Lucide icons
Infra: Docker Compose (MongoDB)

## Environment variables

See `.env.example` for all required values. Key ones:

- `MONGO_URI` — MongoDB connection string
- `GROQ_API_KEY` — Groq API key for content generation
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — image hosting
- `JWT_SECRET` — auth signing key
- `NEXT_PUBLIC_API_URL` — frontend API base URL (defaults to `http://localhost:8000`)

## Open decisions

- Auth: current implementation uses JWT + HTTP-only cookies — swap for Auth.js/Better Auth if preferred
- Subdomain routing: `slug.devframes.in` style wildcard routing is stubbed as slug-based routes — real wildcard DNS + hosting config is an infra step
- Static site export: the current system renders dynamically via Next.js SSR. A static HTML export pipeline can be added on top of the existing `/sites/data/{slug}` endpoint without changing templates
