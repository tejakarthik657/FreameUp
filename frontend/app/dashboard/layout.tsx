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
    { label: "Profile", href: "/dashboard/profile", icon: User },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans antialiased text-gray-900">
      
      {/* SIDENAV */}
      <aside className="w-64 bg-white border-r border-[#EAEAE8] flex flex-col justify-between hidden md:flex shrink-0">
        <div className="flex flex-col">
          {/* Sidenav Header */}
          <div className="px-6 py-5.5 border-b border-[#EAEAE8] flex items-center gap-2.5">
            <span className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
              F
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-800">
              FrameUp
            </span>
          </div>

          {/* Sidenav Navigation */}
          <nav className="p-4 flex flex-col gap-1.5 mt-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    active
                      ? "bg-indigo-50/60 text-indigo-600 border border-indigo-100"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
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
        <div className="p-4 border-t border-[#EAEAE8]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* TOP BAR / HEADER */}
        <header className="bg-white border-b border-[#EAEAE8] px-8 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            {/* Mobile Brand */}
            <div className="flex items-center gap-2 md:hidden">
              <span className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center text-white font-mono font-bold text-xs">
                F
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-800">
                FrameUp
              </span>
            </div>
            
            <h2 className="text-xs font-bold uppercase text-gray-400 tracking-wider hidden md:block">
              {pathname === "/dashboard" ? "Websites Overview" : pathname.split("/").pop()}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Link to landing page */}
            <Link
              href="/"
              className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors"
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Back to home</span>
            </Link>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
