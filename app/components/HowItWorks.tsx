import RevealOnScroll from "./RevealOnScroll";

const steps = [
  {
    number: "01",
    title: "Share your profile",
    description:
      "Tell us your education, skills, and interests. It takes under 2 minutes.",
  },
  {
    number: "02",
    title: "Get career matches",
    description:
      "Receive 2–3 realistic career paths tailored to your unique profile.",
  },
  {
    number: "03",
    title: "Follow your roadmap",
    description:
      "Get a 6‑month plan with clear monthly goals, topics, and learning platforms.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <RevealOnScroll>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            How it works
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-cream sm:text-4xl">
            Three simple steps to clarity
          </h2>
        </RevealOnScroll>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.number} delay={i * 120}>
              <div className="group relative h-full rounded-2xl border border-border bg-bg-card p-8 transition-all hover:border-border-hover hover:bg-bg-elevated">
                {/* Step number */}
                <span className="font-display text-5xl text-border transition-colors group-hover:text-dim">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-cream">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
