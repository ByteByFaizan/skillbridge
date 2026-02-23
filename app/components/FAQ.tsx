"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import RevealOnScroll from "./RevealOnScroll";

const faqs = [
  {
    question: "What do I need to provide?",
    answer:
      "Just your education level, current skills, interests, and optionally a career goal. The more detail you provide, the better your results will be.",
  },
  {
    question: "How long does it take?",
    answer:
      "Filling out your profile takes under 2 minutes. Your career recommendations, skill gaps, and roadmap are generated in about 10 seconds.",
  },
  {
    question: "Do I need to sign up?",
    answer:
      "No sign-up is required to get your first career recommendations. You can create an account later if you want to save your results and track progress.",
  },
  {
    question: "How accurate are the recommendations?",
    answer:
      "Our AI analyzes your profile against real industry data to suggest realistic career paths. Results improve with more detailed inputs — specifics about your skills and interests help the most.",
  },
  {
    question: "What does the roadmap include?",
    answer:
      "A structured 6-month plan broken into monthly milestones. Each month lists specific topics to learn, tools to practice with, and recommended learning platforms.",
  },
  {
    question: "What data do you store?",
    answer:
      "We only store what you explicitly provide — your profile inputs and generated results. No sensitive personal data is stored without your consent. You can delete your data at any time.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <RevealOnScroll>
          <p className="text-sm font-medium uppercase tracking-widest text-muted">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-cream sm:text-4xl">
            Common questions
          </h2>
        </RevealOnScroll>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => (
            <RevealOnScroll key={i} delay={i * 60}>
              <Disclosure
                as="div"
                className="rounded-xl border border-border bg-white transition-colors data-[open]:border-border-hover data-[open]:bg-bg-card"
              >
                <DisclosureButton className="group flex w-full items-center justify-between px-6 py-5 text-left">
                  <span className="pr-4 text-sm font-semibold text-cream sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDownIcon className="h-4 w-4 flex-shrink-0 text-muted transition-transform duration-200 group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-muted">
                    {faq.answer}
                  </p>
                </DisclosurePanel>
              </Disclosure>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
