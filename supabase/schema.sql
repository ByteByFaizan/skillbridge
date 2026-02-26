-- SkillBridge: Supabase schema
-- Paste this into the Supabase SQL Editor to create the required tables.

-- Table: recommendation_runs
-- Stores each AI career analysis run alongside the input and full report.
CREATE TABLE IF NOT EXISTS recommendation_runs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL,
  input      JSONB NOT NULL,
  report     JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast session-scoped history queries
CREATE INDEX IF NOT EXISTS idx_runs_session_created
  ON recommendation_runs (session_id, created_at DESC);

-- Row Level Security: disabled (all access is server-side via service role key).
-- If you later add Supabase Auth, enable RLS and add appropriate policies.
ALTER TABLE recommendation_runs ENABLE ROW LEVEL SECURITY;

-- Allow the service role to do everything (service role inherently bypasses RLS,
-- so we don't need an explicit policy that triggers Supabase linter warnings).
