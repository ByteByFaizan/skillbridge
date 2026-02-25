-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/glbdvrcdahwuuunkohby/sql/new

ALTER TABLE recommendation_runs
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS recommendation_runs_user_id_idx
  ON recommendation_runs (user_id, created_at DESC);
