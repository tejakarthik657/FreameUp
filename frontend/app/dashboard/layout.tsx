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
    { label: "Localization", href: "/dashboard/localization", icon: Globe },
    { label: "Loyalty & Rewards", href: "/dashboard/loyalty", icon: Gift },
    { label: "Invoices", href: "/dashboard/invoices", icon: FileText },
    { label: "Workers & Goods", href: "/dashboard/staff", icon: Users },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#f0f6fa] font-sans antialiased text-[#0a0a0a] pb-20 md:pb-0">
      
      {/* DESKTOP SIDENAV (Midnight Blue Theme) */}
      <aside className="w-64 bg-[#011f4b] text-white border-r border-[#03396c] flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col">
          {/* Logo Header */}
          <div className="px-6 py-6 border-b border-[#03396c] flex items-center gap-3 bg-[#011f4b]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Brand Logo"
              className="w-7 h-7 rounded-full object-cover shadow-xs border border-[#e5a900]"
            />
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              FrameUp <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#e5a900] bg-[#e5a900]/20 px-2 py-0.5 rounded-full">OS</span>
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
                      ? "bg-[#e5a900] text-[#011f4b] font-bold shadow-md"
                      : "text-[#b3cde0] hover:bg-[#03396c] hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#011f4b]" : "text-[#6497b1]"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidenav Footer */}
        <div className="p-4 border-t border-[#03396c]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide text-[#b3cde0] hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP MOBILE BAR */}
        <header className="md:hidden bg-[#011f4b] text-white px-4 py-3.5 border-b border-[#03396c] flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpeg"
              alt="FrameUp Brand Logo"
              className="w-7 h-7 rounded-full object-cover border border-[#e5a900]"
            />
            <span className="font-bold text-sm text-white">FrameUp</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/create"
              className="px-3 py-1.5 bg-[#e5a900] text-[#011f4b] text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Build</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 text-white hover:bg-[#03396c] rounded-xl transition-all"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-between p-4">
            <div className="bg-[#011f4b] border border-[#03396c] rounded-2xl p-4 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#03396c] pb-3">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  FrameUp <span className="text-[10px] bg-[#e5a900] text-[#011f4b] px-2 py-0.5 rounded-full font-bold">OS</span>
                </span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
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
                          ? "bg-[#e5a900] text-[#011f4b]"
                          : "text-[#b3cde0] hover:bg-[#03396c] hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-[#03396c]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOP DESKTOP HEADER BAR */}
        <header className="hidden md:flex bg-white px-8 py-4 border-b border-[#cbd5e1] items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold uppercase tracking-wider text-[#011f4b] font-mono">
              Enterprise Business Studio
            </h1>
            <span className="text-[10px] font-bold uppercase font-mono bg-[#fef9c3] text-[#b87c00] border border-[#e5a900]/40 px-2.5 py-0.5 rounded-full">
              Mustard & Blue Edition
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/create"
              className="px-4 py-2 bg-[#e5a900] hover:bg-[#d99b00] text-[#011f4b] text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Build New Site</span>
            </Link>

            <Link
              href="/dashboard/profile"
              className="w-8 h-8 rounded-full bg-[#011f4b] text-[#e5a900] flex items-center justify-center text-xs font-bold border border-[#03396c]"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>

        {/* BOTTOM MOBILE ACTION BAR */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#011f4b] border-t border-[#03396c] px-4 py-2 flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
                  active ? "text-[#e5a900]" : "text-[#6497b1]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-bold">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
