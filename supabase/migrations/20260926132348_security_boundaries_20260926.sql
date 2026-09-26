-- Keep moderation authority server-owned and failed invite guesses durable.
CREATE OR REPLACE FUNCTION public.join_study_group(invite_code text)
 RETURNS public.groups
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
    return null; -- Commit the failed attempt instead of rolling its counter back.
  end if;

  select g.*
  into matched_group
  from public.groups as g
  where g.code = clean_code;

  if matched_group.id is null then
    return null; -- Commit the failed attempt instead of rolling its counter back.
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (matched_group.id, caller_id, 'member')
  on conflict (group_id, user_id) do nothing;

  return matched_group;
end;
$function$
;
CREATE OR REPLACE FUNCTION public.cast_review_vote(sub_id uuid, verdict_val text, feedback_val text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  reviewer_role text;
  current_status submission_status;
  approve_count int;
  reject_count int;
begin
  select role into reviewer_role
  from public.contributor_reputation
  where user_id = auth.uid();

  if reviewer_role is null or reviewer_role not in ('verified', 'senior', 'founder') then
    raise exception 'NOT_AUTHORIZED_REVIEWER';
  end if;

  select status into current_status
  from public.q_submissions where id = sub_id;

  if current_status not in ('in_peer_review', 'palm_review') then
    raise exception 'NOT_REVIEWABLE_STATUS:%', current_status;
  end if;

  -- Insert review (or update on re-vote within same status)
  insert into public.submission_reviews
    (submission_id, reviewer_id, verdict, feedback, is_palm_review)
  values
    (sub_id, auth.uid(), verdict_val, feedback_val, reviewer_role = 'founder')
  on conflict (submission_id, reviewer_id) do update set
    verdict = excluded.verdict,
    feedback = excluded.feedback,
    created_at = now();

  -- Update reviewer stats
  update public.contributor_reputation
  set reviews_done = reviews_done + 1, updated_at = now()
  where user_id = auth.uid();

  -- Founder vote = immediate finalize
  if reviewer_role = 'founder' then
    if verdict_val = 'approve' then
      update public.q_submissions
      set status = 'approved'::submission_status,
          reviewed_at = now(), approved_at = now(), updated_at = now()
      where id = sub_id;
      -- Bump author reputation
      update public.contributor_reputation
      set approved_count = approved_count + 1,
          score = least(100, score + 5),
          updated_at = now()
      where user_id = (select contributor_id from public.q_submissions where id = sub_id);
      return 'approved';
    elsif verdict_val = 'reject' then
      update public.q_submissions
      set status = 'rejected'::submission_status,
          rejection_reason = feedback_val,
          reviewed_at = now(), updated_at = now()
      where id = sub_id;
      update public.contributor_reputation
      set rejected_count = rejected_count + 1,
          score = greatest(0, score - 3),
          updated_at = now()
      where user_id = (select contributor_id from public.q_submissions where id = sub_id);
      return 'rejected';
    end if;
  end if;

  -- Peer review tallying
  select count(*) filter (where verdict = 'approve'),
         count(*) filter (where verdict = 'reject')
  into approve_count, reject_count
  from public.submission_reviews
  where submission_id = sub_id and is_palm_review = false;

  if reject_count >= 1 then
    update public.q_submissions
    set status = 'peer_failed'::submission_status, updated_at = now()
    where id = sub_id;
    return 'peer_failed';
  end if;

  if approve_count >= 2 then
    update public.q_submissions
    set status = 'palm_review'::submission_status, updated_at = now()
    where id = sub_id;
    return 'palm_review';
  end if;

  return 'pending';
end;
$function$
;
REVOKE DELETE ON public.contributor_reputation FROM authenticated;
DROP POLICY IF EXISTS "users self-delete reputation" ON public.contributor_reputation;
REVOKE ALL ON FUNCTION public.join_study_group(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.join_study_group(text) TO authenticated, service_role;
REVOKE ALL ON FUNCTION public.cast_review_vote(uuid,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cast_review_vote(uuid,text,text) TO authenticated, service_role;
