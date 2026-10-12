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
  Lock,
  Search,
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
    { label: "AI Data Importer", href: "/dashboard/ai-importer", icon: Sparkles, badge: "Wedge #1" },
    { label: "DPDP Sanitizer", href: "/dashboard/dpdp-gateway", icon: ShieldCheck, badge: "Wedge #2" },
    { label: "AI Copilot & Maps", href: "/dashboard/ai-agent", icon: Bot },
    { label: "Operations Desk", href: "/dashboard/operations", icon: Activity },
    { label: "Stock Inventory", href: "/dashboard/inventory", icon: Boxes },
    { label: "B2B Suppliers", href: "/dashboard/suppliers", icon: Truck },
    { label: "GST Invoices", href: "/dashboard/invoices", icon: FileText },
    { label: "Localization", href: "/dashboard/localization", icon: Globe },
    { label: "Loyalty & Rewards", href: "/dashboard/loyalty", icon: Gift },
    { label: "Staff & Workers", href: "/dashboard/staff", icon: Users },
    { label: "Websites", href: "/dashboard", icon: LayoutDashboard },
    { label: "Posters & Canva", href: "/dashboard/posters", icon: Laptop },
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#0d0e12] font-sans antialiased text-[#cbd5e1] pb-20 md:pb-0">
      
      {/* DESKTOP WORKBENCH SIDENAV (Linear Dark Slate Style) */}
      <aside className="w-64 bg-[#12141a] border-r border-[#292b35] flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col">
          {/* Logo & Workspace Title */}
          <div className="px-5 py-4 border-b border-[#292b35] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="Brand Logo"
                className="w-6 h-6 rounded-md object-cover border border-[#292b35]"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-xs tracking-tight text-[#f8fafc]">
                  DataCrew <span className="text-[#635bff] font-mono text-[10px]">OS</span>
                </span>
                <span className="text-[10px] text-[#64748b]">B2B & MSME Suite</span>
              </div>
            </div>

            {/* Privacy Badge */}
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[#3ecf8e] text-[9px] font-mono">
              <Lock className="w-2.5 h-2.5" />
              <span>DPDP</span>
            </div>
          </div>

          {/* Sidenav Navigation */}
          <nav className="p-3 flex flex-col gap-1 mt-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-2 py-1 text-[10px] font-mono font-medium text-[#64748b] uppercase tracking-wider">
              Data & Agents
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    active
                      ? "bg-[#635bff] text-white shadow-sm font-semibold"
                      : "text-[#94a3b8] hover:bg-[#16171d] hover:text-[#f8fafc]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      active ? "bg-white/20 border-white/30 text-white" : "bg-[#1e2029] border-[#292b35] text-[#38bdf8]"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidenav Footer */}
        <div className="p-3 border-t border-[#292b35]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#94a3b8] hover:bg-[#ef4444]/10 hover:text-[#ef4444] transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE SLIDE-OUT DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden flex">
          <div className="w-4/5 max-w-xs bg-[#12141a] border-r border-[#292b35] h-full flex flex-col justify-between p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#292b35]">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpeg"
                    alt="Logo"
                    className="w-6 h-6 rounded-md object-cover border border-[#292b35]"
                  />
                  <span className="font-semibold text-sm text-[#f8fafc]">DataCrew OS</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1 mt-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                        active
                          ? "bg-[#635bff] text-white"
                          : "text-[#94a3b8] hover:bg-[#16171d] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1e2029] text-[#38bdf8]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-[#292b35]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#ef4444] bg-[#ef4444]/10 border border-[#ef4444]/20"
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
        
        {/* TOP WORKBENCH BAR */}
        <header className="bg-[#12141a] border-b border-[#292b35] px-4 md:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded border border-[#292b35] bg-[#16171d] text-[#f8fafc]"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Mobile Brand Logo */}
            <div className="flex items-center gap-2 md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.jpeg"
                alt="Brand Logo"
                className="w-5 h-5 rounded-md object-cover border border-[#292b35]"
              />
              <span className="font-semibold text-xs text-[#f8fafc]">DataCrew</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-semibold text-[#f8fafc]">
                {navItems.find((n) => n.href === pathname)?.label || "Workspace"}
              </span>
              <span className="text-[#3f4352]">/</span>
              <span className="text-[11px] font-mono text-[#64748b]">Production Grid</span>
            </div>
          </div>

          {/* Right Header Status Badges */}
          <div className="flex items-center gap-2.5">
            {/* Data Passport Seal */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3ecf8e]/10 border border-[#3ecf8e]/30 text-[#3ecf8e] text-[11px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DPDP Passport Verified</span>
            </div>

            <Link
              href="/create"
              className="px-3 py-1.5 bg-[#635bff] hover:bg-[#7a73ff] text-white text-xs font-medium rounded-md transition-all shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Store</span>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#12141a] border-t border-[#292b35] px-2 py-1.5 flex items-center gap-1 overflow-x-auto z-40 shadow-lg scrollbar-none">
        {navItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-1.5 rounded text-[10px] font-medium transition-all shrink-0 ${
                active
                  ? "bg-[#635bff] text-white"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5 mb-0.5" />
              <span className="truncate max-w-[52px] text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
