import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="section-bg border-t border-[var(--border)] py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="text-lg font-semibold text-[var(--primary)]">
            {APP_NAME}
          </Link>
          <nav className="flex gap-6 text-sm text-[var(--muted)]">
            <Link href="/" className="hover:text-[var(--primary)]">Home</Link>
            <Link href="/discover" className="hover:text-[var(--primary)]">Discover</Link>
            <Link href="/dashboard" className="hover:text-[var(--primary)]">Dashboard</Link>
          </nav>
        </div>
        <p className="mt-6 text-center text-sm text-[var(--muted)]">
          Personalized career guidance for students and early-career learners.
        </p>
      </div>
    </footer>
  );
}
