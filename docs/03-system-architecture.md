# 03. System Architecture & Distributed Topologies

## 3. System Architecture

### 3.1 Architectural Style & Topology
FrameUp employs a **Decoupled Edge-Accelerated Micro-Monolith Architecture**. Rather than decomposing prematurely into distributed microservices with heavy gRPC network serialization costs and distributed transaction overhead (Two-Phase Commit / Saga orchestrators), FrameUp consolidates business capabilities into a modular, asynchronous FastAPI Python ASGI core, bridged with an ultra-low latency Next.js 14 App Router deployed at the Vercel Edge.

```mermaid
graph TB
    subgraph Client Tier
        UserBrowser[MSME Merchant / Consumer Mobile Client]
        PublicViewer[Storefront Consumer - 4G Network]
    end

    subgraph Edge Tier - Vercel Global Edge Network
        EdgeDNS[Edge DNS & Subdomain Wildcard *.frameup.in]
        EdgeMiddleware[middleware.ts Edge Subdomain Rewriter]
        NextApp[Next.js 14 App Router - Server-Side Rendering RSC]
    end

    subgraph API Tier - Render ASGI Production Container
        NginxIngress[Ingress TLS / Reverse Proxy]
        FastAPI[FastAPI Modular Monolith - Uvicorn ASGI Worker]
        CORSMiddleware[Dynamic CORS & Session Cookie Injector]
        AuthGuard[Dual-Auth Guard: HTTP-Only Cookie + Bearer JWT]
        Routers[18 Modular Sub-Routers: Importer, DPDP, Sites, ERP...]
    end

    subgraph Intelligence Tier
        GroqLPU[Groq LPU Acceleration Cluster - Llama 3.3 70B Versatile]
        OCRService[Vision Parser & Document Scrubber]
    end

    subgraph Persistence Tier
        MongoAtlas[(MongoDB Atlas M0/M10 Replica Set - Motor Driver)]
        CloudinaryCDN[(Cloudinary Media CDN)]
    end

    UserBrowser -->|HTTPS / Dashboard| EdgeDNS
    PublicViewer -->|HTTPS / Subdomain| EdgeDNS
    EdgeDNS --> EdgeMiddleware
    EdgeMiddleware -->|Header Rewrite x-subdomain| NextApp
    NextApp -->|REST API over TLS / JSON| FastAPI
    FastAPI --> CORSMiddleware
    CORSMiddleware --> AuthGuard
    AuthGuard --> Routers
    Routers -->|Async Motor Pool| MongoAtlas
    Routers -->|Streaming Hardware JSON Inference| GroqLPU
    Routers -->|Asset Uploads| CloudinaryCDN
```

---

### 3.2 C4 Context & Container Models

#### C4 Context (Level 1)
```mermaid
C4Context
    title FrameUp Enterprise System Context
    Person(merchant, "MSME Business Owner", "Operates retail store, salon, or restaurant")
    Person(consumer, "End Customer", "Visits dynamic storefront, views catalog, gives DPDP consent")
    System(frameup, "FrameUp Platform", "Unified Storefront, Ingestion, DPDP Gateway, & ERP Engine")
    System_Ext(groq, "Groq Cloud LPU", "Ultra-fast low-latency LLM inference engine")
    System_Ext(mongo, "MongoDB Atlas", "Multi-tenant document persistence cluster")
    System_Ext(maps, "CARTO / OpenStreetMap", "Geospatial vector tiles & Nominatim API")

    Rel(merchant, frameup, "Manages inventory, generates posters, reviews compliance", "HTTPS")
    Rel(consumer, frameup, "Browses storefront, submits inquiries, gives consent", "HTTPS")
    Rel(frameup, groq, "Executes grammar-enforced schema extraction", "HTTP/2 REST")
    Rel(frameup, mongo, "Performs asynchronous non-blocking queries", "MongoDB Wire Protocol")
    Rel(frameup, maps, "Fetches geospatial tiles & competitor points", "HTTPS")
```

---

### 3.3 Edge Subdomain Routing Architecture
One of the core architectural differentiators of FrameUp is its **zero-configuration instant multi-tenant storefront**. When a merchant registers a slug (e.g. `royal-spices`), the public site immediately becomes accessible at both `https://frameup.in/site/royal-spices` and `https://royal-spices.frameup.in`.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Visitor Browser
    participant Cloudflare as DNS / SSL Edge
    participant EdgeMW as Next.js middleware.ts
    participant RSC as App Router RSC (/site/[slug])
    participant API as FastAPI Backend (/api/sites)
    participant Mongo as MongoDB Atlas

    Client->>Cloudflare: GET https://royal-spices.frameup.in/
    Cloudflare->>EdgeMW: Host: royal-spices.frameup.in
    Note over EdgeMW: Extracts host, splits subdomain.<br/>Matches regex: ^([a-z0-9-]+)\.frameup\.in$
    EdgeMW->>EdgeMW: Rewrite URL internally to /site/royal-spices
    EdgeMW->>RSC: Invoke Server Component with params.slug = "royal-spices"
    RSC->>API: GET /api/sites/public/royal-spices (Cache: ISR 60s)
    API->>Mongo: websites.find_one({"slug": "royal-spices", "is_published": true})
    Mongo-->>API: Document (theme, menu, hours, social_links)
    API-->>RSC: JSON response
    RSC->>RSC: Hydrate pure CSS template (Restaurant Modern)
    RSC-->>Client: 200 OK + Static HTML + Inline Critical CSS (TTFB < 150ms)
```

---

### 3.4 Data Flow Architecture

#### Write Pipeline (Transactional & Event-Driven)
1. Ingestion of raw payloads into FastAPI controller via Pydantic model validation.
2. Async context manager resolves MongoDB collection handle from Motor client pool.
3. Transactional validation enforces uniqueness and DPDP PII redacting rules.
4. Storage written to MongoDB with write concern `w: "majority"`.
5. Background notification / audit log dispatched via `atlasos` lightweight worker queue.

#### Read Pipeline (Edge-Cached & Query Optimized)
1. Read requests hit Next.js 14 Server Components.
2. Public storefront requests utilize `fetch(..., { next: { revalidate: 60 } })` for Incremental Static Regeneration (ISR).
3. Private dashboard queries pass through authenticated reverse proxy route handlers, attaching HttpOnly session tokens.
4. Database reads utilize compound indexes `(owner_id: 1, created_at: -1)`, yielding single-digit millisecond index scans (`IXSCAN`).
