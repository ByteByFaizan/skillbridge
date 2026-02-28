"use client";

import { useState, useEffect, useRef, useCallback, type KeyboardEvent } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════════════════ */

interface FormData {
  education: string;
  skills: string[];
  interests: string[];
  goal: string;
}

const EDUCATION_OPTIONS = [
  { value: "high-school", label: "High School", icon: "🎓", description: "Currently in or completed high school" },
  { value: "undergraduate", label: "Undergraduate", icon: "📚", description: "Pursuing a Bachelor's degree (B.Tech, B.Sc, B.Com, etc.)" },
  { value: "graduate", label: "Graduate", icon: "🎯", description: "Completed a Bachelor's degree" },
  { value: "postgraduate", label: "Postgraduate", icon: "🔬", description: "Pursuing or completed Master's / MBA / M.Tech" },
  { value: "self-taught", label: "Self-Taught / Bootcamp", icon: "💡", description: "Learning through online courses and self-study" },
];

const SKILL_SUGGESTIONS = [
  "Python", "JavaScript", "HTML/CSS", "Java", "C++", "SQL",
  "Excel", "Data Analysis", "Machine Learning", "React",
  "Node.js", "Communication", "Public Speaking", "Writing",
  "Research", "Problem Solving", "Teamwork", "Leadership",
  "Graphic Design", "Video Editing", "Marketing", "Sales",
  "Accounting", "Statistics", "Photoshop", "Figma",
];

const INTEREST_SUGGESTIONS = [
  "Web Development", "Mobile Apps", "Data Science", "AI & ML",
  "Cybersecurity", "Cloud Computing", "Game Development", "Blockchain",
  "Digital Marketing", "Content Creation", "UX/UI Design", "DevOps",
  "Finance & Fintech", "Healthcare Tech", "E-commerce", "Education Tech",
  "Robotics", "IoT", "Product Management", "Consulting",
  "Entrepreneurship", "Social Media", "Photography", "Music Production",
];

const TOTAL_STEPS = 4;

const GOAL_MAX_LENGTH = 300;

/* ═══════════════════════════════════════════════════════
   STEP HEADINGS — conversational tone
   ═══════════════════════════════════════════════════════ */

const stepMeta = [
  {
    heading: "What's your education level?",
    subtext: "This helps us match careers to where you are right now.",
    hint: "Select one to continue",
  },
  {
    heading: "What skills do you already have?",
    subtext: "List anything you're comfortable with — technical or soft skills.",
    hint: "Type or pick from suggestions below",
  },
  {
    heading: "What interests you most?",
    subtext: "Pick topics or fields that excite you. There are no wrong choices.",
    hint: "Add at least one to continue",
  },
  {
    heading: "Do you have a career goal in mind?",
    subtext: "Totally optional. If you're unsure, we'll figure it out together.",
    hint: "You can skip this step",
  },
];

/* ═══════════════════════════════════════════════════════
   LOADING MESSAGES
   ═══════════════════════════════════════════════════════ */

const LOADING_STAGES = [
  { text: "Reading your profile…", duration: 800 },
  { text: "Matching career paths…", duration: 900 },
  { text: "Analyzing skill gaps…", duration: 700 },
  { text: "Building your roadmap…", duration: 600 },
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function DiscoverPage() {
  const [step, setStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [slideDir, setSlideDir] = useState<"left" | "right">("left");
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    education: "",
    skills: [],
    interests: [],
    goal: "",
  });

  // Tag input states
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);

  const skillInputRef = useRef<HTMLInputElement>(null);
  const interestInputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* ── Auto-focus inputs on step change ────────────────── */
  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 1) skillInputRef.current?.focus();
      if (step === 2) interestInputRef.current?.focus();
    }, 400); // wait for entrance animation
    return () => clearTimeout(t);
  }, [step]);

  /* ── Global Enter key to advance ─────────────────────── */
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey && !isSubmitting && !transitioning) {
        // Step 0: advance if education selected
        if (step === 0 && formData.education) {
          e.preventDefault();
          goNext();
        }
        // Step 3: submit
        if (step === 3) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, formData.education, isSubmitting, transitioning]);

  /* ── Loading stage progression ───────────────────────── */
  useEffect(() => {
    if (!isSubmitting) {
      setLoadingStage(0);
      return;
    }
    let stageIdx = 0;
    const advanceStage = () => {
      stageIdx++;
      if (stageIdx < LOADING_STAGES.length) {
        setLoadingStage(stageIdx);
        setTimeout(advanceStage, LOADING_STAGES[stageIdx].duration);
      }
    };
    setTimeout(advanceStage, LOADING_STAGES[0].duration);
  }, [isSubmitting]);

  /* ── Navigation ──────────────────────────────────────── */

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: return formData.education !== "";
      case 1: return formData.skills.length > 0;
      case 2: return formData.interests.length > 0;
      case 3: return true; // goal is optional
      default: return false;
    }
  }, [step, formData.education, formData.skills.length, formData.interests.length]);

  const isStepComplete = (s: number) => {
    switch (s) {
      case 0: return formData.education !== "";
      case 1: return formData.skills.length > 0;
      case 2: return formData.interests.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const animateTransition = (dir: "left" | "right", cb: () => void) => {
    setSlideDir(dir);
    setTransitioning(true);
    setTimeout(() => {
      cb();
      setTransitioning(false);
    }, 280);
  };

  const goNext = () => {
    if (!canProceed()) return;
    animateTransition("left", () => {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    });
  };

  const goBack = () => {
    animateTransition("right", () => {
      setStep((s) => Math.max(s - 1, 0));
    });
  };

  const goToStep = (target: number) => {
    if (target === step) return;
    // Allow going back to any completed step, or forward only if current is complete
    if (target < step || (target > step && canProceed())) {
      animateTransition(target > step ? "left" : "right", () => {
        setStep(target);
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          education: formData.education,
          skills: formData.skills,
          interests: formData.interests,
          goal: formData.goal || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        // If DB failed but report was generated, still navigate with the report
        if (data?.report && data?.error?.code === "DB_ERROR") {
          sessionStorage.setItem("sb_fallback_report", JSON.stringify(data.report));
          window.location.href = "/dashboard?fallback=1";
          return;
        }
        console.error("API error:", data);
        alert(data?.error?.message ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }
      // Persist the runId so the dashboard can fetch the full report
      if (data.runId) {
        localStorage.setItem("sb_last_run_id", data.runId);
      }
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  /* ── Tag helpers ─────────────────────────────────────── */

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((fd) => ({ ...fd, skills: [...fd.skills, trimmed] }));
    }
    setSkillInput("");
    skillInputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    setFormData((fd) => ({ ...fd, skills: fd.skills.filter((s) => s !== skill) }));
  };

  const addInterest = (interest: string) => {
    const trimmed = interest.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData((fd) => ({ ...fd, interests: [...fd.interests, trimmed] }));
    }
    setInterestInput("");
    interestInputRef.current?.focus();
  };

  const removeInterest = (interest: string) => {
    setFormData((fd) => ({ ...fd, interests: fd.interests.filter((i) => i !== interest) }));
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === "Backspace" && !skillInput && formData.skills.length > 0) {
      removeSkill(formData.skills[formData.skills.length - 1]);
    }
  };

  const handleInterestKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && interestInput.trim()) {
      e.preventDefault();
      addInterest(interestInput);
    }
    if (e.key === "Backspace" && !interestInput && formData.interests.length > 0) {
      removeInterest(formData.interests[formData.interests.length - 1]);
    }
  };

  /* ── Filtered suggestions ────────────────────────────── */

  const filteredSkillSuggestions = SKILL_SUGGESTIONS.filter(
    (s) =>
      !formData.skills.includes(s) &&
      (!skillInput || s.toLowerCase().includes(skillInput.toLowerCase()))
  );

  const filteredInterestSuggestions = INTEREST_SUGGESTIONS.filter(
    (i) =>
      !formData.interests.includes(i) &&
      (!interestInput || i.toLowerCase().includes(interestInput.toLowerCase()))
  );

  /* ── Progress percentage ─────────────────────────────── */

  const progressPercent = ((step + (canProceed() ? 1 : 0.5)) / TOTAL_STEPS) * 100;

  /* ── Step content transition classes ─────────────────── */

  const contentClass = transitioning
    ? `discover-step-exit ${slideDir === "left" ? "discover-slide-exit-left" : "discover-slide-exit-right"}`
    : "discover-step-enter";

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[#f7f5f3] flex flex-col">
      {/* ──── Thin top progress bar ──── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#e0dedb]">
        <div
          className="h-full bg-[#37322f] transition-all duration-700 ease-out relative overflow-hidden"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 discover-progress-shimmer" />
        </div>
      </div>

      {/* ──── Header ──── */}
      <header
        className="relative z-40 w-full transition-all duration-700"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-12px)",
        }}
      >
        <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#37322f] font-semibold text-xl tracking-tight select-none group"
            style={{ fontFamily: "'DM Serif Display', 'Georgia', serif" }}
          >
            <div className="w-8 h-8 rounded-lg bg-[#37322f] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            SkillBridge
          </Link>

          <div className="flex items-center gap-5">
            {/* ── Step indicator dots ── */}
            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                const completed = i < step || (i === step && canProceed());
                const active = i === step;
                return (
                  <button
                    key={i}
                    onClick={() => goToStep(i)}
                    className={`relative flex items-center justify-center transition-all duration-500 ${
                      active
                        ? "w-8 h-8"
                        : "w-6 h-6"
                    } ${
                      i <= step || isStepComplete(i)
                        ? "cursor-pointer"
                        : "cursor-default"
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                    disabled={i > step && !canProceed()}
                  >
                    {/* Background circle */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      active
                        ? "bg-[#37322f] scale-100"
                        : completed
                          ? "bg-[#37322f] scale-100"
                          : "bg-[#e0dedb] scale-100 hover:bg-[#d5d2cf]"
                    }`} />

                    {/* Active ring pulse */}
                    {active && (
                      <div className="absolute inset-0 rounded-full border-2 border-[#37322f]/30 discover-ring-pulse" />
                    )}

                    {/* Content: checkmark or number */}
                    {completed && !active ? (
                      <svg className="relative z-10 w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <span className={`relative z-10 text-[11px] font-bold transition-colors duration-300 ${
                        active ? "text-white" : "text-[#605A57]"
                      }`}>
                        {i + 1}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <Link
              href="/"
              className="text-sm text-[#49423D] hover:text-[#37322f] transition-colors font-medium"
            >
              Cancel
            </Link>
          </div>
        </div>
      </header>

      {/* ──── Main content ──── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-12 pt-4">
        <div
          ref={formContainerRef}
          className="w-full max-w-[640px]"
        >
          {/* ── Step content with transition ── */}
          <div
            key={`step-block-${step}`}
            className={contentClass}
          >
            {/* ── Heading area ── */}
            <div className="mb-8">
              {/* Step label with mobile step counter */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#37322f] text-white text-xs font-bold">
                  {step + 1}
                </span>
                <span className="text-[#49423D] text-sm font-semibold tracking-wide uppercase">
                  Step {step + 1}
                  <span className="text-[#605A57] font-medium"> of {TOTAL_STEPS}</span>
                </span>

                {/* Completion badge for revisited steps */}
                {isStepComplete(step) && step < 3 && (
                  <span className="discover-tag-enter ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-[#e8f5e9] text-[#2e7d32] text-xs font-semibold rounded-full">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Done
                  </span>
                )}
              </div>

              <h1 className="text-[#37322f] text-3xl sm:text-4xl lg:text-[44px] font-normal leading-[1.15] font-display tracking-tight">
                {stepMeta[step].heading}
              </h1>
              <p className="mt-3 text-[#49423D] text-base sm:text-[17px] font-medium leading-7">
                {stepMeta[step].subtext}
              </p>

              {/* Hint badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#37322f]/[0.04] rounded-full">
                <svg className="w-3.5 h-3.5 text-[#605A57]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4M12 8h.01" />
                </svg>
                <span className="text-xs font-medium text-[#605A57]">
                  {stepMeta[step].hint}
                </span>
              </div>
            </div>

            {/* ── Step body ── */}

            {/* ════════════ STEP 0 — Education ════════════ */}
            {step === 0 && (
              <div className="space-y-2.5">
                {EDUCATION_OPTIONS.map((opt, i) => {
                  const selected = formData.education === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFormData((fd) => ({ ...fd, education: opt.value }))}
                      onDoubleClick={() => {
                        setFormData((fd) => ({ ...fd, education: opt.value }));
                        setTimeout(goNext, 150);
                      }}
                      className={`discover-option-enter w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 group ${
                        selected
                          ? "border-[#37322f] bg-white shadow-[0_4px_20px_rgba(55,50,47,0.10)] scale-[1.01]"
                          : "border-[#e0dedb] bg-white/60 hover:bg-white hover:border-[#37322f]/25 hover:shadow-[0_2px_12px_rgba(55,50,47,0.06)] hover:scale-[1.005]"
                      }`}
                      style={{ animationDelay: `${i * 70 + 80}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Emoji icon */}
                        <span className={`text-xl transition-transform duration-300 ${selected ? "scale-110" : "group-hover:scale-105"}`}>
                          {opt.icon}
                        </span>

                        {/* Radio indicator */}
                        <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          selected ? "border-[#37322f] bg-[#37322f]" : "border-[#d0cdc9] group-hover:border-[#37322f]/50"
                        }`}>
                          {selected && (
                            <svg className="w-2.5 h-2.5 text-white discover-tag-enter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          )}
                        </div>

                        <div className="flex-1">
                          <span className={`text-[15px] font-semibold transition-colors ${
                            selected ? "text-[#37322f]" : "text-[#49423D] group-hover:text-[#37322f]"
                          }`}>
                            {opt.label}
                          </span>
                          <p className={`text-[13px] leading-snug mt-0.5 transition-colors ${
                            selected ? "text-[#605A57]" : "text-[#7a7572]"
                          }`}>
                            {opt.description}
                          </p>
                        </div>

                        {/* Selected indicator arrow */}
                        <svg
                          className={`w-4 h-4 text-[#37322f] transition-all duration-300 ${selected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  );
                })}

                {/* Double-click hint */}
                {formData.education && (
                  <p className="text-xs text-[#605A57] text-center mt-3 discover-tag-enter">
                    Double-click to select and continue, or press <kbd className="px-1.5 py-0.5 bg-white border border-[#e0dedb] rounded text-[11px] font-mono font-semibold text-[#37322f]">Enter ↵</kbd> to advance
                  </p>
                )}
              </div>
            )}

            {/* ════════════ STEP 1 — Skills ════════════ */}
            {step === 1 && (
              <div>
                {/* Tag input container */}
                <div
                  className={`discover-tag-input min-h-[56px] px-4 py-3 rounded-xl border bg-white transition-all duration-300 flex flex-wrap gap-2 items-center cursor-text ${
                    showSkillSuggestions
                      ? "border-[#37322f] shadow-[0_0_0_4px_rgba(55,50,47,0.06),0_4px_16px_rgba(55,50,47,0.06)]"
                      : "border-[#e0dedb] hover:border-[#37322f]/30"
                  }`}
                  onClick={() => skillInputRef.current?.focus()}
                >
                  {formData.skills.map((skill, i) => (
                    <span
                      key={skill}
                      className="discover-tag-enter inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#37322f] text-white text-sm font-medium rounded-full shadow-[0_1px_3px_rgba(55,50,47,0.2)]"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      {skill}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-all duration-200 hover:rotate-90"
                        aria-label={`Remove ${skill}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input
                    ref={skillInputRef}
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onFocus={() => setShowSkillSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSkillSuggestions(false), 200)}
                    placeholder={formData.skills.length === 0 ? "Type a skill and press Enter…" : "Add more…"}
                    className="flex-1 min-w-[140px] border-0 ring-0 bg-transparent text-sm text-[#37322f] placeholder:text-[#8a8582] outline-none focus:outline-none focus:ring-0 focus:border-0"
                  />
                </div>

                {/* Keyboard hint */}
                <div className="mt-2.5 flex items-center gap-3 text-xs text-[#7a7572]">
                  <span className="inline-flex items-center gap-1">
                    Press <kbd className="px-1 py-0.5 bg-white border border-[#e0dedb] rounded text-[10px] font-mono font-semibold text-[#49423D]">Enter</kbd> or <kbd className="px-1 py-0.5 bg-white border border-[#e0dedb] rounded text-[10px] font-mono font-semibold text-[#49423D]">,</kbd> to add
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-white border border-[#e0dedb] rounded text-[10px] font-mono font-semibold text-[#49423D]">⌫</kbd> to remove last
                  </span>
                </div>

                {/* Skill suggestions */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-[#49423D] uppercase tracking-wider mb-3">
                    Quick add
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSkillSuggestions.slice(0, 16).map((skill, i) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="discover-suggestion-enter px-3.5 py-1.5 text-sm font-medium text-[#49423D] bg-white border border-[#e0dedb] rounded-full hover:border-[#37322f]/40 hover:bg-[#37322f]/[0.04] hover:text-[#37322f] transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] hover:shadow-[0_2px_8px_rgba(55,50,47,0.06)]"
                        style={{ animationDelay: `${i * 30 + 150}ms` }}
                      >
                        <span className="mr-1 opacity-50">+</span> {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.skills.length > 0 && (
                  <div className="mt-5 flex items-center gap-2 discover-tag-enter">
                    <div className="h-1.5 flex-1 bg-[#e0dedb] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#37322f] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(formData.skills.length / 5 * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#49423D] font-semibold whitespace-nowrap">
                      {formData.skills.length} skill{formData.skills.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ════════════ STEP 2 — Interests ════════════ */}
            {step === 2 && (
              <div>
                {/* Tag input container */}
                <div
                  className={`discover-tag-input min-h-[56px] px-4 py-3 rounded-xl border bg-white transition-all duration-300 flex flex-wrap gap-2 items-center cursor-text ${
                    showInterestSuggestions
                      ? "border-[#37322f] shadow-[0_0_0_4px_rgba(55,50,47,0.06),0_4px_16px_rgba(55,50,47,0.06)]"
                      : "border-[#e0dedb] hover:border-[#37322f]/30"
                  }`}
                  onClick={() => interestInputRef.current?.focus()}
                >
                  {formData.interests.map((interest, i) => (
                    <span
                      key={interest}
                      className="discover-tag-enter inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#37322f] text-white text-sm font-medium rounded-full shadow-[0_1px_3px_rgba(55,50,47,0.2)]"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      {interest}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeInterest(interest); }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-all duration-200 hover:rotate-90"
                        aria-label={`Remove ${interest}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  <input
                    ref={interestInputRef}
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={handleInterestKeyDown}
                    onFocus={() => setShowInterestSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowInterestSuggestions(false), 200)}
                    placeholder={formData.interests.length === 0 ? "Type an interest and press Enter…" : "Add more…"}
                    className="flex-1 min-w-[140px] border-0 ring-0 bg-transparent text-sm text-[#37322f] placeholder:text-[#8a8582] outline-none focus:outline-none focus:ring-0 focus:border-0"
                  />
                </div>

                {/* Keyboard hint */}
                <div className="mt-2.5 flex items-center gap-3 text-xs text-[#7a7572]">
                  <span className="inline-flex items-center gap-1">
                    Press <kbd className="px-1 py-0.5 bg-white border border-[#e0dedb] rounded text-[10px] font-mono font-semibold text-[#49423D]">Enter</kbd> or <kbd className="px-1 py-0.5 bg-white border border-[#e0dedb] rounded text-[10px] font-mono font-semibold text-[#49423D]">,</kbd> to add
                  </span>
                </div>

                {/* Interest suggestions */}
                <div className="mt-5">
                  <p className="text-xs font-semibold text-[#49423D] uppercase tracking-wider mb-3">
                    Popular topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredInterestSuggestions.slice(0, 16).map((interest, i) => (
                      <button
                        key={interest}
                        onClick={() => addInterest(interest)}
                        className="discover-suggestion-enter px-3.5 py-1.5 text-sm font-medium text-[#49423D] bg-white border border-[#e0dedb] rounded-full hover:border-[#37322f]/40 hover:bg-[#37322f]/[0.04] hover:text-[#37322f] transition-all duration-200 hover:scale-[1.04] active:scale-[0.96] hover:shadow-[0_2px_8px_rgba(55,50,47,0.06)]"
                        style={{ animationDelay: `${i * 30 + 150}ms` }}
                      >
                        <span className="mr-1 opacity-50">+</span> {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.interests.length > 0 && (
                  <div className="mt-5 flex items-center gap-2 discover-tag-enter">
                    <div className="h-1.5 flex-1 bg-[#e0dedb] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#37322f] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(formData.interests.length / 5 * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-[#49423D] font-semibold whitespace-nowrap">
                      {formData.interests.length} interest{formData.interests.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* ════════════ STEP 3 — Career Goal ════════════ */}
            {step === 3 && (
              <div>
                <div className="relative">
                  <textarea
                    value={formData.goal}
                    onChange={(e) => {
                      if (e.target.value.length <= GOAL_MAX_LENGTH) {
                        setFormData((fd) => ({ ...fd, goal: e.target.value }));
                      }
                    }}
                    rows={5}
                    placeholder="e.g. I want to become a data analyst at a tech company, or I want to freelance as a web developer…"
                    className="w-full px-5 py-4 rounded-xl bg-white border border-[#e0dedb] ring-0 text-[#37322f] text-base leading-7 placeholder:text-[#8a8582] outline-none transition-all duration-300 focus:border-[#37322f] focus:ring-0 focus:outline-none focus:shadow-[0_0_0_4px_rgba(55,50,47,0.06),0_4px_16px_rgba(55,50,47,0.06)] resize-none"
                  />
                  {/* Character counter */}
                  <div className={`absolute bottom-3 right-4 text-xs font-medium transition-colors ${
                    formData.goal.length > GOAL_MAX_LENGTH * 0.9 ? "text-[#c0392b]" : "text-[#7a7572]"
                  }`}>
                    {formData.goal.length}/{GOAL_MAX_LENGTH}
                  </div>
                </div>

                <p className="mt-3 text-sm text-[#605A57] font-medium">
                  This is completely optional. Leave it blank if you&apos;re still exploring.
                </p>

                {/* Review summary */}
                <div className="mt-8 pt-8 border-t border-[#e0dedb]">
                  <p className="text-xs font-semibold text-[#49423D] uppercase tracking-wider mb-5">
                    Your profile summary
                  </p>
                  <div className="space-y-3">
                    {/* Education */}
                    <div className="discover-summary-enter flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#e0dedb]/60 hover:border-[#e0dedb] hover:shadow-[0_2px_8px_rgba(55,50,47,0.04)] transition-all duration-300 cursor-pointer" style={{ animationDelay: "0ms" }} onClick={() => goToStep(0)}>
                      <div className="w-9 h-9 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#605A57] font-semibold uppercase tracking-wide">Education</p>
                        <p className="text-sm font-semibold text-[#37322f] mt-0.5">
                          {EDUCATION_OPTIONS.find((o) => o.value === formData.education)?.label ?? "—"}
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-[#d0cdc9] mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>

                    {/* Skills */}
                    <div className="discover-summary-enter flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#e0dedb]/60 hover:border-[#e0dedb] hover:shadow-[0_2px_8px_rgba(55,50,47,0.04)] transition-all duration-300 cursor-pointer" style={{ animationDelay: "60ms" }} onClick={() => goToStep(1)}>
                      <div className="w-9 h-9 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#605A57] font-semibold uppercase tracking-wide">
                          Skills <span className="normal-case tracking-normal font-medium text-[#7a7572]">({formData.skills.length})</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {formData.skills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 bg-[#f7f5f3] border border-[#e0dedb] text-[13px] font-medium text-[#49423D] rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-[#d0cdc9] mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>

                    {/* Interests */}
                    <div className="discover-summary-enter flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#e0dedb]/60 hover:border-[#e0dedb] hover:shadow-[0_2px_8px_rgba(55,50,47,0.04)] transition-all duration-300 cursor-pointer" style={{ animationDelay: "120ms" }} onClick={() => goToStep(2)}>
                      <div className="w-9 h-9 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-[#605A57] font-semibold uppercase tracking-wide">
                          Interests <span className="normal-case tracking-normal font-medium text-[#7a7572]">({formData.interests.length})</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {formData.interests.map((interest) => (
                            <span key={interest} className="px-2.5 py-0.5 bg-[#f7f5f3] border border-[#e0dedb] text-[13px] font-medium text-[#49423D] rounded-full">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-[#d0cdc9] mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>

                    {/* Goal (if provided) */}
                    {formData.goal && (
                      <div className="discover-summary-enter flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#e0dedb]/60 hover:border-[#e0dedb] hover:shadow-[0_2px_8px_rgba(55,50,47,0.04)] transition-all duration-300" style={{ animationDelay: "180ms" }}>
                        <div className="w-9 h-9 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-[#605A57] font-semibold uppercase tracking-wide">Career Goal</p>
                          <p className="text-sm text-[#49423D] mt-1 leading-relaxed">
                            {formData.goal}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation buttons ── */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 0}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                step === 0
                  ? "text-[#d0cdc9] cursor-not-allowed"
                  : "text-[#49423D] hover:text-[#37322f] hover:bg-[#37322f]/[0.04] group"
              }`}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${step > 0 ? "group-hover:-translate-x-1" : ""}`}
                fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={`group inline-flex items-center gap-2 h-12 px-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                  canProceed()
                    ? "bg-[#37322f] text-white hover:bg-[#2A2520] shadow-[0_2px_8px_rgba(55,50,47,0.15),0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:shadow-[0_6px_24px_rgba(55,50,47,0.25)] hover:scale-[1.03] active:scale-[0.97]"
                    : "bg-[#e0dedb] text-[#a09d9a] cursor-not-allowed"
                }`}
              >
                Continue
                <svg
                  className={`h-4 w-4 transition-transform duration-300 ${canProceed() ? "group-hover:translate-x-1" : ""}`}
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group relative inline-flex items-center gap-2.5 h-12 px-8 rounded-full text-sm font-semibold bg-[#37322f] text-white hover:bg-[#2A2520] shadow-[0_2px_8px_rgba(55,50,47,0.15),0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:shadow-[0_6px_24px_rgba(55,50,47,0.25)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>
                    Get My Career Paths
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

          {/* ── Footer note ── */}
          <div className="mt-12 pt-6 border-t border-[#e0dedb]/60 text-center">
            <p className="text-[13px] text-[#7a7572] leading-relaxed font-medium">
              Account needed · Your data is only used to generate recommendations · Takes under 2 minutes
            </p>
          </div>
        </div>
      </main>

      {/* ──── Submitting overlay ──── */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[60] bg-[#f7f5f3]/95 backdrop-blur-md flex items-center justify-center discover-overlay-enter">
          <div className="text-center space-y-8 max-w-md px-6 discover-step-enter">
            {/* Animated concentric rings */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#37322f]/10 discover-ring-1" />
              <div className="absolute inset-2 rounded-full border-2 border-[#37322f]/20 discover-ring-2" />
              <div className="absolute inset-4 rounded-full border-2 border-[#37322f]/30 discover-ring-3" />
              <div className="relative w-14 h-14 rounded-2xl bg-[#37322f] flex items-center justify-center shadow-[0_8px_32px_rgba(55,50,47,0.25)]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
            </div>

            <div>
              <h2 className="text-[#37322f] text-2xl font-display font-normal tracking-tight">
                Crafting your career paths
              </h2>
              <p className="mt-3 text-sm text-[#605A57] font-medium leading-relaxed">
                Our AI is analyzing your profile and finding the best matches.
              </p>
            </div>

            {/* Loading stage indicators */}
            <div className="space-y-2.5 text-left max-w-[260px] mx-auto">
              {LOADING_STAGES.map((stage, i) => (
                <div
                  key={stage.text}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    i <= loadingStage ? "opacity-100" : "opacity-30"
                  }`}
                >
                  {i < loadingStage ? (
                    <svg className="w-4 h-4 text-[#4caf50] flex-shrink-0 discover-tag-enter" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : i === loadingStage ? (
                    <svg className="w-4 h-4 text-[#37322f] animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-20" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="opacity-80" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#e0dedb] flex-shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${
                    i <= loadingStage ? "text-[#37322f]" : "text-[#b0adaa]"
                  }`}>
                    {stage.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──── Decorative background elements ──── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right gradient orb — slightly more visible */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #37322f 0%, transparent 70%)",
          }}
        />
        {/* Bottom-left gradient orb */}
        <div
          className="absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.025]"
          style={{
            background: "radial-gradient(circle, #37322f 0%, transparent 70%)",
          }}
        />
        {/* Subtle grid pattern for depth */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2337322f' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zM40 0h1v40h-1z'/%3E%3Cpath d='M0 0h40v1H0zM0 40h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  );
}
