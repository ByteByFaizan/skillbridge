import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const HOW_IT_WORKS = [
  {
    title: "Tell Us About You",
    description: "Share your education, skills, and interests in a simple form — takes less than a minute.",
  },
  {
    title: "AI Analyzes Your Profile",
    description: "Our AI career counselor matches you with realistic career paths and skill gaps.",
  },
  {
    title: "Get Career Path + Roadmap",
    description: "Receive 2–3 career suggestions and a clear 6-month learning roadmap.",
  },
];

const CAREER_EXAMPLES = [
  { title: "Data Analyst", skills: ["Excel", "SQL", "Statistics"], tag: "High Demand" },
  { title: "UI/UX Designer", skills: ["Figma", "User Research", "Prototyping"], tag: "High Demand" },
  { title: "Software Developer", skills: ["Programming", "Problem Solving", "Version Control"], tag: "High Demand" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero — Pixelia-style split */}
      <section className="relative overflow-hidden section-bg py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--secondary)]/5 pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:gap-12">
          <div className="lg:max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl md:text-5xl animate-fade-in-up">
              Discover the right career path — guided by AI
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)] animate-fade-in-up animate-delay-1">
              Personalized career guidance, skill gap analysis, and a clear learning roadmap for students and early-career learners.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 animate-fade-in-up animate-delay-2">
              <Link href="/discover">
                <Button size="lg" className="transition hover:scale-[1.02] active:scale-[0.98]">Get My Career Roadmap</Button>
              </Link>
              <Link href="/discover">
                <Button variant="outline" size="lg" className="transition hover:scale-[1.02] active:scale-[0.98]">Explore Careers</Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:flex-shrink-0 animate-fade-in-up animate-delay-2">
            <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/15 to-[var(--secondary)]/10 md:h-80 lg:h-96 border border-[var(--primary)]/10">
              <svg className="h-32 w-32 md:h-40 md:w-40 text-[var(--primary)]/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — 3-step cards */}
      <section className="py-16" id="how-it-works">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-[var(--foreground)] md:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[var(--muted)]">
            Three simple steps to your personalized career roadmap.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <Card key={step.title}>
                <CardHeader>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <CardTitle className="mt-3">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--muted)]">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Examples */}
      <section className="section-bg py-16" id="career-examples">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-[var(--foreground)] md:text-3xl">
            Career Examples
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-[var(--muted)]">
            Explore paths we can help you discover.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAREER_EXAMPLES.map((career) => (
              <Card key={career.title}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle>{career.title}</CardTitle>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      {career.tag}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--muted)]">Key skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {career.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded-md bg-[var(--section-bg)] px-2 py-0.5 text-xs text-[var(--foreground)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/discover">
              <Button variant="primary">Find Your Career Fit</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
