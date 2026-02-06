# SkillBridge – AI Career Guidance Platform

Personalized career guidance for students and early-career learners. Get 2–3 career path recommendations, skill gap analysis, and a 6-month learning roadmap powered by AI.

## Features

- **Smart Career Discovery** – Enter education, skills, and interests to get AI-powered career suggestions
- **Skill Gap Analysis** – See existing vs. missing skills with priority (High / Medium / Low)
- **6-Month Learning Roadmap** – Month-wise topics, tools, and resources
- **Job Roles & Opportunities** – Entry-level roles, internships, project ideas
- **Career Growth Path** – 3–5 year progression and salary outlook
- **Personalized Advice** – Mentor-style tips tailored to your profile

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes (serverless)
- **AI:** OpenRouter (e.g. GPT-4o)
- **Database/Auth:** Supabase (required for saving career data; environment variables must be configured)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   - Copy `.env.example` to `.env.local`
   - Set `OPENROUTER_API_KEY` (required - get one at [openrouter.ai](https://openrouter.ai))
   - Set Supabase credentials (required for database persistence):
     - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
     - `SUPABASE_SERVICE_ROLE_KEY` (optional) - Service role key for admin operations

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **Discover careers**
   - Go to **Discover Careers** (or **Get Career Guidance**)
   - Fill education, skills, interests (and optional goal)
   - Click **Analyze My Career** to get your report and roadmap

## Project Structure

- `app/` – Pages and API routes (landing, discover, results, dashboard)
- `components/` – UI, layout, career, roadmap, dashboard components
- `services/ai/` – OpenRouter client, prompts, response formatter
- `lib/` – Supabase, auth, constants
- `types/` – TypeScript types for user, career, roadmap, AI response

## Design

Pixelia-inspired UI: clean, minimal, student-friendly. Soft blue/indigo accent, rounded cards, soft shadows. See `Design Doc.txt` for full specs.

## License

Private.
