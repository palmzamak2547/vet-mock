-- An empty SETOF result is [] in REST, not an all-null composite row.
DROP FUNCTION public.join_study_group(text);
CREATE OR REPLACE FUNCTION public.join_study_group(invite_code text)
 RETURNS SETOF public.groups
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  caller_id uuid := auth.uid();
  clean_code text := upper(btrim(invite_code));
  matched_group public.groups%rowtype;
  attempt_count integer;
begin
  if caller_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;
  if clean_code is null or clean_code !~ '^[A-HJ-NP-Z2-9]{6}$' then
    raise exception 'INVALID_GROUP_CODE' using errcode = '22023';
  end if;

  -- Invite codes are short by design for students to type. Bound online
  -- guessing per authenticated account without storing the attempted codes.
  insert into private.group_join_rate_limits (user_id, window_started_at, attempts)
  values (caller_id, now(), 1)
  on conflict (user_id) do update
  set
    window_started_at = case
      when private.group_join_rate_limits.window_started_at <= now() - interval '10 minutes'
        then now()
      else private.group_join_rate_limits.window_started_at
    end,
    attempts = case
      when private.group_join_rate_limits.window_started_at <= now() - interval '10 minutes'
        then 1
      else private.group_join_rate_limits.attempts + 1
    end
  returning attempts into attempt_count;

  if attempt_count > 20 then
    return; -- Empty rows preserve existing REST clients and commit the attempt.
  end if;

  select g.*
  into matched_group
  from public.groups as g
  where g.code = clean_code;

  if matched_group.id is null then
    return; -- Empty rows preserve existing REST clients and commit the attempt.
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (matched_group.id, caller_id, 'member')
  on conflict (group_id, user_id) do nothing;

  return next matched_group;
  return;
end;
$function$
;

REVOKE ALL ON FUNCTION public.join_study_group(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_study_group(text) TO authenticated, service_role;
NOTIFY pgrst, 'reload schema';
