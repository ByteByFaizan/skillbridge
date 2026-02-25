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
  },
  {
    icon: ChartBarIcon,
    title: "Skill Gap Analysis",
    description:
      "See what you already have vs what to learn, with High, Medium, and Low priorities.",
  },
  {
    icon: MapIcon,
    title: "6‑Month Learning Roadmap",
    description:
      "Month-by-month topics, tools, and recommended platforms — all planned out for you.",
  },
  {
    icon: Squares2X2Icon,
    title: "Career Dashboard",
    description:
      "Save and revisit your career plan anytime. Track your learning progress in one place.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="max-w-[1060px] mx-auto px-4">
        <RevealOnScroll>
          <p className="text-[#605A57] text-sm font-medium uppercase tracking-widest">
            Features
          </p>
          <h2 className="mt-3 text-[#37322f] text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
            Everything you need to plan your career
          </h2>
          <p className="mt-4 max-w-[506px] text-[#49423D]/80 text-base font-medium leading-7">
            SkillBridge gives you clear, actionable guidance — not generic
            advice.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <RevealOnScroll key={feature.title} delay={i * 100}>
              <div className="group p-6 border border-[#e0dedb]/80 bg-white h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#37322f]/20 hover:shadow-[0_8px_30px_rgba(55,50,47,0.06)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f7f5f3]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="mb-4 inline-flex rounded-lg bg-[#f7f5f3] p-2.5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 relative z-10">
                  <feature.icon className="h-5 w-5 text-[#37322f]" />
                </div>
                <h3 className="flex items-center gap-2 text-[#37322f] text-sm font-semibold leading-6 relative z-10">
                  {feature.title}
                </h3>
                <p className="mt-1.5 text-[#49423D]/80 text-sm leading-[22px] relative z-10">
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
