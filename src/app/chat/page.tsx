"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";

export default function ChatPage() {
  const [mobileView, setMobileView] = useState<"chat" | "project">("chat");

  return (
    <div className="h-screen overflow-hidden flex flex-col w-full">
      {/* TopNavBar */}
      <Navbar />

      <main className="pt-20 flex-grow flex overflow-hidden">
        {/* Chat Interface */}
        <section className={`${mobileView === "chat" ? "flex" : "hidden"} md:flex w-full md:w-1/2 flex-col bg-surface-dim relative`}>
          {/* Message Area */}
          <div className="flex-grow overflow-y-auto px-8 py-10 space-y-8 custom-scrollbar">
            {/* Admin Message */}
            <div className="flex gap-4 max-w-2xl">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 mt-1 overflow-hidden">
                <img className="w-full h-full object-cover" data-alt="Small profile avatar of a male designer, studio portrait, dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcXRsQd0HePrYhHnkmd-Capk-VBP21h-qGTetdqAGumzjVi9MWBxIIzCWYXWn4xtHZLYcD_DuWj5kaVKpoQa2nVzX4NtmlbLL0FDpBhqryRWA4HwHQcWImUYe2ihkhViCse8SXiRYMl4VboePBcBiMppHQWJr1n5XVC3gwNF32KZ8yS3UyweVwQt38hrSbEI4KsbWNhqzbWZDNyREwgHpjTM8GSThYwg_YZZj3LphvoDxL2Tiy6gMkx1SUdbRDFg_eZ3t-xBZSebk" />
              </div>
              <div className="space-y-2">
                <div className="bg-surface-container-high p-4 rounded-xl rounded-tl-none border-l-2 border-primary-container">
                  <p className="text-body text-on-surface leading-relaxed">Welcome back! I've been reviewing your brief. To move forward with the architectural phase, we should finalize the service tier. Which of these aligns best with your vision?</p>
                </div>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">10:24 AM</span>
              </div>
            </div>


            {/* User Message */}
            <div className="flex flex-row-reverse gap-4 max-w-2xl ml-auto">
              <div className="w-8 h-8 rounded-full bg-primary-container flex-shrink-0 mt-1 flex items-center justify-center">
                <span className="text-xs font-bold text-surface">ME</span>
              </div>
              <div className="space-y-2 flex flex-col items-end">
                <div className="bg-primary-container text-on-primary-container p-4 rounded-xl rounded-tr-none">
                  <p className="text-body leading-relaxed">The Elite Studio package looks like exactly what we need for the scale of this project. Can we confirm this and book a kickoff call for tomorrow?</p>
                </div>
                <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">10:28 AM</span>
              </div>
            </div>

            {/* Status Update */}
            <div className="flex justify-center py-4">
              <div className="px-4 py-1 bg-surface-container rounded-full text-[10px] text-on-surface-variant font-medium uppercase tracking-widest border border-outline-variant/10">
                Package Confirmed: Elite Studio
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-8 bg-surface-dim border-t border-outline-variant/5">
            <div className="relative flex items-center bg-surface-container-highest rounded-full px-6 py-3 border border-outline-variant/10 focus-within:border-primary/50 transition-all">
              <button className="p-1 text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">attach_file</span>
              </button>
              <input className="bg-transparent border-none focus:ring-0 text-on-surface w-full px-4 text-sm placeholder:text-zinc-600 outline-none" placeholder="Message Julian..." type="text" />
              <button className="bg-primary text-surface p-2 rounded-full flex items-center justify-center active:scale-95 transition-transform">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
              </button>
            </div>
          </div>
        </section>

        {/* Consultation & Transaction Sidebar */}
        <aside className={`${mobileView === "project" ? "flex" : "hidden"} md:flex w-full md:w-1/2 flex-col bg-surface-container-low md:border-l border-outline-variant/10 overflow-y-auto custom-scrollbar`}>
          {/* Sidebar Header */}
          <div className="p-8 pb-4">
            <h3 className="font-headline font-extrabold text-2xl tracking-tighter text-on-surface">Consultation Hub</h3>
            <p className="text-xs text-on-surface-variant mt-2 uppercase tracking-widest">Manage your digital architecture</p>
          </div>

          {/* Selected Package Card */}
          <div className="px-8 py-6">
            <div className="bg-surface-container-high rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Active Selection</span>
              <h4 className="font-headline font-bold text-xl text-on-surface">Elite Studio Tier</h4>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-on-surface">$4,999</span>
                <span className="text-xs text-on-surface-variant">USD / Total</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                  Full Brand Strategy
                </li>
                <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                  Unlimited UI Revisions
                </li>
                <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                  Dedicated Dev Server
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons Area */}
          <div className="px-8 pb-8 space-y-4">
            <button className="w-full bg-gradient-to-br from-primary to-primary-container text-zinc-900 py-4 rounded-full font-bold uppercase text-xs tracking-widest shadow-xl shadow-primary/10 hover:brightness-110 active:scale-[0.98] transition-all">
              Complete Payment
            </button>
            <button className="w-full bg-surface-container-highest text-on-surface py-4 rounded-full font-bold uppercase text-xs tracking-widest border border-outline-variant/20 hover:bg-surface-bright transition-all">
              Book a Call
            </button>
          </div>

          {/* Quick Links / Meta */}
          <div className="mt-auto p-8 border-t border-outline-variant/10">
            <div className="bg-surface-container-lowest p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Next Milestone</p>
                  <p className="text-xs text-on-surface font-medium">Kickoff Discovery</p>
                </div>
              </div>
              <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                <div className="bg-primary w-1/4 h-full"></div>
              </div>
              <p className="text-[9px] text-on-surface-variant mt-2">Project progress: 25% complete</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer Mobile View (Condensed) */}
      <footer className="md:hidden w-full bg-zinc-950 dark:bg-[#131313] py-4 px-8 grid grid-cols-2 border-t border-outline-variant/30 z-50 shrink-0">
        <button
          onClick={() => setMobileView("chat")}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
            mobileView === "chat" ? "text-indigo-400" : "text-zinc-500"
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: mobileView === "chat" ? "'FILL' 1" : "'FILL' 0" }}>chat</span>
          <span className="text-[8px] uppercase tracking-widest font-bold">Chat</span>
        </button>
        <button
          onClick={() => setMobileView("project")}
          className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
            mobileView === "project" ? "text-indigo-400" : "text-zinc-500"
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: mobileView === "project" ? "'FILL' 1" : "'FILL' 0" }}>assignment</span>
          <span className="text-[8px] uppercase tracking-widest font-bold">Project</span>
        </button>
      </footer>
    </div>
  );
}
