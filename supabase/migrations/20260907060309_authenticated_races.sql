-- Rooms and answer keys are private. Only owner-bound RPCs expose snapshots.
CREATE TABLE private.race_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  host_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '1 day',
  started_at timestamptz,
  subject text, year integer,
  question_ids jsonb NOT NULL DEFAULT '[]',
  answers jsonb NOT NULL DEFAULT '[]',
  option_counts jsonb NOT NULL DEFAULT '[]'
);
CREATE TABLE private.race_members (
  room_id uuid NOT NULL REFERENCES private.race_rooms(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responses jsonb NOT NULL DEFAULT '[]',
  correct integer NOT NULL DEFAULT 0,
  finished_at timestamptz,
  PRIMARY KEY (room_id, user_id)
);
CREATE INDEX race_rooms_host_idx ON private.race_rooms(host_id);
CREATE INDEX race_members_user_idx ON private.race_members(user_id);
ALTER TABLE private.race_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.race_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.race_rooms, private.race_members FROM PUBLIC, anon, authenticated;

ALTER TABLE public.race_results ADD COLUMN IF NOT EXISTS room_id uuid REFERENCES private.race_rooms(id) ON DELETE SET NULL;
CREATE UNIQUE INDEX race_result_room_user ON public.race_results(room_id, user_id) WHERE room_id IS NOT NULL;
-- Old clients may record legacy rows, but cannot claim a verified room.
DROP POLICY IF EXISTS rr_insert_own ON public.race_results;
DROP POLICY IF EXISTS race_results_insert_own ON public.race_results;
CREATE POLICY rr_insert_own ON public.race_results FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()) AND room_id IS NULL);

CREATE FUNCTION private.race_caller() RETURNS uuid
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
DECLARE caller uuid := (SELECT auth.uid());
BEGIN
  IF caller IS NULL OR NOT EXISTS (SELECT 1 FROM auth.sessions s
    WHERE s.user_id = caller AND s.id::text = (SELECT auth.jwt()->>'session_id')) THEN
    RAISE EXCEPTION 'Current session required' USING ERRCODE = '42501';
  END IF;
  RETURN caller;
END;
$$;
REVOKE ALL ON FUNCTION private.race_caller() FROM PUBLIC, anon, authenticated;

CREATE FUNCTION public.race_snapshot(p_code text) RETURNS jsonb
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
    'subject', room.subject, 'year', room.year, 'question_ids', room.question_ids, 'participants', members);
END;
$$;

CREATE FUNCTION public.enter_race(p_code text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE caller uuid := private.race_caller(); room private.race_rooms; room_code text; attempts integer := 0;
BEGIN
  IF p_code IS NULL THEN
    DELETE FROM private.race_rooms WHERE expires_at < now();
    IF (SELECT count(*) FROM private.race_rooms WHERE host_id = caller AND created_at > now() - interval '1 hour') >= 10 THEN
      RAISE EXCEPTION 'Too many rooms' USING ERRCODE = '22023';
    END IF;
    LOOP
      room_code := upper(substr(encode(extensions.gen_random_bytes(4), 'hex'), 1, 6));
      BEGIN
        INSERT INTO private.race_rooms (code, host_id) VALUES (room_code, caller) RETURNING * INTO room;
        EXIT;
      EXCEPTION WHEN unique_violation THEN
        attempts := attempts + 1;
        IF attempts > 10 THEN RAISE EXCEPTION 'Try again'; END IF;
      END;
    END LOOP;
  ELSE
    SELECT * INTO room FROM private.race_rooms WHERE code = upper(btrim(p_code)) AND expires_at > now() FOR UPDATE;
    IF NOT FOUND THEN RAISE EXCEPTION 'Room unavailable' USING ERRCODE = '42501'; END IF;
    IF NOT EXISTS (SELECT 1 FROM private.race_members WHERE room_id = room.id AND user_id = caller) THEN
      IF room.started_at IS NOT NULL THEN RAISE EXCEPTION 'Race already started' USING ERRCODE = '22023'; END IF;
      IF (SELECT count(*) FROM private.race_members WHERE room_id = room.id) >= 10 THEN RAISE EXCEPTION 'Room full' USING ERRCODE = '22023'; END IF;
    END IF;
  END IF;
  INSERT INTO private.race_members (room_id, user_id) VALUES (room.id, caller) ON CONFLICT DO NOTHING;
  RETURN public.race_snapshot(room.code);
END;
$$;

CREATE FUNCTION public.start_verified_race(p_payload text, p_signature text) RETURNS jsonb
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
    question_ids = body->'question_ids', answers = body->'answers', option_counts = body->'option_counts' WHERE id = room.id;
  RETURN public.race_snapshot(room.code);
END;
$$;

CREATE FUNCTION public.answer_race(p_code text, p_index integer, p_answer integer) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE caller uuid := private.race_caller(); room private.race_rooms; member private.race_members; n integer; total integer; finished timestamptz;
BEGIN
  SELECT * INTO room FROM private.race_rooms WHERE code = upper(p_code) AND expires_at > now() FOR UPDATE;
  IF NOT FOUND OR room.started_at IS NULL THEN RAISE EXCEPTION 'Race unavailable' USING ERRCODE = '42501'; END IF;
  SELECT * INTO member FROM private.race_members WHERE room_id = room.id AND user_id = caller FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Membership required' USING ERRCODE = '42501'; END IF;
  n := jsonb_array_length(member.responses); total := jsonb_array_length(room.question_ids);
  -- A lost HTTP response can safely replay the identical answer.
  IF p_index >= 0 AND p_index < n AND (member.responses->>p_index)::integer = p_answer THEN
    RETURN public.race_snapshot(room.code);
  END IF;
  IF p_index IS NULL OR p_index <> n OR p_index >= total OR p_answer IS NULL OR p_answer < 0
    OR p_answer >= (room.option_counts->>p_index)::integer THEN RAISE EXCEPTION 'Answer out of order' USING ERRCODE = '22023'; END IF;
  IF n + 1 = total THEN finished := now(); END IF;
  UPDATE private.race_members SET responses = responses || to_jsonb(p_answer),
    correct = correct + CASE WHEN p_answer = (room.answers->>p_index)::integer THEN 1 ELSE 0 END,
    finished_at = finished WHERE room_id = room.id AND user_id = caller RETURNING * INTO member;
  IF finished IS NOT NULL THEN
    INSERT INTO public.race_results (race_code, user_id, subject, question_count, correct_count, duration_ms, year, room_id)
    VALUES (room.code, caller, room.subject, total, member.correct,
      greatest(0, round(extract(epoch FROM (finished - room.started_at)) * 1000)), room.year, room.id)
    ON CONFLICT (room_id, user_id) WHERE room_id IS NOT NULL DO NOTHING;
  END IF;
  RETURN public.race_snapshot(room.code);
END;
$$;
REVOKE ALL ON FUNCTION public.race_snapshot(text), public.enter_race(text),
  public.start_verified_race(text, text), public.answer_race(text, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.race_snapshot(text), public.enter_race(text),
  public.start_verified_race(text, text), public.answer_race(text, integer, integer) TO authenticated;
