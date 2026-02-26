import {
  ChatBubbleBottomCenterTextIcon,
  BoltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import RevealOnScroll from "./RevealOnScroll";

const signals = [
  {
    icon: ChatBubbleBottomCenterTextIcon,
    title: "Simple language",
    description: "Written at a Grade 8 reading level. No jargon, no buzzwords.",
  },
  {
    icon: BoltIcon,
    title: "Fast results",
    description: "Get your first career recommendations in under 10 seconds.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Privacy-first",
    description: "No sensitive personal data stored without your consent.",
  },
];

export default function TrustSignals() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-[1060px] mx-auto px-4">
        {/* Section heading — matches Features / HowItWorks pattern */}
        <RevealOnScroll>
          <p className="text-[#605A57] text-sm font-medium uppercase tracking-widest">
            Why SkillBridge
          </p>
          <h2 className="mt-3 text-[#37322f] text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
            Built for students, not spreadsheets
          </h2>
          <p className="mt-4 max-w-[506px] text-[#49423D]/80 text-base font-medium leading-7">
            Clear guidance, fast answers, and no risk to your privacy.
          </p>
        </RevealOnScroll>

        {/* Cards — staggered reveal, matching Features card style */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {signals.map((signal, i) => (
            <RevealOnScroll key={signal.title} delay={i * 100}>
              <div className="group p-6 border border-[#e0dedb]/80 bg-white h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#37322f]/20 hover:shadow-[0_8px_30px_rgba(55,50,47,0.06)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f7f5f3]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="mb-4 inline-flex rounded-lg bg-[#f7f5f3] p-2.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 relative z-10">
                  <signal.icon className="h-5 w-5 text-[#37322f]" />
                </div>
                <h3 className="text-[#37322f] text-sm font-semibold leading-6 relative z-10">
                  {signal.title}
                </h3>
                <p className="mt-1.5 text-[#49423D]/80 text-sm leading-[22px] relative z-10">
                  {signal.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
