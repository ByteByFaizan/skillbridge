"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Wordmark */}
        <a
          href="/"
          className="font-display text-xl tracking-tight text-cream"
        >
          SkillBridge
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="/discover"
          className="hidden rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98] md:inline-flex"
        >
          Start Career Discovery
        </a>

        {/* Mobile menu toggle */}
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:text-cream md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-white/95 backdrop-blur-lg md:hidden animate-fade-in">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-muted transition-colors hover:bg-bg-elevated hover:text-cream"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/discover"
              className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white transition-all hover:bg-accent-hover"
            >
              Start Career Discovery
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
