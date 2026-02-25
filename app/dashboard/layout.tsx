"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

interface HistoryRun {
  runId: string;
  createdAt: string;
  careerTitles: string[];
}

const navItems = [
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
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [historyRuns, setHistoryRuns] = useState<HistoryRun[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [hoveredHistoryItem, setHoveredHistoryItem] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* Fetch current user */
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User } | null) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  /* Logout handler */
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

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

  const handleToggleHistory = useCallback(async () => {
    if (showHistory) {
      setShowHistory(false);
      return;
    }
    setLoadingHistory(true);
    setShowHistory(true);

    // Auto-expand sidebar if collapsed
    if (sidebarCollapsed) {
      setSidebarCollapsed(false);
    }

    try {
      const res = await fetch("/api/recommendations");
      if (res.ok) {
        const data = await res.json();
        setHistoryRuns(data.runs || []);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [showHistory, sidebarCollapsed]);

  const handleSelectHistory = useCallback((runId: string) => {
    localStorage.setItem("sb_last_run_id", runId);
    if (mobileOpen) setMobileOpen(false);

    // Trigger event for page.tsx to reload
    window.dispatchEvent(new CustomEvent('sb-history-selected'));
  }, [mobileOpen]);

  return (
    <div className="min-h-screen flex bg-[#F5F3F0]" onKeyDown={handleKeyDown}>
      {/* ──────── MOBILE OVERLAY ──────── */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto" role="menu">
          {navItems.map((item, i) => {
            const isHovered = hoveredNav === item.label;
            return (
              <Link
                key={item.label}
                href={item.href}
                role="menuitem"
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${item.active
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
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-300 ${isHovered && !item.active ? "bg-white/[0.04] scale-100" : "bg-transparent scale-75"
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

          {/* ── Sidebar History Toggle ── */}
          <button
            onClick={handleToggleHistory}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 mt-1 ${showHistory
              ? "bg-white/[0.08] text-white"
              : "text-white/45 hover:text-white/90 hover:bg-white/[0.06]"
              } ${sidebarCollapsed && !mobileOpen ? "lg:justify-center lg:px-0" : ""}`}
            onMouseEnter={() => setHoveredNav("History")}
            onMouseLeave={() => setHoveredNav(null)}
          >
            <div
              className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full transition-all duration-300 ${hoveredNav === "History" && !showHistory ? "bg-white/[0.04] scale-100" : "bg-transparent scale-75"
                }`}
            />
            <span className={`relative flex-shrink-0 transition-transform duration-200 ${hoveredNav === "History" ? "scale-110" : ""} ${showHistory ? "text-[#D4A67A]" : ""}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            {(!sidebarCollapsed || mobileOpen) && (
              <span className="relative text-[13.5px] font-medium tracking-wide flex-1 text-left">Previous Roadmaps</span>
            )}

            {/* Caret icon when expanded */}
            {(!sidebarCollapsed || mobileOpen) && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}

            {sidebarCollapsed && !mobileOpen && hoveredNav === "History" && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#2C2623] text-white text-xs font-medium rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-[60] pointer-events-none sidebar-tooltip">
                Previous Roadmaps
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-[#2C2623] rotate-45 border-l border-b border-white/10" />
              </div>
            )}
          </button>

          {/* History List expansion (only if menu is not collapsed) */}
          <div
            className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex-shrink-0"
            style={{
              maxHeight: showHistory && (!sidebarCollapsed || mobileOpen) ? "400px" : "0px",
              opacity: showHistory && (!sidebarCollapsed || mobileOpen) ? 1 : 0,
            }}
          >
            <div className="pl-11 pr-3 py-2 space-y-1 pb-6 overflow-y-auto max-h-[300px] custom-scrollbar">
              {loadingHistory ? (
                <div className="flex items-center gap-2 text-white/40 text-xs py-2">
                  <div className="w-3 h-3 rounded-full border-2 border-white/20 border-t-[#D4A67A] animate-spin" />
                  Loading...
                </div>
              ) : historyRuns.length === 0 ? (
                <div className="text-white/40 text-[11px] py-1">No past roadmaps</div>
              ) : (
                historyRuns.map((run, idx) => {
                  const d = new Date(run.createdAt);
                  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const isHovered = hoveredHistoryItem === run.runId;

                  return (
                    <button
                      key={run.runId}
                      onClick={() => handleSelectHistory(run.runId)}
                      onMouseEnter={() => setHoveredHistoryItem(run.runId)}
                      onMouseLeave={() => setHoveredHistoryItem(null)}
                      className="w-full text-left py-2 px-3 rounded-lg flex items-center gap-2 transition-all duration-200"
                      style={{
                        backgroundColor: isHovered ? "rgba(255,255,255,0.06)" : "transparent",
                        animationDelay: `${idx * 0.05}s`
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-[12px] truncate transition-colors ${isHovered ? "text-white/90" : "text-white/60"}`}>
                          {run.careerTitles.length > 0 ? run.careerTitles[0] : "Roadmap"}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">{dateStr}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </nav>

        {/* ── User profile & Logout ── */}
        {user && (
          <div className={`px-3 pb-5 mt-auto ${sidebarCollapsed && !mobileOpen ? "lg:px-2" : ""}`}>
            <div className={`h-px bg-white/[0.08] mb-3 ${sidebarCollapsed ? "lg:mx-0" : "mx-2"}`} />
            <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${sidebarCollapsed && !mobileOpen ? "lg:justify-center lg:px-0" : ""}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A67A] to-[#A67B52] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold uppercase">
                {(user.user_metadata?.full_name?.[0] ?? user.email?.[0] ?? "U")}
              </div>
              {(!sidebarCollapsed || mobileOpen) && (
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-[13px] font-medium truncate">
                    {user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-white/40 text-[11px] truncate">{user.email}</p>
                </div>
              )}
              {(!sidebarCollapsed || mobileOpen) && (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="group w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-white/40 shadow-sm hover:bg-[#ef4444]/15 hover:border-[#ef4444]/30 hover:text-[#ef4444] hover:shadow-[0_0_12px_rgba(239,68,68,0.2)] transition-all duration-300 ease-out hover:scale-[1.05] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-white/[0.04] relative overflow-hidden"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-[#ef4444]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="relative z-10 transition-transform duration-300 group-hover:-translate-x-[1px]"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" className="transition-transform duration-300 group-hover:translate-x-[2px]" />
                    <line x1="21" y1="12" x2="9" y2="12" className="transition-transform duration-300 group-hover:translate-x-[2px]" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* ──────────── MAIN CONTENT ──────────── */}
      <main
        className={`flex-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] min-h-screen ${sidebarCollapsed ? "lg:ml-[78px]" : "lg:ml-[260px]"
          } ml-0`}
      >
        {children}
      </main>
    </div>
  );
}
