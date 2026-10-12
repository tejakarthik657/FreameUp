"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Sparkles,
  QrCode,
  Globe,
  ArrowRight,
  ShieldCheck,
  Zap,
  Laptop,
  Layers,
  FileSpreadsheet,
  FileText,
  Boxes,
  Truck,
  Users,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const [stats, setStats] = useState<{
    total_sites: number;
    total_businesses: number;
    total_users: number;
    total_images: number;
  } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    api.getGlobalStats().then(setStats).catch(() => {});
    api.getMe().then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0066cc] selection:text-white">
      
      {/* ── TIER 1: APPLE GLOBAL NAV BAR (44px, Pure Black #000000) ── */}
      <nav className="h-[44px] bg-[#000000] text-[#f5f5f7] sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 text-[12px] tracking-[-0.12px] border-b border-[#272729]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-white tracking-tight hover:opacity-85 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="Logo" className="w-5 h-5 rounded-full object-cover" />
              <span>FrameUp</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-[#a1a1a6]">
              <Link href="#solutions" className="hover:text-white transition-colors">
                Solutions
              </Link>
              <Link href="#wedges" className="hover:text-white transition-colors">
                AI Data Importer
              </Link>
              <Link href="#dpdp" className="hover:text-white transition-colors">
                DPDP DataTrust
              </Link>
              <Link href="#features" className="hover:text-white transition-colors">
                Capabilities
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={user ? "/dashboard" : "/login"}
              className="text-[#a1a1a6] hover:text-white transition-colors text-[12px]"
            >
              {user ? "Dashboard" : "Sign In"}
            </Link>
            <Link
              href={user ? "/create" : "/signup"}
              className="apple-btn-primary text-[12px] py-1 px-3.5 font-normal active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── TIER 2: SUB-NAV FROSTED BAR (52px, Frosted Parchment #f5f5f7) ── */}
      <div className="h-[52px] bg-[#f5f5f7]/85 backdrop-blur-md border-b border-[#e0e0e0] sticky top-[44px] z-40 px-4 sm:px-8 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[17px] sm:text-[21px] font-semibold text-[#1d1d1f] tracking-tight">
              Enterprise OS
            </span>
            <span className="text-[11px] font-mono font-medium text-[#7a7a7a] bg-white px-2.5 py-0.5 rounded-full border border-[#e0e0e0] ml-2">
              India 2026 Edition
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/ai-importer"
              className="text-[13px] text-[#0066cc] hover:underline font-normal hidden sm:inline"
            >
              Flatfile Alternative
            </Link>
            <Link
              href={user ? "/create" : "/signup"}
              className="apple-btn-primary text-[13px] py-1.5 px-4 font-normal"
            >
              Start Free
            </Link>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: HERO PRODUCT TILE (Edge-to-Edge Pure White #ffffff) ── */}
      <section className="bg-white border-b border-[#e0e0e0] py-20 sm:py-28 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-[#f5f5f7] border border-[#e0e0e0] px-3.5 py-1 rounded-full text-[12px] text-[#1d1d1f] font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse" />
            {stats ? `${stats.total_sites} Live Websites · ₹0 Mock Data` : "100% Real Production Engine"}
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-[1.05]">
            The complete operating system for modern business.
          </h1>

          <p className="text-lg sm:text-2xl text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed tracking-[-0.015em]">
            From GST billing to watermark-free competitor maps, embeddable data importing, and DPDP-compliant enterprise AI inference.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href={user ? "/dashboard" : "/signup"}
              className="apple-btn-primary text-[16px] py-3 px-7 font-normal"
            >
              Get Started Free
            </Link>
            <Link
              href="#wedges"
              className="apple-btn-secondary text-[16px] py-3 px-6 font-normal"
            >
              Explore AI Engines →
            </Link>
          </div>

          {/* Product Image Stage with Signature Apple Product Shadow */}
          <div className="pt-12 sm:pt-16 max-w-5xl mx-auto">
            <div
              className="rounded-2xl border border-[#e0e0e0] bg-[#fafafc] p-4 sm:p-8"
              style={{ boxShadow: "rgba(0, 0, 0, 0.22) 3px 5px 30px 0px" }}
            >
              <div className="bg-white border border-[#e0e0e0] rounded-xl overflow-hidden shadow-xs">
                {/* Window Header */}
                <div className="bg-[#f5f5f7] border-b border-[#e0e0e0] px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#86868b]">
                    frameup.in/dashboard/ai-agent
                  </span>
                  <div className="text-[11px] font-mono text-[#0066cc] font-semibold">
                    100% Real Live Engine
                  </div>
                </div>

                {/* Hero Showcase Grid */}
                <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="p-5 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0] space-y-2">
                    <div className="text-[11px] font-mono uppercase text-[#0066cc] font-bold">
                      KILLER WEDGE #1
                    </div>
                    <h3 className="font-semibold text-lg text-[#1d1d1f]">Embeddable Importer</h3>
                    <p className="text-xs text-[#86868b] leading-relaxed">
                      Auto-fix messy Indian CSVs, DD/MM/YYYY dates, and +91 phones with drop-in webhook dispatch.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0] space-y-2">
                    <div className="text-[11px] font-mono uppercase text-[#0066cc] font-bold">
                      KILLER WEDGE #2
                    </div>
                    <h3 className="font-semibold text-lg text-[#1d1d1f]">DPDP DataTrust Gateway</h3>
                    <p className="text-xs text-[#86868b] leading-relaxed">
                      Zero-leakage AI proxy with Verhoeff-verified Aadhaar, PAN masking, and verifiable SHA-256 certificates.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f5f5f7] border border-[#e0e0e0] space-y-2">
                    <div className="text-[11px] font-mono uppercase text-[#0066cc] font-bold">
                      CORE INTELLIGENCE
                    </div>
                    <h3 className="font-semibold text-lg text-[#1d1d1f]">Live Competitor Maps</h3>
                    <p className="text-xs text-[#86868b] leading-relaxed">
                      Watermark-free CARTO basemaps with real OSM POIs and live OSRM driving/walking directions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 2: DARK PRODUCT TILE (Near-Black #272729 Tile 1) ── */}
      <section id="wedges" className="bg-[#272729] text-white py-24 sm:py-32 px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-[12px] font-mono tracking-wider text-[#2997ff] uppercase font-bold">
              The Enterprise Moats
            </span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight text-white">
              Two high-margin SaaS wedges built for scale.
            </h2>
            <p className="text-[#a1a1a6] text-base sm:text-lg leading-relaxed">
              Replacing $2,000/mo legacy tools with drop-in components engineered specifically for Indian data formats and legal compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Wedge 1 Card */}
            <div className="bg-[#2a2a2c] rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#0066cc]/30 text-[#2997ff] text-xs font-mono font-semibold border border-[#2997ff]/30">
                  Wedge 1 · $99-$299/mo
                </span>
                <span className="text-xs text-[#a1a1a6] font-mono">Flatfile Alternative</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                DevFrames AI Data Importer
              </h3>
              <p className="text-sm text-[#a1a1a6] leading-relaxed">
                Almost every B2B SaaS crashes when customers drop messy CSVs with DD/MM/YYYY dates and missing +91 country codes. DevFrames Importer auto-maps columns, auto-cleans cells, and sends clean data straight to their PostgreSQL/MongoDB backend in 5 minutes.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/ai-importer"
                  className="apple-btn-primary text-[14px] py-2 px-5 font-normal inline-flex items-center gap-2"
                >
                  <span>Launch Importer Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Wedge 2 Card */}
            <div className="bg-[#2a2a2c] rounded-3xl p-8 sm:p-10 border border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold border border-emerald-500/30">
                  Wedge 2 · ₹15,000-₹50,000/mo
                </span>
                <span className="text-xs text-[#a1a1a6] font-mono">DPDP Act 2023 Gateway</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                DataTrust AI Sanitization Gateway
              </h3>
              <p className="text-sm text-[#a1a1a6] leading-relaxed">
                India's DPDP Act enforces penalties up to ₹250 Crore for leaking customer Aadhaar, PAN, or phone numbers to external AI models. DataTrust deterministically scrubs all PII, proxies prompts safely, and outputs a cryptographically verifiable SHA-256 compliance certificate.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard/dpdp-gateway"
                  className="apple-btn-primary text-[14px] py-2 px-5 font-normal inline-flex items-center gap-2"
                >
                  <span>Open DataTrust Gateway</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── SECTION 3: UTILITY GRID CARDS (Apple Store Grid #ffffff on #f5f5f7) ── */}
      <section id="features" className="py-24 sm:py-32 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-[#0066cc] uppercase tracking-wider font-bold">
            Built for Local Businesses
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            Everything tally cannot do.
          </h2>
          <p className="text-base sm:text-lg text-[#86868b]">
            Designed with high contrast, crisp typography, and touch-first responsiveness for owners on the go.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="apple-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc]">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">GST e-Invoicing & WhatsApp</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Generate GST-compliant tax invoices in seconds. Dispatch automated payment reminders directly over WhatsApp with instant UPI payment QR codes.
            </p>
          </div>

          <div className="apple-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc]">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Live Competitor Maps</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Explore nearby competitors with watermark-free CARTO tiles, live OpenStreetMap commercial POIs, and OSRM driving/walking navigation.
            </p>
          </div>

          <div className="apple-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc]">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Inventory & Low-Stock Alerts</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Track SKUs, cost prices, and current quantities in real time. Get automated WhatsApp alerts before critical inventory runs out.
            </p>
          </div>

          <div className="apple-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc]">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Staff Attendance & Daily Wages</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Manage shift check-ins, advance salary payments, and overtime calculations without clunky paper registers or spreadsheets.
            </p>
          </div>

          <div className="apple-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">AI Marketing Poster Studio</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Create high-converting social media posters and flyers in 1:1, 9:16, or A4 formats with zero Canva watermarks or manual design effort.
            </p>
          </div>

          <div className="apple-card space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-[#0066cc]">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f]">Digital Storefronts & QR Menus</h3>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Deploy lighting-fast Next.js digital storefronts with printable high-resolution QR codes for counter tables and storefront glass.
            </p>
          </div>

        </div>
      </section>

      {/* ── FOOTER: APPLE PARCHMENT FOOTER (#f5f5f7, design.md line 486) ── */}
      <footer className="bg-[#f5f5f7] border-t border-[#e0e0e0] py-16 px-6 text-[#7a7a7a]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[13px] leading-[2.41]">
            <div>
              <div className="font-semibold text-[#1d1d1f] text-[12px] uppercase tracking-wider mb-2">
                Products
              </div>
              <div><Link href="/create" className="hover:text-[#1d1d1f] transition-colors">Digital Storefronts</Link></div>
              <div><Link href="/dashboard/posters" className="hover:text-[#1d1d1f] transition-colors">Poster Generator</Link></div>
              <div><Link href="/dashboard/invoices" className="hover:text-[#1d1d1f] transition-colors">e-Invoicing</Link></div>
              <div><Link href="/dashboard/inventory" className="hover:text-[#1d1d1f] transition-colors">Inventory Tracker</Link></div>
            </div>

            <div>
              <div className="font-semibold text-[#1d1d1f] text-[12px] uppercase tracking-wider mb-2">
                Enterprise AI
              </div>
              <div><Link href="/dashboard/ai-importer" className="hover:text-[#1d1d1f] transition-colors">AI Data Importer</Link></div>
              <div><Link href="/dashboard/dpdp-gateway" className="hover:text-[#1d1d1f] transition-colors">DPDP DataTrust Gateway</Link></div>
              <div><Link href="/dashboard/ai-agent" className="hover:text-[#1d1d1f] transition-colors">Ask Map Intelligence</Link></div>
            </div>

            <div>
              <div className="font-semibold text-[#1d1d1f] text-[12px] uppercase tracking-wider mb-2">
                Operations
              </div>
              <div><Link href="/dashboard/staff" className="hover:text-[#1d1d1f] transition-colors">Staff Attendance</Link></div>
              <div><Link href="/dashboard/suppliers" className="hover:text-[#1d1d1f] transition-colors">B2B Suppliers</Link></div>
              <div><Link href="/dashboard/localization" className="hover:text-[#1d1d1f] transition-colors">Indian Languages</Link></div>
              <div><Link href="/dashboard/loyalty" className="hover:text-[#1d1d1f] transition-colors">Loyalty Rewards</Link></div>
            </div>

            <div>
              <div className="font-semibold text-[#1d1d1f] text-[12px] uppercase tracking-wider mb-2">
                Legal & Trust
              </div>
              <div><span className="text-[#1d1d1f]">DPDP Act 2023 Compliant</span></div>
              <div><span>Section 8 Certified</span></div>
              <div><span>SHA-256 Audit Records</span></div>
              <div><span>Zero Data Retention</span></div>
            </div>
          </div>

          <div className="border-t border-[#e0e0e0] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7a7a7a]">
            <div>
              Copyright © 2026 FrameUp Technologies Pvt Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>·</span>
              <span>Terms of Service</span>
              <span>·</span>
              <span>Security</span>
            </div>
          </div>

        </div>
      </footer>

    </main>
  );
}
