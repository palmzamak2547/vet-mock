-- leave_race: leaving a race's waiting room gives the seat back, and the host
-- leaving closes the room.
--
-- What it closes. Before this, leaving the waiting room only cleared the
-- screen: the membership stayed, so a guest who had gone still counted
-- toward the two players start_verified_race needs, and when the host left
-- before starting, the guests waited for a start that could never come
-- (only the host can start) with nothing to tell them.
--
-- Now RaceView calls leave_race when a student leaves the waiting room:
--   * a guest's membership is deleted, so the room lists only who is there;
--   * the host's call deletes the room (its members go with it, ON DELETE
--     CASCADE), so each guest's next race_snapshot poll is refused with
--     'Room unavailable', which RaceView shows as "ห้อง ... ปิดแล้ว" with the
--     way back to the lobby.
-- Once a race has started nothing is deleted: the answers stay, and entering
-- the same code again resumes at the same question.
--
-- Client first: RaceView already calls leave_race and ignores any failure,
-- so before this is applied the call answers 404 and nothing changes for
-- anyone. Apply it after reading; the guests' closed-room notice works from
-- the first host who leaves after that.
--
-- Undo: DROP FUNCTION public.leave_race(text);
-- (the client keeps calling it and ignores the 404, as before the apply).

CREATE OR REPLACE FUNCTION public.leave_race(p_code text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE caller uuid := private.race_caller(); room private.race_rooms;
BEGIN
  SELECT * INTO room FROM private.race_rooms
    WHERE code = upper(btrim(p_code)) AND expires_at > now() FOR UPDATE;
  -- No live room, or a race already under way: nothing to give back.
  IF NOT FOUND OR room.started_at IS NOT NULL THEN RETURN; END IF;
  IF room.host_id = caller THEN
    DELETE FROM private.race_rooms WHERE id = room.id;
  ELSE
    DELETE FROM private.race_members WHERE room_id = room.id AND user_id = caller;
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.leave_race(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.leave_race(text) TO authenticated, service_role;
