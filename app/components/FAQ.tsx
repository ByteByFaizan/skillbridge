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
      "Sign-up is required to get your first career recommendations. You have to create an account to save your results and track progress.",
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
                  <DisclosureButton className="group flex w-full items-center justify-between py-5 text-left transition-colors duration-300 hover:text-[#37322f]">
                    <span className="pr-4 text-[#49423D] group-hover:text-[#37322f] text-sm font-semibold sm:text-base transition-colors duration-200">
                      {faq.question}
                    </span>
                    <span className="flex items-center justify-center w-8 h-8 rounded-full border border-transparent group-hover:border-[#e0dedb] group-hover:bg-[#f7f5f3] transition-all duration-300">
                      <ChevronDownIcon className="h-4 w-4 flex-shrink-0 text-[#605A57] group-hover:text-[#37322f] transition-transform duration-300 ease-[cubic-bezier(0.87,0,0.13,1)] group-data-[open]:rotate-180" />
                    </span>
                  </DisclosureButton>
                  <DisclosurePanel className="pb-6 overflow-hidden transition-all duration-300 ease-in-out">
                    <p className="text-sm leading-relaxed text-[#605A57] animate-fade-in-up">
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
