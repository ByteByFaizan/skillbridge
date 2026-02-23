import RevealOnScroll from "./RevealOnScroll";

export default function FinalCTA() {
  return (
    <section className="relative py-16 sm:py-20 border-t border-b border-[rgba(55,50,47,0.12)] bg-[#f7f5f3]">
      <div className="relative max-w-[1060px] mx-auto px-4 text-center">
        <RevealOnScroll>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight tracking-tight text-[#37322f]">
            Ready to get clarity on your career?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#605A57] sm:text-lg font-medium leading-7">
            Start your career discovery in minutes. No sign-up. No cost. Just
            clear, personalized guidance.
          </p>
          <div className="mt-10">
            <a
              href="/discover"
              className="group inline-flex items-center gap-2 rounded-full bg-[#37322f] px-8 py-3.5 text-sm font-medium text-white shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
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
