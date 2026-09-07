CREATE FUNCTION private.is_current_race_member(p_room_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM private.race_members
    WHERE room_id = p_room_id AND user_id = (SELECT auth.uid()));
$$;
REVOKE ALL ON FUNCTION private.is_current_race_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_current_race_member(uuid) TO authenticated;
DROP POLICY IF EXISTS rr_select_auth ON public.race_results;
CREATE POLICY rr_select_auth ON public.race_results FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR private.is_current_race_member(room_id));
