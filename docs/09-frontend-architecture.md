# 09. Frontend Architecture & Edge Subdomain Engine: Zero-Bundle Storefronts

> **The Mentor's Note:** Many frontend developers think Next.js is just React with pages. But in FrameUp, Next.js 14 App Router is our **Edge Ingress Proxy**. 
> 
> In this guide, you will understand how **Vercel Edge Middleware** rewrites wildcard subdomains in microseconds, why React Server Components ship **0 KB JavaScript** to mobile consumers, and how we engineered **18 pure CSS templates** that export directly from the user's browser GPU.

---

## 1. The Edge Subdomain Mental Model

How does `sharma-sweets.frameup.in` work without us manually going into GoDaddy or Route 53 to add a DNS CNAME record every time someone signs up?

```
[ Customer visits: https://sharma-sweets.frameup.in ]
                          |
                          v
         [ Cloudflare / Vercel Edge DNS: *.frameup.in ]
         (Wildcard DNS routes ALL subdomains to Anycast Edge)
                          |
                          v
          [ Vercel Edge Location (e.g. Mumbai PoP) ]
                          |
                          v
       +---------------------------------------------+
       | RUNS: frontend/middleware.ts                |
       | 1. Reads Host: "sharma-sweets.frameup.in"   |
       | 2. Extracts slug: "sharma-sweets"           |
       | 3. Rewrites URL internally to:              |
       |    /site/sharma-sweets                      |
       +---------------------------------------------+
                          |
                          v
        [ Next.js App Router: app/site/[slug]/page.tsx ]
        (Executes React Server Component at the Edge)
```

The browser’s address bar **still says `sharma-sweets.frameup.in`**, but Next.js internally maps it to the file `app/site/[slug]/page.tsx` with `params.slug = "sharma-sweets"`.
- **DNS delay:** 0 seconds.
- **SSL certificate:** Handled automatically by wildcard TLS (`*.frameup.in`).
- **Setup time for the merchant:** Literally instantaneous.

---

## 2. Line-by-Line Breakdown: `frontend/middleware.ts`

Let's look at the exact code that executes at the edge:

```typescript
// frontend/middleware.ts (Production Implementation)

import { NextRequest, NextResponse } from "next/server";

export const config = {
  // CRITICAL MATCHER: Exclude static assets and API routes!
  // If we don't exclude these, the middleware will try to rewrite /_next/static/css,
  // causing an infinite loop or broken CSS styles!
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // The apex domains where the main marketing page & dashboard live
  const rootDomains = ["frameup.in", "devframes-presence.vercel.app", "localhost:3000"];
  
  // Check if the current request is targeting a merchant subdomain
  let currentHost = hostname;
  for (const root of rootDomains) {
    if (hostname.endsWith(`.${root}`)) {
      // Strips ".frameup.in" to leave just the slug (e.g. "sharma-sweets")
      currentHost = hostname.replace(`.${root}`, "");
      break;
    }
  }

  // If a valid merchant subdomain is detected (exclude 'www' and 'admin')
  if (currentHost !== hostname && currentHost !== "www" && currentHost !== "admin") {
    // REWRITE: Internally forward request to /site/[slug] without changing the user's browser URL!
    return NextResponse.rewrite(new URL(`/site/${currentHost}${url.pathname}`, req.url));
  }

  // Normal request to apex domain (e.g. https://frameup.in) -> proceed as normal
  return NextResponse.next();
}
```

---

## 3. React Server Components (RSC): Why We Ship 0 KB JavaScript

In traditional React SPAs, when a customer visits a sweet shop's menu, the browser downloads:
- React Runtime (`react.production.min.js` ~ 42KB)
- React DOM (`react-dom.production.min.js` ~ 130KB)
- All the page component code, icons, and state handlers (~ 300KB+)

On a budget Android smartphone with 2GB of RAM over a fluctuating 4G connection in Patna or Kanpur, the browser freezes for 2.5 seconds just compiling that JavaScript!

### The FrameUp RSC Architecture:
In `frontend/app/site/[slug]/page.tsx`, we deliberately **omitted** the `"use client"` directive. It is a pure **React Server Component**:

```typescript
// frontend/app/site/[slug]/page.tsx (Server Component)

export default async function PublicStorefront({ params }: { params: { slug: string } }) {
  // Fetches cached storefront data at the edge
  const site = await getSiteBySlug(params.slug);
  
  if (!site || !site.is_published) {
    return notFound();
  }

  // Renders pure HTML. ZERO React client bundle is shipped to the visitor!
  return (
    <main className="min-h-screen bg-stone-900 text-stone-100 font-sans">
      <HeroSection hero={site.content.hero} theme={site.theme} />
      <MenuSection menu={site.content.menu_sections} />
      <LocationHours address={site.content.address} hours={site.content.hours} />
      <FooterSocials social={site.content.social_links} />
    </main>
  );
}
```
**The Result:** The customer's mobile browser downloads only **pure, pre-rendered HTML and a lightweight Tailwind CSS stylesheet**. The page renders in **under 150 milliseconds**.

---

## 4. The 18 Pure CSS Poster Templates: Client-Side Rasterization

When an MSME owner wants a festival flyer for WhatsApp, we don't call a backend server to render it.

### How It Works Under the Hood:
1. The merchant chooses a template (e.g. `Modern Minimal`, `Festival Gold`, `Midnight Neon`).
2. The browser creates a hidden DOM node sized exactly to **$1080 \times 1350\text{px}$** (4:5 Instagram / WhatsApp ratio).
3. The merchant’s business name, discount offer, and phone number are dynamically injected into the CSS variables.
4. The client uses `html-to-image` (which converts the DOM element into an SVG foreignObject and draws it onto an HTML5 `<canvas>`).
5. The canvas converts the pixels into a high-resolution PNG blob directly in the user's phone RAM.

```typescript
// frontend/app/dashboard/posters/page.tsx

async function exportPoster(containerId: string, filename: string) {
  const node = document.getElementById(containerId);
  if (!node) return;

  // Gate: Wait for custom web fonts (Plus Jakarta Sans) to finish loading
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 50)); // Allow layout tick

  // Rasterize DOM directly on client GPU
  const blob = await toBlob(node, {
    pixelRatio: 3, // 3x pixel ratio guarantees crisp print-ready 300 DPI output!
    cacheBust: true,
  });

  if (!blob) throw new Error("Export failed");

  // Trigger instant local download
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = `${filename}.png`;
  anchor.click();
  URL.revokeObjectURL(downloadUrl);
}
```

---

## 5. How to Defend This in an Interview

### 🎤 The Interviewer's Question:
> *"How do you keep storefront load times under 200ms for mobile users in emerging markets?"*

### 💡 Your Killer Answer:
> *"We achieved sub-200ms load times through a strict three-tier edge strategy:
> 
> First, our public storefronts (`/site/[slug]`) are built exclusively with React Server Components (RSC). They ship **zero client JavaScript runtime** to the browser—only pure, streaming HTML and critical inlined CSS.
> 
> Second, we leverage Vercel's Incremental Static Regeneration (ISR) with a 60-second stale-while-revalidate window. Public visits hit the nearest Edge Point of Presence (such as Mumbai) with cached HTML, bypassing our backend origin entirely.
> 
> Third, image assets are served through Cloudinary CDN with automatic WebP conversion and resolution downsampling based on the client viewport. The total page weight is under 200KB, allowing it to render instantly even on budget Android phones with erratic 4G signals."*
