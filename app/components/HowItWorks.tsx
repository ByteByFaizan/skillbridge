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

const CYCLE_MS = 3200;

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
    <section id="how-it-works" className="border-t border-b border-[#e0dedb]">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="py-16 sm:py-20">
          <RevealOnScroll>
            <p className="text-[#605A57] text-sm font-medium uppercase tracking-widest">
              How it works
            </p>
            <h2 className="mt-3 text-[#37322f] text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">
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
                  className={`group relative p-6 flex flex-col gap-2 border cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isActive
                      ? "bg-white border-[#37322f]/20 shadow-[0_8px_30px_rgba(55,50,47,0.08)] -translate-y-1"
                      : "bg-[#f7f5f3]/30 border-[#e0dedb]/80 hover:border-[#37322f]/10 hover:bg-white/80 hover:shadow-sm"
                    }`}
                >
                  {/* Subtle background glow for active state */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#37322f]/[0.02] to-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} />

                  {/* Animated top indicator line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] overflow-hidden bg-transparent">
                    {isActive && (
                      <div
                        key={animKey}
                        className="h-full bg-[#37322f] animate-progress-bar"
                      />
                    )}
                  </div>

                  <h3 className={`text-sm font-semibold leading-6 mt-2 transition-colors duration-300 relative z-10 ${isActive ? "text-[#37322f]" : "text-[#49423D]/70 group-hover:text-[#37322f]"}`}>
                    {step.title}
                  </h3>
                  <p className={`text-sm leading-[22px] transition-colors duration-300 relative z-10 ${isActive ? "text-[#49423D]/90" : "text-[#49423D]/60 group-hover:text-[#49423D]/80"}`}>
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
