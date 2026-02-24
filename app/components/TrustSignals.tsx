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
        <RevealOnScroll>
          <div className="border border-[#e0dedb] bg-white p-8 sm:p-10">
            <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
              {signals.map((signal) => (
                <div key={signal.title} className="flex gap-3.5">
                  <div className="flex-shrink-0">
                    <div className="inline-flex rounded-lg bg-[#f7f5f3] p-2.5">
                      <signal.icon className="h-5 w-5 text-[#37322f]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#37322f]">{signal.title}</h3>
                    <p className="mt-1 text-sm leading-[22px] text-[#49423D]/80">
                      {signal.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
