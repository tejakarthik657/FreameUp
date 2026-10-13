"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Laptop,
  Bot,
  Activity,
  Globe,
  Gift,
  FileText,
  Users,
  Menu,
  X,
  Plus,
  Sparkles,
  Boxes,
  Truck,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Search,
} from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    async function verifyAuth() {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        if (token) {
          document.cookie = `devframes_token=${token}; path=/; max-age=604800; SameSite=Lax`;
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      }

      try {
        await api.getMe();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
        // Wipe any stale token and redirect to login
        if (typeof document !== "undefined") {
          document.cookie = "devframes_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        router.replace("/login");
        return;
      } finally {
        setAuthChecking(false);
      }
    }

    verifyAuth();
  }, [router]);

  async function handleLogout() {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    if (typeof document !== "undefined") {
      document.cookie = "devframes_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    // Hard navigate to ensure clean React state and reset session
    window.location.href = "/";
  }

  if (authChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] font-sans antialiased text-[#1d1d1f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white border border-[#e0e0e0] flex items-center justify-center shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="FrameUp" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#86868b] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#0066cc] animate-pulse" />
            <span>Verifying workspace session...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { label: "Websites", href: "/dashboard", icon: LayoutDashboard },
    { label: "Posters", href: "/dashboard/posters", icon: Laptop },
    { label: "AI Assistant", href: "/dashboard/ai-agent", icon: Bot },
    { label: "AI Data Importer", href: "/dashboard/ai-importer", icon: Sparkles },
    { label: "DPDP AI Gateway", href: "/dashboard/dpdp-gateway", icon: ShieldCheck },
    { label: "Operations Desk", href: "/dashboard/operations", icon: Activity },
    { label: "Stock Inventory", href: "/dashboard/inventory", icon: Boxes },
    { label: "B2B Suppliers", href: "/dashboard/suppliers", icon: Truck },
    { label: "Localization", href: "/dashboard/localization", icon: Globe },
    { label: "Loyalty & Rewards", href: "/dashboard/loyalty", icon: Gift },
    { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { label: "Workers & Goods", href: "/dashboard/staff", icon: Users },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const currentNavItem = navItems.find((n) => n.href === pathname);
  const currentTitle = currentNavItem?.label || "Dashboard";

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] font-sans antialiased text-[#1d1d1f] selection:bg-[#0066cc] selection:text-white">
      
      {/* ── TIER 1: APPLE HEADER NAV BAR (48px Frosted Glass) ── */}
      <header className="h-[48px] bg-white/90 backdrop-blur-md text-[#1d1d1f] flex items-center justify-between px-4 sm:px-6 text-[12px] tracking-[-0.12px] z-50 sticky top-0 shrink-0 border-b border-[#e5e5ea] shadow-xs">
        <div className="flex items-center gap-6 max-w-7xl mx-auto w-full justify-between">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="FrameUp"
                className="w-6 h-6 rounded-lg object-contain shadow-xs"
              />
              <span className="font-semibold text-[#1d1d1f] tracking-tight text-[13px] flex items-center gap-1.5">
                FrameUp
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#0066cc]/10 text-[#0066cc] border border-[#0066cc]/20 rounded">
                  OS
                </span>
              </span>
            </Link>
            <span className="text-[#d2d2d7] hidden sm:inline">|</span>
            <span className="text-[#86868b] text-[11px] font-medium hidden sm:inline">
              Enterprise MSME Platform
            </span>
          </div>

          {/* Center / Right: Quick Navigation & Status */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-[#6e6e73]">
              <Link href="/dashboard" className="hover:text-[#1d1d1f] transition-colors">
                Overview
              </Link>
              <Link href="/dashboard/ai-importer" className="hover:text-[#1d1d1f] transition-colors">
                Importer
              </Link>
              <Link href="/dashboard/dpdp-gateway" className="hover:text-[#1d1d1f] transition-colors">
                DataTrust
              </Link>
              <Link href="/dashboard/invoices" className="hover:text-[#1d1d1f] transition-colors">
                Billing
              </Link>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#f5f5f7] text-[11px] text-[#0066cc] font-mono font-medium border border-[#e5e5ea]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] animate-pulse" />
                Live OS
              </span>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-lg text-[#1d1d1f] hover:bg-[#f5f5f7] transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ── TIER 2 & MAIN BODY WORKSPACE ── */}
      <div className="flex-1 flex min-w-0">
        
        {/* DESKTOP SIDENAV (Apple White/Pearl Canvas with Action Blue Active Pills) */}
        <aside className="w-64 bg-white border-r border-[#e5e5ea] flex-col justify-between hidden md:flex shrink-0">
          <div className="flex flex-col">
            
            {/* Sidenav Header Strip */}
            <div className="h-[52px] px-5 flex items-center justify-between border-b border-[#f0f0f2] bg-[#fafafc]">
              <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.06em] font-mono">
                Workspace Hub
              </span>
              <span className="text-[10px] font-mono font-medium text-[#0066cc] bg-[#0066cc]/10 px-2 py-0.5 rounded-full border border-[#0066cc]/20">
                v2.4 Live
              </span>
            </div>

            {/* Sidenav Navigation Items */}
            <nav className="p-3 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-160px)]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                      active
                        ? "bg-[#0066cc] text-white font-semibold shadow-xs"
                        : "text-[#3a3a3c] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-[#86868b]"}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidenav Bottom Profile & Logout Footer */}
          <div className="p-3.5 border-t border-[#f0f0f2] bg-[#fafafc]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-[12px] font-medium text-[#6e6e73] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 border border-transparent transition-all"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5 text-[#86868b] group-hover:text-rose-600" />
                <span>Sign Out</span>
              </div>
              <span className="text-[10px] text-[#86868b] font-mono">End Session</span>
            </button>
          </div>
        </aside>

        {/* MOBILE SLIDE-OUT DRAWER OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden flex">
            <div className="w-4/5 max-w-xs bg-white h-full flex flex-col justify-between p-5 shadow-2xl animate-in slide-in-from-left duration-200">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#e0e0e0]">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo.svg"
                      alt="Logo"
                      className="w-6 h-6 rounded-lg object-contain shadow-xs"
                    />
                    <span className="font-bold text-[15px] text-[#1d1d1f] flex items-center gap-1.5">
                      FrameUp
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-[#0066cc]/10 text-[#0066cc] border border-[#0066cc]/20 rounded">
                        OS
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-[#1d1d1f] hover:bg-[#f5f5f7]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1 mt-4 overflow-y-auto max-h-[70vh]">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[13px] font-medium transition-all ${
                          active
                            ? "bg-[#0066cc] text-white font-semibold"
                            : "text-[#1d1d1f] hover:bg-[#f5f5f7]"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-[#e0e0e0]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-[12px] font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f4f5f8]">
          
          {/* ── SUB-NAV / SECTION HEADER BAR (52px Frosted Glass) ── */}
          <div className="h-[52px] bg-white/90 backdrop-blur-md border-b border-[#e2e4e9] px-4 md:px-8 flex items-center justify-between sticky top-[48px] z-30 shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc]" />
              <h1 className="text-[16px] md:text-[18px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                {currentTitle}
              </h1>
            </div>

            {/* Persistent Action Blue Pill CTA */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/create"
                className="apple-btn-primary text-[12px] py-1.5 px-4 font-medium active:scale-95 flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Site</span>
              </Link>
            </div>
          </div>

          {/* MAIN PAGE VIEW */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
            {children}
          </main>
        </div>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (Apple Glass Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#e0e0e0] px-3 py-1.5 flex items-center gap-1 overflow-x-auto z-40 shadow-xs scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[62px] py-1 px-1.5 rounded-full text-[10px] transition-all shrink-0 ${
                active
                  ? "bg-[#0066cc] text-white font-semibold"
                  : "text-[#86868b] hover:text-[#1d1d1f]"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate max-w-[54px] text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
