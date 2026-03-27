"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Portfolio", href: "#portfolio" },
  { name: "Services", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = "home";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check if section is currently near top of viewport
          // Using 200px offset as a buffer for the fixed header
          if (rect.top <= 200) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
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
        
        <Link 
          href="/login"
          className="bg-primary text-on-primary font-bold px-7 py-2.5 rounded-full text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
