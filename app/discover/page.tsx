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
  { value: "high-school", label: "High School", description: "Currently in or completed high school" },
  { value: "undergraduate", label: "Undergraduate", description: "Pursuing a Bachelor's degree (B.Tech, B.Sc, B.Com, etc.)" },
  { value: "graduate", label: "Graduate", description: "Completed a Bachelor's degree" },
  { value: "postgraduate", label: "Postgraduate", description: "Pursuing or completed Master's / MBA / M.Tech" },
  { value: "self-taught", label: "Self-Taught / Bootcamp", description: "Learning through online courses and self-study" },
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

/* ═══════════════════════════════════════════════════════
   STEP HEADINGS — conversational tone
   ═══════════════════════════════════════════════════════ */

const stepMeta = [
  {
    heading: "What's your education level?",
    subtext: "This helps us match careers to where you are right now.",
  },
  {
    heading: "What skills do you already have?",
    subtext: "List anything you're comfortable with — technical or soft skills.",
  },
  {
    heading: "What interests you most?",
    subtext: "Pick topics or fields that excite you. There are no wrong choices.",
  },
  {
    heading: "Do you have a career goal in mind?",
    subtext: "Totally optional. If you're unsure, we'll figure it out together.",
  },
];

/* ═══════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function DiscoverPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
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
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);

  const skillInputRef = useRef<HTMLInputElement>(null);
  const interestInputRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* ── Navigation ──────────────────────────────────────── */

  const canProceed = useCallback(() => {
    switch (step) {
      case 0:
        return formData.education !== "";
      case 1:
        return formData.skills.length > 0;
      case 2:
        return formData.interests.length > 0;
      case 3:
        return true; // goal is optional
      default:
        return false;
    }
  }, [step, formData]);

  const goNext = () => {
    if (!canProceed()) return;
    setDirection("forward");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call — replace with actual /api/career call
    await new Promise((r) => setTimeout(r, 2200));
    // Navigate to results page (once implemented)
    window.location.href = "/results";
  };

  /* ── Tag helpers ─────────────────────────────────────── */

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((fd) => ({ ...fd, skills: [...fd.skills, trimmed] }));
    }
    setSkillInput("");
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

  /* ── Stagger animation helper ────────────────────────── */

  const stagger = (index: number, baseDelay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + index * 0.06}s, transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${baseDelay + index * 0.06}s`,
  });

  /* ── Progress percentage ─────────────────────────────── */

  const progressPercent = ((step + 1) / TOTAL_STEPS) * 100;

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen bg-[#f7f5f3] flex flex-col">
      {/* ──── Thin top progress bar ──── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-[#e0dedb]">
        <div
          className="h-full bg-[#37322f] transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ──── Header ──── */}
      <header className="relative z-40 w-full" style={stagger(0, 0)}>
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

          <div className="flex items-center gap-4">
            <span className="text-sm text-[#605A57] font-medium hidden sm:inline">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
            <Link
              href="/"
              className="text-sm text-[#49423D]/70 hover:text-[#37322f] transition-colors font-medium"
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
          {/* ── Heading area ── */}
          <div
            key={`heading-${step}`}
            className="mb-10 discover-step-enter"
            style={{ animationDirection: direction === "back" ? "reverse" : "normal" }}
          >
            <p className="text-[#605A57] text-sm font-medium uppercase tracking-widest mb-3">
              Step {step + 1}
            </p>
            <h1 className="text-[#37322f] text-3xl sm:text-4xl lg:text-[42px] font-normal leading-tight font-display">
              {stepMeta[step].heading}
            </h1>
            <p className="mt-3 text-[#49423D]/75 text-base sm:text-lg font-medium leading-7">
              {stepMeta[step].subtext}
            </p>
          </div>

          {/* ── Step content ── */}
          <div
            key={`content-${step}`}
            className="discover-step-enter animation-delay-100"
          >
            {/* ════════════ STEP 0 — Education ════════════ */}
            {step === 0 && (
              <div className="space-y-3">
                {EDUCATION_OPTIONS.map((opt, i) => {
                  const selected = formData.education === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFormData((fd) => ({ ...fd, education: opt.value }))}
                      className={`discover-option-enter w-full text-left px-5 py-4 border transition-all duration-300 group ${
                        selected
                          ? "border-[#37322f] bg-white shadow-[0_2px_12px_rgba(55,50,47,0.08)]"
                          : "border-[#e0dedb] bg-white/60 hover:bg-white hover:border-[#37322f]/20 hover:shadow-[0_1px_6px_rgba(55,50,47,0.05)]"
                      }`}
                      style={{ animationDelay: `${i * 60 + 120}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Radio indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          selected ? "border-[#37322f]" : "border-[#e0dedb] group-hover:border-[#37322f]/40"
                        }`}>
                          <div className={`w-2.5 h-2.5 rounded-full bg-[#37322f] transition-all duration-300 ${
                            selected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                          }`} />
                        </div>
                        <div>
                          <span className={`text-sm font-semibold transition-colors ${
                            selected ? "text-[#37322f]" : "text-[#49423D]"
                          }`}>
                            {opt.label}
                          </span>
                          <p className="text-[13px] text-[#605A57] leading-snug mt-0.5">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* ════════════ STEP 1 — Skills ════════════ */}
            {step === 1 && (
              <div>
                {/* Tag input container */}
                <div
                  className={`min-h-[56px] px-4 py-3 border bg-white transition-all duration-300 flex flex-wrap gap-2 items-center cursor-text ${
                    showSkillSuggestions
                      ? "border-[#37322f] shadow-[0_0_0_3px_rgba(55,50,47,0.06)]"
                      : "border-[#e0dedb] hover:border-[#37322f]/30"
                  }`}
                  onClick={() => skillInputRef.current?.focus()}
                >
                  {formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="discover-tag-enter inline-flex items-center gap-1.5 px-3 py-1 bg-[#37322f] text-white text-sm font-medium rounded-full"
                    >
                      {skill}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeSkill(skill); }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
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
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-[#37322f] placeholder:text-[#605A57]/60 outline-none"
                  />
                </div>

                {/* Skill suggestions */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-[#605A57] uppercase tracking-wider mb-2.5">
                    Quick add
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSkillSuggestions.slice(0, 14).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        className="px-3 py-1.5 text-sm font-medium text-[#49423D] bg-white border border-[#e0dedb] rounded-full hover:border-[#37322f]/30 hover:bg-[#37322f]/[0.03] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.skills.length > 0 && (
                  <p className="mt-4 text-sm text-[#605A57]">
                    <span className="font-semibold text-[#37322f]">{formData.skills.length}</span> skill{formData.skills.length !== 1 ? "s" : ""} added
                  </p>
                )}
              </div>
            )}

            {/* ════════════ STEP 2 — Interests ════════════ */}
            {step === 2 && (
              <div>
                {/* Tag input container */}
                <div
                  className={`min-h-[56px] px-4 py-3 border bg-white transition-all duration-300 flex flex-wrap gap-2 items-center cursor-text ${
                    showInterestSuggestions
                      ? "border-[#37322f] shadow-[0_0_0_3px_rgba(55,50,47,0.06)]"
                      : "border-[#e0dedb] hover:border-[#37322f]/30"
                  }`}
                  onClick={() => interestInputRef.current?.focus()}
                >
                  {formData.interests.map((interest) => (
                    <span
                      key={interest}
                      className="discover-tag-enter inline-flex items-center gap-1.5 px-3 py-1 bg-[#37322f] text-white text-sm font-medium rounded-full"
                    >
                      {interest}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeInterest(interest); }}
                        className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
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
                    className="flex-1 min-w-[120px] bg-transparent text-sm text-[#37322f] placeholder:text-[#605A57]/60 outline-none"
                  />
                </div>

                {/* Interest suggestions */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-[#605A57] uppercase tracking-wider mb-2.5">
                    Popular topics
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {filteredInterestSuggestions.slice(0, 14).map((interest) => (
                      <button
                        key={interest}
                        onClick={() => addInterest(interest)}
                        className="px-3 py-1.5 text-sm font-medium text-[#49423D] bg-white border border-[#e0dedb] rounded-full hover:border-[#37322f]/30 hover:bg-[#37322f]/[0.03] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                      >
                        + {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.interests.length > 0 && (
                  <p className="mt-4 text-sm text-[#605A57]">
                    <span className="font-semibold text-[#37322f]">{formData.interests.length}</span> interest{formData.interests.length !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}

            {/* ════════════ STEP 3 — Career Goal ════════════ */}
            {step === 3 && (
              <div>
                <textarea
                  value={formData.goal}
                  onChange={(e) => setFormData((fd) => ({ ...fd, goal: e.target.value }))}
                  rows={5}
                  placeholder="e.g. I want to become a data analyst at a tech company, or I want to freelance as a web developer…"
                  className="w-full px-5 py-4 bg-white border border-[#e0dedb] text-[#37322f] text-base leading-7 placeholder:text-[#605A57]/50 outline-none transition-all duration-300 focus:border-[#37322f] focus:shadow-[0_0_0_3px_rgba(55,50,47,0.06)] resize-none"
                />
                <p className="mt-3 text-sm text-[#605A57]">
                  This is completely optional. Leave it blank if you're still exploring.
                </p>

                {/* Review summary */}
                <div className="mt-8 pt-8 border-t border-[#e0dedb]">
                  <p className="text-xs font-medium text-[#605A57] uppercase tracking-wider mb-4">
                    Your profile summary
                  </p>
                  <div className="space-y-4">
                    {/* Education */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#605A57] font-medium">Education</p>
                        <p className="text-sm font-semibold text-[#37322f]">
                          {EDUCATION_OPTIONS.find((o) => o.value === formData.education)?.label ?? "—"}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#605A57] font-medium">Skills</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {formData.skills.map((s) => (
                            <span key={s} className="px-2.5 py-0.5 bg-[#f7f5f3] border border-[#e0dedb] text-[13px] font-medium text-[#49423D] rounded-full">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interests */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M2 12h20" />
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#605A57] font-medium">Interests</p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {formData.interests.map((i) => (
                            <span key={i} className="px-2.5 py-0.5 bg-[#f7f5f3] border border-[#e0dedb] text-[13px] font-medium text-[#49423D] rounded-full">
                              {i}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Goal (if provided) */}
                    {formData.goal && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#f7f5f3] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37322f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-[#605A57] font-medium">Career Goal</p>
                          <p className="text-sm text-[#49423D] mt-0.5 leading-relaxed">
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
              className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
                step === 0
                  ? "text-[#605A57]/30 cursor-not-allowed"
                  : "text-[#49423D] hover:text-[#37322f] group"
              }`}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${step > 0 ? "group-hover:-translate-x-0.5" : ""}`}
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
                className={`group inline-flex items-center gap-2 h-11 px-8 rounded-full text-sm font-medium transition-all duration-300 ${
                  canProceed()
                    ? "bg-[#37322f] text-white hover:bg-[#2A2520] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:shadow-[0_4px_16px_rgba(55,50,47,0.25)] hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-[#e0dedb] text-[#605A57]/50 cursor-not-allowed"
                }`}
              >
                Continue
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="group relative inline-flex items-center gap-2 h-11 px-8 rounded-full text-sm font-medium bg-[#37322f] text-white hover:bg-[#2A2520] shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] hover:shadow-[0_4px_16px_rgba(55,50,47,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                    </svg>
                    Analyzing your profile…
                  </>
                ) : (
                  <>
                    Get My Career Paths
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
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
            <p className="text-xs text-[#605A57]/70 leading-relaxed">
              No account needed · Your data is only used to generate recommendations · Takes under 2 minutes
            </p>
          </div>
        </div>
      </main>

      {/* ──── Submitting overlay ──── */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[60] bg-[#f7f5f3]/90 backdrop-blur-sm flex items-center justify-center discover-overlay-enter">
          <div className="text-center space-y-6 max-w-sm px-6 discover-step-enter">
            {/* Animated logo */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-[#37322f] flex items-center justify-center animate-pulse-glow">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>

            <div>
              <h2 className="text-[#37322f] text-xl font-display font-normal">
                Crafting your career paths…
              </h2>
              <p className="mt-2 text-sm text-[#605A57] font-medium">
                Our AI is analyzing your profile and finding the best matches.
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#37322f] animate-subtle-float"
                  style={{ animationDelay: `${i * 200}ms`, animationDuration: "1.2s" }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──── Decorative background elements ──── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-right gradient orb */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{
            background: "radial-gradient(circle, #37322f 0%, transparent 70%)",
          }}
        />
        {/* Bottom-left gradient orb */}
        <div
          className="absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{
            background: "radial-gradient(circle, #37322f 0%, transparent 70%)",
          }}
        />
        {/* Subtle grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  );
}
