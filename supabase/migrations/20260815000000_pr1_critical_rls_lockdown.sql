-- ============================================================
-- Migration: 20260815000000_pr1_critical_rls_lockdown.sql
-- Description: PR 1 — Critical RLS Lockdown & Profile Field Protection
-- ============================================================

-- 1. Protect Profile Metrics (total_attempts, total_correct, streak)
-- Direct client UPDATE via Supabase REST API must NOT allow modifying
-- these calculated metrics. Only internal DB triggers/functions or service_role
-- are allowed to adjust them.
CREATE OR REPLACE FUNCTION public.protect_profile_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- If invoked by normal client role, preserve original metric counters
  IF (COALESCE(auth.jwt()->>'role', 'anon') != 'service_role') THEN
    NEW.total_attempts := OLD.total_attempts;
    NEW.total_correct  := OLD.total_correct;
    NEW.streak         := OLD.streak;
  END IF;
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

-- Re-assert safe SELECT and INSERT policies
DROP POLICY IF EXISTS "results_select_own_or_group" ON public.exam_results;
CREATE POLICY "results_select_own_or_group"
  ON public.exam_results FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR group_id IN (SELECT group_id FROM public.group_members WHERE user_id = auth.uid())
    OR group_id IS NULL
  );

DROP POLICY IF EXISTS "results_insert_own" ON public.exam_results;
CREATE POLICY "results_insert_own"
  ON public.exam_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Lock down race_results (Immutable Race Logs)
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
