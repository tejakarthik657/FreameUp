"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, User, Settings, LogOut, Laptop } from "lucide-react";
import { api } from "@/lib/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const router = useRouter();

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
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-[#fffaf0] font-sans antialiased text-[#0a0a0a] pb-16 md:pb-0">
      
      {/* SIDENAV (Desktop Only - Clay Style) */}
      <aside className="w-64 bg-[#faf5e8] border-r border-[#e5e5e5] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col">
          {/* Sidenav Header with Product Logo */}
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
          <nav className="p-4 flex flex-col gap-2 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
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

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR / HEADER */}
        <header className="bg-[#fffaf0] border-b border-[#e5e5e5] px-6 md:px-8 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Brand with Logo */}
            <div className="flex items-center gap-2 md:hidden">
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
            
            <h2 className="text-sm font-bold text-[#0a0a0a] uppercase tracking-wider hidden md:block">
              {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="px-4 py-2 bg-[#0a0a0a] hover:bg-[#1f1f1f] text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
            >
              + Build Site
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#faf5e8] border-t border-[#e5e5e5] px-4 py-2 flex justify-around items-center z-50 shadow-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[10px] font-semibold transition-all ${
                active ? "text-[#0a0a0a] font-bold" : "text-[#6a6a6a]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
