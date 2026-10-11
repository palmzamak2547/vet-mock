-- Room-code guessing in enter_race is counted per account.
--
-- The join branch looked the code up and raised 'Room unavailable' on a
-- miss. A raise rolls the transaction back, so no counter could survive it,
-- and nothing bounded online guessing of the six-hex-character codes.
-- join_study_group (20260926132348) already solves this for invite codes:
-- upsert a per-account counter first, and on a miss or past the limit
-- return an empty result instead of raising, so the failed attempt commits.
--
-- enter_race does the same in its p_code branch: more than 20 join attempts
-- in 10 minutes, or a code that matches no live room, return NULL. The
-- 'Race already started' and 'Room full' raises stay, they come after a
-- correct code. Creating a room (p_code null) is unchanged.
--
-- Client first: RaceView must treat a null snapshot as the 'Room
-- unavailable' refusal before this is applied (today applySnapshot(null)
-- throws and the student is told to retry). Apply only after that client is
-- live. Signature, SECURITY DEFINER, search_path = '' and grants are the
-- live ones.

create table if not exists private.race_join_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 0
);
alter table private.race_join_rate_limits enable row level security;
revoke all on private.race_join_rate_limits from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.enter_race(p_code text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
-- The live body names its code-retry counter "attempts"; it is renamed
-- code_attempts here so the RETURNING of the rate-limit column below is not
-- ambiguous. Nothing else in the p_code IS NULL branch changes.
DECLARE caller uuid := private.race_caller(); room private.race_rooms; room_code text; code_attempts integer := 0; join_attempts integer;
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
        code_attempts := code_attempts + 1;
        IF code_attempts > 10 THEN RAISE EXCEPTION 'Try again'; END IF;
      END;
    END LOOP;
  ELSE
    -- Count every join attempt per account; the attempted code itself is
    -- not stored. A NULL return (not a raise) lets the counter commit.
    INSERT INTO private.race_join_rate_limits (user_id, window_started_at, attempts)
    VALUES (caller, now(), 1)
    ON CONFLICT (user_id) DO UPDATE SET
      window_started_at = CASE
        WHEN private.race_join_rate_limits.window_started_at <= now() - interval '10 minutes' THEN now()
        ELSE private.race_join_rate_limits.window_started_at END,
      attempts = CASE
        WHEN private.race_join_rate_limits.window_started_at <= now() - interval '10 minutes' THEN 1
        ELSE private.race_join_rate_limits.attempts + 1 END
    RETURNING attempts INTO join_attempts;
    IF join_attempts > 20 THEN RETURN NULL; END IF;
    SELECT * INTO room FROM private.race_rooms WHERE code = upper(btrim(p_code)) AND expires_at > now() FOR UPDATE;
    IF NOT FOUND THEN RETURN NULL; END IF;
    IF NOT EXISTS (SELECT 1 FROM private.race_members WHERE room_id = room.id AND user_id = caller) THEN
      IF room.started_at IS NOT NULL THEN RAISE EXCEPTION 'Race already started' USING ERRCODE = '22023'; END IF;
      IF (SELECT count(*) FROM private.race_members WHERE room_id = room.id) >= 10 THEN RAISE EXCEPTION 'Room full' USING ERRCODE = '22023'; END IF;
    END IF;
  END IF;
  INSERT INTO private.race_members (room_id, user_id) VALUES (room.id, caller) ON CONFLICT DO NOTHING;
  RETURN public.race_snapshot(room.code);
END;
$$;
REVOKE ALL ON FUNCTION public.enter_race(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.enter_race(text) TO authenticated, service_role;
