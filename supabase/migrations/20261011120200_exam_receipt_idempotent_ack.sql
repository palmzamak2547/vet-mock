-- A retried exam receipt acknowledges the run it already stored.
--
-- record_exam_receipt inserts ON CONFLICT DO NOTHING and then compares the
-- stored row with the retry field by field. The first POST of a run can be
-- stored as score_source 'server' while its response is lost; a deploy then
-- changes one question's revision, so the retry is marked unverified and
-- arrives as score_source 'client' with the client's subject and year. The
-- comparison returned result_conflict for the row the student already owns,
-- the API answered 409 and the outbox set the result aside for good.
--
-- The submission fingerprint covers the question ids, the versions the
-- client sent and the answers, so a retry whose fingerprint equals the
-- stored one is the same run: return ok with the stored verification.
-- result_conflict remains for a fingerprint that differs (or a stored row
-- without one), checked exactly as before. Signature, SECURITY DEFINER,
-- search_path and grants are the live ones; the HMAC envelope still has to
-- verify before any of this runs.

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
  -- The same run, retried: the stored row is the receipt, whatever the
  -- retry's recomputed score_source, subject or year say.
  IF stored.submission_fingerprint IS NOT NULL
    AND stored.submission_fingerprint = body->>'submission_fingerprint' THEN
    RETURN jsonb_build_object('ok', true, 'id', result_id, 'verification', stored.score_source);
  END IF;
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
GRANT EXECUTE ON FUNCTION public.record_exam_receipt(text, text) TO authenticated, service_role;
