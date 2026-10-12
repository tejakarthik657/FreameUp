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
} from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        document.cookie = `devframes_token=${token}; path=/; max-age=604800; SameSite=Lax`;
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }, []);

  async function handleLogout() {
    try {
      await api.logout();
    } catch (e) {
      console.error(e);
    }
    router.push("/");
  }

  const navItems = [
    { label: "Websites", href: "/dashboard", icon: LayoutDashboard },
    { label: "Posters", href: "/dashboard/posters", icon: Laptop },
    { label: "AI Assistant", href: "/dashboard/ai-agent", icon: Bot },
    { label: "AI Data Importer", href: "/dashboard/ai-importer", icon: Sparkles },
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

  return (
    <div className="min-h-screen flex bg-[#fffaf0] font-sans antialiased text-[#0a0a0a] pb-20 md:pb-0">
      
      {/* DESKTOP SIDENAV (Clay Style) */}
      <aside className="w-64 bg-[#faf5e8] border-r border-[#e5e5e5] flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="px-6 py-6 border-b border-[#e5e5e5] flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Brand Logo"
              className="w-7 h-7 rounded-full object-cover shadow-xs border border-[#e5e5e5]"
            />
            <span className="font-bold text-base tracking-tight text-[#0a0a0a]">
              FrameUp
            </span>
          </div>

          {/* Sidenav Navigation */}
          <nav className="p-4 flex flex-col gap-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "bg-[#0a0a0a] text-white shadow-xs"
                      : "text-[#3a3a3a] hover:bg-[#f5f0e0] hover:text-[#0a0a0a]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidenav Footer */}
        <div className="p-4 border-t border-[#e5e5e5]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide text-[#3a3a3a] hover:bg-[#ff4d8b]/10 hover:text-[#ff4d8b] transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SLIDE-OUT DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden flex">
          <div className="w-4/5 max-w-xs bg-[#faf5e8] h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#e5e5e5]">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="w-7 h-7 rounded-full object-cover border border-[#e5e5e5]"
                  />
                  <span className="font-bold text-base text-[#0a0a0a]">FrameUp</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-700 hover:bg-[#e5e5e5]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 mt-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? "bg-[#0a0a0a] text-white shadow-xs"
                          : "text-[#3a3a3a] hover:bg-[#f5f0e0]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#e5e5e5]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-[#ff4d8b] bg-white border border-[#e5e5e5]"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR / HEADER */}
        <header className="bg-[#fffaf0] border-b border-[#e5e5e5] px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl border border-[#e5e5e5] bg-white text-[#0a0a0a] hover:bg-[#faf5e8]"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Logo */}
            <div className="flex items-center gap-2 md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="FrameUp Brand Logo"
                className="w-6 h-6 rounded-full object-cover border border-[#e5e5e5]"
              />
              <span className="font-bold text-sm text-[#0a0a0a]">
                FrameUp
              </span>
            </div>
            
            <h2 className="text-sm font-bold text-[#0a0a0a] uppercase tracking-wider hidden md:block">
              {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/create"
              className="px-3.5 py-2 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Build Site</span>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM HORIZONTAL SCROLLABLE NAV BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#faf5e8] border-t border-[#e5e5e5] px-2 py-1.5 flex items-center gap-1 overflow-x-auto z-40 shadow-lg scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-xl text-[10px] font-semibold transition-all shrink-0 ${
                active
                  ? "bg-[#0a0a0a] text-white font-bold shadow-xs"
                  : "text-[#6a6a6a] hover:text-[#0a0a0a]"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="truncate max-w-[56px] text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
