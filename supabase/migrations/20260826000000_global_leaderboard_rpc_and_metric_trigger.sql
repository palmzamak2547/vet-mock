-- ============================================================
-- Migration: 20260826000000_global_leaderboard_rpc_and_metric_trigger.sql
-- Description: land the two pieces of PR1 that the live database is
--              actually missing, without regressing what it already has.
-- ============================================================
--
-- 20260815000000_pr1_critical_rls_lockdown.sql was written after the
-- 2026-08-24 hardening pass but timestamped before it, so it sorts
-- BEHIND eight applied migrations and was never applied. Meanwhile its
-- client half shipped: src/lib/api.js calls get_global_leaderboard()
-- on every global board load, the function does not exist, and each
-- load pays a failed RPC + a console warning before falling back.
--
-- Re-timestamping that file would have replayed its policy rewrites
-- over a database that has since moved past them, so it stays as the
-- historical record and this migration carries only what is missing.
--
-- WHAT LIVE ALREADY HAS, and is deliberately NOT touched here:
--
--   • exam_results SELECT. Live reads
--       user_id = (SELECT auth.uid())
--       OR (group_id IS NOT NULL AND private.is_current_user_group_member(group_id))
--     PR1 would have replaced that with a bare `group_id IN (SELECT ...
--     FROM group_members ...)`, losing the SECURITY DEFINER helper that
--     keeps the group check off group_members' own RLS, and losing the
--     (SELECT auth.uid()) form that evaluates once per query instead of
--     once per row. The leaky "group_id IS NULL" clause PR1 set out to
--     remove is already gone — 20260824180000 removed it.
--
--   • Profile counters. PR1 protects total_attempts / total_correct /
--     streak with a trigger. 20260824175839 had already REVOKEd them at
--     the column level: `authenticated` can UPDATE only username and
--     avatar_emoji, and cannot even SELECT the counters. The trigger
--     below still goes in — a column grant is one line away from being
--     widened by a future migration, and a BEFORE UPDATE trigger fails
--     closed if that happens — but it is the second lock, not the first.
--
--   • DELETE policies. exam_results / race_results / user_data each keep
--     a "users self-delete X" policy. PR1's DROPs named policies that do
--     not exist here (results_delete_own, rr_delete_own, udata_delete_own)
--     so they were no-ops, and the live ones are left alone on purpose:
--     the board sorts by pct DESC, so a user's weak attempts never
--     surface anyway and deleting one cannot raise their standing.

-- ── 1. Global leaderboard RPC ────────────────────────────────────────
-- The replacement for the removed "group_id IS NULL" read clause.
-- SECURITY DEFINER so it can join auth.users for the show_on_leaderboard
-- preference (written by AccountSettingsView into user_metadata), which
-- until now was honored nowhere at the data layer. Returns only
-- leaderboard-safe columns — no row handle back into exam_results.
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

-- ── 2. Profile metric trigger (second lock) ──────────────────────────
-- Trusted paths, metrics pass through untouched:
--   • service_role JWT — Edge Functions (delete-account etc.)
--   • no JWT claims at all — SQL editor, pg_cron, psql. PostgREST always
--     sets request.jwt.claims even for anon-key requests, so an empty
--     setting can only be a non-HTTP session. Read the GUC directly
--     rather than auth.jwt(), which throws casting '' to jsonb.
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
    RETURN NEW;
  END IF;
  IF claims::jsonb->>'role' = 'service_role' THEN
    RETURN NEW;
  END IF;
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

-- ── 3. race_results columns the repo never learned about ─────────────
-- The table was created directly in production, and PR1's CREATE TABLE
-- IF NOT EXISTS (which never ran here) lists eight of its ten columns.
-- On a database rebuilt from this repo, race_results would come out
-- without year or phase, and listRaceResults() does `select *`, so the
-- drift would be silent until something needed them. Additive and
-- idempotent: a no-op against production, correct on a fresh build.
ALTER TABLE public.race_results ADD COLUMN IF NOT EXISTS year INT;
ALTER TABLE public.race_results ADD COLUMN IF NOT EXISTS phase TEXT;

-- ── 4. user_data UPDATE gets its WITH CHECK ──────────────────────────
-- Live has USING (auth.uid() = user_id) and no WITH CHECK, so the row a
-- user is allowed to update could be handed a different user_id on the
-- way out — the check clause is what stops a row being reassigned.
DROP POLICY IF EXISTS "udata_update_own" ON public.user_data;
CREATE POLICY "udata_update_own"
  ON public.user_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
