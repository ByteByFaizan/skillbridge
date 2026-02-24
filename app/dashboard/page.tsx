"use client";

import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

const milestones = [
  {
    id: 1,
    month: "Month 1",
    date: "Jan 2026",
    title: "Foundation & Setup",
    description: "Master HTML/CSS fundamentals, set up dev environment, and complete first responsive layout project.",
    status: "completed" as const,
    progress: 100,
    skills: ["HTML5", "CSS3", "Flexbox", "Git Basics"],
    tasks: 12,
    tasksDone: 12,
    accent: "#7B9E87",
  },
  {
    id: 2,
    month: "Month 2",
    date: "Feb 2026",
    title: "JavaScript Mastery",
    description: "Deep-dive into JavaScript ES6+, DOM manipulation, async patterns, and build 3 interactive projects.",
    status: "in-progress" as const,
    progress: 68,
    skills: ["JavaScript", "ES6+", "DOM API", "Fetch/Async"],
    tasks: 15,
    tasksDone: 10,
    accent: "#C4956A",
  },
  {
    id: 3,
    month: "Month 3",
    date: "Mar 2026",
    title: "React Fundamentals",
    description: "Learn React core concepts: components, hooks, state management, and build a full single-page app.",
    status: "upcoming" as const,
    progress: 0,
    skills: ["React", "JSX", "Hooks", "State Mgmt"],
    tasks: 14,
    tasksDone: 0,
    accent: "#8B7EC8",
  },
  {
    id: 4,
    month: "Month 4",
    date: "Apr 2026",
    title: "Backend & APIs",
    description: "Node.js, Express, RESTful APIs, database fundamentals with PostgreSQL, and authentication flows.",
    status: "upcoming" as const,
    progress: 0,
    skills: ["Node.js", "Express", "PostgreSQL", "Auth"],
    tasks: 16,
    tasksDone: 0,
    accent: "#D4836D",
  },
  {
    id: 5,
    month: "Month 5",
    date: "May 2026",
    title: "Full-Stack Integration",
    description: "Connect frontend and backend, deploy with CI/CD, testing strategies, and performance optimization.",
    status: "upcoming" as const,
    progress: 0,
    skills: ["Next.js", "CI/CD", "Testing", "Deploy"],
    tasks: 13,
    tasksDone: 0,
    accent: "#6B9BBF",
  },
  {
    id: 6,
    month: "Month 6",
    date: "Jun 2026",
    title: "Portfolio & Career Prep",
    description: "Build capstone portfolio project, practice system design, prepare for technical interviews and networking.",
    status: "upcoming" as const,
    progress: 0,
    skills: ["Portfolio", "System Design", "Interviews", "Networking"],
    tasks: 11,
    tasksDone: 0,
    accent: "#B8856C",
  },
];

const stats = [
  { label: "Overall Progress", value: "28%", sub: "of 6-month plan", icon: "chart" },
  { label: "Skills Acquired", value: "8", sub: "of 24 total", icon: "star" },
  { label: "Tasks Completed", value: "22", sub: "of 81 total", icon: "check" },
  { label: "Current Streak", value: "14d", sub: "best: 21 days", icon: "fire" },
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<Record<number, number>>({});
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Animate progress bars on mount */
  useEffect(() => {
    if (!mounted) return;
    const timers: NodeJS.Timeout[] = [];
    milestones.forEach((m, i) => {
      const t = setTimeout(() => {
        setAnimatedProgress((prev) => ({ ...prev, [m.id]: m.progress }));
      }, 600 + i * 200);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  const stagger = (i: number, base = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${base + i * 0.08}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${base + i * 0.08}s`,
  });

  return (
    <div className="min-h-screen p-6 lg:p-10">
      {/* ── HEADER ── */}
      <header className="mb-10" style={stagger(0, 0.1)}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[#9B8E85] text-sm font-medium tracking-widest uppercase mb-1.5">
              Learning Roadmap
            </p>
            <h1
              className="text-[#2C2623] text-3xl lg:text-4xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Your Career Milestones
            </h1>
            <p className="text-[#7A706A] text-[15px] mt-2 max-w-lg leading-relaxed">
              6-month frontend engineering track — personalized by AI based on your profile.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 px-5 rounded-xl bg-[#2C2623] text-white text-sm font-medium hover:bg-[#3D3835] transition-all shadow-lg shadow-[#2C2623]/10 active:scale-[0.97]">
              + Add Task
            </button>
            <button className="h-10 w-10 rounded-xl border border-[#DDD8D3] bg-white flex items-center justify-center text-[#7A706A] hover:text-[#2C2623] hover:border-[#2C2623]/20 transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative bg-white rounded-2xl p-5 border border-[#E8E4E0]/80 hover:border-[#C4956A]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#C4956A]/[0.04] cursor-default overflow-hidden"
            style={stagger(i, 0.2)}
          >
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <div className="w-full h-full bg-[#C4956A] rounded-bl-[40px]" />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#F5F3F0] flex items-center justify-center text-[#9B8E85] group-hover:bg-[#C4956A]/10 group-hover:text-[#C4956A] transition-colors">
                {stat.icon === "chart" && (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
                  </svg>
                )}
                {stat.icon === "star" && (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                )}
                {stat.icon === "check" && (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {stat.icon === "fire" && (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                )}
              </div>
              <p className="text-[#9B8E85] text-xs font-medium tracking-wide uppercase">{stat.label}</p>
            </div>
            <p className="text-[#2C2623] text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-[#B0A69E] text-xs mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── OVERALL PROGRESS BAR ── */}
      <div
        className="bg-white rounded-2xl p-6 border border-[#E8E4E0]/80 mb-10"
        style={stagger(0, 0.55)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C4956A] animate-pulse" />
            <p className="text-[#2C2623] text-sm font-semibold">6-Month Plan Progress</p>
          </div>
          <p className="text-[#C4956A] text-sm font-bold">28%</p>
        </div>
        <div className="w-full h-2.5 bg-[#F0ECE8] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden"
            style={{
              width: mounted ? "28%" : "0%",
              background: "linear-gradient(90deg, #C4956A 0%, #D4A87A 50%, #7B9E87 100%)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent dashboard-shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-[#7B9E87]">
              <span className="w-2 h-2 rounded-full bg-[#7B9E87]" /> Completed
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#C4956A]">
              <span className="w-2 h-2 rounded-full bg-[#C4956A]" /> In Progress
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[#D4D0CC]">
              <span className="w-2 h-2 rounded-full bg-[#D4D0CC]" /> Upcoming
            </span>
          </div>
          <p className="text-[#B0A69E] text-xs">Est. completion: Jun 2026</p>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div className="relative" ref={timelineRef}>
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8" style={stagger(0, 0.7)}>
          <h2
            className="text-[#2C2623] text-xl font-bold tracking-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Milestone Timeline
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#E0DBD6] to-transparent" />
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#7B9E87] via-[#C4956A] via-[33%] to-[#E0DBD6] rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#7B9E87] to-[#C4956A] rounded-full transition-all duration-[2.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ height: mounted ? "33%" : "0%" }}
            />
          </div>

          {/* Milestone cards */}
          <div className="space-y-6">
            {milestones.map((milestone, i) => (
              <div
                key={milestone.id}
                className="relative pl-16 group"
                style={stagger(i, 0.8)}
                onMouseEnter={() => setActiveCard(milestone.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                {/* Timeline node */}
                <div className="absolute left-0 top-6 flex items-center">
                  <div
                    className={`relative w-[18px] h-[18px] rounded-full border-[3px] flex items-center justify-center transition-all duration-500 ${
                      milestone.status === "completed"
                        ? "border-[#7B9E87] bg-[#7B9E87]"
                        : milestone.status === "in-progress"
                        ? "border-[#C4956A] bg-white"
                        : "border-[#D4D0CC] bg-white"
                    }`}
                    style={{
                      left: "18px",
                      boxShadow:
                        milestone.status === "completed"
                          ? "0 0 0 4px rgba(123,158,135,0.15)"
                          : milestone.status === "in-progress"
                          ? "0 0 0 4px rgba(196,149,106,0.15)"
                          : "none",
                    }}
                  >
                    {milestone.status === "completed" && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {milestone.status === "in-progress" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#C4956A] animate-pulse" />
                    )}
                  </div>
                  {/* Connector to card */}
                  <div
                    className={`w-8 h-[2px] transition-colors duration-300 ${
                      milestone.status === "completed"
                        ? "bg-[#7B9E87]/30"
                        : milestone.status === "in-progress"
                        ? "bg-[#C4956A]/30"
                        : "bg-[#E0DBD6]"
                    }`}
                  />
                </div>

                {/* Month label */}
                <div className="absolute left-[62px] top-0">
                  <span
                    className={`inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-2.5 py-0.5 rounded-md ${
                      milestone.status === "completed"
                        ? "bg-[#7B9E87]/10 text-[#7B9E87]"
                        : milestone.status === "in-progress"
                        ? "bg-[#C4956A]/10 text-[#C4956A]"
                        : "bg-[#E8E4E0] text-[#9B8E85]"
                    }`}
                  >
                    {milestone.month} · {milestone.date}
                  </span>
                </div>

                {/* Card */}
                <div
                  className={`mt-7 bg-white rounded-2xl border transition-all duration-400 overflow-hidden ${
                    activeCard === milestone.id
                      ? "border-[" + milestone.accent + "]/30 shadow-xl shadow-black/[0.04]"
                      : "border-[#E8E4E0]/80 shadow-sm"
                  } ${
                    milestone.status === "in-progress"
                      ? "ring-1 ring-[#C4956A]/10"
                      : ""
                  }`}
                  style={{
                    borderColor:
                      activeCard === milestone.id
                        ? `${milestone.accent}40`
                        : undefined,
                  }}
                >
                  <div className="p-5 lg:p-6">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <h3 className="text-[#2C2623] text-base lg:text-lg font-bold tracking-tight">
                            {milestone.title}
                          </h3>
                          {milestone.status === "completed" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#7B9E87] bg-[#7B9E87]/8 px-2 py-0.5 rounded-full">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Done
                            </span>
                          )}
                          {milestone.status === "in-progress" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#C4956A] bg-[#C4956A]/8 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C4956A] animate-pulse" />
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[#7A706A] text-sm leading-relaxed max-w-xl">
                          {milestone.description}
                        </p>
                      </div>

                      {/* Circular progress */}
                      <div className="flex-shrink-0 w-14 h-14 relative">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke="#F0ECE8"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx="28"
                            cy="28"
                            r="24"
                            fill="none"
                            stroke={milestone.accent}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - (animatedProgress[milestone.id] ?? 0) / 100)}`}
                            className="transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold text-[#2C2623]">
                          {milestone.progress}%
                        </span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {milestone.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
                          style={{
                            backgroundColor: `${milestone.accent}10`,
                            color: milestone.accent,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Bottom: Tasks progress bar */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[#9B8E85] text-xs font-medium">Tasks</span>
                          <span className="text-[#7A706A] text-xs font-semibold">
                            {milestone.tasksDone}/{milestone.tasks}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F0ECE8] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                            style={{
                              width: `${animatedProgress[milestone.id] ?? 0}%`,
                              backgroundColor: milestone.accent,
                            }}
                          />
                        </div>
                      </div>

                      {/* Action button */}
                      <button
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md active:scale-[0.96]"
                        style={{
                          backgroundColor:
                            milestone.status === "completed"
                              ? "#7B9E87"
                              : milestone.status === "in-progress"
                              ? "#C4956A"
                              : "#E8E4E0",
                          color:
                            milestone.status === "upcoming"
                              ? "#7A706A"
                              : "white",
                        }}
                      >
                        {milestone.status === "completed" && (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            Review
                          </>
                        )}
                        {milestone.status === "in-progress" && (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Continue
                          </>
                        )}
                        {milestone.status === "upcoming" && (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Scheduled
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Active milestone expanded detail */}
                  {milestone.status === "in-progress" && (
                    <div className="border-t border-[#F0ECE8] bg-gradient-to-b from-[#FDFCFB] to-[#FAF8F5] px-5 lg:px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {["#C4956A", "#7B9E87", "#8B7EC8"].map((c, j) => (
                              <div
                                key={j}
                                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                                style={{ backgroundColor: c, zIndex: 3 - j }}
                              >
                                {["AI", "JS", "R"][j]}
                              </div>
                            ))}
                          </div>
                          <span className="text-[#9B8E85] text-xs">3 learning resources active</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#C4956A] font-semibold">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          ~12 days remaining
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      <div
        className="mt-12 bg-gradient-to-br from-[#2C2623] to-[#1E1B19] rounded-2xl p-8 text-center relative overflow-hidden"
        style={stagger(0, 1.8)}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C4956A]/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#7B9E87]/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="relative">
          <h3
            className="text-white text-xl font-bold mb-2"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Stay on track with your goals
          </h3>
          <p className="text-white/50 text-sm mb-5 max-w-md mx-auto">
            Your AI mentor analyzes your progress and adjusts the roadmap to keep you moving forward.
          </p>
          <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A87A] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#C4956A]/20 transition-all active:scale-[0.97]">
            Talk to AI Mentor
          </button>
        </div>
      </div>
    </div>
  );
}
