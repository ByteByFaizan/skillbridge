"use client";

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

function LoginPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formTilt, setFormTilt] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* ── Mouse parallax for left panel ────────────────────── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!leftPanelRef.current) return;
    const rect = leftPanelRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  /* ── 3D tilt for form card ────────────────────────────── */
  const handleFormMouseMove = useCallback((e: React.MouseEvent) => {
    if (!formRef.current) return;
    const rect = formRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setFormTilt({ x: y * -4, y: x * 4 });
  }, []);

  const handleFormMouseLeave = useCallback(() => {
    setFormTilt({ x: 0, y: 0 });
  }, []);

  /* ── Read callback error from URL ─────────────────── */
  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "auth_callback_failed") {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  /* ── OAuth (Google / GitHub) ──────────────────────── */
  const handleOAuth = async (provider: "google" | "github") => {
    setError(null);
    setIsLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const redirectTo = `${window.location.origin}/api/auth/callback`;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("OAuth sign-in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Email + Password submit ─────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error?.message ?? data.error ?? "Sign-up failed.");
        } else {
          setSuccessMsg("Check your email to confirm your account, then sign in.");
          setMode("login");
        }
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error?.message ?? data.error ?? "Invalid credentials.");
        } else {
          const redirect = searchParams.get("redirect") ?? "/dashboard";
          router.push(redirect);
          router.refresh();
          return; // keep spinner until navigation completes
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Stagger helper — spring-overshoot easing ─────────── */
  const stagger = (index: number, base = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0) scale(1)" : "translateY(28px) scale(0.96)",
    transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${base + index * 0.07}s, transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${base + index * 0.07}s`,
  });

  /* ── Floating particles (memoized) ────────────────────── */
  const particles = useMemo(
    () =>
      Array.from({ length: 35 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 20 + 12,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.25 + 0.05,
      })),
    []
  );

  return (
    <div className="min-h-screen flex bg-[#f7f5f3] overflow-hidden">
      {/* ────────────────────────────── LEFT PANEL ────────────────────────────── */}
      <div
        ref={leftPanelRef}
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Animated gradient base */}
        <div className="absolute inset-0 login-gradient-shift" />

        {/* Decorative elements w/ parallax */}
        <div className="absolute inset-0 overflow-hidden">
          {/* ░░ Morphing blob — top-right ░░ */}
          <div
            className="absolute -top-24 -right-24"
            style={{
              opacity: mounted ? 1 : 0,
              transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -18}px) scale(${mounted ? 1 : 0.4})`,
              transition: mounted
                ? "opacity 1.2s ease-out, transform 0.15s linear"
                : "opacity 1.2s ease-out 0.3s, transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s",
            }}
          >
            <div className="w-[500px] h-[500px] login-morph-blob border border-white/[0.06]" />
          </div>

          {/* ░░ Morphing blob — center-left (deeper parallax) ░░ */}
          <div
            className="absolute top-1/3 -left-16"
            style={{
              opacity: mounted ? 1 : 0,
              transform: `translate(${mousePos.x * 35}px, ${mousePos.y * 28}px) scale(${mounted ? 1 : 0.3})`,
              transition: mounted
                ? "opacity 1.2s ease-out, transform 0.2s linear"
                : "opacity 1.2s ease-out 0.5s, transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s",
            }}
          >
            <div className="w-[350px] h-[350px] login-morph-blob-alt bg-white/[0.025]" />
          </div>

          {/* ░░ Rotating ring — bottom-right ░░ */}
          <div
            className="absolute bottom-20 right-20"
            style={{
              opacity: mounted ? 1 : 0,
              transform: `translate(${mousePos.x * -45}px, ${mousePos.y * -38}px) scale(${mounted ? 1 : 0})`,
              transition: mounted
                ? "opacity 1.2s ease-out, transform 0.25s linear"
                : "opacity 1.2s ease-out 0.7s, transform 1.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s",
            }}
          >
            <div className="w-[180px] h-[180px] rounded-full border border-white/[0.05] login-spin-slow" />
          </div>

          {/* ░░ Tiny accent ring — mid-right ░░ */}
          <div
            className="absolute top-[55%] right-[15%]"
            style={{
              opacity: mounted ? 0.6 : 0,
              transform: `translate(${mousePos.x * -55}px, ${mousePos.y * -40}px) scale(${mounted ? 1 : 0})`,
              transition: mounted
                ? "opacity 1s ease-out, transform 0.2s linear"
                : "opacity 1s ease-out 0.9s, transform 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s",
            }}
          >
            <div className="w-[60px] h-[60px] rounded-full border border-[#c4a882]/[0.12] login-spin-slow-reverse" />
          </div>

          {/* ░░ Floating particles (client-only to avoid hydration mismatch) ░░ */}
          {mounted && particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full bg-white login-particle"
              style={{
                width: p.size,
                height: p.size,
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: p.opacity,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}

          {/* Diagonal line pattern — fade in */}
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              opacity: mounted ? 0.03 : 0,
              transition: "opacity 2s ease-out 0.6s",
            }}
          >
            <defs>
              <pattern id="diag" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                <line x1="0" y1="0" x2="0" y2="60" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>

          {/* Noise grain */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            }}
          />

          {/* ░░ Primary orb w/ parallax ░░ */}
          <div
            className="absolute top-[38%] left-[42%] w-[320px] h-[320px] rounded-full bg-[#c4a882]/[0.08] blur-[100px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: `translate(${mousePos.x * 50}px, ${mousePos.y * 40}px)`,
              transition: mounted
                ? "opacity 1.5s ease-out 0.4s, transform 0.3s ease-out"
                : "opacity 1.5s ease-out 0.4s",
              animation: mounted ? "orb-pulse 6s ease-in-out 1.5s infinite" : "none",
            }}
          />

          {/* ░░ Secondary accent orb ░░ */}
          <div
            className="absolute bottom-[18%] left-[18%] w-[220px] h-[220px] rounded-full bg-[#c4a882]/[0.05] blur-[80px]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: `translate(${mousePos.x * -35}px, ${mousePos.y * -28}px)`,
              transition: "opacity 1.8s ease-out 0.7s, transform 0.35s ease-out",
              animation: mounted ? "orb-pulse 8s ease-in-out 2.2s infinite reverse" : "none",
            }}
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top: Brand */}
          <div
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateX(0) translateY(0) scale(1)" : "translateX(-24px) translateY(-12px) scale(0.92)",
              transition: "all 1s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s",
            }}
          >
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm group-hover:bg-white/[0.15] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span
                className="text-white/90 text-xl tracking-tight font-semibold"
                style={{ fontFamily: "'DM Serif Display', 'Georgia', serif" }}
              >
                SkillBridge
              </span>
            </Link>
          </div>

          {/* Center: Tagline — letter stagger */}
          <div className="max-w-md">
            <h1
              className="text-white/90 text-4xl xl:text-[2.75rem] leading-[1.15] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
            >
              <span className="inline-block" style={stagger(0, 0.3)}>Your personalized</span>
              <br />
              <span className="inline-block" style={stagger(1, 0.3)}>path to career</span>
              <br />
              <span
                className="inline-block login-gold-shimmer"
                style={{
                  ...stagger(2, 0.3),
                  color: "#c4a882",
                }}
              >
                success.
              </span>
            </h1>
            <p
              className="text-white/55 text-[15px] leading-relaxed max-w-sm"
              style={stagger(3, 0.3)}
            >
              Discover your ideal career path with AI-powered guidance and personalized roadmaps tailored just for you.
            </p>

          </div>

          {/* Spacer */}
          <div />
        </div>
      </div>

      {/* ─────────────────────────── RIGHT PANEL (FORM) ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div
          ref={formRef}
          className="w-full max-w-[420px]"
          onMouseMove={handleFormMouseMove}
          onMouseLeave={handleFormMouseLeave}
          style={{
            transform: `perspective(1200px) rotateX(${formTilt.x}deg) rotateY(${formTilt.y}deg)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-10" style={stagger(0, 0.1)}>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#37322f] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/90">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span
                className="text-[#37322f] text-lg font-semibold tracking-tight"
                style={{ fontFamily: "'DM Serif Display', 'Georgia', serif" }}
              >
                SkillBridge
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8" style={stagger(0, 0.15)}>
            <h2
              className="text-[#2c2724] text-[28px] tracking-tight mb-2"
              style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
            >
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-[#49423D]/60 text-[15px]" style={stagger(1, 0.15)}>
              {mode === "login"
                ? "Enter your credentials to access your account"
                : "Start your personalized career journey"}
            </p>
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-[fade-in_0.3s_ease-out]">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 animate-[fade-in_0.3s_ease-out]">
              {successMsg}
            </div>
          )}

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6" style={stagger(2, 0.15)}>
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-2.5 rounded-xl border border-[#37322f]/[0.08] bg-white px-4 py-3 text-sm font-medium text-[#37322f]/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[#37322f]/[0.15] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-white hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#37322f]/[0.02] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0 group-hover:scale-110 transition-transform duration-300">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth("github")}
              disabled={isLoading}
              className="group relative flex items-center justify-center gap-2.5 rounded-xl border border-[#37322f]/[0.08] bg-white px-4 py-3 text-sm font-medium text-[#37322f]/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[#37322f]/[0.15] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:bg-white hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#37322f]/[0.02] to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#37322f" className="shrink-0 opacity-80 group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-500">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-6" style={stagger(3, 0.15)}>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#37322f]/[0.08] to-transparent" />
            <span className="px-4 text-xs text-[#49423D]/55 font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#37322f]/[0.08] to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (signup only) */}
            {mode === "signup" && (
              <div style={stagger(3.5, 0.15)}>
                <label htmlFor="name" className="block text-[13px] font-medium text-[#37322f]/70 mb-1.5">
                  Full name
                </label>
                <div className={`relative login-input-wrap ${focusedField === "name" ? "login-input-focused" : ""}`}>
                  <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-all duration-300 ${focusedField === "name" ? "scale-110" : ""}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors duration-300 ${focusedField === "name" ? "text-[#c4a882]" : "text-[#37322f]/40"}`}>
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-[#37322f]/[0.08] bg-white py-3 pl-11 pr-4 text-[15px] text-[#2c2724] placeholder:text-[#37322f]/40 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#c4a882]/30 focus:shadow-[0_0_0_3px_rgba(196,168,130,0.08),0_0_20px_rgba(196,168,130,0.06)] transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div style={stagger(4, 0.15)}>
              <label htmlFor="email" className="block text-[13px] font-medium text-[#37322f]/70 mb-1.5">
                Email address
              </label>
              <div className={`relative login-input-wrap ${focusedField === "email" ? "login-input-focused" : ""}`}>
                <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-all duration-300 ${focusedField === "email" ? "scale-110" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors duration-300 ${focusedField === "email" ? "text-[#c4a882]" : "text-[#37322f]/40"}`}>
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-xl border border-[#37322f]/[0.08] bg-white py-3 pl-11 pr-4 text-[15px] text-[#2c2724] placeholder:text-[#37322f]/40 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#c4a882]/30 focus:shadow-[0_0_0_3px_rgba(196,168,130,0.08),0_0_20px_rgba(196,168,130,0.06)] transition-all duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div style={stagger(5, 0.15)}>
              <label htmlFor="password" className="block text-[13px] font-medium text-[#37322f]/70 mb-1.5">
                Password
              </label>
              <div className={`relative login-input-wrap ${focusedField === "password" ? "login-input-focused" : ""}`}>
                <div className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-all duration-300 ${focusedField === "password" ? "scale-110" : ""}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors duration-300 ${focusedField === "password" ? "text-[#c4a882]" : "text-[#37322f]/40"}`}>
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-[#37322f]/[0.08] bg-white py-3 pl-11 pr-12 text-[15px] text-[#2c2724] placeholder:text-[#37322f]/40 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#c4a882]/30 focus:shadow-[0_0_0_3px_rgba(196,168,130,0.08),0_0_20px_rgba(196,168,130,0.06)] transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#37322f]/30 hover:text-[#37322f]/50 hover:scale-110 active:scale-95 transition-all duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between pt-1" style={stagger(6, 0.15)}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-md border border-[#37322f]/[0.12] bg-white peer-checked:bg-[#37322f] peer-checked:border-[#37322f] peer-checked:scale-110 transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" />
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute top-[3px] left-[3px] opacity-0 peer-checked:opacity-100 transition-all duration-300 peer-checked:animate-[check-pop_0.3s_ease-out]"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13px] text-[#49423D]/70 group-hover:text-[#49423D]/90 transition-colors select-none">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-[13px] font-medium text-[#37322f]/65 hover:text-[#c4a882] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-[#c4a882]/50 hover:after:w-full after:transition-all after:duration-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="login-submit-btn group relative w-full mt-2 rounded-xl bg-[#37322f] py-3.5 text-[15px] font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_12px_rgba(55,50,47,0.15)] hover:bg-[#2c2724] hover:shadow-[0_4px_12px_rgba(0,0,0,0.2),0_12px_32px_rgba(55,50,47,0.25)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_12px_rgba(55,50,47,0.15)] transition-all duration-300 cursor-pointer"
              style={stagger(7, 0.15)}
            >
              {/* Shine sweep */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                <div className="absolute inset-0 login-btn-shine-sweep" />
              </div>
              {/* Ripple on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className={`relative z-10 inline-flex items-center gap-2 ${isLoading ? "opacity-0" : ""}`}>
                {mode === "login" ? "Sign in" : "Create account"}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-200">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-[14px] text-[#49423D]/65" style={stagger(8, 0.15)}>
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError(null);
                setSuccessMsg(null);
              }}
              className="font-medium text-[#37322f] hover:text-[#c4a882] transition-colors duration-300 underline decoration-[#37322f]/20 underline-offset-2 hover:decoration-[#c4a882]/40 cursor-pointer"
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>

          {/* Terms */}
          <p className="mt-6 text-center text-[12px] text-[#49423D]/45 leading-relaxed" style={stagger(9, 0.15)}>
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-[#49423D]/50 transition-colors duration-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-[#49423D]/50 transition-colors duration-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* ──────────── CSS Animations ──────────── */}
      { }
      <style dangerouslySetInnerHTML={{
        __html: `
        /* ▸ Animated gradient background */
        .login-gradient-shift {
          background: linear-gradient(135deg, #2c2724 0%, #37322f 25%, #1e1b19 50%, #2c2724 75%, #37322f 100%);
          background-size: 400% 400%;
          animation: gradient-shift 18s ease infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }

        /* ▸ Morphing blob shapes */
        .login-morph-blob {
          border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          animation: morph-1 20s ease-in-out infinite;
        }
        @keyframes morph-1 {
          0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; }
          50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; }
          75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; }
        }
        .login-morph-blob-alt {
          border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          animation: morph-2 25s ease-in-out infinite;
        }
        @keyframes morph-2 {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          25% { border-radius: 40% 60% 70% 30% / 40% 50% 50% 60%; }
          50% { border-radius: 70% 30% 50% 50% / 30% 60% 40% 70%; }
          75% { border-radius: 50% 50% 40% 60% / 70% 40% 60% 30%; }
        }

        /* ▸ Floating particles */
        .login-particle {
          animation: particle-drift linear infinite;
        }
        @keyframes particle-drift {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: inherit;
          }
          25% {
            transform: translateY(-40px) translateX(20px) scale(1.3);
          }
          50% {
            transform: translateY(-20px) translateX(-15px) scale(0.8);
          }
          75% {
            transform: translateY(-60px) translateX(25px) scale(1.1);
          }
          100% {
            transform: translateY(-80px) translateX(0) scale(0.6);
            opacity: 0;
          }
        }

        /* ▸ Rotating rings */
        .login-spin-slow {
          animation: slow-spin 35s linear infinite;
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .login-spin-slow-reverse {
          animation: slow-spin 28s linear infinite reverse;
        }

        /* ▸ Orb pulse */
        @keyframes orb-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        /* ▸ Gold shimmer on "success." */
        .login-gold-shimmer {
          background: linear-gradient(
            90deg,
            #c4a882 0%,
            #e8d5b8 35%,
            #fff5e6 50%,
            #e8d5b8 65%,
            #c4a882 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out 1.2s infinite;
        }
        @keyframes shimmer {
          0%, 100% { background-position: 100% 0; }
          50% { background-position: -100% 0; }
        }

        /* ▸ Stat icon pulse */
        .login-stat-pulse {
          animation: stat-glow 3s ease-in-out infinite;
        }
        @keyframes stat-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(196, 168, 130, 0);
          }
          50% {
            box-shadow: 0 0 12px 2px rgba(196, 168, 130, 0.08);
          }
        }

        /* ▸ Input field glow */
        .login-input-wrap {
          position: relative;
        }
        .login-input-wrap::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 13px;
          background: linear-gradient(135deg, transparent, rgba(196, 168, 130, 0.2), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: -1;
        }
        .login-input-focused::before {
          opacity: 1;
          animation: input-glow-pulse 2s ease-in-out infinite;
        }
        @keyframes input-glow-pulse {
          0%, 100% {
            opacity: 0.5;
            box-shadow: 0 0 8px 1px rgba(196, 168, 130, 0.1);
          }
          50% {
            opacity: 1;
            box-shadow: 0 0 16px 3px rgba(196, 168, 130, 0.15);
          }
        }

        /* ▸ Button shine sweep */
        .login-btn-shine-sweep {
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255, 255, 255, 0.06) 45%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.06) 55%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: btn-shine 4s ease-in-out 2s infinite;
        }
        @keyframes btn-shine {
          0% { background-position: 200% 0; }
          50%, 100% { background-position: -200% 0; }
        }

        /* ▸ Submit button hover glow */
        .login-submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          opacity: 0;
          box-shadow: 0 0 20px 4px rgba(196, 168, 130, 0.12);
          transition: opacity 0.3s ease;
        }
        .login-submit-btn:hover::after {
          opacity: 1;
        }

        /* ▸ Checkbox pop */
        @keyframes check-pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        /* ▸ Fade-in for error/success messages */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      ` }} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
