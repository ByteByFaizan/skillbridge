"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
   TYPES
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

interface CareerOverviewItem {
  title: string;
  why: string;
  demandLevel: "High" | "Medium" | "Low";
}

interface SkillGapItem {
  careerTitle: string;
  existingSkills: { name: string }[];
  missingSkills: { name: string; priority: string }[];
}

interface RoadmapMonth {
  month: number;
  topics: string[];
  tools: string[];
  platforms: string[];
}

interface LearningRoadmap {
  durationMonths: number;
  months: RoadmapMonth[];
}

interface JobRoles {
  entryLevelRoles: string[];
  internships: string[];
  freelanceOrProjectIdeas: string[];
}

interface CareerGrowthStep {
  yearRange: string;
  roleTitle: string;
  salaryRange: string;
  specializations?: string[];
}

interface CareerGrowthPathItem {
  careerTitle: string;
  steps: CareerGrowthStep[];
}

interface CareerReport {
  careerOverview: CareerOverviewItem[];
  skillGapAnalysis: SkillGapItem[];
  learningRoadmap: LearningRoadmap;
  jobRolesAndOpportunities: JobRoles;
  careerGrowthPath: CareerGrowthPathItem[];
  personalizedAdvice: string[];
}

interface RunData {
  runId: string;
  createdAt: string;
  input: {
    education: string;
    skills: string[];
    interests: string[];
    goal?: string;
    name?: string;
  };
  report: CareerReport;
}

interface HistoryRun {
  runId: string;
  createdAt: string;
  careerTitles: string[];
}


/* ═══════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════ */

const MONTH_ACCENTS = ["#7B9E87", "#C4956A", "#8B7EC8", "#D4836D", "#6B9BBF", "#B8856C"];

function buildMilestones(roadmap: LearningRoadmap, completedIds: Set<number>): Milestone[] {
  const now = new Date();
  return roadmap.months
    .slice()
    .sort((a, b) => a.month - b.month)
    .map((m, i) => {
      const startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() + i);
      const monthName = startDate.toLocaleString("default", { month: "short" });
      const year = startDate.getFullYear();

      const skills = [...m.topics.slice(0, 2), ...m.tools.slice(0, 2)];
      const taskCount = m.topics.length + m.tools.length;

      // Determine status based on completion tracking
      let status: MilestoneStatus;
      if (completedIds.has(m.month)) {
        status = "completed";
      } else {
        // Find first non-completed month — that one is "in-progress"
        const firstIncomplete = roadmap.months
          .slice()
          .sort((a, b) => a.month - b.month)
          .find((rm) => !completedIds.has(rm.month));
        status = firstIncomplete?.month === m.month ? "in-progress" : "upcoming";
      }

      return {
        id: m.month,
        month: `Month ${m.month}`,
        date: `${monthName} ${year}`,
        title: m.topics[0] ?? `Month ${m.month} Focus`,
        description: `Focus on ${m.topics.join(", ")}. Tools: ${m.tools.join(", ")}. Learn via ${m.platforms.join(", ")}.`,
        status,
        progress: status === "completed" ? 100 : 0,
        skills,
        tasks: taskCount,
        tasksDone: status === "completed" ? taskCount : 0,
        accent: MONTH_ACCENTS[i % MONTH_ACCENTS.length],
        details: [
          ...m.topics.map((t) => `○ ${t}`),
          ...m.tools.map((t) => `🔧 ${t}`),
          ...m.platforms.map((p) => `📚 ${p}`),
        ],
      };
    });
}

function buildStats(report: CareerReport) {
  const totalSkills = new Set<string>();
  report.skillGapAnalysis.forEach((sg) => {
    sg.existingSkills.forEach((s) => totalSkills.add(s.name));
    sg.missingSkills.forEach((s) => totalSkills.add(s.name));
  });
  const existingSkills = new Set<string>();
  report.skillGapAnalysis.forEach((sg) => {
    sg.existingSkills.forEach((s) => existingSkills.add(s.name));
  });
  const missingSkills = new Set<string>();
  report.skillGapAnalysis.forEach((sg) => {
    sg.missingSkills.forEach((s) => missingSkills.add(s.name));
  });
  const totalTopics = report.learningRoadmap.months.reduce(
    (sum, m) => sum + m.topics.length + m.tools.length,
    0
  );

  return [
    {
      label: "Career Paths",
      value: String(report.careerOverview.length),
      sub: "matched for you",
      icon: "chart" as const,
      trend: report.careerOverview.map((c) => c.title).join(", "),
    },
    {
      label: "Skills You Have",
      value: String(existingSkills.size),
      sub: `of ${totalSkills.size} total`,
      icon: "star" as const,
      trend: `${missingSkills.size} to learn`,
    },
    {
      label: "Topics to Learn",
      value: String(totalTopics),
      sub: "across 6 months",
      icon: "check" as const,
      trend: "Personalized plan",
    },
    {
      label: "Advice Tips",
      value: String(report.personalizedAdvice.length),
      sub: "from AI mentor",
      icon: "fire" as const,
      trend: "Tailored for you",
    },
  ];
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════════════════ */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [elReady, setElReady] = useState(false);

  // Detect when the ref element is first attached to the DOM
  useEffect(() => {
    if (ref.current && !elReady) setElReady(true);
  });

  useEffect(() => {
    if (isVisible) return; // already revealed
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
  }, [threshold, elReady, isVisible]);

  return { ref, isVisible };
}

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════ */

function useAnimatedCounter(target: number, isVisible: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
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
   EMPTY STATE COMPONENT
   ═══════════════════════════════════════════════════════ */

function EmptyState() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-5">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-[#F3F0EC] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B8E85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h2
          className="text-[#1E1B18] text-2xl lg:text-3xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
        >
          No career results yet
        </h2>
        <p className="text-[#635B55] text-[15px] leading-relaxed mb-8">
          Complete the career discovery questionnaire to get your personalized AI-powered roadmap, skill gap analysis, and career recommendations.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2C2623] text-white text-sm font-bold hover:bg-[#1E1B18] transition-all duration-200 shadow-lg shadow-[#2C2623]/15 active:scale-[0.96] hover:shadow-xl hover:shadow-[#2C2623]/20"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Start Career Discovery
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LOADING STATE
   ═══════════════════════════════════════════════════════ */

function LoadingState() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-5">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-[3px] border-[#E5E0DB] border-t-[#C4956A] animate-spin mx-auto mb-5" />
        <p className="text-[#635B55] text-sm font-medium">Loading your career roadmap…</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ERROR STATE
   ═══════════════════════════════════════════════════════ */

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-5">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4836D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <h3 className="text-[#1E1B18] text-lg font-bold mb-2">Something went wrong</h3>
        <p className="text-[#635B55] text-sm mb-5">{message}</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-[#2C2623] text-white text-sm font-medium hover:bg-[#1E1B18] transition-all"
          >
            Try Again
          </button>
          <Link
            href="/discover"
            className="px-5 py-2.5 rounded-xl border border-[#D5CFC9] text-[#635B55] text-sm font-medium hover:border-[#2C2623]/25 transition-all"
          >
            New Discovery
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runData, setRunData] = useState<RunData | null>(null);

  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Set<number>>(new Set());

  // Scroll reveal refs
  const headerReveal = useScrollReveal(0.1);
  const statsReveal = useScrollReveal(0.1);
  const timelineReveal = useScrollReveal(0.05);
  const careerReveal = useScrollReveal(0.1);
  const adviceReveal = useScrollReveal(0.1);
  const ctaReveal = useScrollReveal(0.2);

  // Derived data
  const milestones = runData ? buildMilestones(runData.report.learningRoadmap, completedMilestones) : [];
  const stats = runData ? buildStats(runData.report) : [];

  // Animated counters for stats
  const counter0 = useAnimatedCounter(
    runData ? parseInt(stats[0]?.value ?? "0", 10) || 0 : 0,
    statsReveal.isVisible
  );
  const counter1 = useAnimatedCounter(
    runData ? parseInt(stats[1]?.value ?? "0", 10) || 0 : 0,
    statsReveal.isVisible
  );
  const counter2 = useAnimatedCounter(
    runData ? parseInt(stats[2]?.value ?? "0", 10) || 0 : 0,
    statsReveal.isVisible
  );
  const counter3 = useAnimatedCounter(
    runData ? parseInt(stats[3]?.value ?? "0", 10) || 0 : 0,
    statsReveal.isVisible
  );

  const getAnimatedValue = (index: number) => {
    if (index === 0) return `${counter0}`;
    if (index === 1) return `${counter1}`;
    if (index === 2) return `${counter2}`;
    return `${counter3}`;
  };

  /* ── Fetch report data ─────────────────────────────── */
  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check for fallback report from session storage (DB insert failed scenario)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("fallback") === "1") {
      try {
        const fallback = sessionStorage.getItem("sb_fallback_report");
        if (fallback) {
          const report = JSON.parse(fallback) as CareerReport;
          sessionStorage.removeItem("sb_fallback_report");
          // Clean up URL without reload
          window.history.replaceState({}, "", "/dashboard");
          setRunData({
            runId: "fallback",
            createdAt: new Date().toISOString(),
            input: { education: "", skills: [], interests: [] },
            report,
          });
          setExpandedCard(1);
          setLoading(false);
          return;
        }
      } catch {
        // Fall through to normal flow
      }
    }

    const runId = localStorage.getItem("sb_last_run_id");
    if (!runId) {
      setLoading(false);
      return; // No run — show empty state
    }

    try {
      const res = await fetch(`/api/recommendations/${runId}`);
      if (!res.ok) {
        if (res.status === 404) {
          localStorage.removeItem("sb_last_run_id");
          setLoading(false);
          return;
        }
        throw new Error("Failed to load your career report.");
      }
      const data: RunData = await res.json();
      setRunData(data);
      setExpandedCard(1); // Expand first month by default

      // Load completed milestones from localStorage for this run
      try {
        const saved = localStorage.getItem(`sb_completed_${data.runId}`);
        if (saved) {
          setCompletedMilestones(new Set(JSON.parse(saved) as number[]));
        } else {
          setCompletedMilestones(new Set());
        }
      } catch {
        setCompletedMilestones(new Set());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();

    // Listen for history selection from sidebar
    const handleHistorySelected = () => {
      fetchReport();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('sb-history-selected', handleHistorySelected);
    return () => window.removeEventListener('sb-history-selected', handleHistorySelected);
  }, [fetchReport]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const toggleCard = useCallback((id: number) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  }, []);

  const toggleMilestoneComplete = useCallback((milestoneId: number) => {
    setCompletedMilestones((prev) => {
      const next = new Set(prev);
      if (next.has(milestoneId)) {
        next.delete(milestoneId);
      } else {
        next.add(milestoneId);
      }
      // Persist to localStorage
      if (runData) {
        localStorage.setItem(
          `sb_completed_${runData.runId}`,
          JSON.stringify([...next])
        );
      }
      return next;
    });
  }, [runData]);

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

  /* ── Conditional rendering ─────────────────────────── */

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={fetchReport} />;
  if (!runData) return <EmptyState />;

  const { report } = runData;
  const completedCount = milestones.filter((m) => m.status === "completed").length;

  return (
    <div className="min-h-screen p-5 pt-16 lg:pt-6 lg:p-10 overflow-x-hidden">
      {/* ── HEADER ── */}
      <header ref={headerReveal.ref} className="mb-10" style={revealStyle(headerReveal.isVisible, 0, 0.1)}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[#6B6058] text-sm font-semibold tracking-[0.15em] uppercase mb-2">
              Learning Roadmap
            </p>
            <h1
              className="text-[#1E1B18] text-3xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.15]"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Your Career Milestones
            </h1>
            <p className="text-[#4A433E] text-[15px] mt-2.5 max-w-lg leading-relaxed">
              {report.learningRoadmap.durationMonths}-month personalized learning plan — built by AI based on your skills and goals.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="group h-10 px-5 rounded-xl bg-[#2C2623] text-white text-sm font-medium hover:bg-[#1E1B18] transition-all duration-200 shadow-lg shadow-[#2C2623]/15 active:scale-[0.96] hover:shadow-xl hover:shadow-[#2C2623]/20 flex items-center"
            >
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:rotate-90 transition-transform duration-300">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Discovery
              </span>
            </Link>
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
                <p className="text-[#5C5249] text-xs font-semibold tracking-wide uppercase">{stat.label}</p>
              </div>
              <p className="text-[#1E1B18] text-[1.75rem] font-bold tracking-tight leading-none">
                {getAnimatedValue(i)}
              </p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[#6B6058] text-xs">{stat.sub}</p>
                <p className="text-[#4A8A5A] text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.trend}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CAREER OVERVIEW ── */}
      <div ref={careerReveal.ref} className="mb-10">
        <div className="flex items-center gap-4 mb-5" style={revealStyle(careerReveal.isVisible, 0, 0)}>
          <h2
            className="text-[#1E1B18] text-xl lg:text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Recommended Careers
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#D5CFC9] to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {report.careerOverview.map((career, i) => (
            <div
              key={career.title}
              className="bg-white rounded-2xl p-5 border border-[#E5E0DB] hover:border-[#C4956A]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={revealStyle(careerReveal.isVisible, i, 0.1)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-[#1E1B18] text-base font-bold tracking-tight">{career.title}</h3>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{
                    backgroundColor:
                      career.demandLevel === "High" ? "rgba(123,158,135,0.12)" :
                        career.demandLevel === "Medium" ? "rgba(196,149,106,0.12)" :
                          "rgba(155,142,133,0.08)",
                    color:
                      career.demandLevel === "High" ? "#5A8A6A" :
                        career.demandLevel === "Medium" ? "#B07D4F" :
                          "#8A7E76",
                  }}
                >
                  {career.demandLevel === "High" && <span className="w-1.5 h-1.5 rounded-full bg-[#5A8A6A]" />}
                  {career.demandLevel} Demand
                </span>
              </div>
              <p className="text-[#4A433E] text-sm leading-relaxed">{career.why}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div ref={timelineReveal.ref} className="relative">
        <div className="flex items-center gap-4 mb-8" style={revealStyle(timelineReveal.isVisible, 0, 0)}>
          <h2
            className="text-[#1E1B18] text-xl lg:text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Milestone Timeline
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#D5CFC9] to-transparent" />
          <span className="text-[#5C5249] text-xs font-semibold">
            {completedCount}/{milestones.length} milestones
          </span>
        </div>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-[2px] overflow-hidden">
            <div className="absolute inset-0 bg-[#E5E0DB]" />
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
                      className="inline-block text-xs font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-md transition-all duration-200"
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
                      borderColor: isHovered ? `${milestone.accent}50` : "#E5E0DB",
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
                          <p className="text-[#4A433E] text-sm leading-relaxed max-w-xl">
                            {milestone.description}
                          </p>
                        </div>


                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {milestone.skills.map((skill, si) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 hover:scale-105 hover:shadow-sm cursor-default"
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

                      {/* Bottom: complete button + expand chevron */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Mark Complete / Undo button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMilestoneComplete(milestone.id);
                          }}
                          className={`group/btn flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 active:scale-[0.96] ${milestone.status === "completed"
                              ? "bg-[#7B9E87]/12 text-[#5A8A6A] hover:bg-[#7B9E87]/20 border border-[#7B9E87]/25"
                              : "bg-[#F3F0EC] text-[#4A433E] hover:bg-[#2C2623] hover:text-white border border-[#E5E0DB] hover:border-[#2C2623] hover:shadow-lg hover:shadow-[#2C2623]/10"
                            }`}
                        >
                          {milestone.status === "completed" ? (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/btn:scale-110">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              Completed
                            </>
                          ) : (
                            <>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover/btn:scale-110">
                                <circle cx="12" cy="12" r="10" />
                              </svg>
                              Mark Complete
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
                      <div className="border-t border-[#ECE8E3] bg-gradient-to-b from-[#FDFCFB] to-[#F9F7F4] px-5 lg:px-6 py-5">
                        {milestone.details && (
                          <div className="space-y-2.5">
                            {milestone.details.map((detail, di) => (
                              <p
                                key={di}
                                className="text-sm leading-relaxed text-[#3D3632] flex items-start gap-2"
                                style={{
                                  opacity: isExpanded ? 1 : 0,
                                  transform: isExpanded ? "translateX(0)" : "translateX(-8px)",
                                  transition: `opacity 0.4s ease ${di * 0.05}s, transform 0.4s ease ${di * 0.05}s`,
                                }}
                              >
                                {detail}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SKILL GAP ANALYSIS ── */}
      {report.skillGapAnalysis.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <h2
              className="text-[#1E1B18] text-xl lg:text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Skill Gap Analysis
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#D5CFC9] to-transparent" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {report.skillGapAnalysis.map((sg) => (
              <div key={sg.careerTitle} className="bg-white rounded-2xl p-5 border border-[#E5E0DB] hover:border-[#C4956A]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <h3 className="text-[#1E1B18] text-base font-bold mb-3">{sg.careerTitle}</h3>
                {sg.existingSkills.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[#5C5249] text-xs font-semibold uppercase tracking-wider mb-2">You have</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sg.existingSkills.map((s) => (
                        <span key={s.name} className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#7B9E87]/12 text-[#3D7A50] transition-colors duration-200 hover:bg-[#7B9E87]/20">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {sg.missingSkills.length > 0 && (
                  <div>
                    <p className="text-[#5C5249] text-xs font-semibold uppercase tracking-wider mb-2">To learn</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sg.missingSkills.map((s) => (
                        <span
                          key={s.name}
                          className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-200 hover:opacity-80"
                          style={{
                            backgroundColor:
                              s.priority === "High" ? "rgba(212,131,109,0.15)" :
                                s.priority === "Medium" ? "rgba(196,149,106,0.15)" :
                                  "rgba(155,142,133,0.12)",
                            color:
                              s.priority === "High" ? "#B5543A" :
                                s.priority === "Medium" ? "#96693A" :
                                  "#5C5249",
                          }}
                        >
                          {s.name}
                          <span className="opacity-70 ml-1">({s.priority})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── JOB ROLES & OPPORTUNITIES ── */}
      <div className="mt-10">
        <div className="flex items-center gap-4 mb-6">
          <h2
            className="text-[#1E1B18] text-xl lg:text-2xl font-bold tracking-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Job Roles & Opportunities
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#D5CFC9] to-transparent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Entry Level */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E0DB] hover:border-[#7B9E87]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#7B9E87]/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A8A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h3 className="text-[#1E1B18] text-sm font-bold">Entry-Level Roles</h3>
            </div>
            <ul className="space-y-2">
              {report.jobRolesAndOpportunities.entryLevelRoles.map((r) => (
                <li key={r} className="text-[#3D3632] text-sm flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B9E87] flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          {/* Internships */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E0DB] hover:border-[#C4956A]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#C4956A]/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B07D4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 10 3 12 0v-5" />
                </svg>
              </div>
              <h3 className="text-[#1E1B18] text-sm font-bold">Internships</h3>
            </div>
            <ul className="space-y-2">
              {report.jobRolesAndOpportunities.internships.map((r) => (
                <li key={r} className="text-[#3D3632] text-sm flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4956A] flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          {/* Freelance */}
          <div className="bg-white rounded-2xl p-5 border border-[#E5E0DB] hover:border-[#8B7EC8]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#8B7EC8]/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8B7EC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-[#1E1B18] text-sm font-bold">Freelance & Projects</h3>
            </div>
            <ul className="space-y-2">
              {report.jobRolesAndOpportunities.freelanceOrProjectIdeas.map((r) => (
                <li key={r} className="text-[#3D3632] text-sm flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B7EC8] flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── CAREER GROWTH PATH ── */}
      {report.careerGrowthPath.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center gap-4 mb-6">
            <h2
              className="text-[#1E1B18] text-xl lg:text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Career Growth Path
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#D5CFC9] to-transparent" />
          </div>
          <div className="space-y-6">
            {report.careerGrowthPath.map((path) => (
              <div key={path.careerTitle} className="bg-white rounded-2xl p-5 lg:p-6 border border-[#E5E0DB] hover:border-[#C4956A]/30 transition-all duration-300 hover:shadow-lg">
                <h3 className="text-[#1E1B18] text-base font-bold mb-4">{path.careerTitle}</h3>
                <div className="relative">
                  <div className="absolute left-[14px] top-3 bottom-3 w-[2px] bg-[#ECE8E3]" />
                  <div className="space-y-4">
                    {path.steps.map((step, si) => (
                      <div key={si} className="relative flex items-start gap-4 pl-[38px]">
                        <div
                          className="absolute left-[8px] top-1 w-[14px] h-[14px] rounded-full border-[2.5px] bg-white"
                          style={{
                            borderColor: MONTH_ACCENTS[si % MONTH_ACCENTS.length],
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#1E1B18] text-sm font-bold">{step.roleTitle}</span>
                            <span className="text-[#6B6058] text-xs">·</span>
                            <span className="text-[#5C5249] text-xs font-medium">{step.yearRange}</span>
                          </div>
                          <p className="text-[#3D7A50] text-xs font-semibold mt-0.5">{step.salaryRange}</p>
                          {step.specializations && step.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {step.specializations.map((s) => (
                                <span key={s} className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F3F0EC] text-[#4A433E]">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PERSONALIZED ADVICE ── */}
      {report.personalizedAdvice.length > 0 && (
        <div ref={adviceReveal.ref} className="mt-10">
          <div className="flex items-center gap-4 mb-6" style={revealStyle(adviceReveal.isVisible, 0, 0)}>
            <h2
              className="text-[#1E1B18] text-xl lg:text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
              Personalized Advice
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-[#D5CFC9] to-transparent" />
          </div>
          <div className="space-y-3">
            {report.personalizedAdvice.map((advice, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-[#E5E0DB] flex items-start gap-3 hover:border-[#C4956A]/30 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-default"
                style={revealStyle(adviceReveal.isVisible, i, 0.1)}
              >
                <div className="w-7 h-7 rounded-lg bg-[#C4956A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B07D4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
                <p className="text-[#3D3632] text-sm leading-relaxed">{advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOOTER CTA ── */}
      <div
        ref={ctaReveal.ref}
        className="mt-12 rounded-2xl p-8 lg:p-10 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2C2623 0%, #1A1715 100%)",
          ...revealStyle(ctaReveal.isVisible, 0, 0),
        }}
      >
        <div className="absolute top-0 right-0 w-56 h-56 rounded-full -translate-y-1/3 translate-x-1/4 cta-orb-1" style={{ background: "radial-gradient(circle, rgba(196,149,106,0.12) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full translate-y-1/3 -translate-x-1/4 cta-orb-2" style={{ background: "radial-gradient(circle, rgba(123,158,135,0.1) 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, white 0%, transparent 60%)" }} />

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/[0.08] rounded-full px-4 py-1.5 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#7B9E87] animate-pulse" />
            <span className="text-white/80 text-xs font-semibold tracking-wide">AI-Powered Guidance</span>
          </div>
          <h3
            className="text-white text-2xl lg:text-[1.75rem] font-bold mb-3 leading-tight"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Ready to explore more?
          </h3>
          <p className="text-white/80 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Run a new discovery with different skills or interests to compare career paths side by side.
          </p>
          <Link
            href="/discover"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#C4956A] to-[#D4A87A] text-white text-sm font-bold hover:shadow-2xl hover:shadow-[#C4956A]/30 transition-all duration-300 active:scale-[0.97] hover:-translate-y-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Start New Discovery
          </Link>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-8" />
    </div>
  );
}
