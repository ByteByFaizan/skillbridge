"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Integrate Supabase auth
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex bg-[#f7f5f3]">
      {/* ────────────────────────────── LEFT PANEL ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Deep warm gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2c2724] via-[#37322f] to-[#1e1b19]" />

        {/* Decorative geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Large circle top-right */}
          <div
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/[0.06]"
            style={{
              animation: mounted ? "float-slow 20s ease-in-out infinite" : "none",
            }}
          />
          {/* Medium circle center-left */}
          <div
            className="absolute top-1/3 -left-20 w-[350px] h-[350px] rounded-full bg-white/[0.02]"
            style={{
              animation: mounted ? "float-slow 25s ease-in-out infinite reverse" : "none",
            }}
          />
          {/* Small circle bottom */}
          <div
            className="absolute bottom-20 right-20 w-[180px] h-[180px] rounded-full border border-white/[0.04]"
            style={{
              animation: mounted ? "float-slow 18s ease-in-out infinite" : "none",
            }}
          />
          {/* Diagonal lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diag" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                <line x1="0" y1="0" x2="0" y2="60" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diag)" />
          </svg>
          {/* Noise grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Glowing orb */}
          <div className="absolute top-[40%] left-[45%] w-[300px] h-[300px] rounded-full bg-[#c4a882]/[0.07] blur-[100px]" />
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-30px)",
            transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Top: Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-white/[0.08] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm group-hover:bg-white/[0.12] transition-colors">
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

          {/* Center: Tagline */}
          <div className="max-w-md">
            <h1
              className="text-white/90 text-4xl xl:text-[2.75rem] leading-[1.15] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
            >
              Your personalized
              <br />
              path to career
              <br />
              <span className="text-[#c4a882]">success.</span>
            </h1>
            <p className="text-white/40 text-[15px] leading-relaxed max-w-sm">
              Join thousands of students who have discovered their ideal career path with AI-powered guidance and personalized roadmaps.
            </p>
          </div>

          {/* Bottom: Testimonial */}
          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="flex -space-x-2">
                {[
                  "bg-gradient-to-br from-[#c4a882] to-[#8a7560]",
                  "bg-gradient-to-br from-[#7a8b7a] to-[#556b55]",
                  "bg-gradient-to-br from-[#8b7a7a] to-[#6b5555]",
                ].map((bg, i) => (
                  <div
                    key={i}
                    className={`w-9 h-9 rounded-full ${bg} border-2 border-[#37322f] flex items-center justify-center text-white/80 text-xs font-medium`}
                  >
                    {["A", "S", "M"][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#c4a882" className="opacity-80">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-white/50 text-[13px] leading-relaxed">
                  &ldquo;SkillBridge helped me transition into tech in just 4 months.&rdquo;
                </p>
                <p className="text-white/30 text-xs mt-1">— 2,400+ students guided</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────── RIGHT PANEL (FORM) ─────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div
          className="w-full max-w-[420px]"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          }}
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-10">
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
          <div className="mb-8">
            <h2
              className="text-[#2c2724] text-[28px] tracking-tight mb-2"
              style={{ fontFamily: "var(--font-instrument-serif), 'Georgia', serif" }}
            >
              Welcome back
            </h2>
            <p className="text-[#49423D]/60 text-[15px]">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="group flex items-center justify-center gap-2.5 rounded-xl border border-[#37322f]/[0.08] bg-white px-4 py-3 text-sm font-medium text-[#37322f]/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[#37322f]/[0.15] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="group flex items-center justify-center gap-2.5 rounded-xl border border-[#37322f]/[0.08] bg-white px-4 py-3 text-sm font-medium text-[#37322f]/80 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-[#37322f]/[0.15] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:bg-white transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#37322f" className="shrink-0 opacity-80">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center mb-6">
            <div className="flex-1 h-px bg-[#37322f]/[0.07]" />
            <span className="px-4 text-xs text-[#49423D]/40 font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#37322f]/[0.07]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-[#37322f]/70 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#37322f]/25">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full rounded-xl border border-[#37322f]/[0.08] bg-white py-3 pl-11 pr-4 text-[15px] text-[#2c2724] placeholder:text-[#37322f]/25 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#37322f]/20 focus:ring-2 focus:ring-[#37322f]/[0.06] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[13px] font-medium text-[#37322f]/70 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#37322f]/25">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-[#37322f]/[0.08] bg-white py-3 pl-11 pr-12 text-[15px] text-[#2c2724] placeholder:text-[#37322f]/25 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:border-[#37322f]/20 focus:ring-2 focus:ring-[#37322f]/[0.06] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#37322f]/30 hover:text-[#37322f]/50 transition-colors"
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
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-md border border-[#37322f]/[0.12] bg-white peer-checked:bg-[#37322f] peer-checked:border-[#37322f] transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]" />
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute top-[3px] left-[3px] opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13px] text-[#49423D]/60 group-hover:text-[#49423D]/80 transition-colors select-none">
                  Remember me
                </span>
              </label>
              <a
                href="#"
                className="text-[13px] font-medium text-[#37322f]/50 hover:text-[#37322f] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full mt-2 rounded-xl bg-[#37322f] py-3.5 text-[15px] font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_12px_rgba(55,50,47,0.15)] hover:bg-[#2c2724] hover:shadow-[0_2px_6px_rgba(0,0,0,0.15),0_8px_24px_rgba(55,50,47,0.2)] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              <span className={`inline-flex items-center gap-2 ${isLoading ? "opacity-0" : ""}`}>
                Sign in
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          <p className="mt-8 text-center text-[14px] text-[#49423D]/50">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="font-medium text-[#37322f] hover:text-[#2c2724] transition-colors underline decoration-[#37322f]/20 underline-offset-2 hover:decoration-[#37322f]/40"
            >
              Create account
            </a>
          </p>

          {/* Terms */}
          <p className="mt-6 text-center text-[12px] text-[#49423D]/30 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:text-[#49423D]/50 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:text-[#49423D]/50 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* ──────────── CSS Animations ──────────── */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(15px, -20px) scale(1.02);
          }
          66% {
            transform: translate(-10px, 15px) scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}
