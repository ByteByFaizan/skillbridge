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
    <section id="faq" className="py-16 sm:py-20 border-t border-[#e0dedb]">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="grid gap-10 sm:grid-cols-[280px_1fr] sm:gap-16">
          {/* Left column */}
          <RevealOnScroll>
            <div>
              <p className="text-[#605A57] text-sm font-medium uppercase tracking-widest">
                FAQ
              </p>
              <h2 className="mt-3 text-[#37322f] text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
                Common questions
              </h2>
            </div>
          </RevealOnScroll>

          {/* Right column — accordion */}
          <div>
            {faqs.map((faq, i) => (
              <RevealOnScroll key={i} delay={i * 60}>
                <Disclosure as="div" className="border-b border-[rgba(73,66,61,0.16)]">
                  <DisclosureButton className="group flex w-full items-center justify-between py-5 text-left">
                    <span className="pr-4 text-[#49423D] text-sm font-semibold sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDownIcon className="h-4 w-4 flex-shrink-0 text-[#605A57] transition-transform duration-200 group-data-[open]:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="pb-5">
                    <p className="text-sm leading-relaxed text-[#605A57]">
                      {faq.answer}
                    </p>
                  </DisclosurePanel>
                </Disclosure>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
