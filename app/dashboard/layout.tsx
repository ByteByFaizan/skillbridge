"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    active: false,
  },
  {
    label: "Roadmap",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4.5" r="2.5" />
        <path d="M12 7v3" />
        <circle cx="12" cy="12" r="2" />
        <path d="M12 14v3" />
        <circle cx="12" cy="19.5" r="2.5" />
      </svg>
    ),
    active: true,
  },
  {
    label: "Skills",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    active: false,
  },
  {
    label: "Mentors",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    active: false,
  },
  {
    label: "Resources",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    active: false,
  },
  {
    label: "Settings",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    active: false,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* Close mobile sidebar on resize to desktop */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Lock body scroll when mobile sidebar is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setMobileOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F5F3F0]" onKeyDown={handleKeyDown}>
      {/* ──────── MOBILE OVERLAY ──────── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ──────── MOBILE HAMBURGER ──────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-5 left-5 z-30 lg:hidden w-10 h-10 rounded-xl bg-white border border-[#E0DBD5] flex items-center justify-center shadow-md hover:shadow-lg transition-all active:scale-95"
        aria-label="Open sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2623" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="16" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* ──────────── SIDEBAR ──────────── */}
      <aside
        className={`fixed left-0 top-0 h-screen z-50 flex flex-col
          ${sidebarCollapsed ? "lg:w-[78px]" : "lg:w-[260px]"}
          ${mobileOpen ? "w-[280px] translate-x-0" : "w-[280px] -translate-x-full lg:translate-x-0"}
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        `}
        style={{
          background: "linear-gradient(175deg, #2F2A27 0%, #1D1A18 100%)",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.7s ease-out, transform 0.5s cubic-bezier(0.16,1,0.3,1), width 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 pt-7 pb-5 ${sidebarCollapsed ? "lg:justify-center lg:px-0" : ""}`}>
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A67A] to-[#A67B52] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#C4956A]/25 sidebar-logo-glow">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            {(!sidebarCollapsed || mobileOpen) && (
              <span
                className="text-white font-semibold text-lg tracking-tight select-none"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
              >
                SkillBridge
              </span>
            )}
          </Link>
          {/* Mobile close */}
          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto lg:hidden w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex absolute -right-3.5 top-[52px] w-7 h-7 rounded-full bg-[#2C2623] border-[2.5px] border-[#F5F3F0] items-center justify-center hover:bg-[#44403C] transition-all z-50 shadow-lg hover:scale-110 active:scale-95"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform duration-300 ${sidebarCollapsed ? "rotate-180" : ""}`}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Separator */}
        <div className={`mx-5 h-px bg-white/[0.08] mb-3 ${sidebarCollapsed ? "lg:mx-3" : ""}`} />

        {/* Section label */}
        {(!sidebarCollapsed || mobileOpen) && (
          <p className="px-6 mb-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white/25">
            Menu
          </p>
        )}

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto" role="menu">
          {navItems.map((item, i) => {
            const isHovered = hoveredNav === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                role="menuitem"
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                  item.active
                    ? "bg-white/[0.1] text-white"
                    : "text-white/45 hover:text-white/90 hover:bg-white/[0.06]"
                } ${sidebarCollapsed && !mobileOpen ? "lg:justify-center lg:px-0" : ""}`}
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-16px)",
                  transition: `all 0.2s ease, opacity 0.5s ease-out ${0.12 + i * 0.04}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.12 + i * 0.04}s`,
                }}
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
                onClick={() => setMobileOpen(false)}
              >
                {/* Active indicator bar */}
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#D4A67A] shadow-sm shadow-[#D4A67A]/40" />
                )}

                {/* Hover glow behind icon */}
                <div
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-300 ${
                    isHovered && !item.active ? "bg-white/[0.04] scale-100" : "bg-transparent scale-75"
                  }`}
                />

                <span className={`relative flex-shrink-0 transition-transform duration-200 ${isHovered ? "scale-110" : ""} ${item.active ? "text-[#D4A67A]" : ""}`}>
                  {item.icon}
                </span>
                {(!sidebarCollapsed || mobileOpen) && (
                  <span className="relative text-[13.5px] font-medium tracking-wide">{item.label}</span>
                )}

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && !mobileOpen && isHovered && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#2C2623] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-[60] pointer-events-none sidebar-tooltip">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#2C2623] rotate-45 border-l border-b border-white/10" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Separator before profile */}
        <div className={`mx-5 h-px bg-white/[0.06] mt-2 ${sidebarCollapsed ? "lg:mx-3" : ""}`} />

        {/* Bottom: User profile */}
        <div className={`p-4 ${sidebarCollapsed && !mobileOpen ? "lg:flex lg:justify-center" : ""}`}>
          <div
            className={`flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.05] transition-colors cursor-pointer ${
              sidebarCollapsed && !mobileOpen ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8BAF96] to-[#5A7D62] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ring-2 ring-white/10">
              AS
            </div>
            {(!sidebarCollapsed || mobileOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm font-medium truncate">Alex S.</p>
                <p className="text-white/40 text-[11px] truncate">Frontend Track</p>
              </div>
            )}
            {(!sidebarCollapsed || mobileOpen) && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25 flex-shrink-0">
                <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
              </svg>
            )}
          </div>
        </div>
      </aside>

      {/* ──────────── MAIN CONTENT ──────────── */}
      <main
        className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-screen ${
          sidebarCollapsed ? "lg:ml-[78px]" : "lg:ml-[260px]"
        } ml-0`}
      >
        {children}
      </main>
    </div>
  );
}
