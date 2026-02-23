## Plan: Pre-Coding Setup for SkillBridge

You’re starting from zero code with a clear stack in [Tech Stack.txt] and requirements in [Product Requirements Document (PRD).txt]. This plan walks through everything to do **before** real feature coding: installing tools, creating accounts, bootstrapping the Next.js app, wiring Supabase/OpenRouter keys, and making sure `npm run dev` runs cleanly. I’ll assume modern Next.js (App Router), TypeScript, Tailwind, and default `npm` on Windows; you can easily swap tools later.

**Steps**

1. **Set up your local dev environment (Windows)**
   - Install Node.js LTS (from nodejs.org, e.g., 20.x); verify with `node -v` and `npm -v`.
   - Install Git (git-scm.com) so you can version-control the project.
   - Install VS Code if not already, plus helpful extensions:
     - “ES7+ React/Redux/React-Native snippets”
     - “Tailwind CSS IntelliSense”
     - “GitHub Copilot” or similar AI coding assistant
     - “ESLint” and “Prettier” (for lint/format support later).
   - Create your project folder on disk if not already: `e:\Project\skillbridge` (this is already your workspace root).

2. **Create required online accounts & projects**
   - Vercel:
     - Create/sign in at vercel.com (optionally connect GitHub if you’ll push the repo).
     - You won’t deploy yet, but you’ll later add environment variables there.
   - Supabase:
     - Create a Supabase account at supabase.com and create a new project (e.g., `skillbridge-dev`).
     - After project creation, note:
       - `SUPABASE_URL`
       - `SUPABASE_ANON_KEY`
       - `SUPABASE_SERVICE_ROLE_KEY` (use only on server, never in browser).
   - OpenRouter:
     - Create an account at openrouter.ai.
     - Generate an API key that can access a GPT‑5.2–class model.
     - Note the key for your `.env` as `OPENROUTER_API_KEY`.

3. **Configure basic Supabase project (minimum for dev)**
   - In the Supabase dashboard for your project:
     - Enable Email/password auth (Google OAuth can be added later if you want it from day one).
     - Under “Settings → API”, confirm and copy `SUPABASE_URL` and anon key.
     - Under “Authentication → URL configuration”, set redirect URLs that you’ll eventually use with Next.js (e.g., `http://localhost:3000` for local).
   - You will later implement the DB schema described in [Project Folder Str.txt], but that can wait until after the initial app runs locally.

4. **Plan environment variable usage**
   - Decide on the env keys you’ll use (matching your docs and Next.js conventions):
     - `OPENROUTER_API_KEY`
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - For client-side access (e.g., Supabase anon key if needed in the browser), plan to add `NEXT_PUBLIC_`-prefixed vars, such as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Decide that secrets (`OPENROUTER_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) will only ever be read in server-side code (API routes, server components, or server utilities).

5. **Bootstrap the Next.js + TypeScript project**
   - From `e:\Project\skillbridge`, open a terminal and run a Next.js app generator (conceptually; when you implement, use `npx create-next-app@latest` and choose):
     - TypeScript: yes
     - App Router: yes
     - Tailwind: yes (this saves Tailwind manual setup)
     - ESLint: yes
   - Ensure the generated project root matches your workspace root (or plan to move files so [Project Folder Str.txt] structure can be applied).
   - After generation, confirm:
     - `package.json` exists with scripts like `dev`, `build`, `start`, `lint`.
     - `tsconfig.json`, `next.config.mjs` (or `.js`), and Tailwind config files are present.

6. **Install additional core dependencies (matching your stack)**
   - In the project root, plan to install the libraries you’ll need on top of the default Next.js + Tailwind setup:
     - Supabase client: `@supabase/supabase-js`
     - State management: `zustand` (or React Context only, but you have Zustand in [Tech Stack.txt](
     - UI libraries:
       - Either `@headlessui/react` or Radix UI packages you prefer
       - Icon set: `lucide-react` or `@heroicons/react`
     - (Optional but recommended) Validation library: `zod` for request/response validation and data schemas.
   - Make sure `node_modules` installs cleanly and `npm run dev` succeeds with the starter page.

7. **Set up local environment files**
   - In the project root, ensure you have:
     - `.env.example` listing required keys: `OPENROUTER_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and any `NEXT_PUBLIC_` variants.
     - `.env.local` for your machine with real values:
       - `OPENROUTER_API_KEY=...`īī
       - `SUPABASE_URL=...`
       - `SUPABASE_ANON_KEY=...`
       - `SUPABASE_SERVICE_ROLE_KEY=...`
   - Confirm that `.gitignore` includes `.env.local` so secrets are not committed.

8. **Align basic project structure with your design doc**
   - Using [Project Folder Str.txt]īī as a guide, plan the main folders you’ll create soon (after setup is done):
     - `app/` (Next.js App Router: root page, `discover/`, `results/`, `dashboard/`, and `app/api/...` routes).
     - `components/` (UI components, layout, navbar, forms).
     - `lib/` (Supabase client file `lib/supabase.ts`, configuration utilities).
     - `services/ai/` (e.g., `openrouter.ts`, `formatter.ts`).
     - `services/database/` (database access services).
     - `types/` (TypeScript interfaces for AI input/output, Supabase rows, etc.).
     - `utils/` (validation, error handling, rate limit helper).
   - At this stage you don’t need to fill them out; just know that your generated Next.js project will be reorganized by you into this structure.

9. **Prepare Vercel project (for when you deploy)**
   - In Vercel:
     - Create a new project and connect it to your Git repo once you’ve initialized Git and pushed (later).
     - In the “Environment Variables” section, add the same keys as `.env.local` for the “Development”, “Preview”, and “Production” environments, using the correct Supabase project keys.
   - Set build/deploy framework to Next.js; Vercel usually detects this automatically from `package.json`.

10. **Add minimal tooling for code quality (pre-coding baseline)**
    - Decide on:
      - ESLint configuration (Next.js default is OK to start).
      - Prettier (and optionally format-on-save in VS Code).
    - Confirm `npm run lint` runs successfully on the fresh project.

11. **Final verification before real coding**
    - Run `npm run dev` from the project root; open `http://localhost:3000` and check that the default Next.js starter page loads.
    - With `.env.local` in place, add a quick manual check (later, as first coding tasks) that:
      - Supabase client can connect (e.g., simple server-side test call in a temporary route).
      - OpenRouter key is accessible in a server environment (e.g., log presence of `process.env.OPENROUTER_API_KEY` in an API route, without printing the value).

**Verification**

- Local dev:
  - `node -v` and `npm -v` show installed versions.
  - `npm install` works with no errors.
  - `npm run dev` serves the starter Next.js page on `http://localhost:3000`.
- Integrations (once you start coding small test routes):
  - Supabase simple query succeeds using values from `.env.local`.
  - OpenRouter test call from a server-only API route returns a response (no CORS or auth errors).
- Vercel (later):
  - First deploy builds successfully and uses your environment variables.

**Decisions**

- Use **Node.js LTS (e.g., 20.x)** and the **latest Next.js App Router template with TypeScript and Tailwind**.
- Use **npm** as the default package manager (you can switch to `pnpm`/`yarn` if you prefer).
- Keep secrets (`OPENROUTER_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) **server-only**, with optional `NEXT_PUBLIC_SUPABASE_*` for safe client-side usage.
- Defer detailed DB schema migration, rate limiting implementation, and advanced auth flows until after this initial setup and “Hello World” app are running.
