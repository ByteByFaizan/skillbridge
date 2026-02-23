Project: SkillBridge – AI Career Guidance Platform
1️⃣ FRONTEND (Client Side)
✅ Framework

Next.js (React)

Why this is final

Industry standard for modern SaaS

Built-in routing & performance optimizations

SEO friendly (important for student discovery)

Perfect match with Vercel

✅ Language

TypeScript

Why

Safer than JavaScript

Used by real companies

Prevents runtime bugs

Looks professional in interviews

✅ Styling

Tailwind CSS

Why

Pixelia-style clean UI

Fast development

Mobile-first responsiveness

No CSS bloat

✅ UI & Icons

Headless UI / Radix UI (accessible components)

Lucide / Heroicons (icons)

✅ State Management

React Context / Zustand

Why

Lightweight

Enough for MVP

No Redux complexity

2️⃣ BACKEND (Server Side)
✅ Backend Type

Serverless APIs (Next.js API Routes)

Why

No separate backend server needed

Scales automatically

Perfect for form-based AI workflows

✅ Runtime & Language

Node.js

TypeScript

Backend Responsibilities

Handle user requests

Validate inputs

Call OpenRouter GPT-5.2

Enforce output format

Store results in database

3️⃣ AI / INTELLIGENCE LAYER
✅ AI Gateway

OpenRouter

Why

Provider-agnostic

Easy model switching

Startup-grade flexibility

✅ AI Model

GPT-5.2

Why

Strong reasoning

Structured output generation

Excellent for career analysis & roadmaps

AI Tasks

Career path recommendations

Skill gap analysis

6-month learning roadmap generation

Personalized advice

Prompt Strategy

System role prompt (Career Counselor)

Structured user input

Strict output format enforcement

4️⃣ DATABASE & AUTHENTICATION
✅ Backend-as-a-Service

Supabase

Data Storage

PostgreSQL (via Supabase)

Why

Industry gold standard

Strong relational modeling

Perfect for structured career data

Authentication

Supabase Auth

Supports

Email/password login

Google OAuth

Secure session handling

JWT tokens

Row-Level Security (RLS)

Stored Data

User profiles

Skills & interests

Career recommendations

Roadmaps

Progress data

5️⃣ DEPLOYMENT & HOSTING
✅ Frontend + Backend

Vercel

Why

Best-in-class Next.js hosting

Serverless API support

Global CDN

Easy environment variable management

✅ Database Hosting

Supabase (Managed PostgreSQL)

6️⃣ SECURITY & BEST PRACTICES

Environment variables for API keys

AI requests only from backend (never frontend)

Input validation before AI calls

Rate limiting on AI endpoints

HTTPS by default

7️⃣ RESPONSIVE DESIGN (CONFIRMED)

Handled via:

Tailwind CSS

Mobile-first layout

Flexible grid & flexbox

Adaptive components


FINAL STACK SUMMARY (ONE VIEW)
Frontend      → Next.js + React + TypeScript
Styling       → Tailwind CSS
Backend       → Next.js API Routes (Serverless)
AI            → OpenRouter (GPT-5.2)
Database      → Supabase PostgreSQL
Authentication→ Supabase Auth
Hosting       → Vercel