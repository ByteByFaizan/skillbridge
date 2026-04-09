<p align="center">
  <img src="public/skillbridge-logo.png" alt="SkillBridge Logo" width="80" />
</p>

<h1 align="center">SkillBridge</h1>

<p align="center">
  <strong>AI-powered career guidance for students and early-career learners.</strong>
</p>

<p align="center">
  <a href="https://skillbridge-phi-olive.vercel.app"><img src="https://img.shields.io/badge/Live-Demo-37322f?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" /></a>
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

Answer a few questions about your education, skills, and interests — get **2–3 realistic career paths**, a **skill-gap breakdown**, and a structured **6-month learning roadmap**. Results in under 10 seconds.

## Features

- **Smart Career Discovery** — Receive 2–3 career paths with clear reasoning, matched to your unique profile.
- **Skill Gap Analysis** — See what you already know vs. what you need to learn, prioritized as High / Medium / Low.
- **6-Month Learning Roadmap** — Month-by-month topics, tools, and recommended learning platforms planned out for you.
- **Career Dashboard** — Save and revisit your career plan anytime. Track learning progress across devices.
- **Secure Authentication** — Sign up / log in with Supabase Auth (email, Google, and GitHub OAuth).
- **Fast & Private** — First recommendations in under 10 seconds. No sensitive data stored without consent.

## Security

Production-grade security built in:

- **Rate Limiting** — Tiered IP-based limits (100 req/min API, 10 req/15min auth), configurable via environment variables. Standard `X-RateLimit-*` response headers.
- **Auth Enforcement** — Protected API routes (`/api/career`, `/api/recommendations/*`) reject unauthenticated requests with `401 Unauthorized`.
- **CORS** — Strict origin whitelist from `CORS_ALLOWED_ORIGINS`. No wildcard `*`. Proper preflight (OPTIONS) handling.
- **Security Headers** — HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, Permissions-Policy.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/) · [Tailwind CSS 4](https://tailwindcss.com/) · [Headless UI](https://headlessui.com/) · [Heroicons](https://heroicons.com/) |
| **State** | [Zustand](https://zustand.docs.pmnd.rs/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Auth & Database** | [Supabase](https://supabase.com/) (Auth · PostgreSQL · SSR) |
| **AI** | [NVIDIA NIM](https://build.nvidia.com/) — LLM-powered career analysis  |
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

# Supabase (required for auth & persistence)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL (used for OAuth redirect & CORS default)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# CORS — comma-separated allowed origins (optional, defaults to APP_URL)
# CORS_ALLOWED_ORIGINS=https://your-domain.com

# Rate Limiting — optional, sensible defaults are built in
# RATE_LIMIT_WINDOW_MS=60000
# RATE_LIMIT_MAX_REQUESTS=100
# RATE_LIMIT_AUTH_WINDOW_MS=900000
# RATE_LIMIT_AUTH_MAX_REQUESTS=10
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
│   │   ├── auth/               # Login, signup, logout, OAuth callback
│   │   ├── career/             # AI career analysis endpoint (protected)
│   │   └── recommendations/    # Saved recommendations CRUD (protected)
│   ├── components/             # UI components (Header, Hero, FAQ, etc.)
│   ├── about/                  # About page
│   ├── dashboard/              # Career dashboard (saved results)
│   ├── discover/               # 4-step career discovery questionnaire
│   ├── forgot-password/        # Password reset flow
│   ├── update-password/        # Password update page
│   ├── login/                  # Authentication page
│   ├── layout.tsx              # Root layout (fonts & metadata)
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles & design tokens
├── lib/
│   ├── cors.ts                 # CORS configuration & helpers
│   ├── rate-limit.ts           # Tiered rate limiter with quota headers
│   ├── session.ts              # Anonymous session management
│   ├── supabase-auth.ts        # Supabase client (RLS-aware)
│   ├── supabase-browser.ts     # Supabase client (browser)
│   └── supabase-server.ts      # Supabase client (service role)
├── services/ai/
│   ├── nvidia.ts               # NVIDIA NIM API integration
│   └── prompts.ts              # AI prompt templates
├── utils/
│   └── validators.ts           # Zod schemas (auth, career input, report)
├── supabase/
│   └── schema.sql              # Database schema
├── proxy.ts                    # Next.js 16 proxy (auth, rate-limit, CORS)
└── public/                     # Static assets & logo
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Deployment

Deployed on [Vercel](https://vercel.com). To deploy your own:

1. Push to GitHub
2. Import the repo in Vercel
3. Set these environment variables in Vercel:

| Variable | Required |
|---|---|
| `NVIDIA_API_KEY` | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ |
| `NEXT_PUBLIC_APP_URL` | ✅ |
| `CORS_ALLOWED_ORIGINS` | Recommended |

4. Deploy 🚀

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
