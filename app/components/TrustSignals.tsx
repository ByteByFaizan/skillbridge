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
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <RevealOnScroll>
          <div className="rounded-2xl border border-border bg-bg-card p-8 sm:p-12">
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
              {signals.map((signal) => (
                <div key={signal.title} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex rounded-lg bg-bg-elevated p-2.5">
                      <signal.icon className="h-5 w-5 text-cream" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-cream">{signal.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
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
