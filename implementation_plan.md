# AI Portfolio Project Generator — Implementation Plan

This feature generates 3 personalized, portfolio-ready project ideas from the user's skill gap analysis via NVIDIA NIM, persists them to Supabase, and displays them on a dedicated `/dashboard/projects` page with the platform's Warm / Editorial Minimalist aesthetic.

## User Review Required

> [!IMPORTANT]
> **Supabase Schema Change:** A new `portfolio_projects` table will be created with a foreign key to `recommendation_runs`. This is a DDL change to your production database. The migration SQL is shown below in the schema section.

> [!IMPORTANT]
> **No Scope Selector in v1:** The spec mentions "Adjustable Scope" (Weekend Hack, Sprint, Capstone) and "Export to README." These are listed as "Why Users Will Love It" features but are NOT part of the core data flow or explicit UI specs. I will **include the scope selector** as it's mentioned explicitly in the user-facing UI ("Users can select the scope"), and **include the Export to README** button as it's referenced in the micro-interaction specs. Let me know if you'd rather defer these.

---

## Proposed Changes

### 1. Database (Supabase)

#### [NEW] [schema_migration.sql](file:///e:/Project/skillbridge/supabase/schema.sql)

Create a `portfolio_projects` table linked to `recommendation_runs`:

```sql
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id        UUID NOT NULL REFERENCES recommendation_runs(id) ON DELETE CASCADE,
  user_id       UUID,
  projects      JSONB NOT NULL,   -- Array of 3 project objects
  scope         TEXT DEFAULT 'sprint',  -- 'weekend' | 'sprint' | 'capstone'
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_run ON portfolio_projects(run_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_user ON portfolio_projects(user_id);
```

This stores the AI-generated projects JSON per roadmap run, enabling the "fetch over generate" pattern from the spec.

---

### 2. AI Service Layer

#### [NEW] [portfolio-prompts.ts](file:///e:/Project/skillbridge/services/ai/portfolio-prompts.ts)

New prompt templates for the portfolio project generation:
- System prompt scoped to outputting a JSON array of 3 project objects
- Each object: `{ title, description, estimatedTime, coreSkill, featureChecklist: string[] }`
- User prompt dynamically built from the roadmap's `skillGapAnalysis` (missing skills) and `careerOverview`
- Repair prompt for validation retries

#### [MODIFY] [nvidia.ts](file:///e:/Project/skillbridge/services/ai/nvidia.ts)

Add a new exported function `generatePortfolioProjects(input)` that:
- Reuses the existing `callNvidaNim()` infrastructure
- Uses the new portfolio prompts
- Validates output against a new Zod schema
- Returns the typed portfolio projects array

---

### 3. Validators

#### [MODIFY] [validators.ts](file:///e:/Project/skillbridge/utils/validators.ts)

Add new Zod schemas:
- `PortfolioProjectSchema` — validates individual project shape
- `PortfolioProjectsArraySchema` — array of exactly 3 projects
- `PortfolioProjectsInputSchema` — input for the API (runId, scope)

---

### 4. API Routes

#### [NEW] [route.ts](file:///e:/Project/skillbridge/app/api/portfolio-projects/route.ts)

**`GET ?runId=xxx`** — Fetch saved projects for a given roadmap run
- Checks `portfolio_projects` table by `run_id`
- Returns the saved JSON array if exists, or `null`

**`POST`** — Generate new projects via AI
- Accepts `{ runId, scope }` (scope: "weekend" | "sprint" | "capstone")
- Fetches the roadmap report from `recommendation_runs` by `run_id`
- Calls `generatePortfolioProjects()` with skill gap data
- Upserts into `portfolio_projects` (replaces existing for same run_id)
- Returns the generated projects

---

### 5. Dashboard Sidebar Navigation

#### [MODIFY] [layout.tsx](file:///e:/Project/skillbridge/app/dashboard/layout.tsx)

Add "Portfolio Projects" nav item **between** "Roadmap" and "Previous Roadmaps" in the sidebar:
- Icon: a grid/layout icon to represent projects
- Links to `/dashboard/projects`
- Active state detection based on current pathname (will need `usePathname()`)
- Also fix the existing "Roadmap" nav item so its `active` state is dynamic (currently hardcoded `true`)

---

### 6. Dashboard Roadmap Page (CTA Buttons)

#### [MODIFY] [page.tsx](file:///e:/Project/skillbridge/app/dashboard/page.tsx)

Add two "Generate Portfolio Projects" buttons as specified:
1. **Top of page:** Next to the "New Discovery" button in the header (line ~619-631)
2. **Bottom of page:** Below the "Start New Discovery" CTA section (line ~1426-1435)

Both buttons navigate to `/dashboard/projects?runId={currentRunId}&generate=1` to trigger auto-generation.

---

### 7. Portfolio Projects Page (NEW — the main feature)

#### [NEW] [page.tsx](file:///e:/Project/skillbridge/app/dashboard/projects/page.tsx)

A dedicated page at `/dashboard/projects` with:

**States:**
- **Empty state** — No projects generated yet, CTA to generate
- **Loading/generating state** — Skeleton with staggered reveal animation
- **Projects view** — 3 editorial-style project cards

**Scope selector:** Pill toggle for "Weekend Hack" / "Sprint" / "Capstone"

**Per-project card layout (asymmetrical/editorial):**
- Title in `var(--font-instrument-serif)` (display serif)
- Description body in `var(--font-inter)`
- Metadata in small caps: "ESTIMATED TIME: 2 WEEKS", "CORE SKILL: POSTGRESQL"
- Feature checklist with interactive checkboxes (state persisted to localStorage per project)
- Asymmetric overlap: title container slightly overlaps the checklist card
- Staggered `fade-in-up` animation with `animation-delay` per card

**Checklist interactions (CSS-driven):**
- Animated strike-through on check
- Scale pop on checkbox (`fade-in-scale`)

**Buttons:**
- "Generate New Projects" — re-trigger AI with current scope
- "Export as README" — generates markdown blob + downloads `.md` file

**Design tokens from spec:**
- Background: `var(--color-bg-warm)` (#f7f5f3)
- Card surfaces: `var(--color-bg-elevated)` with 1px borders
- Text: `var(--color-text-secondary)` for body
- Focus rings: `outline: 2px solid #37322f`
- No purple gradients, no sparkle emojis

---

### 8. CSS Additions

#### [MODIFY] [globals.css](file:///e:/Project/skillbridge/app/globals.css)

Add new animation classes:
- `@keyframes checklist-strike` — width animation for the strike-through line
- `.portfolio-check-strike` — animated strike-through class
- Additional animation delay utilities if needed

---

## Open Questions

> [!IMPORTANT]
> **Supabase project ID:** I'll apply the database migration using the Supabase MCP tool. Do you have the Supabase project connected? I can list your projects to find the right one, or you can add the migration manually via the Supabase SQL editor.

---

## Verification Plan

### Automated Tests
- `npm run build` — ensures no TypeScript or build errors
- Run the dev server and manually verify:
  - Sidebar nav item appears in correct position
  - CTA buttons on roadmap page navigate correctly
  - Projects page renders with proper editorial design
  - Generate flow hits the AI and persists to Supabase
  - Re-visiting the page fetches from DB (no re-generation)
  - Regenerate button works
  - Checklist interactions animate correctly
  - Export README downloads a valid `.md` file

### Manual Verification
- Browser test: navigate through the full flow
- Verify responsive design (mobile sidebar, card layout)
- Visual check: typography, spacing, animation timing all match the editorial spec
