-- ============================================================
-- Migration: 20260815000000_pr1_critical_rls_lockdown.sql
-- Description: PR 1 — Critical RLS Lockdown & Profile Field Protection
-- ============================================================

-- 1. Protect Profile Metrics (total_attempts, total_correct, streak)
-- Direct client UPDATE via Supabase REST API must NOT allow modifying
-- these calculated metrics. Only internal DB triggers/functions or service_role
-- are allowed to adjust them.
--
-- Trusted paths (metrics pass through untouched):
--   • service_role JWT — Edge Functions (delete-account etc.)
--   • Sessions with NO JWT claims at all — SQL editor, pg_cron, db
--     scripts over the postgres role. PostgREST always sets
--     request.jwt.claims (even for anon-key requests), so an empty
--     setting can only come from a non-HTTP session. We read the GUC
--     directly instead of auth.jwt() because auth.jwt() casts the
--     empty string to jsonb and would throw.
CREATE OR REPLACE FUNCTION public.protect_profile_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  claims TEXT;
BEGIN
  claims := COALESCE(current_setting('request.jwt.claims', true), '');
  IF claims = '' THEN
    RETURN NEW;  -- non-HTTP session (postgres / cron) — trusted
  END IF;
  IF claims::jsonb->>'role' = 'service_role' THEN
    RETURN NEW;  -- Edge Function / admin key — trusted
  END IF;
  -- Normal client (anon / authenticated): freeze calculated counters
  NEW.total_attempts := OLD.total_attempts;
  NEW.total_correct  := OLD.total_correct;
  NEW.streak         := OLD.streak;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_protect_profile_metrics ON public.profiles;
CREATE TRIGGER tr_protect_profile_metrics
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_metrics();

-- 2. Lock down exam_results (Immutable Exam Logs)
-- Ensure RLS is active
ALTER TABLE public.exam_results ENABLE ROW LEVEL SECURITY;

-- Explicitly drop any permissive UPDATE or DELETE policies
DROP POLICY IF EXISTS "exam_results_update_own" ON public.exam_results;
DROP POLICY IF EXISTS "exam_results_delete_own" ON public.exam_results;
DROP POLICY IF EXISTS "results_update_own" ON public.exam_results;
DROP POLICY IF EXISTS "results_delete_own" ON public.exam_results;

-- Re-assert safe SELECT and INSERT policies.
-- SELECT = own rows + rows of groups the user belongs to. Deliberately
-- NOT "group_id IS NULL" — that clause made every solo attempt of every
-- user readable by all authenticated users (full history via any
-- user_id), bypassing the show_on_leaderboard preference. The global
-- leaderboard goes through get_global_leaderboard() below instead.
DROP POLICY IF EXISTS "results_select_own_or_group" ON public.exam_results;
CREATE POLICY "results_select_own_or_group"
  ON public.exam_results FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "results_insert_own" ON public.exam_results;
CREATE POLICY "results_insert_own"
  ON public.exam_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Lock down race_results (Immutable Race Logs)
-- Fresh-DB reproducibility: the table previously existed only in the
-- production database, so this migration crashed with
-- "relation does not exist" on any database rebuilt from the repo.
-- Columns mirror the fields the client reads/writes in src/lib/api.js
-- (recordRaceResult / listRaceResults) + the delete-account Edge
-- Function (user_id purge).
CREATE TABLE IF NOT EXISTS public.race_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_code TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT,
  question_count INT,
  correct_count INT,
  duration_ms INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_race_results_code ON public.race_results(race_code);

ALTER TABLE public.race_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "race_results_update_own" ON public.race_results;
DROP POLICY IF EXISTS "race_results_delete_own" ON public.race_results;
DROP POLICY IF EXISTS "rr_update_own" ON public.race_results;
DROP POLICY IF EXISTS "rr_delete_own" ON public.race_results;

DROP POLICY IF EXISTS "rr_select_auth" ON public.race_results;
CREATE POLICY "rr_select_auth"
  ON public.race_results FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "rr_insert_own" ON public.race_results;
CREATE POLICY "rr_insert_own"
  ON public.race_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. Secure user_data Cloud Sync Table
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "udata_select_own" ON public.user_data;
CREATE POLICY "udata_select_own"
  ON public.user_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "udata_insert_own" ON public.user_data;
CREATE POLICY "udata_insert_own"
  ON public.user_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "udata_update_own" ON public.user_data;
CREATE POLICY "udata_update_own"
  ON public.user_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Explicitly block client-side DELETE on user_data
DROP POLICY IF EXISTS "udata_delete_own" ON public.user_data;

-- 5. Global leaderboard RPC — the safe replacement for the removed
-- "group_id IS NULL" read clause.
--
-- SECURITY DEFINER so it can read exam_results + profiles + the
-- show_on_leaderboard flag in auth.users.raw_user_meta_data on the
-- caller's behalf. It exposes ONLY leaderboard-safe fields (no
-- duration, no raw row access) and honors the privacy opt-out that
-- was previously enforced nowhere at the data layer.
CREATE OR REPLACE FUNCTION public.get_global_leaderboard(
  p_year INT DEFAULT NULL,
  p_phase TEXT DEFAULT NULL,
  p_limit INT DEFAULT 200
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  profiles JSONB,
  mode TEXT,
  subject TEXT,
  total INT,
  correct INT,
  pct INT,
  year INT,
  phase TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    r.id,
    r.user_id,
    jsonb_build_object('username', pr.username, 'avatar_emoji', pr.avatar_emoji) AS profiles,
    r.mode,
    r.subject,
    r.total,
    r.correct,
    r.pct,
    r.year,
    r.phase,
    r.created_at
  FROM public.exam_results r
  JOIN public.profiles pr ON pr.id = r.user_id
  JOIN auth.users u ON u.id = r.user_id
  WHERE (p_year IS NULL OR r.year = p_year)
    AND (p_phase IS NULL OR r.phase = p_phase)
    AND COALESCE(u.raw_user_meta_data->>'show_on_leaderboard', 'true')::boolean
  ORDER BY r.pct DESC, r.correct DESC, r.created_at DESC
  LIMIT GREATEST(1, LEAST(1000, COALESCE(p_limit, 200)));
$$;

REVOKE EXECUTE ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT) TO authenticated;
