import RevealOnScroll from "./RevealOnScroll";

export default function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-32 bg-bg-card">
      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <RevealOnScroll>
          <h2 className="font-display text-3xl tracking-tight text-cream sm:text-4xl lg:text-5xl">
            Ready to get clarity on your career?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted sm:text-lg">
            Start your career discovery in minutes. No sign-up. No cost. Just
            clear, personalized guidance.
          </p>
          <div className="mt-10">
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
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
