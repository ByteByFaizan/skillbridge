<p align="center">
  <img src="public/skillbridge-logo.png" alt="SkillBridge Logo" width="80" />
</p>

<h1 align="center">SkillBridge</h1>

<p align="center">
  <strong>AI-powered career guidance for students and early-career learners.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/NVIDIA-NIM-76B900?logo=nvidia&logoColor=white" alt="NVIDIA NIM" />
</p>

---

Answer a few questions about your education, skills, and interests — get **2-3 realistic career paths**, a **skill-gap breakdown**, and a structured **6-month learning roadmap**. Results in under 10 seconds.

## Features

- **Smart Career Discovery** — Receive 2-3 career paths with clear reasoning, matched to your unique profile.
- **Skill Gap Analysis** — See what you already know vs. what you need to learn, prioritized as High / Medium / Low.
- **6-Month Learning Roadmap** — Month-by-month topics, tools, and recommended learning platforms planned out for you.
- **Career Dashboard** — Save and revisit your career plan anytime. Track learning progress in one place.
- **Secure Authentication** — Sign up / log in with Supabase Auth (email and OAuth).
- **Fast and Private** — First recommendations in under 10 seconds. No sensitive data stored without consent.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/) · [Tailwind CSS 4](https://tailwindcss.com/) · [Headless UI](https://headlessui.com/) · [Heroicons](https://heroicons.com/) |
| **State** | [Zustand](https://zustand.docs.pmnd.rs/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Auth and Database** | [Supabase](https://supabase.com/) (Auth · PostgreSQL · SSR) |
| **AI** | [NVIDIA NIM](https://build.nvidia.com/) — LLM-powered career analysis (Qwen3-235B) |
| **Language** | TypeScript 5 |

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or any package manager)
- A [Supabase](https://supabase.com/) project
- An [NVIDIA NIM](https://build.nvidia.com/) API key (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/ByteByFaizan/skillbridge.git
cd skillbridge

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env.local
```

### Environment Variables

Fill in `.env.local` with the following:

```env
# NVIDIA NIM (required for AI career analysis)
NVIDIA_API_KEY=your_nvidia_api_key

# Supabase (required for auth and persistence)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL (used for OAuth redirect)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database Setup

Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) inside the Supabase SQL Editor to create the required `recommendation_runs` table.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
skillbridge/
├── app/
│   ├── api/
│   │   ├── auth/               # Auth callbacks and OAuth handling
│   │   ├── career/             # Career analysis endpoint
│   │   └── recommendations/    # Saved recommendations CRUD
│   ├── components/             # UI components
│   │   ├── Header.tsx          # Navigation and mobile menu
│   │   ├── Hero.tsx            # Landing hero section
│   │   ├── HowItWorks.tsx      # Step-by-step explainer
│   │   ├── Features.tsx        # Feature cards
│   │   ├── FeatureHighlights.tsx
│   │   ├── TrustSignals.tsx    # Social proof and trust badges
│   │   ├── FAQ.tsx             # Accordion FAQ
│   │   ├── FinalCTA.tsx        # Bottom call-to-action
│   │   ├── Footer.tsx          # Site footer
│   │   └── RevealOnScroll.tsx  # Scroll animation wrapper
│   ├── about/                  # About page
│   ├── dashboard/              # Career dashboard (saved results)
│   ├── discover/               # Career discovery questionnaire
│   ├── login/                  # Authentication page
│   ├── layout.tsx              # Root layout (fonts and metadata)
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles and design tokens
├── lib/
│   ├── supabase-browser.ts     # Supabase client (browser)
│   ├── supabase-server.ts      # Supabase client (server)
│   ├── supabase-auth.ts        # Auth helper utilities
│   ├── session.ts              # Session management
│   └── rate-limit.ts           # API rate limiting
├── services/ai/
│   ├── nvidia.ts               # NVIDIA NIM API integration
│   └── prompts.ts              # AI prompt templates
├── utils/
│   └── validators.ts           # Zod validation schemas
├── supabase/
│   └── schema.sql              # Database schema
├── scripts/
│   └── migration.sql           # DB migration script
├── docs/                       # Design docs and PRD
└── public/                     # Static assets and logo
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch — `git checkout -b feature/amazing-feature`
3. Commit your changes — `git commit -m 'Add amazing feature'`
4. Push to the branch — `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ♦ for students everywhere
</p>
