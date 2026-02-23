export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-36 sm:pb-20">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Hero Content */}
          <div className="max-w-[937px] flex flex-col items-center gap-6">
            <h1 className="max-w-[748px] text-center text-[#37322f] text-4xl sm:text-5xl md:text-[80px] font-normal leading-tight md:leading-[96px] font-display animate-fade-in-up">
              Find a career path that fits you — and a plan to get started
            </h1>
            <p className="max-w-[506px] text-center text-[#37322f]/80 text-lg font-medium leading-7 animate-fade-in-up animation-delay-100">
              Answer a few questions about your education, skills, and interests.
              Get 2–3 realistic career options, your skill gaps, and a
              month-by-month roadmap.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4 animate-fade-in-up animation-delay-200">
            <a
              href="/discover"
              className="h-10 px-12 bg-[#37322f] hover:bg-[#2A2520] text-white rounded-full font-medium text-sm transition-colors inline-flex items-center shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset]"
            >
              Start Career Discovery
            </a>
            <p className="text-[#605A57] text-sm font-medium">
              No sign-up required · Takes under 2 minutes
            </p>
          </div>

          {/* Trust line */}
          <p className="text-[#605A57] text-sm font-medium animate-fade-in-up animation-delay-300">
            Built for students and early careers. Simple language. Fast results.
          </p>
        </div>
      </div>
    </section>
  );
}
