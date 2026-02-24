"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full pt-4 pb-2">
      {/* Full-width horizontal line through the middle of the navbar */}
      {!scrolled && (
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#37322f]/[0.08] transition-opacity duration-300" />
      )}
      <div className="relative max-w-[1060px] mx-auto px-4">
        <nav className={`flex items-center justify-between rounded-full border header-sticky px-6 py-2.5 ${
          scrolled
            ? "border-[#37322f]/6 header-scrolled shadow-[0_1px_8px_rgba(0,0,0,0.06)]"
            : "border-[#37322f]/8 bg-white/60 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        }`}>
          {/* Left: Brand + nav links */}
          <div className="flex items-center gap-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-[#37322f] font-semibold text-xl tracking-tight select-none"
              style={{ fontFamily: "'DM Serif Display', 'Georgia', serif" }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#37322f] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              SkillBridge
            </a>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#37322f]/70 hover:text-[#37322f] text-sm font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Log in button (desktop) */}
          <div className="hidden md:flex items-center">
            <a
              href="/login"
              className="rounded-full border border-[#37322f]/10 bg-white px-5 py-1.5 text-sm font-medium text-[#37322f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#37322f]/[0.03] hover:shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-all"
            >
              Log in
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="inline-flex items-center justify-center rounded-full p-2 text-[#37322f] hover:bg-[#37322f]/5 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-[#37322f]/6 bg-[#f7f5f3]">
          <div className="max-w-[1060px] mx-auto flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-4 py-3 text-sm font-medium text-[#37322f] transition-all hover:bg-[#37322f]/5 animate-slide-in-bottom"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/login"
              className="rounded-md px-4 py-3 text-sm font-medium text-[#37322f] transition-all hover:bg-[#37322f]/5 animate-slide-in-bottom"
              style={{ animationDelay: "150ms" }}
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
