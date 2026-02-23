# SkillBridge Landing Page — Design Doc

Status: Draft (MVP)
Last updated: 2026-02-24
Owner: SkillBridge

## Summary
This document defines the MVP marketing landing page for SkillBridge at `/`, inspired by the section flow of the Brillance SaaS landing-page template (hero → features → social proof/integrations → FAQ → footer), adapted to SkillBridge’s product requirements.

Primary CTA: **Start Career Discovery** (links to `/discover`).
Pricing: **not included** in MVP.

## Context
SkillBridge is an AI career guidance platform for students and early-career learners. From a short profile (education, skills, interests, optional goal), the product generates:
- 2–3 realistic career paths
- Skill-gap analysis per career (existing vs missing, priority High/Medium/Low)
- A month-by-month learning roadmap for exactly 6 months

The landing page is marketing-only. It must set clear expectations, build trust, and drive users into the discovery flow.

## Goals
- Communicate SkillBridge’s value in simple language (Grade 8 reading level).
- Build trust (realistic results, privacy-minded, student-friendly).
- Drive conversion to the discovery flow via a single primary CTA.
- Keep the page fast and mobile-first.

## Non-goals (MVP)
- Pricing table, checkout, subscriptions.
- Long-form case studies, blog, or resource hub.
- Multiple landing variants, animations, or complex interactive sections.
- Collecting sensitive personal data on the landing page.

## Users & Personas
Primary personas (from PRD):
- College student (18–22), India (Tier 2/3), overwhelmed by options, wants a clear plan.
- Career switcher/fresher (22–26), low-to-medium technical proficiency, wants a step-by-step transition plan.

Implications for landing:
- Keep language direct and concrete.
- Avoid buzzwords.
- Offer reassurance about realism and time-to-value.

## Inspiration and Section Mapping
Reference template: Brillance SaaS landing page (v0 template).

We keep the same macro structure, but tailor content to SkillBridge:
1. Header/Nav + CTA
2. Hero (headline, subtext, primary CTA)
3. Features (3–4 blocks)
4. Social proof and “integrations” (trust signals, lightweight compatibility)
5. FAQ
6. Final CTA
7. Footer

Pricing is intentionally removed for MVP.

## Information Architecture
- `/` — Marketing landing page (this document)
- `/discover` — Career discovery form (out of scope for this doc, but the CTA points here)

## Page Spec (MVP)

### 1) Header / Navigation
Purpose: orient users, provide short path to key sections, and keep the CTA visible.

Content:
- Left: “SkillBridge” wordmark (text-only for now).
- Nav links (scroll-to anchors): Features, How it works, FAQ.
- Right: Primary button “Start Career Discovery”.

Behavior:
- On mobile: collapse to a minimal header (either a simple stacked layout or a small menu). MVP preference: keep it simple (no complex menus if avoidable).

### 2) Hero + CTA
Purpose: explain value in one glance.

Copy requirements:
- Headline: outcome-focused, plain language.
- Subtext: mention 2–3 career paths, skill gaps, and 6-month roadmap.
- Trust line: “Built for students and early careers. Simple language. Fast results.”

Hero elements:
- Headline (example): “Find a career path that fits you — and a 6‑month plan to get started.”
- Subtext (example): “Answer a few questions. Get 2–3 realistic career options, your skill gaps, and a month-by-month roadmap.”
- Primary CTA button: “Start Career Discovery” → `/discover`.
- Secondary link (optional, text-only): “See an example report” → scroll to FAQ or a small example block (keep MVP minimal; if added, it must not become a new page).

### 3) How It Works (compact)
Purpose: make the process feel easy and predictable.

Layout:
- 3 steps in a row (desktop) / stacked (mobile).

Step copy (example):
1. “Tell us your education, skills, and interests.”
2. “Get 2–3 career paths that match you.”
3. “Follow a 6‑month roadmap with clear monthly goals.”

### 4) Features
Purpose: present the product’s core outputs as benefits.

Feature set (MVP):
- Smart Career Discovery: “2–3 realistic paths with a short reason for each.”
- Skill Gap Analysis: “What you have vs what to learn, with priorities.”
- 6‑Month Learning Roadmap: “Month-by-month topics, tools, and platforms.”
- Career Dashboard: “Save and revisit your plan.” (If not implemented yet, label as “Coming soon” to avoid over-promising.)

Guidance:
- Prefer short titles + 1–2 sentence descriptions.
- Avoid large screenshots until the app UI exists.

### 5) Social Proof & Integrations (Trust Signals)
Purpose: build credibility without inventing fake testimonials.

MVP approach:
- Replace testimonials with trust statements that are true and aligned with PRD:
  - “Simple language (Grade 8).”
  - “Fast first recommendations (target ≤10 seconds).”
  - “No sensitive personal data stored without consent.”

Optional “integrations” row (only if accurate):
- “Powered by OpenRouter + GPT-5.2” (if that is the actual runtime choice).
- “Built on Supabase + Vercel” (if applicable).

Do not add customer logos unless you have permission.

### 6) FAQ
Purpose: reduce uncertainty and handle common objections.

MVP FAQ list (suggested):
- “What do I need to provide?”
- “How long does it take?”
- “Do I need to sign up?”
- “How accurate are the recommendations?”
- “What does the roadmap include?”
- “What data do you store?”

Answer guidelines:
- Keep answers short (2–4 sentences).
- Avoid absolute guarantees.
- Encourage better inputs (“The more detail you provide, the better the results.”).

### 7) Final CTA
Purpose: re-capture users who scrolled.

Content:
- One sentence summary + the same primary CTA.
- Example: “Ready to get clarity? Start your career discovery in minutes.”

### 8) Footer
Purpose: close with basic links and lightweight trust.

MVP footer items:
- Product: Features, FAQ
- Company: About (optional), Contact (optional)
- Legal: Privacy, Terms (can be placeholders until available)

## Visual & Content Guidelines

### Tone and readability
- Grade 8 reading level.
- Short sentences; avoid jargon.
- Use concrete outcomes (“career options”, “skill gaps”, “month-by-month plan”).

### Claims and disclaimers
- Avoid promising guaranteed jobs, salaries, or outcomes.
- Allowed: “target ≤10 seconds” (as a target), “realistic career paths”, “exactly 6 months” for the roadmap.

### Consistency
- Use one primary CTA label everywhere: “Start Career Discovery”.
- Avoid multiple competing CTAs.

## Layout and Components (Implementation Notes)

### Technology
- Next.js App Router, TypeScript, Tailwind.
- Use existing theme primitives (CSS variables for background/foreground) rather than hard-coded colors.

### Suggested component breakdown (optional)
These can be implemented inline first, then extracted later:
- `Header`
- `Hero`
- `HowItWorks`
- `FeatureGrid`
- `TrustRow`
- `FAQ`
- `Footer`

### Responsive behavior
- Mobile-first: stack sections vertically with comfortable spacing.
- Ensure tap targets meet accessibility guidelines.
- Keep line length readable (avoid very wide paragraphs).

## Accessibility Checklist
- Semantic headings: one H1, then H2s per section.
- Buttons and links have clear labels.
- Color contrast meets WCAG AA.
- Focus styles visible for keyboard users.
- FAQ interactions (if accordion) are keyboard accessible.

## Performance Checklist
- Minimal images until product UI exists.
- Use `next/image` for any images.
- Avoid heavy client-side JS; prefer server components where possible.
- Keep fonts consistent (use the configured Geist variables rather than overriding body fonts).

## SEO and Metadata
MVP metadata updates:
- Title: “SkillBridge — AI Career Guidance for Students”
- Description: short value proposition (no over-claims)
- Open Graph basics (optional)

## Analytics (Optional)
If adding lightweight analytics, track:
- Landing CTA clicks
- Section scroll depth (optional)
- FAQ opens (optional)

## Open Questions
- Do we want a small example report preview on the landing page (static excerpt), or keep it strictly section-based?
- Should “Career Dashboard” be listed as “Coming soon” until implemented?
- Do you want Privacy/Terms pages created now, or link placeholders?
- Should “Career Dashboard” be listed as “Coming soon” until implemented?
- Do you want Privacy/Terms pages created now, or link placeholders?
