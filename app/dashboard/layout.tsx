"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F5F3F0]">
      {/* ──────────── SIDEBAR ──────────── */}
      <aside
        className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarCollapsed ? "w-[78px]" : "w-[260px]"
        }`}
        style={{
          background: "linear-gradient(180deg, #2C2623 0%, #1E1B19 100%)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateX(0)" : "translateX(-20px)",
          transition: "opacity 0.7s ease-out, transform 0.7s cubic-bezier(0.16,1,0.3,1), width 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-6 pt-8 pb-6 ${sidebarCollapsed ? "justify-center px-0" : ""}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4956A] to-[#A67B52] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#C4956A]/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          {!sidebarCollapsed && (
            <span
              className="text-white/90 font-semibold text-lg tracking-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              SkillBridge
            </span>
          )}
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-11 w-6 h-6 rounded-full bg-[#2C2623] border-2 border-[#F5F3F0] flex items-center justify-center hover:bg-[#3D3835] transition-colors z-50 shadow-md"
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
        <div className={`mx-5 h-px bg-white/[0.07] mb-4 ${sidebarCollapsed ? "mx-3" : ""}`} />

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 overflow-y-auto">
          {navItems.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 relative ${
                item.active
                  ? "bg-white/[0.1] text-white"
                  : "text-white/40 hover:text-white/75 hover:bg-white/[0.04]"
              } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.5s ease-out ${0.15 + i * 0.05}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.05}s`,
              }}
            >
              {item.active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[#C4956A]" />
              )}
              <span className={`flex-shrink-0 ${item.active ? "text-[#C4956A]" : ""}`}>{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="text-[13.5px] font-medium tracking-wide">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom: User profile */}
        <div className={`p-4 border-t border-white/[0.06] ${sidebarCollapsed ? "flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7B9E87] to-[#5A7D62] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-inner">
              AS
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white/80 text-sm font-medium truncate">Alex S.</p>
                <p className="text-white/30 text-xs truncate">Frontend Track</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ──────────── MAIN CONTENT ──────────── */}
      <main
        className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          sidebarCollapsed ? "ml-[78px]" : "ml-[260px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
