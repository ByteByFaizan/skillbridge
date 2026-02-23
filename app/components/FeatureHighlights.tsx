"use client";

import { useState, useEffect } from "react";

const highlights = [
  {
    title: "Share your profile",
    description:
      "Tell us your education, skills, and interests. It takes under 2 minutes.",
  },
  {
    title: "Get career matches",
    description:
      "Receive 2\u20133 realistic career paths tailored to your unique profile.",
  },
  {
    title: "Follow your roadmap",
    description:
      "Get a 6-month plan with clear monthly goals, topics, and learning platforms.",
  },
];

export default function FeatureHighlights() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % highlights.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-t border-b border-[#e0dedb]">
      <div className="max-w-[1060px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 relative">
          {highlights.map((item, index) => {
            const isActive = active === index;
            return (
              <div
                key={index}
                onClick={() => setActive(index)}
                className={`relative p-8 cursor-pointer ${
                  index < highlights.length - 1
                    ? "md:border-r border-[#e0dedb]"
                    : ""
                }`}
              >
                {/* Animated top indicator line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] bg-[#37322f]"
                  style={{
                    transform: `scaleX(${isActive ? 1 : 0})`,
                    transformOrigin: isActive
                      ? "left"
                      : index < active
                        ? "right"
                        : "left",
                    transition: isActive
                      ? "transform 2.8s linear"
                      : "transform 0.3s ease-out",
                  }}
                />

                <h3 className="text-[#49423D] text-sm font-semibold leading-6 mt-4">
                  {item.title}
                </h3>
                <p className="mt-2 text-[#605A57] text-sm leading-[22px]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
