"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { signInWithEmail, signInWithGoogle } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="section-bg min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            Sign in to access your saved careers and progress
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            
            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-[var(--muted)]">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              onClick={handleGoogleLogin}
              className="mt-4 flex items-center justify-center gap-2"
              type="button"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[var(--primary)] hover:underline font-medium">
              Sign up
            </Link>
          </p>

          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            <Link href="/discover" className="hover:underline">
              Continue without signing in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
