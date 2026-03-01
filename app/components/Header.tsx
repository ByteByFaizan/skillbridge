"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>({ name: "Demo User", email: "demo@skillbridge.com" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
    setMobileOpen(false);
    window.location.href = "/";
  };

  return (
    <>
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
              <Link
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
              </Link>
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
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#37322f]/10 bg-white shadow-lg py-1 z-50 animate-menu-slide-down">
                      <div className="px-4 py-2 border-b border-[#37322f]/5">
                        <p className="text-sm font-medium text-[#37322f] truncate">{user.name}</p>
                        <p className="text-xs text-[#37322f]/50 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/update-password"
                        onClick={() => setDropdownOpen(false)}
                        className="group flex w-full items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-medium text-[#37322f]/70 bg-transparent hover:bg-[#37322f]/[0.04] hover:text-[#37322f] transition-all duration-200"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#37322f]/[0.04] group-hover:bg-[#37322f]/[0.08] transition-colors duration-200">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:animate-lock-wiggle">
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </span>
                        Change password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="group flex w-full items-center gap-2.5 px-4 py-2.5 text-[13.5px] font-medium text-[#37322f]/70 bg-transparent hover:bg-[#ef4444]/[0.06] hover:text-[#ef4444] transition-all duration-200"
                      >
                        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-[#37322f]/[0.04] group-hover:bg-[#ef4444]/10 transition-colors duration-200 overflow-hidden relative">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <g className="group-hover:animate-logout-arrow" style={{ transformOrigin: "center" }}>
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </g>
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

            {/* Mobile hamburger button */}
            <button
              className="inline-flex items-center justify-center rounded-full p-2 text-[#37322f] hover:bg-[#37322f]/5 md:hidden transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </nav>
        </div>
      </header>

      {/* ── MOBILE MENU OVERLAY ── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in panel from the right */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[70] w-[80%] max-w-[320px] md:hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: "linear-gradient(160deg, #2F2A27 0%, #1A1714 100%)" }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[0.07]">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center gap-2.5 text-white font-semibold text-lg tracking-tight"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif" }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4A67A] to-[#A67B52] flex items-center justify-center shadow-lg shadow-[#C4956A]/25">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            SkillBridge
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 rounded-full bg-white/[0.07] hover:bg-white/[0.13] flex items-center justify-center text-white/70 hover:text-white transition-all"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-1">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/[0.07] transition-all duration-200 active:scale-[0.98]"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateX(0)" : "translateX(16px)",
                transition: `opacity 0.35s ease ${0.05 + i * 0.05}s, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${0.05 + i * 0.05}s, background 0.2s, color 0.2s`,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A67A]/60 flex-shrink-0" />
              {link.label}
            </a>
          ))}

          {/* Divider */}
          <div className="my-3 h-px bg-white/[0.07] mx-2" />

          {/* Dashboard link */}
          <a
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 mx-2 px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.08] text-[15px] font-semibold text-white hover:bg-white/[0.13] transition-all duration-200 active:scale-[0.98]"
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateX(0)" : "translateX(16px)",
              transition: `opacity 0.35s ease 0.25s, transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.25s, background 0.2s`,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4A67A]">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </a>
        </nav>

        {/* Bottom: Auth */}
        <div className="px-4 pb-8 pt-3 border-t border-white/[0.07]">
          {user ? (
            <div
              style={{
                opacity: mobileOpen ? 1 : 0,
                transition: "opacity 0.35s ease 0.3s",
              }}
            >
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/[0.05]">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4A67A] to-[#A67B52] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white/90 text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-white/40 text-[11px] truncate">{user.email}</p>
                </div>
              </div>
              <Link
                href="/update-password"
                onClick={() => setMobileOpen(false)}
                className="group flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-white/60 hover:text-white hover:bg-white/[0.07] transition-all duration-200 active:scale-[0.98]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-all duration-300 group-hover:animate-lock-wiggle">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Change password
              </Link>
              <button
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-medium text-white/60 hover:text-[#ef4444] hover:bg-[#ef4444]/[0.08] transition-all duration-200 active:scale-[0.98] overflow-hidden"
              >
                <span className="relative overflow-hidden flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <g className="group-hover:animate-logout-arrow" style={{ transformOrigin: "center" }}>
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </g>
                  </svg>
                </span>
                Log out
              </button>
            </div>
          ) : (
            <a
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#D4A67A] to-[#C4956A] text-white text-[15px] font-semibold shadow-lg shadow-[#C4956A]/25 hover:opacity-90 transition-all active:scale-[0.98]"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.35s ease 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.3s",
              }}
            >
              Log in to SkillBridge
            </a>
          )}
        </div>
      </div>
    </>
  );
}
