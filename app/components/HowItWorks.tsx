"use client";

import { useState, useEffect, useRef } from "react";
import RevealOnScroll from "./RevealOnScroll";

const steps = [
  {
    number: "01",
    title: "Share your profile",
    description:
      "Tell us your education, skills, and interests. It takes under 2 minutes.",
  },
  {
    number: "02",
    title: "Get career matches",
    description:
      "Receive 2–3 realistic career paths tailored to your unique profile.",
  },
  {
    number: "03",
    title: "Follow your roadmap",
    description:
      "Get a 6‑month plan with clear monthly goals, topics, and learning platforms.",
  },
];

const CYCLE_MS = 3000;

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    setActive(index);
    setAnimKey((k) => k + 1);
    // Reset interval so it counts from the new selection
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % steps.length;
        return next;
      });
      setAnimKey((k) => k + 1);
    }, CYCLE_MS);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
      setAnimKey((k) => k + 1);
    }, CYCLE_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
            {steps.map((step, index) => {
              const isActive = active === index;
              return (
                <div
                  key={step.number}
                  onClick={() => goTo(index)}
                  className={`relative p-6 flex flex-col gap-2 border cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-white border-[#e0dedb] shadow-sm"
                      : "border-[#e0dedb]/80"
                  }`}
                >
                  {/* Animated top indicator line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden">
                    {isActive && (
                      <div
                        key={animKey}
                        className="h-full bg-[#37322f] animate-progress-bar"
                      />
                    )}
                  </div>

                  <h3 className="text-[#49423D] text-sm font-semibold leading-6 mt-2">
                    {step.title}
                  </h3>
                  <p className="text-[#605A57] text-sm leading-[22px]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
