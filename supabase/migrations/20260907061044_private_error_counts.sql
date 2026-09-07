CREATE TABLE private.client_error_counts (
  day date NOT NULL DEFAULT current_date, release text NOT NULL, view text NOT NULL,
  kind text NOT NULL, category text NOT NULL, count bigint NOT NULL DEFAULT 1,
  PRIMARY KEY(day, release, view, kind, category)
);
ALTER TABLE private.client_error_counts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.client_error_counts FROM PUBLIC, anon, authenticated;
CREATE FUNCTION public.record_client_diagnostic(p_payload text, p_signature text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE signing_key text; envelope jsonb; body jsonb;
BEGIN
  IF p_payload IS NULL OR octet_length(p_payload) > 1024 OR p_signature IS NULL OR p_signature !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid report' USING ERRCODE = '22023';
  END IF;
  SELECT secret INTO signing_key FROM private.application_signing_keys WHERE name = 'app-rpc';
  IF signing_key IS NULL OR encode(extensions.hmac(p_payload, signing_key, 'sha256'), 'hex') IS DISTINCT FROM p_signature THEN
    RAISE EXCEPTION 'Invalid report' USING ERRCODE = '42501';
  END IF;
  envelope := p_payload::jsonb; body := envelope->'data';
  IF envelope->>'purpose' IS DISTINCT FROM 'client-diagnostic'
    OR NOT ((envelope->>'issuedAt')::numeric BETWEEN extract(epoch FROM now()) - 300 AND extract(epoch FROM now()) + 30)
    OR length(body::text) > 400 THEN RAISE EXCEPTION 'Invalid report' USING ERRCODE = '42501'; END IF;
  DELETE FROM private.client_error_counts WHERE day < current_date - 14;
  INSERT INTO private.client_error_counts AS previous (release, view, kind, category)
    VALUES (body->>'release', body->>'view', body->>'kind', body->>'category')
    ON CONFLICT (day, release, view, kind, category) DO UPDATE SET count = previous.count + 1;
  RETURN jsonb_build_object('ok', true);
END;
$$;
REVOKE ALL ON FUNCTION public.record_client_diagnostic(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_client_diagnostic(text,text) TO anon, authenticated;
