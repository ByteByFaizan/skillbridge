export default function Loader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function LoaderOverlay({ message = "Analyzing your profile…" }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader className="h-10 w-10" />
        <p className="text-[var(--muted)]">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skillbridge-card animate-pulse overflow-hidden p-6">
      <div className="mb-4 h-6 w-2/3 rounded bg-[var(--border)]" />
      <div className="mb-2 h-4 w-full rounded bg-[var(--border)]" />
      <div className="mb-2 h-4 w-5/6 rounded bg-[var(--border)]" />
      <div className="h-4 w-4/6 rounded bg-[var(--border)]" />
    </div>
  );
}
