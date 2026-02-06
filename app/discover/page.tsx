"use client";

import { useState, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Card, { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { LoaderOverlay } from "@/components/ui/Loader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { EDUCATION_LEVELS } from "@/lib/constants";
import { validateDiscoveryInput } from "@/utils/validators";
import { storage } from "@/utils/storage";

const SKILL_SUGGESTIONS = ["Python", "Excel", "SQL", "Communication", "Writing", "Figma"] as const;
const INTEREST_SUGGESTIONS = ["Data", "Design", "Tech", "Writing", "Business", "Research"] as const;

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  label: string;
}

const TagInput = memo(function TagInput({
  value,
  onChange,
  placeholder,
  label,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = useCallback(
    (tag: string) => {
      const t = tag.trim();
      if (t && !value.includes(t)) onChange([...value, t]);
    },
    [value, onChange]
  );

  const removeTag = useCallback(
    (i: number) => onChange(value.filter((_, j) => j !== i)),
    [value, onChange]
  );

  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
        {label}
      </label>
      <div className="flex flex-wrap gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-white p-2 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20">
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-sm text-[var(--primary)]"
          >
            {tag}
            <button
              type="button"
              className="ml-0.5 rounded-full hover:bg-[var(--primary)]/20"
              onClick={() => removeTag(i)}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          className="min-w-[120px] flex-1 border-0 bg-transparent p-1 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-0"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(input);
              setInput("");
            }
          }}
          onBlur={() => {
            if (input.trim()) addTag(input);
            setInput("");
          }}
        />
      </div>
    </div>
  );
});

interface QuickAddButtonsProps {
  suggestions: readonly string[];
  currentValues: string[];
  onAdd: (value: string) => void;
}

const QuickAddButtons = memo(function QuickAddButtons({ 
  suggestions, 
  currentValues, 
  onAdd 
}: QuickAddButtonsProps) {
  return (
    <>
      <p className="mt-1.5 text-xs text-[var(--muted)]">Quick add:</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {suggestions.map((s) => {
          const isAdded = currentValues.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => !isAdded && onAdd(s)}
              disabled={isAdded}
              className="rounded-full border border-[var(--border)] bg-white px-2.5 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Add ${s}`}
            >
              + {s}
            </button>
          );
        })}
      </div>
    </>
  );
});

export default function DiscoverPage() {
  const router = useRouter();
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddSkill = useCallback((skill: string) => {
    setSkills(prev => [...prev, skill]);
  }, []);

  const handleAddInterest = useCallback((interest: string) => {
    setInterests(prev => [...prev, interest]);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validation = validateDiscoveryInput({ education, skills, interests });
    if (!validation.valid) {
      setError(validation.message ?? "Please check your inputs.");
      return;
    }

    setLoading(true);
    try {
      // Get auth token if user is logged in
      const headers: HeadersInit = { "Content-Type": "application/json" };
      
      if (typeof window !== "undefined") {
        const { supabase } = await import("@/lib/supabase");
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers["Authorization"] = `Bearer ${session.access_token}`;
          }
        }
      }

      const res = await fetch("/api/career", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: name || undefined,
          education,
          skills,
          interests,
          goal: goal || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      const data = await res.json();
      
      // Store result in sessionStorage using safe storage utility
      storage.setJSON("skillbridge_result", data);
      
      router.push("/results");
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-bg min-h-screen py-12 md:py-16">
      {loading && <LoaderOverlay message="Analyzing your profile…" />}
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Discover Your Career Path</CardTitle>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Tell us a bit about yourself. We&apos;ll suggest careers and a learning roadmap.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
                  Education level
                </label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                  required
                >
                  <option value="">Select education level</option>
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <TagInput
                  label="Current skills"
                  value={skills}
                  onChange={setSkills}
                  placeholder="e.g. Python, Excel, Communication"
                />
                <QuickAddButtons 
                  suggestions={SKILL_SUGGESTIONS}
                  currentValues={skills}
                  onAdd={handleAddSkill}
                />
              </div>
              <div>
                <TagInput
                  label="Interests"
                  value={interests}
                  onChange={setInterests}
                  placeholder="e.g. Data, Design, Writing"
                />
                <QuickAddButtons 
                  suggestions={INTEREST_SUGGESTIONS}
                  currentValues={interests}
                  onAdd={handleAddInterest}
                />
              </div>
              <Input
                label="Career goal (optional)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Become a data analyst"
              />
              {error && (
                <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{error}</p>
              )}
              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={loading}
              >
                {loading ? "Analyzing…" : "Analyze My Career"}
              </Button>
              <p className="text-center text-sm text-[var(--muted)]">
                This takes less than 10 seconds
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
