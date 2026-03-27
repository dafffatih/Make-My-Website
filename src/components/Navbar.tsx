"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);

    if (element) {
      const offsetTop = element.offsetTop;
      window.scrollTo({
        top: targetId === "home" ? 0 : offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  const userInitial = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 font-manrope transition-all duration-500 ease-in-out ${
        scrolled 
          ? "bg-surface-container-low/90 backdrop-blur-xl border-b border-outline-variant/10 shadow-lg shadow-black/5 py-0" 
          : "bg-surface-container-low/40 backdrop-blur-sm border-b border-transparent py-2"
      }`}
    >
      <div className={`flex justify-between items-center px-8 w-full max-w-screen-2xl mx-auto transition-all duration-500 ${scrolled ? 'h-[4.5rem]' : 'h-20'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={(e) => handleClick(e as any, "#home")}>
          <div className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-lg">public</span>
          </div>
          <div className="text-xl font-extrabold tracking-tighter text-white">
            Make My Website
          </div>
        </div>

        {/* Simple Navigation */}
        <div className="hidden md:flex items-center space-x-12">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className={`relative pb-1 font-bold transition-colors duration-300 ${
                  isActive 
                    ? "text-primary" 
                    : "text-on-surface-variant hover:text-white"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary rounded-full"></span>
                )}
              </a>
            );
          })}
        </div>
        
        {/* Auth Section */}
        {status === "loading" ? (
          <div className="w-10 h-10 rounded-full bg-surface-container-high/50 animate-pulse"></div>
        ) : session?.user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              id="profile-avatar-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center text-white font-bold text-sm uppercase cursor-pointer hover:shadow-lg hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all ring-2 ring-transparent hover:ring-primary/30"
              aria-label="Open profile menu"
            >
              {userInitial}
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-surface-container-high/95 backdrop-blur-2xl border border-outline-variant/20 rounded-2xl shadow-2xl shadow-black/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                {/* User Info */}
                <div className="px-5 py-4 border-b border-outline-variant/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#c3c0ff_0%,#4f46e5_100%)] flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-bold text-sm truncate">
                        {session.user.name || "User"}
                      </div>
                      <div className="text-on-surface-variant text-xs truncate">
                        {session.user.email || ""}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="p-2">
                  <button
                    id="logout-btn"
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut({ callbackUrl: "/dashboard" });
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/login"
            className="bg-primary text-on-primary font-bold px-7 py-2.5 rounded-full text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
