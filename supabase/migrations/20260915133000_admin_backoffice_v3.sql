-- Back-office v3: no student's own row can break the owner's page, and the
-- calendar is Bangkok's.
--
-- v1 cast unvalidated JSON (a questionId of twenty digits, a "correct" that
-- is not a boolean, a history that is not an array) and one such row would
-- have raised inside every admin reader at once; user_data has own-row
-- insert/update with no CHECK on history, so a client can write anything.
-- Every cast is now guarded and a bad value becomes null/false, never an
-- exception. Days are bucketed in Asia/Bangkok, and a range of N days is
-- N calendar days ending today, so the chart's bars and the KPI agree.

create or replace function public.admin_history(days int)
returns table (user_id uuid, question_id bigint, subject text, correct boolean, at timestamptz)
language sql stable security definer set search_path = public as $$
  with bounds as (
    select case when days <= 0 then '-infinity'::timestamptz
                else ((date_trunc('day', now() at time zone 'Asia/Bangkok') - make_interval(days => days - 1)) at time zone 'Asia/Bangkok') end as since
  ),
  rows_ as (
    select ud.user_id, e
    from public.user_data ud
    cross join jsonb_array_elements(case when jsonb_typeof(ud.history) = 'array' then ud.history else '[]'::jsonb end) e
    where public.is_admin()
  ),
  typed as (
    select user_id,
           case when regexp_replace(coalesce(e->>'questionId', ''), '[^0-9]', '', 'g') ~ '^[0-9]{1,18}$'
                then regexp_replace(e->>'questionId', '[^0-9]', '', 'g')::bigint end as question_id,
           case when jsonb_typeof(e->'subject') = 'string' then e->>'subject' end as subject,
           case when jsonb_typeof(e->'correct') = 'boolean' then (e->'correct')::boolean else false end as correct,
           case when jsonb_typeof(e->'date') = 'number' and (e->>'date')::numeric between 0 and 4102444800000
                then to_timestamp((e->>'date')::double precision / 1000.0) end as at
    from rows_
  )
  select t.user_id, t.question_id, t.subject, t.correct, t.at
  from typed t, bounds b
  where days <= 0 or (t.at is not null and t.at >= b.since);
$$;
revoke execute on function public.admin_history(int) from public, anon, authenticated;

create or replace function public.admin_overview(days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb; since timestamptz;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  since := case when days <= 0 then '-infinity'::timestamptz
                else ((date_trunc('day', now() at time zone 'Asia/Bangkok') - make_interval(days => days - 1)) at time zone 'Asia/Bangkok') end;
  with h as (select * from public.admin_history(days)),
  daily as (
    select date_trunc('day', at at time zone 'Asia/Bangkok') as d, count(*) as attempts, count(*) filter (where correct) as correct, count(distinct user_id) as users
    from h where at is not null group by 1
  )
  select jsonb_build_object(
    'days', days,
    'generated_at', now(),
    'accounts_total', (select count(*) from public.profiles),
    'accounts_new', (select count(*) from public.profiles where created_at >= since),
    'users_active', (select count(distinct user_id) from h),
    'users_synced', (select count(*) from public.user_data where updated_at >= since),
    'attempts', (select count(*) from h),
    'correct', (select count(*) filter (where correct) from h),
    'questions_touched', (select count(distinct question_id) from h where question_id is not null),
    'exams', (select count(*) from public.exam_results where created_at >= since),
    'exams_avg_pct', (select round(avg(pct)) from public.exam_results where created_at >= since),
    'history_rows_total', (select coalesce(sum(case when jsonb_typeof(history) = 'array' then jsonb_array_length(history) else 0 end), 0) from public.user_data),
    'attempt_events', (select count(*) from public.study_event_batches b, jsonb_each(b.events) ev where ev.key like 'attempt:%'),
    'library_docs', (select count(*) from public.library_docs where status = 'public'),
    'submissions_open', (select count(*) from public.q_submissions where status in ('submitted', 'in_peer_review', 'palm_review')),
    'daily', (select coalesce(jsonb_agg(jsonb_build_object('d', to_char(d, 'YYYY-MM-DD'), 'attempts', attempts, 'correct', correct, 'users', users) order by d), '[]'::jsonb) from daily)
  ) into result;
  return result;
end $$;

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
  ans as (
    select qid, jsonb_object_agg(ans_key, n) as dist from (
      select case when regexp_replace(coalesce(ev.value->>'questionId', ''), '[^0-9]', '', 'g') ~ '^[0-9]{1,18}$'
                  then regexp_replace(ev.value->>'questionId', '[^0-9]', '', 'g')::bigint end as qid,
             coalesce(ev.value->>'answer', 'null') as ans_key, count(*) as n
      from public.study_event_batches b, jsonb_each(b.events) ev
      where ev.key like 'attempt:%' group by 1, 2
    ) s where qid is not null group by qid
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'question_id', q.question_id, 'subject', q.subject, 'attempts', q.attempts, 'wrong', q.wrong,
    'users', q.users, 'users_wrong', q.users_wrong, 'last_at', q.last_at, 'answers', coalesce(a.dist, '{}'::jsonb)
  ) order by (q.wrong::numeric / q.attempts) desc, q.attempts desc), '[]'::jsonb)
  from (select * from q order by (wrong::numeric / attempts) desc, attempts desc limit greatest(lim, 1)) q
  left join ans a on a.qid = q.question_id
  into result;
  return result;
end $$;

create or replace function public.admin_question_detail(qid bigint) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  with h as (select * from public.admin_history(0) where question_id = qid)
  select jsonb_build_object(
    'question_id', qid,
    'attempts', (select count(*) from h),
    'wrong', (select count(*) filter (where not correct) from h),
    'users', (select coalesce(jsonb_agg(jsonb_build_object('user_id', u.user_id, 'username', p.username, 'avatar', p.avatar_emoji,
                 'attempts', u.attempts, 'wrong', u.wrong, 'last_at', u.last_at) order by u.wrong desc, u.attempts desc), '[]'::jsonb)
              from (select user_id, count(*) as attempts, count(*) filter (where not correct) as wrong, max(at) as last_at from h group by user_id) u
              left join public.profiles p on p.id = u.user_id),
    'answers', (select coalesce(jsonb_object_agg(k, n), '{}'::jsonb) from (
                 select coalesce(ev.value->>'answer', 'null') as k, count(*) as n
                 from public.study_event_batches b, jsonb_each(b.events) ev
                 where ev.key like 'attempt:%'
                   and regexp_replace(coalesce(ev.value->>'questionId', ''), '[^0-9]', '', 'g') = qid::text
                 group by 1) s),
    'recent', (select coalesce(jsonb_agg(jsonb_build_object('at', r.at, 'correct', r.correct, 'username', p.username) order by r.at desc), '[]'::jsonb)
               from (select * from h where at is not null order by at desc limit 30) r left join public.profiles p on p.id = r.user_id)
  ) into result;
  return result;
end $$;
