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
    <section id="features" className="py-16 sm:py-20">
      <div className="max-w-[1060px] mx-auto px-4">
        <RevealOnScroll>
          <p className="text-[#605A57] text-sm font-medium uppercase tracking-widest">
            Features
          </p>
          <h2 className="mt-3 text-[#49423D] text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
            Everything you need to plan your career
          </h2>
          <p className="mt-4 max-w-[506px] text-[#605A57] text-base font-medium leading-7">
            SkillBridge gives you clear, actionable guidance — not generic
            advice.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <RevealOnScroll key={feature.title} delay={i * 100}>
              <div className="p-6 border border-[#e0dedb] bg-white hover:shadow-sm transition-all h-full">
                <div className="mb-4 inline-flex rounded-lg bg-[#f7f5f3] p-2.5">
                  <feature.icon className="h-5 w-5 text-[#49423D]" />
                </div>
                <h3 className="flex items-center gap-2 text-[#49423D] text-sm font-semibold leading-6">
                  {feature.title}
                  {feature.comingSoon && (
                    <span className="px-2 py-0.5 bg-[#f7f5f3] border border-[#e0dedb] text-[10px] font-semibold uppercase tracking-wider text-[#605A57] rounded-full">
                      Coming soon
                    </span>
                  )}
                </h3>
                <p className="mt-1.5 text-[#605A57] text-sm leading-[22px]">
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
