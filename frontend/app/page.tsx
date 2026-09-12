"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Sparkles, QrCode, Globe, ArrowUpRight, Check, Shield, Zap, Laptop, RefreshCw } from "lucide-react";

// Sector descriptions and metadata mapped to Clay's pastel card themes
const SECTORS = [
  {
    key: "restaurant",
    label: "Restaurant & Cafe",
    tag: "MENU + ORDERS",
    cardBg: "bg-[#e8b94a]", // Brand Ochre
    textColor: "text-[#0a0a0a]",
    tagBg: "bg-[#fffaf0]/80 text-[#0a0a0a]",
    desc: "Complete menus grouped by category, dietary indicators, reservation controls, custom order buttons, and image uploads.",
  },
  {
    key: "salon",
    label: "Salon & Spa",
    tag: "SERVICES + BOOKING",
    cardBg: "bg-[#ff4d8b]", // Brand Pink
    textColor: "text-white",
    tagBg: "bg-white/20 text-white",
    desc: "Detailed treatment options with pricing, durations, stylist bio showcases, custom booking page links, and policy details.",
  },
  {
    key: "local_services",
    label: "Local Services",
    tag: "LEADS + TRUST",
    cardBg: "bg-[#ffb084]", // Brand Peach
    textColor: "text-[#0a0a0a]",
    tagBg: "bg-[#fffaf0]/80 text-[#0a0a0a]",
    desc: "Service area lists, emergency service indicators, trust certification badges, warranties, and quick quote forms.",
  },
  {
    key: "others",
    label: "Custom Business",
    tag: "FULLY ADAPTABLE",
    cardBg: "bg-[#b8a4ed]", // Brand Lavender
    textColor: "text-[#0a0a0a]",
    tagBg: "bg-[#fffaf0]/80 text-[#0a0a0a]",
    desc: "Flexible structure for gymnasiums, medical clinics, boutique stores, or educational institutes. Fully tailored layout.",
  },
];

const FEATURES = [
  { icon: Zap, title: "Deploy in 5 minutes", desc: "No complex configuration or deployments. Walk through six guided steps and your site is live immediately.", color: "bg-[#ff4d8b] text-white" },
  { icon: Sparkles, title: "AI-Powered Enhancements", desc: "Instantly enhance tags, taglines, about pages, and menus with professional copies via integrated AI autofills.", color: "bg-[#b8a4ed] text-[#0a0a0a]" },
  { icon: Laptop, title: "Fully Responsive Layouts", desc: "Sleek, fluid layouts that render correctly on standard mobile, tablet, and desktop monitors.", color: "bg-[#ffb084] text-[#0a0a0a]" },
  { icon: QrCode, title: "Printable QR Codes", desc: "Every generated site comes with a high-definition sharing QR code for print menus or physical brochures.", color: "bg-[#e8b94a] text-[#0a0a0a]" },
  { icon: RefreshCw, title: "Instant Style Customizer", desc: "Change color schemes, swap fonts, and rewrite copy directly from the design preview dashboard in real time.", color: "bg-[#a4d4c5] text-[#0a0a0a]" },
  { icon: Shield, title: "Static Serverless Hosting", desc: "Publish clean static HTML builds. Serve visitors instantly at minimal cost with zero database overhead.", color: "bg-[#1a3a3a] text-white" },
  { icon: Sparkles, title: "AI Poster Creator", desc: "Instantly create high-converting marketing posters. Match designs automatically, overlay custom brand assets, and download in print-ready formats.", color: "bg-[#ff4d8b] text-white" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState<{ total_sites: number; total_businesses: number; total_users: number; total_images: number } | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Load dynamic real-time stats
    api.getGlobalStats().then(setStats).catch(() => {});

    // Check if user is authenticated
    api.getMe().then(setUser).catch(() => setUser(null));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#fffaf0] text-[#0a0a0a] font-sans antialiased selection:bg-[#ff4d8b] selection:text-white">
      
      {/* CLAY HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#fffaf0]/90 backdrop-blur-md border-b border-[#e5e5e5] py-4 shadow-sm"
            : "bg-transparent py-6 md:py-8"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Brand Logo"
              className={`rounded-full object-cover shadow-sm border border-[#e5e5e5] transition-all duration-200 ${
                scrolled ? "w-9 h-9" : "w-11 h-11"
              }`}
            />
            <span className="font-bold text-lg tracking-tight text-[#0a0a0a] font-sans">
              FrameUp
            </span>
          </div>
          
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/login" className="text-xs sm:text-sm font-medium text-[#3a3a3a] hover:text-[#0a0a0a] transition-colors">
              Log in
            </Link>
            <Link href={user ? "/create" : "/signup"} className="px-5 py-2.5 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* CLAY HERO SECTION */}
      <section className="relative px-6 pt-36 sm:pt-44 pb-24 lg:pb-32 bg-[#fffaf0] text-[#0a0a0a] flex items-center justify-center border-b border-[#e5e5e5]">
        
        <div className="max-w-6xl mx-auto relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Metrics */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 bg-[#faf5e8] border border-[#e5e5e5] px-4 py-1.5 rounded-full text-xs font-semibold text-[#0a0a0a] mb-8 shadow-xs select-none">
              <span className="w-2 h-2 rounded-full bg-[#ff4d8b] animate-pulse" />
              {stats ? `${stats.total_sites} Websites Live Now` : "Live & Operational"}
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0a0a0a] mb-6 leading-[1.05] font-sans">
              Your business online.<br />
              <span className="text-[#ff4d8b]">In minutes.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-[#3a3a3a] max-w-2xl mb-10 leading-relaxed px-2 lg:px-0">
              FrameUp generates fully functional, beautifully styled, and responsive websites for restaurants, salons, and local services instantly. No coding required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full max-w-xs sm:max-w-none">
              <Link href={user ? "/create" : "/signup"} className="w-full sm:w-auto text-center px-7 py-3.5 text-sm font-semibold rounded-xl bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white shadow-md transition-all">
                Create my website
              </Link>
              <Link href="/login" className="w-full sm:w-auto text-center px-7 py-3.5 text-sm font-semibold rounded-xl bg-[#faf5e8] hover:bg-[#f5f0e0] border border-[#e5e5e5] text-[#0a0a0a] transition-all">
                Dashboard
              </Link>
            </div>

            {/* Real-time stats */}
            {stats && (
              <div className="mt-14 pt-8 border-t border-[#e5e5e5] flex flex-wrap justify-center lg:justify-start items-center gap-8 sm:gap-12 text-[#6a6a6a] text-xs font-semibold uppercase tracking-wider w-full">
                <div>
                  <span className="text-[#0a0a0a] text-xl font-bold block">{stats.total_sites}</span> Live Sites
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#ffb084] hidden sm:block" />
                <div>
                  <span className="text-[#0a0a0a] text-xl font-bold block">{stats.total_businesses}</span> Businesses
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-[#b8a4ed] hidden sm:block" />
                <div>
                  <span className="text-[#0a0a0a] text-xl font-bold block">{stats.total_images}</span> Design Assets
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Clay Product Tactile Mockup */}
          <div className="lg:col-span-5 hidden lg:block relative h-[460px]">
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Layer 1: Style Settings Card (Lavender Accent) */}
              <div className="absolute top-4 left-4 w-[280px] bg-[#b8a4ed] text-[#0a0a0a] rounded-3xl p-6 shadow-xl animate-float-1 select-none">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/30 px-2.5 py-0.5 rounded-full">Style Tokens</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff4d8b]" />
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-semibold block mb-2 opacity-80 uppercase">Pastel Palette</span>
                    <div className="flex gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#ff4d8b] border border-white/40 shadow-xs" />
                      <span className="w-6 h-6 rounded-full bg-[#e8b94a] border border-white/40 shadow-xs" />
                      <span className="w-6 h-6 rounded-full bg-[#ffb084] border border-white/40 shadow-xs" />
                      <span className="w-6 h-6 rounded-full bg-[#1a3a3a] border border-white/40 shadow-xs" />
                    </div>
                  </div>
                  <div className="bg-white/40 backdrop-blur-xs rounded-xl p-3 text-xs font-medium">
                    <span>Playfair + Inter Pairing</span>
                  </div>
                </div>
              </div>

              {/* Layer 2: Mobile Live Mockup (Peach Accent) */}
              <div className="absolute top-20 right-2 w-[220px] bg-[#ffb084] text-[#0a0a0a] rounded-3xl p-5 shadow-2xl animate-float-2 select-none">
                <div className="w-12 h-1 bg-black/20 rounded-full mx-auto mb-4" />
                <div className="text-center space-y-3">
                  <div className="w-10 h-10 bg-white rounded-full mx-auto flex items-center justify-center font-bold text-sm shadow-xs">
                    ☕
                  </div>
                  <h4 className="font-bold text-base leading-tight">LaRana Bistro</h4>
                  <p className="text-[11px] opacity-80 leading-snug">Artisanal Bakery & Specialty Coffee</p>
                  <div className="bg-[#0a0a0a] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
                    View Menu
                  </div>
                </div>
              </div>

              {/* Layer 3: QR Sharing Card (Ochre Accent) */}
              <div className="absolute bottom-6 left-10 bg-[#e8b94a] text-[#0a0a0a] rounded-2xl p-4 shadow-xl animate-float-3 flex items-center gap-3 select-none">
                <div className="bg-white p-2 rounded-xl shadow-xs shrink-0">
                  <QrCode className="w-7 h-7 text-[#0a0a0a]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">QR Link</span>
                  <span className="text-xs font-bold block">Instantly Shared</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* CLAY LIVE STATS SHOWCASE BANNER */}
      {stats && (
        <section className="bg-[#1a3a3a] text-white py-14 px-6 border-b border-[#0a0a0a]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="text-xs font-bold text-[#a4d4c5] uppercase tracking-widest block mb-2">Dynamic Platform Growth</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Powering small businesses worldwide.</h2>
              <p className="text-sm text-white/70 mt-2 max-w-md leading-relaxed">Lightning-fast, highly optimized static website builds served instantly at zero server cost.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-8 sm:gap-14 w-full md:w-auto pt-6 md:pt-0 border-t border-white/10 md:border-t-0">
              <div className="text-center md:text-left min-w-[100px]">
                <span className="text-4xl md:text-5xl font-black text-[#ffb084] tracking-tight block">{stats.total_sites}</span>
                <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">Live Sites</span>
              </div>
              <div className="text-center md:text-left min-w-[100px]">
                <span className="text-4xl md:text-5xl font-black text-[#b8a4ed] tracking-tight block">{stats.total_businesses}</span>
                <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">Businesses</span>
              </div>
              <div className="text-center md:text-left min-w-[100px]">
                <span className="text-4xl md:text-5xl font-black text-[#e8b94a] tracking-tight block">{stats.total_images}</span>
                <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">Assets</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CLAY 4-STEP PIPELINE SECTION */}
      <section className="bg-[#faf5e8] border-b border-[#e5e5e5] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-xs font-bold text-[#ff4d8b] uppercase tracking-widest block mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight">
              How FrameUp turns your ideas into reality.
            </h2>
            <p className="text-sm text-[#6a6a6a] mt-3 max-w-md mx-auto">
              Follow our simple, guided steps to generate websites and design marketing assets instantly.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-[#fffaf0] border border-[#e5e5e5] rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#ff4d8b] text-white flex items-center justify-center font-bold text-base mb-5 shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-[#0a0a0a] mb-2">Enter Details</h3>
              <p className="text-xs text-[#3a3a3a] leading-relaxed">
                Provide your business name, segment, hours, services, and optionally upload your logo & featured photos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-[#fffaf0] border border-[#e5e5e5] rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#b8a4ed] text-[#0a0a0a] flex items-center justify-center font-bold text-base mb-5 shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-[#0a0a0a] mb-2">AI Copywriting</h3>
              <p className="text-xs text-[#3a3a3a] leading-relaxed">
                Our built-in AI automatically refines your taglines, descriptions, offerings, and slogans to be punchy and high-converting.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-[#fffaf0] border border-[#e5e5e5] rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#ffb084] text-[#0a0a0a] flex items-center justify-center font-bold text-base mb-5 shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-[#0a0a0a] mb-2">Pick Layouts</h3>
              <p className="text-xs text-[#3a3a3a] leading-relaxed">
                Browse layouts suited for your sector. Swap fonts, colors, and content in real-time with the instant customizer.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center p-6 bg-[#fffaf0] border border-[#e5e5e5] rounded-3xl shadow-sm">
              <div className="w-12 h-12 rounded-full bg-[#e8b94a] text-[#0a0a0a] flex items-center justify-center font-bold text-base mb-5 shadow-xs">
                4
              </div>
              <h3 className="text-base font-bold text-[#0a0a0a] mb-2">Go Live & Share</h3>
              <p className="text-xs text-[#3a3a3a] leading-relaxed">
                Publish a lightning-fast static webpage and download matching high-quality promotional posters with printable QR codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLAY SATURATED SECTOR SHOWCASE */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="mb-14 text-center lg:text-left">
          <span className="text-xs font-bold text-[#6a6a6a] uppercase tracking-widest block mb-2">
            Tailored Industry Solutions
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight">
            Sector-aware designs built around your layout needs.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s) => (
            <div key={s.key} className={`${s.cardBg} ${s.textColor} p-8 rounded-3xl shadow-md flex flex-col justify-between transition-all hover:-translate-y-1`}>
              <div>
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6 ${s.tagBg}`}>
                  {s.tag}
                </span>
                <h3 className="text-xl font-bold mb-3">{s.label}</h3>
                <p className="text-xs leading-relaxed opacity-90 mb-8">{s.desc}</p>
              </div>
              <Link href={user ? "/create" : "/signup"} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:opacity-80">
                Build this format <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CLAY CORE FEATURES GRID */}
      <section className="bg-[#faf5e8] border-y border-[#e5e5e5] px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-xs font-bold text-[#6a6a6a] uppercase tracking-widest block mb-2">
              Everything Included
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0a0a0a] tracking-tight">
              Powerful tools to launch and customize your site.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-[#fffaf0] border border-[#e5e5e5] p-6 rounded-3xl flex gap-4 items-start shadow-xs">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${f.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0a0a0a] mb-1">{f.title}</h3>
                    <p className="text-xs text-[#6a6a6a] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLAY AGENCY PROMOTION SECTION */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="bg-[#f5f0e0] border border-[#e5e5e5] rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="DevFrame Logo" className="w-12 h-12 rounded-full object-cover shadow-sm border border-white" />
              <div>
                <span className="text-xs font-bold text-[#ff4d8b] uppercase tracking-wider">
                  Partner Agency
                </span>
                <h3 className="text-lg font-bold text-[#0a0a0a] leading-tight">
                  DevFrame Digital Solutions
                </h3>
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#3a3a3a] leading-relaxed">
              We are pleased to introduce <strong>DevFrame</strong>, a digital agency focused on building modern websites, custom software, AI-powered solutions, and digital experiences for businesses and startups. 
              We&apos;re currently expanding our online presence and would greatly appreciate your support by following our official social media pages.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              <a
                href="https://www.instagram.com/devframe.26/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-xs font-semibold text-[#0a0a0a] bg-[#fffaf0] hover:bg-[#faf5e8] transition-all"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-4 h-4 text-[#6a6a6a]" />
              </a>
              <a
                href="https://www.threads.com/@devframe.26"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-xs font-semibold text-[#0a0a0a] bg-[#fffaf0] hover:bg-[#faf5e8] transition-all"
              >
                <span>Threads</span>
                <ArrowUpRight className="w-4 h-4 text-[#6a6a6a]" />
              </a>
              <a
                href="https://www.linkedin.com/in/devframes-undefined-02712841a/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-xs font-semibold text-[#0a0a0a] bg-[#fffaf0] hover:bg-[#faf5e8] transition-all"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-4 h-4 text-[#6a6a6a]" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591401721246"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2.5 border border-[#e5e5e5] rounded-xl text-xs font-semibold text-[#0a0a0a] bg-[#fffaf0] hover:bg-[#faf5e8] transition-all"
              >
                <span>Facebook</span>
                <ArrowUpRight className="w-4 h-4 text-[#6a6a6a]" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CLAY CREAM FOOTER */}
      <footer className="border-t border-[#e5e5e5] py-12 px-6 bg-[#faf5e8] text-xs text-[#6a6a6a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Brand Logo"
              className="w-7 h-7 rounded-full object-cover shadow-xs border border-[#e5e5e5]"
            />
            <span className="font-bold text-sm text-[#0a0a0a]">
              FrameUp
            </span>
          </div>
          <span>&copy; {new Date().getFullYear()} FrameUp. All rights reserved.</span>
        </div>
      </footer>

    </main>
  );
}
