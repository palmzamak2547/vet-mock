-- ============================================================
-- Migration: 20260903000000_global_leaderboard_min_questions.sql
-- Description: minimum-run-size gate on the public leaderboard.
-- ============================================================
--
-- LAUNCH_READINESS flagged (2026-08): "Public leaderboard has no
-- minimum-attempt gate (a 1-question run can score 100%) — needs a
-- product decision, not a bug fix." Decision 2026-09-03: gate on
-- questions PER RUN, not on run count — a lucky 1-question sprint
-- stays off the board no matter how many times it is repeated, while
-- one honest 5-question set is enough to appear.
--
-- The floor is 5 to match RaceView's host-side question-count clamp
-- (min=5), the smallest set the app already considers a real run.
--
-- The old 3-arg get_global_leaderboard must be DROPped, not OR
-- REPLACEd: a parameter-count change creates a separate overloaded
-- function in PostgreSQL, so "replacing" would silently leave the
-- ungated 3-arg version answering every existing client call. Drop
-- first, then create the 4-arg form. Callers that still send only
-- (p_year, p_phase, p_limit) keep working — PostgREST fills
-- p_min_total from its DEFAULT. Nothing else changes: SECURITY
-- DEFINER, the show_on_leaderboard opt-out, the pct → correct →
-- recency order and the authenticated-only grant all carry over
-- verbatim, so the supabase-rls-guard regexes keep passing here.

-- ── 1. Re-land the RPC with the min-questions floor ────────────────
DROP FUNCTION IF EXISTS public.get_global_leaderboard(INT, TEXT, INT);

CREATE OR REPLACE FUNCTION public.get_global_leaderboard(
  p_year INT DEFAULT NULL,
  p_phase TEXT DEFAULT NULL,
  p_limit INT DEFAULT 200,
  p_min_total INT DEFAULT 5
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
    AND r.total >= COALESCE(p_min_total, 5)
    AND COALESCE(u.raw_user_meta_data->>'show_on_leaderboard', 'true')::boolean
  ORDER BY r.pct DESC, r.correct DESC, r.created_at DESC
  LIMIT GREATEST(1, LEAST(1000, COALESCE(p_limit, 200)));
$$;

REVOKE EXECUTE ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT, INT) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT, INT) TO authenticated;
