export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-radial from-[#37322f]/[0.03] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1060px] mx-auto px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Hero Content */}
          <div className="max-w-[937px] flex flex-col items-center gap-6">
            <h1 className="max-w-[748px] text-center text-[#37322f] text-4xl sm:text-5xl md:text-[80px] font-normal leading-tight md:leading-[96px] font-display animate-fade-in-up">
              Find a career path that fits you — and a plan to get started
            </h1>
            <p className="max-w-[506px] text-center text-[#49423D] text-lg font-medium leading-7 animate-fade-in-up animation-delay-200">
              Answer a few questions about your education, skills, and interests.
              Get 2–3 realistic career options, your skill gaps, and a
              month-by-month roadmap.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4 animate-fade-in-up animation-delay-400">
            <a
              href="/discover"
              className="group h-11 px-12 bg-[#37322f] hover:bg-[#2A2520] text-white rounded-full font-medium text-sm transition-all duration-300 inline-flex items-center gap-2 shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:shadow-[0_4px_16px_rgba(55,50,47,0.25)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Career Discovery
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
            <p className="text-[#605A57] text-sm font-medium">
              No sign-up required · Takes under 2 minutes
            </p>
          </div>

          {/* Trust line */}
          <p className="text-[#49423D]/70 text-sm font-medium animate-fade-in-up animation-delay-600">
            Built for students and early careers. Simple language. Fast results.
          </p>
        </div>
      </div>
    </section>
  );
}
