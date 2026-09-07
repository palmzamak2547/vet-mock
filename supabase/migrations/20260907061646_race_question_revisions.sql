ALTER TABLE private.race_rooms ADD COLUMN question_versions jsonb NOT NULL DEFAULT '{}';

CREATE OR REPLACE FUNCTION public.race_snapshot(p_code text) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE caller uuid := private.race_caller(); room private.race_rooms; members jsonb;
BEGIN
  SELECT * INTO room FROM private.race_rooms r WHERE r.code = upper(p_code) AND r.expires_at > now();
  IF NOT FOUND OR NOT EXISTS (SELECT 1 FROM private.race_members m WHERE m.room_id = room.id AND m.user_id = caller) THEN
    RAISE EXCEPTION 'Room unavailable' USING ERRCODE = '42501';
  END IF;
  SELECT jsonb_object_agg(m.user_id::text, jsonb_build_object(
    'username', COALESCE(p.username, 'ผู้ใช้'), 'avatar', COALESCE(p.avatar_emoji, '🐾'),
    'idx', jsonb_array_length(m.responses), 'correct', m.correct, 'finished', m.finished_at IS NOT NULL,
    'duration_ms', CASE WHEN m.finished_at IS NOT NULL THEN greatest(0, round(extract(epoch FROM (m.finished_at - room.started_at)) * 1000)) ELSE NULL END
  )) INTO members FROM private.race_members m LEFT JOIN public.profiles p ON p.id = m.user_id WHERE m.room_id = room.id;
  RETURN jsonb_build_object('code', room.code, 'host_id', room.host_id, 'started_at', room.started_at,
    'subject', room.subject, 'year', room.year, 'question_ids', room.question_ids, 'question_versions', room.question_versions, 'participants', members);
END;
$$;

CREATE OR REPLACE FUNCTION public.start_verified_race(p_payload text, p_signature text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE caller uuid := private.race_caller(); signing_key text; envelope jsonb; body jsonb; room private.race_rooms;
BEGIN
  IF p_payload IS NULL OR octet_length(p_payload) > 8192 OR p_signature IS NULL OR p_signature !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid start' USING ERRCODE = '22023';
  END IF;
  SELECT secret INTO signing_key FROM private.application_signing_keys WHERE name = 'app-rpc';
  IF signing_key IS NULL OR encode(extensions.hmac(p_payload, signing_key, 'sha256'), 'hex') IS DISTINCT FROM p_signature THEN
    RAISE EXCEPTION 'Invalid start' USING ERRCODE = '42501';
  END IF;
  envelope := p_payload::jsonb; body := envelope->'data';
  IF envelope->>'purpose' IS DISTINCT FROM 'race-start' OR body->>'user_id' IS DISTINCT FROM caller::text
    OR NOT ((envelope->>'issuedAt')::numeric BETWEEN extract(epoch FROM now()) - 300 AND extract(epoch FROM now()) + 30)
    OR jsonb_array_length(body->'question_ids') NOT BETWEEN 5 AND 50
    OR jsonb_array_length(body->'answers') <> jsonb_array_length(body->'question_ids') THEN
    RAISE EXCEPTION 'Invalid start' USING ERRCODE = '42501';
  END IF;
  SELECT * INTO room FROM private.race_rooms WHERE code = body->>'code' AND expires_at > now() FOR UPDATE;
  IF NOT FOUND OR room.host_id <> caller THEN RAISE EXCEPTION 'Host required' USING ERRCODE = '42501'; END IF;
  IF room.started_at IS NOT NULL THEN RETURN public.race_snapshot(room.code); END IF;
  IF (SELECT count(*) FROM private.race_members WHERE room_id = room.id) < 2 THEN RAISE EXCEPTION 'Wait for another player'; END IF;
  UPDATE private.race_rooms SET started_at = now(), subject = body->>'subject', year = (body->>'year')::integer,
    question_ids = body->'question_ids', question_versions = body->'question_versions', answers = body->'answers', option_counts = body->'option_counts' WHERE id = room.id;
  RETURN public.race_snapshot(room.code);
END;
$$;
