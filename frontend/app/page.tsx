"use client";

import Link from "next/link";
import { Sparkles, QrCode, Globe, Instagram, Facebook, Linkedin, ArrowUpRight, Check, Shield, Zap, Laptop } from "lucide-react";

// Sector descriptions and metadata
const SECTORS = [
  {
    key: "restaurant",
    label: "Restaurant / Cafe",
    tag: "Menu & Order CTA",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    desc: "Complete menus grouped by category, dietary indications, reservation controls, custom order buttons, and image uploads.",
  },
  {
    key: "salon",
    label: "Salon & Spa",
    tag: "Services & Booking",
    color: "text-rose-600 bg-rose-50 border-rose-200",
    desc: "Detailed treatment options with pricing, durations, stylist bio showcases, custom booking page links, and policy details.",
  },
  {
    key: "local_services",
    label: "Local Services",
    tag: "Leads & Credentials",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    desc: "Service area lists, emergency service indicators, trust certification badges, warranties, and quick quote forms.",
  },
  {
    key: "others",
    label: "Others / Custom",
    tag: "Fully Adaptable",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
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
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans antialiased">
      
      {/* HEADER */}
      <header className="bg-white border-b border-[#EAEAE8] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white font-mono font-bold text-sm shadow-sm">
              F
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-800">
              FrameUp
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-xs font-semibold uppercase tracking-wider bg-gray-900 text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-all shadow-sm">
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="px-6 py-20 md:py-32 border-b border-[#EAEAE8]">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full text-[10px] font-semibold text-emerald-800 tracking-wider uppercase mb-8 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live & Operational
          </div>

          <h1 className="text-4xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-6 leading-[1.05]">
            Your business online.<br />
            <span className="text-indigo-600">In minutes.</span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            FrameUp generates fully functional, beautifully styled, and responsive websites for restaurants, salons, and local services instantly. No domains, hosting, or coding required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/create" className="text-xs font-semibold uppercase tracking-wider bg-indigo-600 text-white px-7 py-3.5 rounded-md hover:bg-indigo-700 transition-all shadow-md">
              Create my website
            </Link>
            <Link href="/login" className="text-xs font-semibold uppercase tracking-wider border border-[#E2E2DF] bg-white px-7 py-3.5 rounded-md hover:bg-gray-50 text-gray-700 transition-all">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* SECTOR LIST */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <div className="mb-12 text-center lg:text-left">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono block mb-2">
            Tailored Industry Solutions
          </span>
          <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight">
            Sector-aware designs built around your layout needs.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s) => (
            <div key={s.key} className="bg-white border border-[#EAEAE8] p-6 rounded-xl shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-200">
              <div>
                <span className={`inline-block text-[9px] font-mono font-bold uppercase border px-2.5 py-0.5 rounded mb-4 ${s.color}`}>
                  {s.tag}
                </span>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{s.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6">{s.desc}</p>
              </div>
              <Link href="/create" className="text-[10px] font-bold font-mono uppercase text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5">
                Build this format <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CORE FEATURES */}
      <section className="bg-white border-y border-[#EAEAE8] px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono block mb-2">
              Everything Included
            </span>
            <h2 className="text-2xl md:text-4xl font-semibold text-gray-900 tracking-tight">
              Powerful tools to launch and customize your site.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEVFRAME PROMOTION AGENCY SECTION */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-100/30 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="DevFrame Logo" className="w-10 h-10 rounded-full object-cover shadow-sm border border-white" />
              <div>
                <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase tracking-wider">
                  Partner Agency
                </span>
                <h3 className="text-base font-semibold text-gray-900 leading-tight">
                  DevFrame Digital Solutions
                </h3>
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              We are pleased to introduce <strong>DevFrame</strong>, a digital agency focused on building modern websites, custom software, AI-powered solutions, and digital experiences for businesses and startups. 
              We&apos;re currently expanding our online presence and would greatly appreciate your support by following our official social media pages. Your support helps us reach more businesses and continue building impactful digital solutions.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <a
                href="https://www.instagram.com/devframe.26/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs"
              >
                <span>Instagram</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
              <a
                href="https://www.threads.com/@devframe.26"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs"
              >
                <span>Threads</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
              <a
                href="https://www.linkedin.com/in/devframes-undefined-02712841a/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs"
              >
                <span>LinkedIn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591401721246"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-2xs"
              >
                <span>Facebook</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </div>

            <div className="border-t border-indigo-100/70 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium">
                Crafting Digital Experiences. Building Business Growth.
              </span>
              <a
                href="https://devframes.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Visit Our Website <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#EAEAE8] py-8 px-6 bg-white text-xs text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              FrameUp
            </span>
          </div>
          <span>&copy; {new Date().getFullYear()} FrameUp. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
