"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const ADMIN_NAV = [
  { name: "Users", href: "/admin/users", icon: "group" },
  { name: "Chat", href: "/admin/chat", icon: "chat" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="h-screen flex bg-surface-dim overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-[72px]" : "w-64"
        } bg-surface-container-low border-r border-outline-variant/10 flex flex-col transition-all duration-300 shrink-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-outline-variant/10 gap-3">
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <span className="material-symbols-outlined text-white text-lg">shield_person</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-sm font-extrabold tracking-tight text-white truncate">Admin Panel</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high/50 hover:text-white"
                }`}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-outline-variant/10 space-y-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">
              {sidebarCollapsed ? "chevron_right" : "chevron_left"}
            </span>
            {!sidebarCollapsed && <span>Collapse</span>}
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high/50 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">home</span>
            {!sidebarCollapsed && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 bg-surface-container-low/50 backdrop-blur-xl border-b border-outline-variant/10 flex items-center justify-between px-8 shrink-0 relative z-[100]">
          <div>
            <h1 className="text-lg font-bold text-white">
              {ADMIN_NAV.find((n) => pathname.startsWith(n.href))?.name || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-3 relative z-[101]">
            <div className="text-right mr-3 hidden sm:block">
              <div className="text-sm font-semibold text-white">{session?.user?.name || "Admin"}</div>
              <div className="text-xs text-on-surface-variant">{session?.user?.email}</div>
            </div>
            
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:scale-105 active:scale-95"
            >
              <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center text-white font-bold text-sm shadow-md">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[998]"
                  onClick={() => setProfileOpen(false)}
                ></div>
                <div className="absolute right-0 top-[120%] mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-2xl shadow-2xl z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-outline-variant/10 sm:hidden">
                    <div className="text-sm font-semibold text-white truncate">{session?.user?.name || "Admin"}</div>
                    <div className="text-xs text-on-surface-variant truncate">{session?.user?.email}</div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
