"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */

type MilestoneStatus = "completed" | "in-progress" | "upcoming";

interface Milestone {
  id: number;
  month: string;
  date: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  progress: number;
  skills: string[];
  tasks: number;
  tasksDone: number;
  accent: string;
  details?: string[];
}

const milestones: Milestone[] = [
  {
    id: 1,
    month: "Month 1",
    date: "Jan 2026",
    title: "Foundation & Setup",
    description: "Master HTML/CSS fundamentals, set up dev environment, and complete first responsive layout project.",
    status: "completed",
    progress: 100,
    skills: ["HTML5", "CSS3", "Flexbox", "Git Basics"],
    tasks: 12,
    tasksDone: 12,
    accent: "#7B9E87",
    details: [
      "✓ Built 3 responsive layouts with CSS Grid & Flexbox",
      "✓ Set up VS Code, Git, and terminal workflow",
      "✓ Deployed first static site to Vercel",
    ],
  },
  {
    id: 2,
    month: "Month 2",
    date: "Feb 2026",
    title: "JavaScript Mastery",
    description: "Deep-dive into JavaScript ES6+, DOM manipulation, async patterns, and build 3 interactive projects.",
    status: "in-progress",
    progress: 68,
    skills: ["JavaScript", "ES6+", "DOM API", "Fetch/Async"],
    tasks: 15,
    tasksDone: 10,
    accent: "#C4956A",
    details: [
      "✓ Completed ES6+ modules & destructuring",
      "✓ DOM manipulation mini-projects done",
      "→ Working on async/await & Fetch API",
      "○ Todo app with localStorage pending",
      "○ Weather dashboard project pending",
    ],
  },
  {
    id: 3,
    month: "Month 3",
    date: "Mar 2026",
    title: "React Fundamentals",
    description: "Learn React core concepts: components, hooks, state management, and build a full single-page app.",
    status: "upcoming",
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
    status: "upcoming",
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
    status: "upcoming",
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
    status: "upcoming",
    progress: 0,
    skills: ["Portfolio", "System Design", "Interviews", "Networking"],
    tasks: 11,
    tasksDone: 0,
    accent: "#B8856C",
  },
];

const stats = [
  { label: "Overall Progress", value: "28%", sub: "of 6-month plan", icon: "chart", trend: "+5% this week" },
  { label: "Skills Acquired", value: "8", sub: "of 24 total", icon: "star", trend: "+2 this month" },
  { label: "Tasks Completed", value: "22", sub: "of 81 total", icon: "check", trend: "3 this week" },
  { label: "Current Streak", value: "14d", sub: "best: 21 days", icon: "fire", trend: "🔥 on fire!" },
];

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════════════════ */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════ */

function useAnimatedCounter(target: number, isVisible: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, isVisible, duration]);

  return count;
}

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(2); // month 2 open by default
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState<Record<number, number>>({});

  // Scroll reveal refs
  const headerReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const progressReveal = useScrollReveal(0.2);
  const timelineReveal = useScrollReveal(0.05);
  const ctaReveal = useScrollReveal(0.2);

  // Animated counter for stats
  const progressCount = useAnimatedCounter(28, statsReveal.isVisible);
  const skillsCount = useAnimatedCounter(8, statsReveal.isVisible);
  const tasksCount = useAnimatedCounter(22, statsReveal.isVisible);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Animate progress bars when visible */
  useEffect(() => {
    if (!timelineReveal.isVisible) return;
    const timers: NodeJS.Timeout[] = [];
    milestones.forEach((m, i) => {
      const t = setTimeout(() => {
        setAnimatedProgress((prev) => ({ ...prev, [m.id]: m.progress }));
      }, 400 + i * 180);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [timelineReveal.isVisible]);

  const toggleCard = useCallback((id: number) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  }, []);

  /* Stagger helper */
  const revealStyle = (visible: boolean, i: number, base = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${base + i * 0.08}s, transform 0.8s cubic-bezier(0.34,1.56,0.64,1) ${base + i * 0.08}s`,
  });

  /* Status helpers */
  const statusBadge = (status: MilestoneStatus) => {
    if (status === "completed") return { bg: "rgba(123,158,135,0.12)", color: "#5A8A6A", text: "Done" };
    if (status === "in-progress") return { bg: "rgba(196,149,106,0.12)", color: "#B07D4F", text: "Active" };
    return { bg: "rgba(155,142,133,0.08)", color: "#8A7E76", text: "Upcoming" };
  };

  const getAnimatedValue = (index: number) => {
    if (index === 0) return `${progressCount}%`;
    if (index === 1) return `${skillsCount}`;
    if (index === 2) return `${tasksCount}`;
    return "14d";
  };

  return (
    <div className="min-h-screen p-5 pt-16 lg:pt-6 lg:p-10 overflow-x-hidden">
      {/* ── HEADER ── */}
      <header ref={headerReveal.ref} className="mb-10" style={revealStyle(headerReveal.isVisible, 0, 0.1)}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[#8A7E76] text-sm font-semibold tracking-[0.15em] uppercase mb-2">
              Learning Roadmap
            </p>
            <h1
              className="text-[#1E1B18] text-3xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.15]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Your Career Milestones
            </h1>
            <p className="text-[#635B55] text-[15px] mt-2.5 max-w-lg leading-relaxed">
              6-month frontend engineering track — personalized by AI based on your skills and goals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="group h-10 px-5 rounded-xl bg-[#2C2623] text-white text-sm font-medium hover:bg-[#1E1B18] transition-all duration-200 shadow-lg shadow-[#2C2623]/15 active:scale-[0.96] hover:shadow-xl hover:shadow-[#2C2623]/20">
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:rotate-90 transition-transform duration-300">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Task
              </span>
            </button>
            <button className="h-10 w-10 rounded-xl border border-[#D5CFC9] bg-white flex items-center justify-center text-[#7A706A] hover:text-[#2C2623] hover:border-[#2C2623]/25 hover:shadow-md transition-all duration-200 active:scale-95">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── STATS ROW ── */}
      <div ref={statsReveal.ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative bg-white rounded-2xl p-5 border border-[#E5E0DB] hover:border-[#C4956A]/40 transition-all duration-300 cursor-default overflow-hidden stat-card-hover"
            style={revealStyle(statsReveal.isVisible, i, 0.1)}
          >
            {/* Animated background glow on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#C4956A]/[0.06] rounded-full blur-xl" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3F0EC] flex items-center justify-center text-[#8A7E76] group-hover:bg-[#C4956A]/[0.12] group-hover:text-[#B07D4F] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  {stat.icon === "chart" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
                    </svg>
                  )}
                  {stat.icon === "star" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  )}
                  {stat.icon === "check" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  {stat.icon === "fire" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                  )}
                </div>
                <p className="text-[#7A706A] text-xs font-semibold tracking-wide uppercase">{stat.label}</p>
              </div>
              <p className="text-[#1E1B18] text-[1.75rem] font-bold tracking-tight leading-none">
                {getAnimatedValue(i)}
              </p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-[#9B8E85] text-xs">{stat.sub}</p>
                <p className="text-[#7B9E87] text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.trend}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── OVERALL PROGRESS BAR ── */}
      <div
        ref={progressReveal.ref}
        className="bg-white rounded-2xl p-6 border border-[#E5E0DB] mb-10 overflow-hidden"
        style={revealStyle(progressReveal.isVisible, 0, 0)}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#C4956A]" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[#C4956A] animate-ping opacity-30" />
            </div>
            <p className="text-[#1E1B18] text-sm font-bold">6-Month Plan Progress</p>
          </div>
          <p className="text-[#C4956A] text-lg font-bold tabular-nums">{progressCount}%</p>
        </div>
        <div className="w-full h-3 bg-[#ECE8E3] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full relative overflow-hidden"
            style={{
              width: progressReveal.isVisible ? "28%" : "0%",
              background: "linear-gradient(90deg, #7B9E87 0%, #C4956A 60%, #D4A87A 100%)",
              transition: "width 2.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent dashboard-shimmer" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-3.5">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2 text-xs text-[#5A8A6A] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7B9E87]" /> 1 Completed
            </span>
            <span className="flex items-center gap-2 text-xs text-[#B07D4F] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C4956A]" /> 1 In Progress
            </span>
            <span className="flex items-center gap-2 text-xs text-[#8A7E76] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D5CFC9]" /> 4 Upcoming
            </span>
          </div>
          <p className="text-[#8A7E76] text-xs font-medium">Est. completion: Jun 2026</p>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div ref={timelineReveal.ref} className="relative">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-8" style={revealStyle(timelineReveal.isVisible, 0, 0)}>
          <h2
            className="text-[#1E1B18] text-xl lg:text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Milestone Timeline
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#D5CFC9] to-transparent" />
          <span className="text-[#8A7E76] text-xs font-semibold">
            {milestones.filter((m) => m.status === "completed").length}/{milestones.length} milestones
          </span>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-[2px] overflow-hidden">
            {/* Background line */}
            <div className="absolute inset-0 bg-[#E5E0DB]" />
            {/* Animated fill */}
            <div
              className="absolute top-0 left-0 w-full rounded-full"
              style={{
                height: timelineReveal.isVisible ? "33%" : "0%",
                background: "linear-gradient(180deg, #7B9E87 0%, #C4956A 100%)",
                transition: "height 2.5s cubic-bezier(0.16,1,0.3,1) 0.5s",
              }}
            />
          </div>

          {/* Milestone cards */}
          <div className="space-y-5">
            {milestones.map((milestone, i) => {
              const isExpanded = expandedCard === milestone.id;
              const isHovered = hoveredCard === milestone.id;
              const badge = statusBadge(milestone.status);

              return (
                <div
                  key={milestone.id}
                  className="relative pl-[68px] group"
                  style={revealStyle(timelineReveal.isVisible, i, 0.15)}
                  onMouseEnter={() => setHoveredCard(milestone.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Timeline node */}
                  <div className="absolute left-0 top-[26px] flex items-center">
                    <div
                      className="relative w-[20px] h-[20px] rounded-full border-[3px] flex items-center justify-center transition-all duration-500"
                      style={{
                        left: "17px",
                        borderColor:
                          milestone.status === "completed"
                            ? "#7B9E87"
                            : milestone.status === "in-progress"
                            ? "#C4956A"
                            : "#D5CFC9",
                        backgroundColor:
                          milestone.status === "completed"
                            ? "#7B9E87"
                            : "white",
                        boxShadow:
                          milestone.status === "completed"
                            ? "0 0 0 4px rgba(123,158,135,0.18), 0 2px 8px rgba(123,158,135,0.15)"
                            : milestone.status === "in-progress"
                            ? "0 0 0 4px rgba(196,149,106,0.18), 0 2px 8px rgba(196,149,106,0.15)"
                            : "none",
                        transform: isHovered ? "scale(1.2)" : "scale(1)",
                      }}
                    >
                      {milestone.status === "completed" && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {milestone.status === "in-progress" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#C4956A] timeline-node-pulse" />
                      )}
                    </div>
                    {/* Connector */}
                    <div
                      className="h-[2px] transition-all duration-300"
                      style={{
                        width: isHovered ? "20px" : "16px",
                        backgroundColor:
                          milestone.status === "completed"
                            ? "rgba(123,158,135,0.3)"
                            : milestone.status === "in-progress"
                            ? "rgba(196,149,106,0.3)"
                            : "#E5E0DB",
                      }}
                    />
                  </div>

                  {/* Month label */}
                  <div className="mb-2">
                    <span
                      className="inline-block text-[11px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-md transition-all duration-200"
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.color,
                        transform: isHovered ? "translateX(2px)" : "translateX(0)",
                      }}
                    >
                      {milestone.month} · {milestone.date}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className="bg-white rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer"
                    style={{
                      borderColor: isHovered
                        ? `${milestone.accent}50`
                        : "#E5E0DB",
                      boxShadow: isHovered
                        ? `0 8px 30px -8px ${milestone.accent}18, 0 2px 8px rgba(0,0,0,0.04)`
                        : "0 1px 3px rgba(0,0,0,0.03)",
                      transform: isHovered ? "translateX(4px)" : "translateX(0)",
                    }}
                    onClick={() => toggleCard(milestone.id)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(milestone.id); } }}
                  >
                    {/* Active indicator strip */}
                    {milestone.status === "in-progress" && (
                      <div
                        className="h-[3px] w-full"
                        style={{
                          background: `linear-gradient(90deg, ${milestone.accent}, ${milestone.accent}88, transparent)`,
                        }}
                      />
                    )}

                    <div className="p-5 lg:p-6">
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                            <h3 className="text-[#1E1B18] text-base lg:text-lg font-bold tracking-tight">
                              {milestone.title}
                            </h3>
                            <span
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                              style={{ backgroundColor: badge.bg, color: badge.color }}
                            >
                              {milestone.status === "completed" && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                              {milestone.status === "in-progress" && (
                                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: badge.color }} />
                              )}
                              {badge.text}
                            </span>
                          </div>
                          <p className="text-[#635B55] text-sm leading-relaxed max-w-xl">
                            {milestone.description}
                          </p>
                        </div>

                        {/* Circular progress */}
                        <div className="flex-shrink-0 w-[60px] h-[60px] relative">
                          <svg className="w-[60px] h-[60px] -rotate-90" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="25" fill="none" stroke="#ECE8E3" strokeWidth="4" />
                            <circle
                              cx="30"
                              cy="30"
                              r="25"
                              fill="none"
                              stroke={milestone.accent}
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${2 * Math.PI * 25}`}
                              strokeDashoffset={`${2 * Math.PI * 25 * (1 - (animatedProgress[milestone.id] ?? 0) / 100)}`}
                              style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)" }}
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold text-[#1E1B18]">
                            {animatedProgress[milestone.id] ?? 0}%
                          </span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {milestone.skills.map((skill, si) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 hover:scale-105 cursor-default"
                            style={{
                              backgroundColor: `${milestone.accent}14`,
                              color: milestone.accent,
                              transitionDelay: `${si * 30}ms`,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Bottom: Tasks + expand indicator */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[#7A706A] text-xs font-semibold">Tasks</span>
                            <span className="text-[#4A433E] text-xs font-bold tabular-nums">
                              {milestone.tasksDone}/{milestone.tasks}
                            </span>
                          </div>
                          <div className="w-full h-[6px] bg-[#ECE8E3] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full relative overflow-hidden"
                              style={{
                                width: `${(animatedProgress[milestone.id] ?? 0) === 0 && milestone.status === "upcoming" ? 0 : animatedProgress[milestone.id] ?? 0}%`,
                                backgroundColor: milestone.accent,
                                transition: "width 1.5s cubic-bezier(0.16,1,0.3,1)",
                              }}
                            >
                              {milestone.status !== "upcoming" && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent dashboard-shimmer" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action button */}
                        <button
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 hover:shadow-lg active:scale-[0.95]"
                          style={{
                            backgroundColor:
                              milestone.status === "completed"
                                ? "#7B9E87"
                                : milestone.status === "in-progress"
                                ? "#C4956A"
                                : "#ECE8E3",
                            color:
                              milestone.status === "upcoming" ? "#635B55" : "white",
                            boxShadow:
                              milestone.status !== "upcoming"
                                ? `0 4px 14px -3px ${milestone.accent}40`
                                : "none",
                          }}
                          onClick={(e) => e.stopPropagation()}
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

                        {/* Expand/collapse chevron */}
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9B8E85] hover:bg-[#F3F0EC] transition-all"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expandable detail section */}
                    <div
                      className="overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        maxHeight: isExpanded ? "400px" : "0px",
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <div className="border-t border-[#ECE8E3] bg-gradient-to-b from-[#FDFCFB] to-[#F9F7F4] px-5 lg:px-6 py-4">
                        {/* Detail items */}
                        {milestone.details && (
                          <div className="mb-3 space-y-1.5">
                            {milestone.details.map((detail, di) => (
                              <p
                                key={di}
                                className="text-[13px] leading-relaxed"
                                style={{
                                  color: detail.startsWith("✓")
                                    ? "#5A8A6A"
                                    : detail.startsWith("→")
                                    ? "#B07D4F"
                                    : "#8A7E76",
                                  fontWeight: detail.startsWith("→") ? 600 : 400,
                                }}
                              >
                                {detail}
                              </p>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                              {[milestone.accent, "#7B9E87", "#8B7EC8"].map((c, j) => (
                                <div
                                  key={j}
                                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm hover:scale-110 hover:z-10 transition-transform cursor-pointer"
                                  style={{ backgroundColor: c, zIndex: 3 - j }}
                                >
                                  {["AI", "JS", "R"][j]}
                                </div>
                              ))}
                            </div>
                            <span className="text-[#7A706A] text-xs font-medium">3 resources</span>
                          </div>
                          {milestone.status === "in-progress" && (
                            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: milestone.accent }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              ~12 days remaining
                            </div>
                          )}
                          {milestone.status === "completed" && (
                            <span className="text-[#5A8A6A] text-xs font-bold">
                              Completed on Jan 28
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FOOTER CTA ── */}
      <div
        ref={ctaReveal.ref}
        className="mt-12 rounded-2xl p-8 lg:p-10 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2C2623 0%, #1A1715 100%)",
          ...revealStyle(ctaReveal.isVisible, 0, 0),
        }}
      >
        {/* Animated decorative orbs */}
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/3 translate-x-1/4 cta-orb-1" style={{ background: "radial-gradient(circle, rgba(196,149,106,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full translate-y-1/3 -translate-x-1/4 cta-orb-2" style={{ background: "radial-gradient(circle, rgba(123,158,135,0.1) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, white 0%, transparent 60%)" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/[0.08] rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#7B9E87] animate-pulse" />
            <span className="text-white/60 text-xs font-semibold tracking-wide">AI-Powered Guidance</span>
          </div>
          <h3
            className="text-white text-2xl lg:text-[1.75rem] font-bold mb-3 leading-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Stay on track with your goals
          </h3>
          <p className="text-white/65 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Your AI mentor analyzes your progress daily and adjusts the roadmap to keep you moving forward.
          </p>
          <button className="group px-7 py-3 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A87A] text-white text-sm font-bold hover:shadow-2xl hover:shadow-[#C4956A]/30 transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Talk to AI Mentor
            </span>
          </button>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
