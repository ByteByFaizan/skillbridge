import RevealOnScroll from "./RevealOnScroll";

const steps = [
  {
    number: "01",
    title: "Share your profile",
    description:
      "Tell us your education, skills, and interests. It takes under 2 minutes.",
    highlighted: true,
  },
  {
    number: "02",
    title: "Get career matches",
    description:
      "Receive 2–3 realistic career paths tailored to your unique profile.",
    highlighted: false,
  },
  {
    number: "03",
    title: "Follow your roadmap",
    description:
      "Get a 6‑month plan with clear monthly goals, topics, and learning platforms.",
    highlighted: false,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-[#e0dedb] border-b border-b-[#e0dedb]">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="py-16 sm:py-20">
          <RevealOnScroll>
            <p className="text-[#605A57] text-sm font-medium uppercase tracking-widest">
              How it works
            </p>
            <h2 className="mt-3 text-[#49423D] text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
              Three simple steps to clarity
            </h2>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <RevealOnScroll key={step.number} delay={i * 120}>
                <div
                  className={`p-6 flex flex-col gap-2 ${
                    step.highlighted
                      ? "bg-white border border-[#e0dedb] shadow-sm"
                      : "border border-[#e0dedb]/80"
                  }`}
                >
                  {step.highlighted && (
                    <div className="space-y-1 mb-2">
                      <div className="w-full h-0.5 bg-[#322d2b]/8"></div>
                      <div className="w-32 h-0.5 bg-[#322d2b]"></div>
                    </div>
                  )}
                  <h3 className="text-[#49423D] text-sm font-semibold leading-6">
                    {step.title}
                  </h3>
                  <p className="text-[#605A57] text-sm leading-[22px]">
                    {step.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
