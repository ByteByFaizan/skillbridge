<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

# SkillBridge

**AI-powered career guidance for students and early-career learners.**

Answer a few questions about your education, skills, and interests — get 2–3 realistic career paths, a skill-gap breakdown, and a structured 6‑month learning roadmap. No sign-up required. Results in under 10 seconds.

---

## Features

| Feature | Description |
|---|---|
| **Smart Career Discovery** | Get 2–3 realistic career paths with a clear reason for each, matched to your unique profile |
| **Skill Gap Analysis** | See what you already have vs. what you need to learn, prioritized as High, Medium, or Low |
| **6‑Month Learning Roadmap** | Month-by-month topics, tools, and recommended learning platforms — all planned out for you |
| **Career Dashboard** | Save and revisit your career plan anytime. Track your learning progress in one place |

## Trust & Privacy

- **Simple Language** — Written at a Grade 8 reading level. No jargon, no buzzwords.
- **Fast Results** — First career recommendations in under 10 seconds.
- **Privacy-First** — No sensitive personal data stored without your consent.

---

## How It Works

```
01 → Share Your Profile
     Tell us your education, skills, and interests. Takes under 2 minutes.

02 → Get Career Matches
     Receive 2–3 realistic career paths tailored to your unique profile.

03 → Follow Your Roadmap
     Get a 6‑month plan with clear monthly goals, topics, and learning platforms.
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | [React 19](https://react.dev/) · [Tailwind CSS 4](https://tailwindcss.com/) · [Headless UI](https://headlessui.com/) · [Heroicons](https://heroicons.com/) |
| **State** | [Zustand](https://zustand.docs.pmnd.rs/) |
| **Validation** | [Zod](https://zod.dev/) |
| **Auth & Database** | [Supabase](https://supabase.com/) (Auth, PostgreSQL, SSR) |
| **AI** | [OpenRouter](https://openrouter.ai/) (LLM-powered career analysis) |
| **Language** | TypeScript 5 |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or any package manager)
- A **Supabase** project (for auth & data persistence)
- An **OpenRouter** API key (for AI career analysis)

### Installation

```bash
# Clone the repository
git clone https://github.com/ByteByFaizan/skillbridge.git
cd skillbridge

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# OpenRouter (required for AI career analysis)
OPENROUTER_API_KEY=your_openrouter_api_key

# Supabase (required for auth & persistence)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App URL (used for OAuth redirect & OpenRouter referrer)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
skillbridge/
├── app/
│   ├── api/                # API routes (auth, career, recommendations)
│   ├── components/         # Reusable UI components
│   ├── dashboard/          # Career dashboard page
│   ├── discover/           # Career discovery questionnaire
│   ├── login/              # Authentication page
│   ├── layout.tsx          # Root layout with fonts & metadata
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles & design tokens
├── lib/                    # Supabase clients, session, rate limiting
├── services/ai/            # OpenRouter integration & AI prompts
├── public/                 # Static assets
└── supabase/               # Database migrations
```

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ♦ for students everywhere
</p>
