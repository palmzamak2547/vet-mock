-- Detailed events are grouped by session so PostgreSQL can compress the JSON
-- rather than creating one wide row/index entry for each answered question.
CREATE TABLE public.study_event_batches (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id uuid NOT NULL,
  events jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(events) = 'object'),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, session_id),
  CHECK (octet_length(events::text) <= 2097152)
);
ALTER TABLE public.study_event_batches ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.study_event_batches FROM anon, authenticated;
GRANT SELECT, DELETE ON public.study_event_batches TO authenticated;
CREATE POLICY study_events_read_own ON public.study_event_batches FOR SELECT
  TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY study_events_delete_own ON public.study_event_batches FOR DELETE
  TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE TABLE private.study_event_limits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  window_started timestamptz NOT NULL,
  requests integer NOT NULL
);
ALTER TABLE private.study_event_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.study_event_limits FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.append_study_events(p_session_id uuid, p_events jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  caller uuid := (SELECT auth.uid());
  requests_used integer;
  event_count integer;
BEGIN
  IF caller IS NULL THEN RAISE EXCEPTION 'Authentication required' USING ERRCODE = '42501'; END IF;
  IF p_session_id IS NULL OR p_events IS NULL OR jsonb_typeof(p_events) <> 'object'
    OR octet_length(p_events::text) > 524288 THEN
    RAISE EXCEPTION 'Invalid event batch' USING ERRCODE = '22023';
  END IF;
  SELECT count(*) INTO event_count FROM jsonb_each(p_events);
  IF event_count < 1 OR event_count > 200 OR EXISTS (
    SELECT 1 FROM jsonb_each(p_events) AS item
    WHERE length(item.key) > 200
      OR item.value->>'id' IS DISTINCT FROM item.key
      OR item.value->>'sessionId' IS DISTINCT FROM p_session_id::text
      OR COALESCE(item.value->>'kind', '') NOT IN ('attempt', 'review')
      OR jsonb_typeof(item.value->'date') IS DISTINCT FROM 'number'
  ) THEN RAISE EXCEPTION 'Invalid event batch' USING ERRCODE = '22023'; END IF;

  INSERT INTO private.study_event_limits AS existing (user_id, window_started, requests)
  VALUES (caller, date_trunc('hour', now()), 1)
  ON CONFLICT (user_id) DO UPDATE SET
    window_started = EXCLUDED.window_started,
    requests = CASE WHEN existing.window_started = EXCLUDED.window_started THEN existing.requests + 1 ELSE 1 END
  RETURNING requests INTO requests_used;
  IF requests_used > 120 THEN RAISE EXCEPTION 'Sync capacity reached; retry later' USING ERRCODE = 'P0001'; END IF;

  INSERT INTO public.study_event_batches AS existing (user_id, session_id, events)
  VALUES (caller, p_session_id, p_events)
  ON CONFLICT (user_id, session_id) DO UPDATE SET
    events = EXCLUDED.events || existing.events,
    updated_at = clock_timestamp()
  WHERE existing.events IS DISTINCT FROM (EXCLUDED.events || existing.events);
  RETURN jsonb_build_object('ok', true);
END;
$$;
REVOKE ALL ON FUNCTION public.append_study_events(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.append_study_events(uuid, jsonb) TO authenticated;
