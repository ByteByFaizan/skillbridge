"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { APP_NAME, NAV_LINKS } from "@/lib/constants";
import { getCurrentUser, signOut } from "@/lib/auth";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[var(--foreground)]"
        >
          <span className="text-[var(--primary)]">{APP_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center rounded-[var(--radius)] border-2 border-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
          >
            Get Career Guidance
          </Link>
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-[var(--radius)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--section-bg)]"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center rounded-[var(--radius)] px-4 py-2 text-sm font-medium text-[var(--muted)] hover:bg-[var(--section-bg)]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-[var(--radius)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--section-bg)]"
              >
                Login
              </Link>
            )
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[var(--foreground)] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[var(--border)] bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--section-bg)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/discover"
              className="mt-2 block rounded-lg bg-[var(--primary)] px-3 py-3 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get Career Guidance
            </Link>
            {!loading && (
              user ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileOpen(false);
                  }}
                  className="mt-2 block rounded-lg bg-[var(--section-bg)] px-3 py-3 text-center text-sm font-medium text-[var(--foreground)]"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="mt-2 block rounded-lg bg-[var(--section-bg)] px-3 py-3 text-center text-sm font-medium text-[var(--foreground)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
