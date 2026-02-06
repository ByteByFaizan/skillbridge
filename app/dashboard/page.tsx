import Link from "next/link";
import SavedCareers from "@/components/dashboard/SavedCareers";
import ProgressTracker from "@/components/dashboard/ProgressTracker";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div className="section-bg min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
        <p className="mt-1 text-[var(--muted)]">
          Your saved careers and progress in one place.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <SavedCareers />
          <ProgressTracker />
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent AI Advice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--muted)]">
              Your latest personalized advice will show here after you complete career discovery.
            </p>
            <Link href="/discover" className="mt-4 inline-block">
              <Button variant="outline" size="sm">Get Career Guidance</Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Link href="/discover">
            <Button>Get My Career Roadmap</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
