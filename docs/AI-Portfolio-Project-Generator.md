# AI Portfolio Project Generator (High Impact, Easy to Build)

## What it is
Instead of just telling users *what* to learn, tell them *what to build*. Based on the user's "Skill Gap Analysis," the AI (via NVIDIA NIM) can generate 3 custom, portfolio-ready project ideas.

## Why it's best
Students struggle the most with knowing what projects will actually impress employers.

## How it works
The AI outputs a project title, a brief description, and a checklist of features that force the user to practice the exact skills they are missing.

### Data Flow & State Management
To ensure a fast, consistent user experience while minimizing API costs, the feature follows a strict fetch-or-generate lifecycle:
1. **Contextual Trigger:** The user clicks "Generate Portfolio Projects" specifically while viewing an active roadmap.
2. **AI Generation:** The system grabs the context of the currently open roadmap (the specific missing skills and goals) and sends the prompt to the AI (NVIDIA NIM, explicitly scoped to output JSON arrays for seamless frontend mapping).
3. **Persistence (Supabase):** Once the AI generates the 3 projects, the result is immediately saved to the Supabase database (e.g., within a `portfolio_projects` table, using a foreign key constraint linking to `{roadmap_id}` and `{user_id}`). These projects are now permanently tied to that user and that specific roadmap session.
4. **Fetching Over Generating:** From then on, whenever the user navigates back to the "Projects" section of their dashboard or roadmap, the app simply fetches the saved JSON array from Supabase. It does *not* hit the AI API again, ensuring instant load times and significantly cutting API overhead.
5. **On-Demand Regeneration:** The visible projects remain static until the user explicitly clicks a "Generate New Projects" button. This overrides the previous save in Supabase and triggers a fresh AI generation cycle.

## Deep Dive: Feature Explanation
This feature acts as the critical bridge between theoretical learning and practical application. Once the platform identifies a user's specific weak points (e.g., "weak in React context and PostgreSQL"), the generator synthesizes realistic, industry-relevant projects. It translates abstract learning goals into a concrete, buildable product roadmap.

## Why We (Developers/AI) Like It
* **Technically Elegant:** It's very straightforward to implement robustly using structured LLM outputs (NVIDIA NIM can strictly output a JSON schema with `title`, `description`, and `featureChecklist`).
* **High ROI:** A single AI prompt generation turns into days or weeks of actionable, high-value work for the user.
* **Future Expansion:** It lays the groundwork perfectly for future features, like progress tracking, automated code reviews on their generated projects, and sharing their portfolio straight from the platform.

## Why Users Will Love It
* **Cures "Blank Canvas Paralysis":** Completely removes the anxiety and wasted time spent figuring out what to build.
* **Employability Focus:** Projects are framed around real-world business value, helping users build a portfolio that actually impresses hiring managers, rather than just another generic "To-Do App."
* **Gamified Milestones:** The checklist format breaks down daunting, complex projects into bite-sized, achievable tasks, complete with visual progress bars to trigger dopamine hits.
* **Hyper-Personalized:** It perfectly calibrates to *their* exact skill gaps, making efficient use of their practice time.
* **Adjustable Scope:** Users can select the scope of their project (e.g., "Weekend Hack," "Sprint," or "Capstone") to match their available time and dedication.
* **Portfolio-Ready Assets:** The generated project description and feature checklist can be exported directly into a professional `README.md` format, giving them a head start on their GitHub repository and teaching them good documentation habits.

## Navigation & Placement
To ensure the generator is highly discoverable without cluttering the main workspace, it will be integrated seamlessly into the user's dashboard sidebar and within the active roadmap page.
* **Sidebar Hierarchy:** The new "Portfolio Projects" link will be positioned specifically between the **"Roadmap"** and **"Previous Roadmaps"** navigation items.
* **Dedicated Projects Page:** Clicking this navigation link will navigate the user to a brand new, dedicated page within the dashboard (e.g., `/dashboard/projects`). This ensures the generated portfolio projects have a spacious, focused environment rather than being cramped in a modal or inline section.
* **Roadmap Integration (Call to Action):** On the active Roadmap page, there will be two direct buttons to trigger the generation of projects based on that specific roadmap:
  1. A button at the top of the page, positioned immediately beside the "New Discovery" button.
  2. A button at the bottom of the page, positioned directly below the "Start New Discovery" button. 
  Clicking either of these contextual buttons will immediately redirect the user to the dedicated Projects page and automatically kick off the AI generation process.
* **Logical Flow:** This placement logically bridges the gap between their current learning path and their historical progress, framing the projects as the practical culmination of their active learning.

## Frontend Design & UI Specifications
To ensure this feature aligns perfectly with the platform's distinctive **Warm / Editorial Minimalist** aesthetic (avoiding generic "AI slop" slants), the UI must strictly adhere to the following design implementation:

### 1. Typography & Hierarchy
*   **Header (The Hook):** Use the site's signature display font (`var(--font-instrument-serif)`) for the project titles to provide an elegant, editorial feel. 
*   **Body (The Details):** Employ the clean, highly readable structural body font (`var(--font-inter)`) for the project description and checklists (`text-color-text-secondary`, `#605A57`). 
*   **Contrast:** Pair the oversized, elegant serif headers with small, tightly tracked sans-serif caps for metadata (like "ESTIMATED TIME: 2 WEEKS" or "CORE SKILL: POSTGRESQL").

### 2. Spatial Composition & Cards
*   Avoid standard boring flex-box grids. Use **asymmetrical overlap** where the project's title container slightly overlaps the feature checklist card.
*   **Backgrounds & Texture:** The main canvas should utilize the established warm background (`var(--color-bg-warm)`, `#f7f5f3`). Instead of flat white cards, use subtle, elevated surfaces (`var(--color-bg-elevated)`) punctuated by sharp, minimal 1px borders (`var(--color-border-hover)`, `rgba(55, 50, 47, 0.20)`). 
*   **Negative Space:** Be generous with padding. Let the text breathe to maintain the luxury, premium feel of the platform.

### 3. Motion & Micro-interactions
*   **Staggered Reveals:** When the AI generates the 3 projects, they should not snap into view simultaneously. Use a staggered `animation-delay` paired with a graceful `fade-in-up` animation (`transform: translateY(24px) scale(0.98)` to `0`).
*   **Checklist Interaction:** Checking off a milestone should trigger a CSS-only visual delight—a strike-through that smoothly animates across the text, accompanied by a brief scale pop (`fade-in-scale`) on the checkbox itself.
*   **Button & Input States:** Ensure all "Generate" and "Export" buttons respect the site's focus ring accessibility (`outline: 2px solid #37322f`) and text selection states (`background-color: rgba(55, 50, 47, 0.12)`). Use subtle active `transform` scaling or the existing `subtle-float` animation to make the main calls-to-action feel tactile and inviting.

### 4. Avoiding the "Generic AI" Look
*   **No Purple Gradients or Sparkle Emojis:** We will not use the overdone "AI gradient" aesthetics. The intelligence of the feature speaks for itself.
*   **Editorial Focus:** Treat the AI output like an editorial spread from a high-end magazine rather than a dashboard list. The emphasis is on beautiful typography and striking layout over flashy, distractive UI elements.
