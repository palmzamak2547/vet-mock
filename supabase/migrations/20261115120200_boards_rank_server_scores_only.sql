-- The boards rank only scores the server marked, and the old race-results
-- write path is closed.
--
-- What it closes.
--
-- 1. Scores a phone sent by itself. exam_results rows a browser inserts
--    directly are forced to score_source = 'client' (trigger
--    protect_exam_attestation) and are checked only for shape, so anyone
--    signed in can post any percentage. Two public reads still ranked them:
--    get_leaderboard_by_source(p_source => 'client'), which fed the
--    leaderboard's "คะแนนเดิม / ชุดส่วนตัว" tab (removed from the app in the
--    same release), and get_global_leaderboard, which mixed both kinds and
--    has no caller left in the app. Both now return server-marked runs
--    only: get_leaderboard_by_source answers nothing for any other source,
--    and get_global_leaderboard filters score_source = 'server'.
--    The direct insert itself stays (policy results_insert_own): it is how a
--    private set the server cannot mark is kept in the student's own
--    history, which only that student reads (results_select_own_or_group).
--
-- 2. Legacy race rows. Policy rr_insert_own let any signed-in student insert
--    a race_results row with any numbers, as long as room_id was null. The
--    race has written its results itself since 7 Sep 2026 (answer_race,
--    SECURITY DEFINER, scored against the key the server holds), nothing in
--    the app inserts or reads legacy rows any more, and production holds 0
--    race_results rows. The policy is dropped, so no client can write one.
--    Students can still delete their own rows ("users self-delete
--    race_results"), and answer_race is unaffected.
--
-- Client first: the app no longer calls either path, so applying this
-- changes nothing a student sees today.
--
-- Undo:
--   CREATE POLICY rr_insert_own ON public.race_results FOR INSERT TO authenticated
--     WITH CHECK (user_id = (SELECT auth.uid()) AND room_id IS NULL);
--   and re-run the two function bodies from 20260907060250_verified_exam_results.sql
--   (get_leaderboard_by_source) and 20260903000000_global_leaderboard_min_questions.sql
--   (get_global_leaderboard), which drop the score_source filter added here.

DROP POLICY IF EXISTS rr_insert_own ON public.race_results;

CREATE OR REPLACE FUNCTION public.get_leaderboard_by_source(
  p_year integer DEFAULT NULL, p_phase text DEFAULT NULL, p_limit integer DEFAULT 200, p_source text DEFAULT 'server'
) RETURNS TABLE(id uuid, user_id uuid, profiles jsonb, mode text, subject text, total integer, correct integer,
  pct integer, year integer, phase text, created_at timestamptz, attempt_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  WITH eligible AS (
    SELECT r.*, jsonb_build_object('username', p.username, 'avatar_emoji', p.avatar_emoji) AS public_profile,
      row_number() OVER (PARTITION BY r.user_id ORDER BY r.pct DESC, r.correct DESC, r.created_at DESC, r.id) AS position,
      count(*) OVER (PARTITION BY r.user_id) AS attempt_count
    FROM public.exam_results r JOIN public.profiles p ON p.id = r.user_id JOIN auth.users u ON u.id = r.user_id
    -- Only server-marked runs rank, whatever source is asked for.
    WHERE r.total >= 5 AND p_source = 'server' AND r.score_source = 'server'
      AND (p_year IS NULL OR r.year = p_year) AND (p_phase IS NULL OR r.phase = p_phase)
      AND lower(btrim(COALESCE(u.raw_user_meta_data->>'show_on_leaderboard', 'true'))) IN ('true', 't', 'yes', 'y', 'on', '1')
  )
  SELECT r.id, r.user_id, r.public_profile, r.mode, r.subject, r.total, r.correct, r.pct, r.year, r.phase, r.created_at, r.attempt_count
  FROM eligible r WHERE r.position = 1
  ORDER BY r.pct DESC, r.correct DESC, r.created_at DESC
  LIMIT GREATEST(1, LEAST(1000, COALESCE(p_limit, 200)));
$$;
REVOKE ALL ON FUNCTION public.get_leaderboard_by_source(integer, text, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard_by_source(integer, text, integer, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_global_leaderboard(
  p_year INT DEFAULT NULL, p_phase TEXT DEFAULT NULL, p_limit INT DEFAULT 200, p_min_total INT DEFAULT 5
) RETURNS TABLE(id uuid, user_id uuid, profiles jsonb, mode text, subject text, total integer, correct integer,
  pct integer, year integer, phase text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
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
    AND r.total >= GREATEST(5, COALESCE(p_min_total, 5))
    AND r.score_source = 'server'
    AND lower(btrim(COALESCE(u.raw_user_meta_data->>'show_on_leaderboard', 'true'))) IN ('true', 't', 'yes', 'y', 'on', '1')
  ORDER BY r.pct DESC, r.correct DESC, r.created_at DESC
  LIMIT GREATEST(1, LEAST(1000, COALESCE(p_limit, 200)));
$$;
REVOKE ALL ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT, INT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT, INT) TO authenticated;
