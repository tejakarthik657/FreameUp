# 01. Project Overview & Product Understanding

## 1. Project Overview
- **System Name:** FrameUp (DevFrames Enterprise MSME Operating System)
- **Current Version:** `2.4.0-production`
- **Architectural Archetype:** Decoupled Edge Multi-Tenant Architecture with Async ASGI Services & AI Acceleration
- **Domain:** Enterprise Indian MSME Digital Transformation & Privacy Compliance
- **Repository:** `https://github.com/tejakarthik657/FreameUp.git`

---

### 1.1 Project Introduction
FrameUp (DevFrames) is a purpose-built, high-performance cloud operating system and privacy-first digital transformation platform engineered specifically for Indian Micro, Small, and Medium Enterprises (MSMEs). MSMEs form the economic backbone of India—contributing ~30% of national GDP and over 45% of total manufacturing exports—yet over 92% operate without unified, compliant software systems.

FrameUp converges multi-tenant digital storefronts, AI-driven unstructured data ingestion, statutory privacy governance (Digital Personal Data Protection Act, 2023), automated vernacular promotional engines, and localized GST-compliant operations into an edge-accelerated, single-pane-of-glass platform.

### 1.2 Problem Statement
The Indian MSME technology landscape suffers from severe fragmentation, high financial barriers to entry, and compliance landmines:
1. **The Subscription Tax:** To operate digitally, an average business owner must stitch together Wix/Shopify ($29-$79/mo), Canva Pro ($13/mo), Flatfile/CSV clean-up tools ($500+/mo), Google Workspace/Maps APIs, WhatsApp Business BSPs, and local accounting software (Tally/Zoho). Cumulative cost exceeds ₹35,000 to ₹1,50,000/month.
2. **The "Data Mess" Dilemma:** MSME inventory, supplier records, and customer accounts arrive via unstructured WhatsApp exports, handwritten bills captured on low-resolution phone cameras, and corrupted legacy Excel `.xls`/`.csv` files. Existing SaaS requires rigid tabular schemas, resulting in catastrophic user drop-off during onboarding (>80%).
3. **Statutory Non-Compliance (DPDP Act 2023):** The Indian Parliament enacted the Digital Personal Data Protection Act (DPDP Act 2023), imposing statutory financial penalties of up to **₹250 Crore** for handling customer PII without explicit consent notices, verifiable audit logs, and verifiable purpose limitation. Small businesses have zero in-house legal or compliance tooling.
4. **Bandwidth & Compute Asymmetry:** MSME customers browse on budget 4G mobile devices with packet loss and high latency. Heavy client-side JavaScript bundles and unoptimized server rendering crush conversion rates.

### 1.3 Why This Problem Matters
SaaS platforms built in Western markets assume high bandwidth, standardized enterprise CSVs, credit card ubiquity, and homogeneous English interfaces. In India:
- Businesses operate in hybrid regional languages (Hindi, Telugu, Tamil, Marathi, Kannada, etc.).
- Payments flow through UPI and cash-on-delivery.
- Customer relationships are conversational, mediated primarily through WhatsApp.
Solving this problem unlocks formal financial access, digital identity, and direct consumer reach for millions of merchants who are currently locked inside closed marketplace aggregators (who charge 25%–35% take rates per transaction).

### 1.4 Proposed Solution
FrameUp replaces this disjointed stack with an all-in-one, sub-second MSME Operating System:
```
+-----------------------------------------------------------------------------------+
|                        FRAMEUP (DEVFRAMES ENTERPRISE OS)                          |
+-----------------------------------------------------------------------------------+
|  [Edge Subdomain Layer]  -> Multi-tenant Instant Storefronts (<slug>.frameup.in)  |
|  [AI Importer Wedge]     -> Any-Format Unstructured Data Ingestion (Vision/LPU)   |
|  [DPDP 2023 Gateway]     -> Statutory Consent Capture & Verhoeff PII Scrubber     |
|  [Poster Studio]         -> Zero-Headless-Browser Pure CSS Graphic Engine          |
|  [Operations Hub]        -> Inventory, Staff, Multi-Tax GST Invoicing, Suppliers  |
|  [Geospatial Radar]      -> Free-Tier Competitor & Catchment Density Analytics    |
+-----------------------------------------------------------------------------------+
```

### 1.5 Product Vision
To become the unified digital operating system for emerging market merchants, reducing the friction of digital presence, operational workflows, and regulatory compliance to near-zero time and financial cost.

### 1.6 Target Users & Personas

| Persona | Archetype Profile | Core Pain Point | FrameUp Solution |
| :--- | :--- | :--- | :--- |
| **Rajesh Sharma** | Owner, *Sharma Sweets & Caterers* (Tier-2 Lucknow) | Handwritten paper logs, seasonal festival rushes, zero digital menus. | Snap phone photo of paper menu -> Ingest via Vision LPU -> Live storefront in 45 seconds. |
| **Priya Nair** | Founder, *Aura Unisex Luxury Salon* (Bengaluru) | Client telephone numbers leaked; staff churn leads to customer poaching; DPDP risk. | DPDP Consent Gateway with Aadhaar/Phone tokenization, instant digital loyalty cards. |
| **Vikram Patel** | Distributor, *Apex Auto Spares* (Ahmedabad) | Corrupted supplier CSVs with 1,200 non-standard SKUs; manual entry takes 3 days. | AI Data Importer maps messy columns to standardized schema with 99.4% fuzzy accuracy. |
| **Ananya Sen** | Boutique Decorator & Event Planner (Kolkata) | Cannot afford ₹10,000/mo graphic designers for Instagram Diwali / New Year offers. | Pure CSS Poster Studio generates 1080x1350 print-ready promotional creatives on the edge. |

### 1.7 Core Value Proposition
- **Time to Value:** From signup to a fully localized, live public website in under 60 seconds.
- **Cost Reduction:** ₹0/month fixed infrastructure cost tier, compared to ₹40,000/mo across disparate tools.
- **Regulatory Immunity:** Turnkey compliance with India's DPDP Act 2023 out of the box with cryptographic proof.
- **Zero Technical Friction:** Natural language commands, photo ingestion, and automatic domain orchestration.

### 1.8 Real-World Use Cases
1. **Flash Festival Sales:** Merchant enters a discount promo ("Flat 30% off on all North Indian Thalis this weekend"). AI generates localized bilingual copy (Hindi/English), creates marketing posters, and deploys a dynamic banner to the live storefront.
2. **Messy Catalog Migrations:** Wholesaler uploads a vendor's supplier sheet containing multi-line merged cells, inconsistent headers ("Item Desc", "Prce", "Qnty Avl"), and Hindi transliterations. Importer resolves errors, validates GST brackets (5%, 12%, 18%, 28%), and commits clean inventory records.
3. **Walk-in Customer KYC:** Salon receptionist captures customer name and phone number for billing. DPDP Gateway presents digital consent UI, masks PII, logs consent timestamp, and issues SHA-256 certificate for statutory auditing.

### 1.9 Project Scope
- End-to-End Multi-Tenant Authentication (JWT + Dual Cookie / Bearer Token + Google OAuth2).
- Edge-Accelerated Subdomain Storefront Engine (`<slug>.frameup.in`).
- Multi-Modal AI Data Importer (Groq LPU Llama 3.3).
- DPDP Act 2023 Statutory Privacy Gateway (Verhoeff Checksum + PII Vault).
- Pure CSS Dynamic Poster Studio (18 templates + Client HTML5 Canvas export).
- Operations ERP (GST Invoicing, Real-Time Inventory, Suppliers, Staff, UPI QR).
- Free-Tier Geospatial Intelligence (CARTO / OpenStreetMap).

### 1.10 Out of Scope
- Direct payment escrow / banking settlement (handled via direct merchant UPI QR codes).
- Native iOS / Android compiled binaries (served as high-performance mobile-first PWA).
- Cross-border multi-currency FX (domestic INR / GST focus).

### 1.11 Success Metrics & OKRs

```
+-----------------------------------+--------------------+--------------------+
| Metric                            | Industry Baseline  | FrameUp Milestone  |
+-----------------------------------+--------------------+--------------------+
| Time to Publish Storefront        | 4.5 hours          | < 60 seconds       |
| Unstructured File Extraction Acc. | 65% (Traditional)  | > 98.5% (Groq LPU) |
| Poster Export Latency             | 3,500ms (Puppeteer)| < 420ms (Edge CSS) |
| Server Memory per Poster Render   | 150MB - 300MB      | 0 MB (Edge Client) |
| Lighthouse Mobile Perf Score      | 48 / 100           | > 92 / 100         |
| Statutory Consent Audit Logging   | 0% (MSME sector)   | 100% Cryptographic |
+-----------------------------------+--------------------+--------------------+
```
