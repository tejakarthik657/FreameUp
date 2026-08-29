"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Sparkles, QrCode, Globe, ArrowUpRight, Check, Shield, Zap, Laptop, RefreshCw } from "lucide-react";

// Sector descriptions and metadata
const SECTORS = [
  {
    key: "restaurant",
    label: "Restaurant / Cafe",
    tag: "Menu & Order CTA",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    desc: "Complete menus grouped by category, dietary indications, reservation controls, custom order buttons, and image uploads.",
  },
  {
    key: "salon",
    label: "Salon & Spa",
    tag: "Services & Booking",
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    desc: "Detailed treatment options with pricing, durations, stylist bio showcases, custom booking page links, and policy details.",
  },
  {
    key: "local_services",
    label: "Local Services",
    tag: "Leads & Credentials",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    desc: "Service area lists, emergency service indicators, trust certification badges, warranties, and quick quote forms.",
  },
  {
    key: "others",
    label: "Others / Custom",
    tag: "Fully Adaptable",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    desc: "Flexible structure for gymnasiums, medical clinics, boutique stores, or educational institutes. Fully tailored layout.",
  },
];

const FEATURES = [
  { icon: Zap, title: "Deploy in 5 minutes", desc: "No complex configuration or deployments. Walk through six guided steps and your site is live immediately." },
  { icon: Sparkles, title: "AI-Powered Enhancements", desc: "Instantly enhance tags, taglines, about pages, and menus with professional copies via integrated AI autofills." },
  { icon: Laptop, title: "Fully Responsive Layouts", desc: "Sleek, fluid layouts that render correctly on standard mobile, tablet, and desktop monitors." },
  { icon: QrCode, title: "Printable QR Codes", desc: "Every generated site comes with a high-definition sharing QR code for print menus or physical brochures." },
  { icon: RefreshCw, title: "Instant Style Customizer", desc: "Change color schemes, swap fonts, and rewrite copy directly from the design preview dashboard in real time." },
  { icon: Shield, title: "Static Serverless Hosting", desc: "Publish clean static HTML builds. Serve visitors instantly at minimal cost with zero database overhead." },
  { icon: Sparkles, title: "AI Poster Creator", desc: "Instantly create high-converting marketing posters. Match designs automatically, overlay custom brand assets, and download in print-ready formats." },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState<{ total_sites: number; total_businesses: number; total_images: number } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    
    // Load dynamic real-time stats
    api.getGlobalStats().then(setStats).catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans antialiased">
      
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-slate-200/80 py-4 shadow-sm"
            : "bg-transparent border-slate-200/50 py-6 md:py-8"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Brand Logo"
              className={`rounded-full object-cover shadow-sm border border-slate-200 hover:scale-105 transition-all duration-200 ${
                scrolled ? "w-9 h-9" : "w-11 h-11 md:w-12 md:h-12"
              }`}
            />
            <span className={`font-mono font-black uppercase tracking-[0.15em] text-slate-900 transition-all duration-200 ${
              scrolled ? "text-sm min-[380px]:text-base" : "text-sm min-[380px]:text-lg md:text-xl"
            } hidden min-[380px]:inline`}>
              FrameUp
            </span>
          </div>
          
          <nav className="flex items-center gap-3 sm:gap-8">
            <Link href="/login" className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="btn-landing-primary !py-2 !px-4 sm:!py-3 sm:!px-6 text-[10px] sm:text-xs font-bold rounded-lg !bg-slate-900 hover:!bg-slate-800 !text-white shadow-md">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION WITH DYNAMIC GRID & AURORA GLOW (LIGHT THEME) */}
      <section className="relative px-6 py-28 sm:py-36 lg:py-48 overflow-hidden bg-slate-50 text-slate-900 flex items-center justify-center min-h-[90vh] border-b border-slate-200/80">
        {/* Grid drafting canvas background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 z-0" />
        
        {/* Moving glowing spotlights (aurora effects) */}
        <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-indigo-200/20 blur-[100px] animate-pulse pointer-events-none z-0" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full bg-emerald-200/20 blur-[80px] animate-pulse pointer-events-none z-0" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 right-10 w-[25rem] h-[25rem] rounded-full bg-amber-200/10 blur-[90px] animate-pulse pointer-events-none z-0" style={{ animationDelay: "4s" }} />

        <div className="max-w-6xl mx-auto relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Metrics */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start w-full">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-3.5 py-1 rounded-full text-[10px] font-semibold text-emerald-700 tracking-wider uppercase mb-8 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)] animate-pulse" />
              Live & Operational
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-semibold tracking-tight text-slate-900 mb-6 leading-[1.1] sm:leading-[1.05] font-serif">
              Your business online.<br />
              <span className="text-indigo-600">In minutes.</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed px-4 lg:px-0">
              FrameUp generates fully functional, beautifully styled, and responsive websites for restaurants, salons, and local services instantly. No domains, hosting, or coding required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none">
              <Link href="/create" className="btn-landing-primary w-full sm:w-auto text-center px-6 py-3.5 text-xs font-semibold rounded-md shadow-lg !bg-indigo-600 hover:!bg-indigo-500 text-white">
                Create my website
              </Link>
              <Link href="/login" className="btn-landing-outline w-full sm:w-auto text-center px-6 py-3.5 text-xs font-semibold rounded-md !bg-white !border-slate-200 hover:!bg-slate-50 hover:!border-slate-300 !text-slate-700 transition-all shadow-sm">
                Dashboard
              </Link>
            </div>

            {/* Real-time stats */}
            {stats && (
              <div className="mt-16 pt-8 border-t border-slate-200 flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-12 text-slate-500 font-mono text-[10px] tracking-wider uppercase animate-fade-up w-full">
                <div>
                  <span className="text-slate-900 text-base sm:text-lg font-bold block">{stats.total_sites}</span> Websites
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                <div>
                  <span className="text-slate-900 text-base sm:text-lg font-bold block">{stats.total_businesses}</span> Businesses
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 hidden sm:block" />
                <div>
                  <span className="text-slate-900 text-base sm:text-lg font-bold block">{stats.total_images}</span> Assets
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Workspace Mockup */}
          <div className="lg:col-span-5 hidden lg:block relative h-[450px]">
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Layer 1: The Design Customizer (Behind, floats slow) */}
              <div className="absolute top-4 left-6 w-[270px] bg-white border border-slate-200 rounded-xl p-5 shadow-xl animate-float-1 select-none text-slate-800">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-[10px] font-mono font-bold text-slate-400 ml-2 uppercase tracking-wider">Style Settings</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block mb-2 uppercase">Color Palette</span>
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-600 border border-slate-200 shadow-sm" />
                      <span className="w-5 h-5 rounded-full bg-indigo-600 border border-slate-200 shadow-sm animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="w-5 h-5 rounded-full bg-amber-600 border border-slate-200 shadow-sm" />
                      <span className="w-5 h-5 rounded-full bg-rose-600 border border-slate-200 shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-400 block mb-2 uppercase">Typography Pairing</span>
                    <div className="bg-slate-50 border border-slate-200/80 rounded px-2.5 py-1.5 text-[10px] font-sans text-slate-600 flex justify-between items-center">
                      <span>Playfair + Inter</span>
                      <span className="text-[8px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layer 2: Mobile Live Template Mockup (Center, floats fast) */}
              <div className="absolute top-20 right-4 w-[210px] bg-stone-50 border border-stone-200 rounded-3xl p-4 shadow-2xl animate-float-2 select-none text-stone-800">
                <div className="w-12 h-1 bg-stone-300 rounded-full mx-auto mb-4" />
                <div className="text-center space-y-3">
                  <span className="text-[8px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                    Live Site
                  </span>
                  <h3 className="font-serif text-sm font-extrabold tracking-tight text-stone-900 leading-none">
                    The Bistro Cafe
                  </h3>
                  <p className="text-[8.5px] text-stone-500 font-light leading-relaxed">
                    Warm coffee, fresh pastries, and community vibes.
                  </p>
                  <div className="h-20 bg-stone-100 rounded-lg relative overflow-hidden flex items-center justify-center border border-stone-200/50">
                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest font-bold">Pastry Grid</span>
                  </div>
                  <button className="w-full bg-[#25D366] text-white font-bold py-1.5 rounded-md text-[9px] shadow-sm flex items-center justify-center gap-1.5 hover:scale-105 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    Chat on WhatsApp
                  </button>
                </div>
              </div>

              {/* Layer 3: Stat/QR Badge (Bottom Left overlay, floats mid) */}
              <div className="absolute bottom-6 left-12 bg-white border border-slate-200 rounded-lg p-3 shadow-xl animate-float-3 flex items-center gap-3 select-none text-slate-800">
                <div className="bg-slate-50 p-1 rounded border border-slate-200 shadow-sm shrink-0">
                  <svg width="32" height="32" viewBox="0 0 32 32" className="text-slate-900">
                    <rect x="0" y="0" width="8" height="8" fill="currentColor" stroke="none" />
                    <rect x="0" y="24" width="8" height="8" fill="currentColor" stroke="none" />
                    <rect x="24" y="0" width="8" height="8" fill="currentColor" stroke="none" />
                    <rect x="12" y="12" width="8" height="8" fill="currentColor" stroke="none" />
                    <rect x="24" y="24" width="4" height="4" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div>
                  <span className="text-[8px] font-mono font-bold text-indigo-600 uppercase tracking-wider block">QR Link</span>
                  <span className="text-[10px] font-bold text-slate-900 block">Instantly Shared</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7.5px] font-mono text-slate-500 uppercase font-semibold">100% Static</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* SECTOR LIST */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="mb-12 text-center lg:text-left">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono block mb-2">
            Tailored Industry Solutions
          </span>
          <h2 className="text-2xl md:text-4xl font-semibold text-[var(--text-primary)] tracking-tight font-serif">
            Sector-aware designs built around your layout needs.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s) => (
            <div key={s.key} className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-xl shadow-xs flex flex-col justify-between hover:border-[var(--text-muted)] transition-all duration-200">
              <div>
                <span className={`inline-block text-[9px] font-mono font-bold uppercase border px-2.5 py-0.5 rounded mb-4 ${s.color}`}>
                  {s.tag}
                </span>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">{s.label}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-6">{s.desc}</p>
              </div>
              <Link href="/create" className="text-[10px] font-bold font-mono uppercase text-[var(--accent)] hover:underline flex items-center gap-1.5">
                Build this format <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="bg-[var(--surface)] border-y border-[var(--border)] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono block mb-2">
              Everything Included
            </span>
            <h2 className="text-2xl md:text-4xl font-semibold text-[var(--text-primary)] tracking-tight font-serif">
              Powerful tools to launch and customize your site.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[var(--accent)] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{f.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEVFRAME PROMOTION AGENCY SECTION */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-100/30 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="DevFrame Logo" className="w-10 h-10 rounded-full object-cover shadow-sm border border-white" />
              <div>
                <span className="text-[9px] font-mono font-bold text-[var(--accent)] uppercase tracking-wider">
                  Partner Agency
                </span>
                <h3 className="text-base font-semibold text-[var(--text-primary)] leading-tight">
                  DevFrame Digital Solutions
                </h3>
              </div>
            </div>

            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">
              We are pleased to introduce <strong>DevFrame</strong>, a digital agency focused on building modern websites, custom software, AI-powered solutions, and digital experiences for businesses and startups. 
              We&apos;re currently expanding our online presence and would greatly appreciate your support by following our official social media pages. Your support helps us reach more businesses and continue building impactful digital solutions.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <a
                href="https://www.instagram.com/devframe.26/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--surface-high)] hover:border-gray-300 transition-all shadow-2xs animate-fade-up"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </a>
              <a
                href="https://www.threads.com/@devframe.26"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--surface-high)] hover:border-gray-300 transition-all shadow-2xs animate-fade-up"
              >
                <span>Threads</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </a>
              <a
                href="https://www.linkedin.com/in/devframes-undefined-02712841a/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--surface-high)] hover:border-gray-300 transition-all shadow-2xs animate-fade-up"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591401721246"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--text-secondary)] bg-[var(--surface)] hover:bg-[var(--surface-high)] hover:border-gray-300 transition-all shadow-2xs animate-fade-up"
              >
                <span>Facebook</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              </a>
            </div>

            <div className="border-t border-[var(--border)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Crafting Digital Experiences. Building Business Growth.
              </span>
              <a
                href="https://devframes.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline"
              >
                Visit Our Website <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border)] py-8 px-6 bg-[var(--surface)] text-xs text-[var(--text-muted)] animate-fade-up">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Brand Logo"
              className="w-6 h-6 rounded-full object-cover shadow-2xs border border-gray-200/20"
            />
            <span className="font-mono text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              FrameUp
            </span>
          </div>
          <span>&copy; {new Date().getFullYear()} FrameUp. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
