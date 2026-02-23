export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-44 sm:pb-28">
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-1.5 text-xs font-medium text-muted animate-fade-in-up">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cream animate-pulse" />
          AI-powered career guidance
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl leading-[1.15] tracking-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up animation-delay-100">
          Find a career path that fits you — and a 6&#x2011;month plan to get
          started
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg animate-fade-in-up animation-delay-200">
          Answer a few questions about your education, skills, and interests.
          Get 2–3 realistic career options, your skill gaps, and a
          month-by-month roadmap.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center gap-4 animate-fade-in-up animation-delay-300">
          <a
            href="/discover"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-white transition-all hover:bg-accent-hover hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Career Discovery
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
          <p className="text-sm text-dim">
            No sign-up required · Takes under 2 minutes
          </p>
        </div>

        {/* Trust line */}
        <p className="mt-16 text-sm text-dim animate-fade-in-up animation-delay-400">
          Built for students and early careers. Simple language. Fast results.
        </p>
      </div>
    </section>
  );
}
