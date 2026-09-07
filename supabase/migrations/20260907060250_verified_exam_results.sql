CREATE TABLE private.application_signing_keys (
  name text PRIMARY KEY,
  secret text NOT NULL CHECK (length(secret) >= 32)
);
ALTER TABLE private.application_signing_keys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.application_signing_keys FROM PUBLIC, anon, authenticated;

ALTER TABLE public.exam_results ADD COLUMN IF NOT EXISTS score_source text NOT NULL DEFAULT 'client'
  CHECK (score_source IN ('client', 'server'));

ALTER TABLE public.exam_results ADD COLUMN IF NOT EXISTS submission_fingerprint text;

-- A browser may keep submitting legacy practice results, but cannot mark
-- them as server-checked. The signed RPC executes as its trusted owner.
CREATE OR REPLACE FUNCTION private.protect_exam_attestation()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated') THEN NEW.score_source := 'client'; NEW.submission_fingerprint := NULL; END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION private.protect_exam_attestation() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER protect_exam_attestation BEFORE INSERT OR UPDATE ON public.exam_results
  FOR EACH ROW EXECUTE FUNCTION private.protect_exam_attestation();

DROP POLICY IF EXISTS results_insert_own ON public.exam_results;
CREATE POLICY results_insert_own ON public.exam_results FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) AND
    (group_id IS NULL OR private.is_current_user_group_member(group_id)));

CREATE OR REPLACE FUNCTION public.record_exam_receipt(p_payload text, p_signature text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  caller uuid := (SELECT auth.uid());
  signing_key text;
  envelope jsonb;
  body jsonb;
  result_id uuid;
  stored public.exam_results;
BEGIN
  IF caller IS NULL OR NOT EXISTS (
    SELECT 1 FROM auth.sessions AS session
    WHERE session.user_id = caller AND session.id::text = (SELECT auth.jwt()->>'session_id')
  ) THEN RAISE EXCEPTION 'Current session required' USING ERRCODE = '42501'; END IF;
  IF p_payload IS NULL OR octet_length(p_payload) > 4096 OR p_signature IS NULL
    OR p_signature !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid receipt' USING ERRCODE = '22023';
  END IF;
  SELECT secret INTO signing_key FROM private.application_signing_keys WHERE name = 'app-rpc';
  IF signing_key IS NULL OR encode(extensions.hmac(p_payload, signing_key, 'sha256'), 'hex') IS DISTINCT FROM p_signature THEN
    RAISE EXCEPTION 'Invalid receipt' USING ERRCODE = '42501';
  END IF;
  envelope := p_payload::jsonb;
  body := envelope->'data';
  IF envelope->>'purpose' IS DISTINCT FROM 'exam-result'
    OR (envelope->>'issuedAt')::numeric < extract(epoch FROM now()) - 300
    OR (envelope->>'issuedAt')::numeric > extract(epoch FROM now()) + 30
    OR body->>'user_id' IS DISTINCT FROM caller::text THEN
    RAISE EXCEPTION 'Invalid receipt' USING ERRCODE = '42501';
  END IF;
  result_id := (body->>'id')::uuid;
  INSERT INTO public.exam_results (id, user_id, mode, subject, total, correct, pct, duration_sec, year, phase, score_source, submission_fingerprint)
  VALUES (result_id, caller, body->>'mode', body->>'subject', (body->>'total')::integer,
    (body->>'correct')::integer, (body->>'pct')::integer, (body->>'duration_sec')::integer,
    (body->>'year')::integer, body->>'phase', body->>'score_source', body->>'submission_fingerprint')
  ON CONFLICT (id) DO NOTHING;
  SELECT * INTO stored FROM public.exam_results WHERE id = result_id AND user_id = caller;
  IF NOT FOUND THEN RAISE EXCEPTION 'Receipt unavailable' USING ERRCODE = '42501'; END IF;
  IF stored.submission_fingerprint IS DISTINCT FROM body->>'submission_fingerprint'
    OR stored.total IS DISTINCT FROM (body->>'total')::integer OR stored.correct IS DISTINCT FROM (body->>'correct')::integer
    OR stored.pct IS DISTINCT FROM (body->>'pct')::integer OR stored.mode IS DISTINCT FROM body->>'mode'
    OR stored.subject IS DISTINCT FROM body->>'subject' OR stored.year IS DISTINCT FROM (body->>'year')::integer
    OR stored.phase IS DISTINCT FROM body->>'phase' OR stored.score_source IS DISTINCT FROM body->>'score_source' THEN
    RETURN jsonb_build_object('ok', false, 'id', result_id, 'error', 'result_conflict');
  END IF;
  RETURN jsonb_build_object('ok', true, 'id', result_id, 'verification', stored.score_source);
END;
$$;
REVOKE ALL ON FUNCTION public.record_exam_receipt(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_exam_receipt(text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_leaderboard_by_source(
  p_year integer DEFAULT NULL, p_phase text DEFAULT NULL, p_limit integer DEFAULT 200, p_source text DEFAULT 'server'
)
RETURNS TABLE (id uuid, user_id uuid, profiles jsonb, mode text, subject text, total integer,
  correct integer, pct integer, year integer, phase text, created_at timestamptz, attempt_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, pg_temp AS $$
  WITH eligible AS (
    SELECT r.*, jsonb_build_object('username', p.username, 'avatar_emoji', p.avatar_emoji) AS public_profile,
      row_number() OVER (PARTITION BY r.user_id ORDER BY r.pct DESC, r.correct DESC, r.created_at DESC, r.id) AS position,
      count(*) OVER (PARTITION BY r.user_id) AS attempt_count
    FROM public.exam_results r JOIN public.profiles p ON p.id = r.user_id JOIN auth.users u ON u.id = r.user_id
    WHERE r.total >= 5 AND r.score_source = p_source
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
