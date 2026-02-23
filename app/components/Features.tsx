import {
  SparklesIcon,
  ChartBarIcon,
  MapIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import RevealOnScroll from "./RevealOnScroll";

const features = [
  {
    icon: SparklesIcon,
    title: "Smart Career Discovery",
    description:
      "2–3 realistic career paths with a clear reason for each, matched to your unique profile.",
    comingSoon: false,
  },
  {
    icon: ChartBarIcon,
    title: "Skill Gap Analysis",
    description:
      "See what you already have vs what to learn, with High, Medium, and Low priorities.",
    comingSoon: false,
  },
  {
    icon: MapIcon,
    title: "6‑Month Learning Roadmap",
    description:
      "Month-by-month topics, tools, and recommended platforms — all planned out for you.",
    comingSoon: false,
  },
  {
    icon: Squares2X2Icon,
    title: "Career Dashboard",
    description:
      "Save and revisit your career plan anytime. Track your learning progress in one place.",
    comingSoon: true,
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 bg-bg-card">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <RevealOnScroll>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            Features
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-cream sm:text-4xl">
            Everything you need to plan your career
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted">
            SkillBridge gives you clear, actionable guidance — not generic
            advice.
          </p>
        </RevealOnScroll>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <RevealOnScroll key={feature.title} delay={i * 100}>
              <div className="group relative h-full rounded-2xl border border-border bg-white p-8 transition-all hover:border-border-hover hover:shadow-sm">
                <div className="mb-5 inline-flex rounded-xl bg-bg-elevated p-3">
                  <feature.icon className="h-6 w-6 text-cream" />
                </div>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-cream">
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="rounded-full bg-bg-elevated px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                      Coming soon
                    </span>
                  )}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
