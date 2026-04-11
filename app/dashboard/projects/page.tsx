"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════ */

interface PortfolioProject {
  title: string;
  description: string;
  estimatedTime: string;
  coreSkill: string;
  featureChecklist: string[];
}

type Scope = "weekend" | "sprint" | "capstone";

const SCOPE_CONFIG: Record<Scope, { label: string; sub: string }> = {
  weekend: { label: "Weekend Hack", sub: "1–2 days" },
  sprint: { label: "Sprint", sub: "1–2 weeks" },
  capstone: { label: "Capstone", sub: "4–8 weeks" },
};

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL HOOK (reused from dashboard)
   ═══════════════════════════════════════════════════════ */

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, isVisible]);

  return { ref, isVisible };
}

/* ═══════════════════════════════════════════════════════
   LOADING SKELETON
   ═══════════════════════════════════════════════════════ */

function ProjectSkeleton({ index }: { index: number }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 180}ms` }}
    >
      <div className="relative">
        {/* Title skeleton */}
        <div
          className="bg-white border border-[#E5E0DB] rounded-2xl p-8 relative z-10"
          style={{ marginBottom: "-24px" }}
        >
          <div className="portfolio-skeleton h-5 w-20 mb-4" />
          <div className="portfolio-skeleton h-8 w-3/4 mb-3" />
          <div className="portfolio-skeleton h-4 w-full mb-2" />
          <div className="portfolio-skeleton h-4 w-2/3" />
        </div>

        {/* Checklist skeleton */}
        <div className="bg-[var(--color-bg-elevated)] border border-[#E5E0DB] rounded-2xl p-8 pt-12">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="portfolio-skeleton w-5 h-5 rounded flex-shrink-0" />
                <div className="portfolio-skeleton h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════ */

function EmptyState({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-5">
      <div className="text-center max-w-lg animate-fade-in-up">
        <div className="w-20 h-20 rounded-2xl bg-[#F3F0EC] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B8E85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <path d="M17.5 14v7M14 17.5h7" />
          </svg>
        </div>
        <h2
          className="text-[#1E1B18] text-2xl lg:text-3xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          No portfolio projects yet
        </h2>
        <p className="text-[#605A57] text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
          Generate personalized project ideas based on your skill gap analysis.
          Each project helps you practice the exact skills you need for your target career.
        </p>
        <button
          onClick={onGenerate}
          disabled={generating}
          className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2C2623] text-white text-sm font-bold hover:bg-[#1E1B18] transition-all duration-200 shadow-lg shadow-[#2C2623]/15 active:scale-[0.96] hover:shadow-xl hover:shadow-[#2C2623]/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
                <path d="M12 3v18M3 12h18" />
              </svg>
              Generate Portfolio Projects
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   NO ROADMAP STATE
   ═══════════════════════════════════════════════════════ */

function NoRoadmapState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-5">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="w-20 h-20 rounded-2xl bg-[#F3F0EC] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9B8E85" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h2
          className="text-[#1E1B18] text-2xl lg:text-3xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          Start with a roadmap
        </h2>
        <p className="text-[#605A57] text-[15px] leading-relaxed mb-8">
          Complete the career discovery first to generate portfolio projects tailored to your learning path.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#2C2623] text-white text-sm font-bold hover:bg-[#1E1B18] transition-all duration-200 shadow-lg shadow-[#2C2623]/15"
        >
          Start Career Discovery
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PROJECT CARD COMPONENT
   ═══════════════════════════════════════════════════════ */

function ProjectCard({
  project,
  index,
  checkedItems,
  onToggleCheck,
  visible,
}: {
  project: PortfolioProject;
  index: number;
  checkedItems: Set<string>;
  onToggleCheck: (key: string) => void;
  visible: boolean;
}) {
  const [recentlyChecked, setRecentlyChecked] = useState<string | null>(null);
  const checkedCount = project.featureChecklist.filter((_, i) => checkedItems.has(`${index}-${i}`)).length;
  const progress = Math.round((checkedCount / project.featureChecklist.length) * 100);

  const handleCheck = (featureIdx: number) => {
    const key = `${index}-${featureIdx}`;
    onToggleCheck(key);
    if (!checkedItems.has(key)) {
      setRecentlyChecked(key);
      setTimeout(() => setRecentlyChecked(null), 350);
    }
  };

  return (
    <div
      className="group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.15}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.15 + index * 0.15}s`,
      }}
    >
      <div className="relative">
        {/* ── TITLE CONTAINER (overlaps the checklist card) ── */}
        <div
          className="bg-white border border-[rgba(55,50,47,0.20)] rounded-2xl p-7 lg:p-8 relative z-10 transition-shadow duration-300 hover:shadow-lg hover:shadow-[#2C2623]/[0.04]"
          style={{ marginBottom: "-20px" }}
        >
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#605A57] bg-[#F3F0EC] px-2.5 py-1 rounded-md">
              {project.estimatedTime}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#605A57] bg-[#F3F0EC] px-2.5 py-1 rounded-md">
              Core Skill: {project.coreSkill}
            </span>
          </div>

          {/* Title — editorial serif */}
          <h3
            className="text-[#1E1B18] text-2xl lg:text-[1.75rem] font-normal tracking-tight leading-tight mb-3"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            {project.title}
          </h3>

          {/* Description */}
          <p
            className="text-[15px] leading-relaxed"
            style={{ color: "#605A57", fontFamily: "var(--font-body), sans-serif" }}
          >
            {project.description}
          </p>

          {/* Progress bar */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-[#ECE8E3] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: progress === 100
                    ? "linear-gradient(90deg, #7B9E87, #5A8A6A)"
                    : "linear-gradient(90deg, #C4956A, #D4A87A)",
                }}
              />
            </div>
            <span className="text-[11px] font-bold text-[#605A57] tabular-nums min-w-[32px] text-right">
              {progress}%
            </span>
          </div>
        </div>

        {/* ── CHECKLIST CARD (slightly behind the title) ── */}
        <div className="bg-[var(--color-bg-elevated)] border border-[rgba(55,50,47,0.12)] rounded-2xl p-7 lg:p-8 pt-10 lg:pt-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9B8E85] mb-5">
            Feature Checklist — {checkedCount}/{project.featureChecklist.length}
          </p>

          <div className="space-y-3">
            {project.featureChecklist.map((feature, featureIdx) => {
              const key = `${index}-${featureIdx}`;
              const isChecked = checkedItems.has(key);
              const justPopped = recentlyChecked === key;

              return (
                <button
                  key={featureIdx}
                  onClick={() => handleCheck(featureIdx)}
                  className="w-full flex items-start gap-3 text-left group/item py-1.5 transition-colors duration-200 hover:bg-white/60 rounded-lg px-2 -mx-2"
                >
                  {/* Checkbox */}
                  <div
                    className={`w-[22px] h-[22px] rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200
                      ${isChecked
                        ? "bg-[#2C2623] border-[#2C2623] text-white"
                        : "border-[#D5CFC9] text-transparent hover:border-[#9B8E85]"
                      }
                      ${justPopped ? "portfolio-checkbox-pop" : ""}
                    `}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  {/* Feature text with animated strike-through */}
                  <span
                    className={`text-[14px] leading-relaxed transition-colors duration-300 portfolio-check-strike ${isChecked ? "text-[#9B8E85] checked" : "text-[#3D3632]"
                      }`}
                    style={{ fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {feature}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

function ProjectsPageContent() {
  const searchParams = useSearchParams();
  const [runId, setRunId] = useState<string | null>(null);
  const [projects, setProjects] = useState<PortfolioProject[] | null>(null);
  const [scope, setScope] = useState<Scope>("sprint");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [hasRoadmap, setHasRoadmap] = useState(true);

  // Simple reveal state — triggered after projects are loaded and rendered
  const [contentVisible, setContentVisible] = useState(false);

  // Trigger visibility a frame after projects are set (so DOM is ready)
  useEffect(() => {
    if (projects && !loading && !generating) {
      const frame = requestAnimationFrame(() => {
        setContentVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setContentVisible(false);
    }
  }, [projects, loading, generating]);

  /* ── Resolve runId ──────────────────────────────────── */
  useEffect(() => {
    const paramRunId = searchParams.get("runId");
    if (paramRunId) {
      setRunId(paramRunId);
      return;
    }

    // No runId in URL — try to find the last active run
    const savedRunId = localStorage.getItem("sb_last_run_id");
    if (savedRunId) {
      setRunId(savedRunId);
      return;
    }

    // No run at all — need to fetch latest
    fetch("/api/recommendations/latest")
      .then((res) => res.json())
      .then((data: { runId: string | null }) => {
        if (data.runId) {
          setRunId(data.runId);
        } else {
          setHasRoadmap(false);
          setLoading(false);
        }
      })
      .catch(() => {
        setHasRoadmap(false);
        setLoading(false);
      });
  }, [searchParams]);

  /* ── Fetch existing projects for this run ────────────── */
  const fetchProjects = useCallback(async (rid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portfolio-projects?runId=${rid}`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      const data = await res.json();

      if (data.projects) {
        setProjects(data.projects);
        setScope(data.scope || "sprint");
        // Load checklist state
        loadChecklistState(rid);
      } else {
        setProjects(null);
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
      setProjects(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!runId) return;
    fetchProjects(runId);
  }, [runId, fetchProjects]);

  /* ── Auto-generate if ?generate=1 ───────────────────── */
  useEffect(() => {
    if (searchParams.get("generate") === "1" && runId && !generating && !projects && !loading) {
      generateProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, loading, projects]);

  /* ── Generate projects via AI ───────────────────────── */
  const generateProjects = useCallback(async () => {
    if (!runId || generating) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/portfolio-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId, scope }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: { message: "Generation failed" } }));
        throw new Error(errData.error?.message || "Generation failed");
      }

      const data = await res.json();
      setProjects(data.projects);
      setScope(data.scope || scope);
      // Reset checklist
      setCheckedItems(new Set());
      saveChecklistState(runId, new Set());

      // Clean up URL if it had generate=1
      if (searchParams.get("generate") === "1") {
        window.history.replaceState({}, "", `/dashboard/projects?runId=${runId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setGenerating(false);
    }
  }, [runId, scope, generating, searchParams]);

  /* ── Checklist persistence (localStorage) ───────────── */
  const loadChecklistState = (rid: string) => {
    try {
      const saved = localStorage.getItem(`sb_portfolio_checks_${rid}`);
      if (saved) {
        setCheckedItems(new Set(JSON.parse(saved) as string[]));
      } else {
        setCheckedItems(new Set());
      }
    } catch {
      setCheckedItems(new Set());
    }
  };

  const saveChecklistState = (rid: string, items: Set<string>) => {
    localStorage.setItem(`sb_portfolio_checks_${rid}`, JSON.stringify([...items]));
  };

  const toggleCheck = useCallback((key: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      if (runId) saveChecklistState(runId, next);
      return next;
    });
  }, [runId]);

  /* ── Export as README ────────────────────────────────── */
  const exportReadme = useCallback(() => {
    if (!projects) return;

    const lines: string[] = [
      "# Portfolio Projects",
      "",
      `> Generated by SkillBridge — ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
      "",
      "---",
      "",
    ];

    projects.forEach((project, i) => {
      lines.push(`## ${i + 1}. ${project.title}`);
      lines.push("");
      lines.push(`**Estimated Time:** ${project.estimatedTime}  `);
      lines.push(`**Core Skill:** ${project.coreSkill}`);
      lines.push("");
      lines.push(project.description);
      lines.push("");
      lines.push("### Feature Checklist");
      lines.push("");
      project.featureChecklist.forEach((feat, j) => {
        const isChecked = checkedItems.has(`${i}-${j}`);
        lines.push(`- [${isChecked ? "x" : " "}] ${feat}`);
      });
      lines.push("");
      lines.push("---");
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-projects.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [projects, checkedItems]);

  /* ── Conditional renders ────────────────────────────── */

  if (!hasRoadmap) return <NoRoadmapState />;

  if (loading || (generating && !projects)) {
    return (
      <div className="min-h-screen p-5 pt-16 lg:pt-6 lg:p-10 overflow-x-hidden">
        {/* Header skeleton */}
        <div className="mb-10 animate-fade-in-up">
          <div className="portfolio-skeleton h-4 w-40 mb-3" />
          <div className="portfolio-skeleton h-10 w-80 mb-3" />
          <div className="portfolio-skeleton h-5 w-64" />
        </div>

        {/* Cards skeleton */}
        <div className="grid gap-8 lg:grid-cols-1 xl:grid-cols-1 max-w-3xl">
          {[0, 1, 2].map((i) => (
            <ProjectSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!projects) {
    return (
      <div className="min-h-screen p-5 pt-16 lg:pt-6 lg:p-10 overflow-x-hidden">
        {/* Header */}
        <header className="mb-10 animate-fade-in-up">
          <p className="text-[#6B6058] text-sm font-semibold tracking-[0.15em] uppercase mb-2">
            Portfolio Projects
          </p>
          <h1
            className="text-[#1E1B18] text-3xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.15] mb-4"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Build Your Portfolio
          </h1>

          {/* Scope selector */}
          <div className="flex items-center gap-2 mb-6">
            {(Object.keys(SCOPE_CONFIG) as Scope[]).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${scope === s
                  ? "bg-[#2C2623] text-white shadow-md"
                  : "bg-white border border-[#E5E0DB] text-[#605A57] hover:border-[#9B8E85] hover:text-[#3D3632]"
                  }`}
              >
                <span className="block">{SCOPE_CONFIG[s].label}</span>
                <span className="block text-[10px] opacity-70">{SCOPE_CONFIG[s].sub}</span>
              </button>
            ))}
          </div>
        </header>

        <EmptyState onGenerate={generateProjects} generating={generating} />
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     RENDER: Projects view
     ═══════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen p-5 pt-16 lg:pt-6 lg:p-10 overflow-x-hidden">
      {/* ── HEADER ── */}
      <header className="mb-10" style={{
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-[#6B6058] text-sm font-semibold tracking-[0.15em] uppercase mb-2">
              Portfolio Projects
            </p>
            <h1
              className="text-[#1E1B18] text-3xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.15]"
              style={{ fontFamily: "var(--font-display), Georgia, serif" }}
            >
              Your Project Ideas
            </h1>
            <p className="text-[#4A433E] text-[15px] mt-2.5 max-w-lg leading-relaxed">
              AI-generated project ideas personalized to your skill gaps. Check off features as you build.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={exportReadme}
              className="group h-10 px-5 rounded-xl border border-[#D5CFC9] text-[#605A57] text-sm font-medium hover:border-[#2C2623]/25 hover:text-[#3D3632] transition-all duration-200 active:scale-[0.96] flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-0.5 transition-transform">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export README
            </button>
            <button
              onClick={generateProjects}
              disabled={generating}
              className="group h-10 px-5 rounded-xl bg-[#2C2623] text-white text-sm font-medium hover:bg-[#1E1B18] transition-all duration-200 shadow-lg shadow-[#2C2623]/15 active:scale-[0.96] hover:shadow-xl hover:shadow-[#2C2623]/20 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="group-hover:rotate-90 transition-transform duration-300">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Generate New
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scope selector */}
        <div className="flex items-center gap-2 mt-6">
          {(Object.keys(SCOPE_CONFIG) as Scope[]).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${scope === s
                ? "bg-[#2C2623] text-white shadow-md"
                : "bg-white border border-[#E5E0DB] text-[#605A57] hover:border-[#9B8E85] hover:text-[#3D3632]"
                }`}
            >
              <span className="block">{SCOPE_CONFIG[s].label}</span>
              <span className="block text-[10px] opacity-70">{SCOPE_CONFIG[s].sub}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Error banner */}
      {error && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in-up">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4836D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <div>
            <p className="text-[#D4836D] text-sm font-medium">{error}</p>
            <button onClick={generateProjects} className="text-[#D4836D] text-xs font-medium underline mt-1 hover:text-[#B07D4F]">
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── PROJECT CARDS ── */}
      <div className="max-w-3xl space-y-10">
        {projects.map((project, i) => (
          <ProjectCard
            key={`${project.title}-${i}`}
            project={project}
            index={i}
            checkedItems={checkedItems}
            onToggleCheck={toggleCheck}
            visible={contentVisible}
          />
        ))}
      </div>

      {/* ── BACK TO ROADMAP LINK ── */}
      <div className="mt-12 mb-8 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#605A57] text-sm font-medium hover:text-[#3D3632] transition-colors duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Roadmap
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUSPENSE WRAPPER (required for useSearchParams)
   ═══════════════════════════════════════════════════════ */

function ProjectsPageFallback() {
  return (
    <div className="min-h-screen p-5 pt-16 lg:pt-6 lg:p-10 overflow-x-hidden">
      <div className="mb-10 animate-fade-in-up">
        <div className="portfolio-skeleton h-4 w-40 mb-3" />
        <div className="portfolio-skeleton h-10 w-80 mb-3" />
        <div className="portfolio-skeleton h-5 w-64" />
      </div>
      <div className="max-w-3xl space-y-8">
        {[0, 1, 2].map((i) => (
          <ProjectSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsPageFallback />}>
      <ProjectsPageContent />
    </Suspense>
  );
}
