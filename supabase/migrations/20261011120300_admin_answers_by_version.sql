-- Back-office answer distribution, also split by question version.
--
-- admin_questions and admin_question_detail count ev.value->>'answer' over
-- every attempt of a question, so a question whose options were reordered
-- showed one merged distribution and a wrong key looked popular or rare for
-- no reason. Attempt events carry questionVersion (src/lib/study-events.js,
-- the q1-xxxxxxxx digest of the question text and options).
--
-- Both functions keep their signatures, defaults, keys and the 'answers'
-- object unchanged, and add one key, answers_by_version:
--   { "<questionVersion or 'unknown'>": { "<answer>": n, ... }, ... }
-- The sum over answers_by_version equals the sum over answers for every
-- question (the harness checks it). No argument was added: a new overload
-- would break the current AdminView, which reads 'answers' and sends
-- { qid } only; the display of the current revision first is a later slice.
--
-- is_admin() gate, SECURITY DEFINER, search_path = public and grants are
-- the live ones (20260915121049 v1, 20260915133000 v3).

create or replace function public.admin_questions(days int default 0, min_attempts int default 3, lim int default 80) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  with h as (select * from public.admin_history(days)),
  q as (
    select question_id, max(subject) as subject, count(*) as attempts,
           count(*) filter (where not correct) as wrong,
           count(distinct user_id) as users,
           count(distinct user_id) filter (where not correct) as users_wrong,
           max(at) as last_at
    from h where question_id is not null
    group by question_id having count(*) >= greatest(min_attempts, 1)
  ),
  attempts as (
    select case when regexp_replace(coalesce(ev.value->>'questionId', ''), '[^0-9]', '', 'g') ~ '^[0-9]{1,18}$'
                then regexp_replace(ev.value->>'questionId', '[^0-9]', '', 'g')::bigint end as qid,
           coalesce(nullif(ev.value->>'questionVersion', ''), 'unknown') as version,
           coalesce(ev.value->>'answer', 'null') as ans_key
    from public.study_event_batches b, jsonb_each(b.events) ev
    where ev.key like 'attempt:%'
  ),
  ans as (
    select qid, jsonb_object_agg(ans_key, n) as dist from (
      select qid, ans_key, count(*) as n from attempts where qid is not null group by 1, 2
    ) s group by qid
  ),
  ansv as (
    select qid, jsonb_object_agg(version, dist) as by_version from (
      select qid, version, jsonb_object_agg(ans_key, n) as dist from (
        select qid, version, ans_key, count(*) as n from attempts where qid is not null group by 1, 2, 3
      ) s group by qid, version
    ) v group by qid
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'question_id', q.question_id, 'subject', q.subject, 'attempts', q.attempts, 'wrong', q.wrong,
    'users', q.users, 'users_wrong', q.users_wrong, 'last_at', q.last_at, 'answers', coalesce(a.dist, '{}'::jsonb),
    'answers_by_version', coalesce(v.by_version, '{}'::jsonb)
  ) order by (q.wrong::numeric / q.attempts) desc, q.attempts desc), '[]'::jsonb)
  from (select * from q order by (wrong::numeric / attempts) desc, attempts desc limit greatest(lim, 1)) q
  left join ans a on a.qid = q.question_id
  left join ansv v on v.qid = q.question_id
  into result;
  return result;
end $$;
revoke execute on function public.admin_questions(int, int, int) from public, anon;
grant execute on function public.admin_questions(int, int, int) to authenticated, service_role;

create or replace function public.admin_question_detail(qid bigint) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  with h as (select * from public.admin_history(0) where question_id = qid),
  attempts as (
    select coalesce(nullif(ev.value->>'questionVersion', ''), 'unknown') as version,
           coalesce(ev.value->>'answer', 'null') as k
    from public.study_event_batches b, jsonb_each(b.events) ev
    where ev.key like 'attempt:%'
      and regexp_replace(coalesce(ev.value->>'questionId', ''), '[^0-9]', '', 'g') = qid::text
  )
  select jsonb_build_object(
    'question_id', qid,
    'attempts', (select count(*) from h),
    'wrong', (select count(*) filter (where not correct) from h),
    'users', (select coalesce(jsonb_agg(jsonb_build_object('user_id', u.user_id, 'username', p.username, 'avatar', p.avatar_emoji,
                 'attempts', u.attempts, 'wrong', u.wrong, 'last_at', u.last_at) order by u.wrong desc, u.attempts desc), '[]'::jsonb)
              from (select user_id, count(*) as attempts, count(*) filter (where not correct) as wrong, max(at) as last_at from h group by user_id) u
              left join public.profiles p on p.id = u.user_id),
    'answers', (select coalesce(jsonb_object_agg(k, n), '{}'::jsonb) from (
                 select k, count(*) as n from attempts group by 1) s),
    'answers_by_version', (select coalesce(jsonb_object_agg(version, dist), '{}'::jsonb) from (
                 select version, jsonb_object_agg(k, n) as dist from (
                   select version, k, count(*) as n from attempts group by 1, 2) s group by version) v),
    'recent', (select coalesce(jsonb_agg(jsonb_build_object('at', r.at, 'correct', r.correct, 'username', p.username) order by r.at desc), '[]'::jsonb)
               from (select * from h where at is not null order by at desc limit 30) r left join public.profiles p on p.id = r.user_id)
  ) into result;
  return result;
end $$;
revoke execute on function public.admin_question_detail(bigint) from public, anon;
grant execute on function public.admin_question_detail(bigint) to authenticated, service_role;
