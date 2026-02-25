"use client";

import { useState, useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch the logged-in user
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (data.user) {
        const meta = data.user.user_metadata;
        setUser({
          name: meta?.full_name || meta?.name || data.user.email?.split("@")[0] || "User",
          email: data.user.email || "",
        });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event: string, session: { user: User } | null) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        setUser({
          name: meta?.full_name || meta?.name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setDropdownOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 w-full pt-4 pb-2">
      {/* Full-width horizontal line through the middle of the navbar */}
      {!scrolled && (
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[#37322f]/[0.08] transition-opacity duration-300" />
      )}
      <div className="relative max-w-[1060px] mx-auto px-4">
        <nav className={`flex items-center justify-between rounded-full border header-sticky px-6 py-2.5 ${scrolled
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

          {/* Right: Dashboard + Auth buttons (desktop) */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="/dashboard"
              className="rounded-full bg-[#37322f] px-5 py-1.5 text-sm font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-[#2A2520] transition-all"
            >
              Dashboard
            </a>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#37322f]/10 bg-white pl-2 pr-4 py-1.5 text-sm font-medium text-[#37322f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#37322f]/[0.03] hover:shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-all"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#37322f] text-white text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#37322f]/10 bg-white shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-[#37322f]/5">
                      <p className="text-sm font-medium text-[#37322f] truncate">{user.name}</p>
                      <p className="text-xs text-[#37322f]/50 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="group flex w-full items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-medium text-[#37322f]/70 bg-transparent hover:bg-[#ef4444]/[0.06] hover:text-[#ef4444] transition-all duration-200"
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#37322f]/[0.04] group-hover:bg-[#ef4444]/10 transition-colors duration-200">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" className="transition-transform duration-200 group-hover:translate-x-[2px]" />
                          <line x1="21" y1="12" x2="9" y2="12" className="transition-transform duration-200 group-hover:translate-x-[2px]" />
                        </svg>
                      </span>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/login"
                className="rounded-full border border-[#37322f]/10 bg-white px-5 py-1.5 text-sm font-medium text-[#37322f] shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-[#37322f]/[0.03] hover:shadow-[0_1px_4px_rgba(0,0,0,0.07)] transition-all"
              >
                Log in
              </a>
            )}
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
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${mobileOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
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
              href="/dashboard"
              className="rounded-md px-4 py-3 text-sm font-medium text-[#37322f] transition-all hover:bg-[#37322f]/5 animate-slide-in-bottom"
              style={{ animationDelay: "100ms" }}
            >
              Dashboard
            </a>
            {user ? (
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-[14px] font-medium text-[#37322f]/80 transition-all hover:bg-[#ef4444]/[0.06] hover:text-[#ef4444] animate-slide-in-bottom"
                style={{ animationDelay: "150ms" }}
              >
                <span className="flex items-center justify-center w-7 h-7 rounded-md bg-[#37322f]/[0.04] group-hover:bg-[#ef4444]/10 transition-colors duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" className="transition-transform duration-200 group-hover:translate-x-[2px]" />
                    <line x1="21" y1="12" x2="9" y2="12" className="transition-transform duration-200 group-hover:translate-x-[2px]" />
                  </svg>
                </span>
                Log out
              </button>
            ) : (
              <a
                href="/login"
                className="rounded-md px-4 py-3 text-sm font-medium text-[#37322f] transition-all hover:bg-[#37322f]/5 animate-slide-in-bottom"
                style={{ animationDelay: "150ms" }}
              >
                Log in
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
