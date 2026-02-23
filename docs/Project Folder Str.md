📁 SkillBridge — Project Folder Structure

Framework: Next.js (App Router)
Language: TypeScript

ROOT LEVEL
skillbridge/
│
├── app/
├── components/
├── lib/
├── services/
├── styles/
├── types/
├── utils/
│
├── public/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md


1️⃣ app/ — Pages & API Routes

(Core of your application)

app/
│
├── layout.tsx
├── page.tsx                # Landing page
│
├── discover/
│   └── page.tsx            # Career discovery input page
│
├── results/
│   └── page.tsx            # Career results page
│
├── dashboard/
│   └── page.tsx            # User dashboard
│
├── api/
│   ├── career/
│   │   └── route.ts        # AI career analysis endpoint
│   │
│   ├── roadmap/
│   │   └── route.ts        # AI roadmap generation
│   │
│   └── auth/
│       └── callback/
│           └── route.ts    # Supabase auth callback


Why this is good

Clean separation of pages

Backend APIs live inside /api

Easy to deploy on Vercel

Matches industry Next.js standards


components/ — Reusable UI Components

components/
│
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Input.tsx
│   ├── Loader.tsx
│
├── career/
│   ├── CareerCard.tsx
│   ├── SkillGapCard.tsx
│   ├── GrowthPath.tsx
│
├── roadmap/
│   ├── RoadmapMonth.tsx
│   ├── RoadmapTimeline.tsx
│
└── dashboard/
    ├── SavedCareers.tsx
    ├── ProgressTracker.tsx


3️⃣ lib/ — Core Configurations

lib/
│
├── supabase.ts             # Supabase client setup
├── auth.ts                 # Auth helpers
├── constants.ts            # App-wide constants

4️⃣ services/ — External Integrations

(VERY IMPORTANT for clean architecture)

services/
│
├── ai/
│   ├── openrouter.ts       # OpenRouter client
│   ├── prompts.ts          # System & user prompts
│   └── formatter.ts        # Enforce output structure
│
├── database/
│   ├── user.service.ts
│   ├── career.service.ts
│   └── roadmap.service.ts

Why

AI logic stays OUT of UI

Easy to swap AI provider later

Very professional structure

5️⃣ types/ — TypeScript Types

types/
│
├── user.ts
├── career.ts
├── roadmap.ts
├── ai-response.ts

Example

export interface CareerPath {
  title: string;
  reason: string;
  demand: "High" | "Medium" | "Low";
}


6️⃣ utils/ — Helpers & Validation

utils/
│
├── validators.ts           # Input validation
├── formatters.ts           # UI formatting
├── errorHandler.ts         # Central error handling


7️⃣ styles/ — Styling Layer

styles/
│
├── globals.css
├── theme.css               # Colors, spacing tokens
(Tailwind config lives at root)

8️⃣ public/ — Static Assets
public/
│
├── icons/
├── illustrations/
├── logo.svg


9️⃣ Environment Variables (.env.local)

OPENROUTER_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

10 GitIgnore (.gitignore)

# dependencies
/node_modules

# Next.js build output
/.next
/out

# environment variables
.env
.env.local
.env.production

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# TypeScript
*.tsbuildinfo

# ESLint
.eslintcache

# OS files
.DS_Store
Thumbs.db

# editor settings
.vscode/
.idea/

# Supabase local
.supabase/



🔁 Data Flow (How folders work together)

UI Page
  ↓
API Route
  ↓
AI Service (OpenRouter)
  ↓
Formatter & Validation
  ↓
Database (Supabase)
  ↓
Response → UI



Supabase Database Schema
Project: SkillBridge – AI Career Guidance Platform
🔐 1️⃣ users (Profile Extension Table)

Supabase already has auth.users.
This table extends user profile data.

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  education_level TEXT,
  interests TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

Purpose

Store user-specific profile data

Linked 1-to-1 with Supabase Auth

🧠 2️⃣ user_skills
Stores skills entered by the user.

CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  proficiency_level TEXT,
  created_at TIMESTAMP DEFAULT now()
);

Example Data
skill_name	proficiency
Python		Beginner
Excel		Intermediate

🎯 3️⃣ career_recommendations

Stores AI-generated career suggestions.

CREATE TABLE career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  career_title TEXT NOT NULL,
  reason TEXT NOT NULL,
  demand_level TEXT CHECK (demand_level IN ('High','Medium','Low')),
  created_at TIMESTAMP DEFAULT now()
);

Why separate table?

Users can regenerate recommendations

Keeps history

Easy dashboard display

🧠 4️⃣ skill_gap_analysis
Stores skill gap per career.

CREATE TABLE skill_gap_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID REFERENCES career_recommendations(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  gap_type TEXT CHECK (gap_type IN ('Existing','Missing')),
  priority TEXT CHECK (priority IN ('High','Medium','Low')),
  created_at TIMESTAMP DEFAULT now()
);


🛠️ 5️⃣ learning_roadmaps
Stores roadmap header per career.

CREATE TABLE learning_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID REFERENCES career_recommendations(id) ON DELETE CASCADE,
  duration_months INT DEFAULT 6,
  created_at TIMESTAMP DEFAULT now()
);



📅 6️⃣ roadmap_steps
Month-wise roadmap content.

CREATE TABLE roadmap_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID REFERENCES learning_roadmaps(id) ON DELETE CASCADE,
  month_number INT CHECK (month_number BETWEEN 1 AND 6),
  topics TEXT[],
  tools TEXT[],
  resources TEXT[],
  created_at TIMESTAMP DEFAULT now()
);

💼 7️⃣ job_opportunities

AI-suggested roles & projects.

CREATE TABLE job_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID REFERENCES career_recommendations(id) ON DELETE CASCADE,
  role_type TEXT CHECK (role_type IN ('Job','Internship','Freelance')),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

📈 8️⃣ career_growth_paths

Career progression over time.

CREATE TABLE career_growth_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID REFERENCES career_recommendations(id) ON DELETE CASCADE,
  year_range TEXT,
  role_title TEXT,
  salary_range TEXT,
  created_at TIMESTAMP DEFAULT now()
);

💡 9️⃣ personalized_advice

AI mentor tips per user.

CREATE TABLE personalized_advice (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  advice TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

⭐ 10️⃣ saved_careers (Dashboard Feature)

Allows users to save careers.

CREATE TABLE saved_careers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  career_id UUID REFERENCES career_recommendations(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

🔒 Row Level Security (VERY IMPORTANT)

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_roadmaps ENABLE ROW LEVEL SECURITY;

Example Policy (Users can see only their data)
CREATE POLICY "Users can access own data"
ON career_recommendations
FOR SELECT
USING (auth.uid() = user_id);


🧠 Data Relationship Overview

auth.users
   ↓
users
   ↓
career_recommendations
   ↓
 ├─ skill_gap_analysis
 ├─ learning_roadmaps → roadmap_steps
 ├─ job_opportunities
 ├─ career_growth_paths

