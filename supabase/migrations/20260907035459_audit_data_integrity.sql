-- Reading progress joins the existing owner-scoped replica. Old clients
-- omit the new column and keep working; no existing data is rewritten.
ALTER TABLE public.user_data ADD COLUMN IF NOT EXISTS reading_checklist jsonb
  NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(reading_checklist) = 'object');

-- Metadata is user-editable. Unknown values hide a row instead of raising
-- an exception for the entire board. Callers cannot lower the five-Q floor.
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
    AND r.total >= GREATEST(5, COALESCE(p_min_total, 5))
    AND lower(btrim(COALESCE(u.raw_user_meta_data->>'show_on_leaderboard', 'true'))) IN ('true', 't', 'yes', 'y', 'on', '1')
  ORDER BY r.pct DESC, r.correct DESC, r.created_at DESC
  LIMIT GREATEST(1, LEAST(1000, COALESCE(p_limit, 200)));
$$;

REVOKE EXECUTE ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT, INT) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_global_leaderboard(INT, TEXT, INT, INT) TO authenticated;
