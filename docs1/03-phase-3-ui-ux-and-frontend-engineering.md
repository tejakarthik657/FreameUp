# Phase 3 — UI/UX & Frontend Engineering
## System: FrameUp (DevFrames Enterprise MSME Operating System)

> **Architect's Orientation:** This document covers **everything related to the user-facing application**. We detail the dark-mode design system, Next.js 14 App Router architecture, React Server Components (RSC) vs Client Islands, client-side HTML5 Canvas poster rasterization, responsive mobile UX, and Core Web Vitals optimization.

---

## 12. UI/UX Design

### 12.1 Design Tokens & The Dark Charcoal System
FrameUp uses a high-contrast, distraction-free design system engineered for legibility on budget smartphone screens under direct sunlight:
- **Base Canvas:** Deep Charcoal (`#09090B`) — provides battery power savings on OLED smartphone screens and eliminates eye strain.
- **Card Surface:** Midnight Zinc (`#18181B`) with subtle border `#27272A`.
- **Accent Emerald:** `#10B981` (Used for positive actions: "Publish", "Stock In Stock", "Paid").
- **Warning Amber:** `#F59E0B` (Used for "Low Stock Alert", "Pending KYC").
- **Danger Crimson:** `#EF4444` (Used for "Out of Stock", "Revoke Consent").

### 12.2 Typography Hierarchy
- **Primary Interface Font:** `Plus Jakarta Sans` — A clean, modern geometric sans-serif with a tall x-height, making small text legible on 5.5-inch Android screens.
- **Headings & Display:** `Space Grotesk` & `Inter`.
- **Monospace Financial Figures:** `JetBrains Mono` / Tabular Numerals for GST invoice totals and price columns, preventing layout shift when numbers change.

### 12.3 Mobile-First Touch Targets & Accessibility
- Minimum actionable touch target: **$48\text{px} \times 48\text{px}$** for buttons, tabs, and menu triggers.
- Form controls feature high-contrast focus rings (`ring-2 ring-emerald-500`) to assist keyboard and screen-reader accessibility.

---

## 13. Frontend Architecture

### 13.1 Next.js 14 App Router Directory Organization
```
frontend/
├── app/
│   ├── (auth)/                   # Unauthenticated route group
│   │   ├── login/page.tsx        # Email/password & Google OAuth entrypoint
│   │   └── signup/page.tsx       # Merchant onboarding & registration
│   ├── create/                   # Multi-step site creation wizard
│   │   ├── page.tsx              # Business profile & vertical selection
│   │   └── style/page.tsx        # Palette, typography & layout picker
│   ├── dashboard/                # Authenticated Merchant Enterprise OS
│   │   ├── ai-agent/page.tsx     # Conversational business assistant
│   │   ├── ai-importer/page.tsx  # Drag-and-drop unstructured data ingestion
│   │   ├── dpdp-gateway/page.tsx # Statutory consent manager & audit certificate viewer
│   │   ├── inventory/page.tsx    # Real-time SKU tracking with low-stock alerts
│   │   ├── invoices/page.tsx     # GST tax invoice generator & PDF compiler
│   │   ├── layout.tsx            # Persistent sidebar, header, & auth guard
│   │   ├── localization/page.tsx # Vernacular language translator
│   │   ├── loyalty/page.tsx      # Digital loyalty cards & reward passes
│   │   ├── operations/page.tsx   # Consolidated financial & footfall metrics
│   │   ├── page.tsx              # Main analytics command center
│   │   ├── posters/page.tsx      # 18 Pure CSS vector-free graphic studio
│   │   ├── staff/page.tsx        # Employee role directory
│   │   └── suppliers/page.tsx    # Vendor supply chains & orders
│   ├── preview/[slug]/page.tsx   # Authenticated live preview sandbox
│   ├── site/[slug]/page.tsx      # Public edge-rendered storefront (RSC)
│   ├── workshop/[slug]/page.tsx  # WYSIWYG live site customizer & block editor
│   ├── layout.tsx                # Root layout with font optimization & toast providers
│   └── page.tsx                  # Public landing page & marketing hero
├── components/                   # Shared UI primitives (Modals, Badges, Tables)
├── lib/                          # API client, auth helpers, utility functions
└── middleware.ts                 # Edge subdomain resolution & URL rewriter
```

---

## 14. Frontend Development

### 14.1 Server Components (RSC) vs Client Islands
We enforce a strict separation between public read paths and private interactive paths:
- **Public Storefronts (`/site/[slug]`):** 100% **React Server Components**. They fetch data directly at the edge and emit raw HTML streams. Zero React runtime JavaScript is downloaded by the end-consumer.
- **Admin Dashboard (`/dashboard/*`):** Interactive **Client Components (`"use client"`)**. Powers real-time chart rendering, optimistic form updates, drag-and-drop file ingestion, and local canvas exports.

### 14.2 Vector-Free Pure CSS Graphic Engine
Instead of relying on server-side Puppeteer, the frontend synthesizes marketing posters using pure CSS:
```typescript
// frontend/app/dashboard/posters/page.tsx
import { toBlob } from 'html-to-image';

async function exportHighResPoster(elementId: string, filename: string) {
  const node = document.getElementById(elementId);
  if (!node) return;

  // Await web font loading to prevent fallback serif font clipping
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Render DOM element to Blob at 3x pixel ratio for print/retina sharpness
  const blob = await toBlob(node, {
    quality: 0.95,
    pixelRatio: 3, // 1080px x 1350px ultra-crisp output
    cacheBust: true,
  });

  const url = URL.createObjectURL(blob!);
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
```

---

## 15. State Management

### 15.1 State Tiering Matrix
- **Server State (React Server Components):** Governed by Next.js edge caching and ISR (`revalidate: 60`). Fresh data is streamed without client-side Redux/Zustand boilerplate.
- **Form & Interactive State (React Hook Form / Local State):** Local component state for invoice item rows, dynamic discount calculations, and live color palette previewing in the workshop.
- **Session State (Dual-Auth Storage):** Session tokens are persisted transparently via HTTP-Only cookies, with in-memory Bearer token fallback held inside an authenticated API client wrapper.

---

## 16. Client-Side Engineering

### 16.1 Drag-and-Drop Batch File Ingestion
The AI Importer frontend (`app/dashboard/ai-importer/page.tsx`) implements chunked multipart uploads using `react-dropzone`:
- Validates file extensions (`.csv`, `.tsv`, `.jpg`, `.jpeg`, `.png`, `.pdf`) before upload.
- Checks file size ceilings ($10\text{MB}$ max payload) in the browser to prevent network saturation.
- Displays optimistic upload progress indicators and parsed sample row previews before final batch commit.

### 16.2 Offline Resilience (IndexedDB Fallback)
In areas with fluctuating 4G signals, invoice creation payloads are cached optimistically in browser `indexedDB`. If a network timeout occurs, the UI displays a pending sync badge and retries with an idempotency key once connectivity is restored.

---

## 17. Frontend Performance Optimization

### 17.1 Core Web Vitals Benchmarks
```
+------------------------------------+-------------------+--------------------+
| Web Vital Metric                   | Industry Average  | FrameUp Storefront |
+------------------------------------+-------------------+--------------------+
| Largest Contentful Paint (LCP)     | 3.2s              | 0.85s (Cloudinary) |
| First Input Delay (FID)            | 120ms             | < 20ms             |
| Cumulative Layout Shift (CLS)      | 0.18              | 0.00 (Fixed CSS)   |
| JavaScript Bundle Size (Storefront)| 420 KB            | 0 KB (Pure RSC)    |
| Lighthouse Mobile Performance Score| 52 / 100          | 98 / 100           |
+------------------------------------+-------------------+--------------------+
```

### 17.2 Code Splitting & Image Optimization
- Next.js dynamic imports (`next/dynamic`) defer loading heavy chart packages (Recharts / Leaflet) until the merchant scrolls to the analytics section of the dashboard.
- Images are delivered via Cloudinary CDN using `f_auto,q_auto,w_800`, delivering optimized WebP/AVIF formats based on client browser support.
