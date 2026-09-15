-- Admin back-office (หลังบ้าน): one table naming who may read aggregates, one
-- predicate, and SECURITY DEFINER readers that refuse everyone else. The table
-- has RLS enabled with NO policies and no grants, so REST cannot read or write
-- it at all; only the predicate, running as the owner, can consult it.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
revoke all on table public.admin_users from public, anon, authenticated;
insert into public.admin_users (user_id) values ('a852a209-71ce-4a46-9efd-e13718a346cb') on conflict do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated, service_role;

-- Every synced history row, flattened: one row per answered question across
-- all users. Internal: only the definer functions below call it.
create or replace function public.admin_history(days int)
returns table (user_id uuid, question_id bigint, subject text, correct boolean, at timestamptz)
language sql stable security definer set search_path = public as $$
  select ud.user_id,
         nullif(regexp_replace(coalesce(e->>'questionId', ''), '[^0-9]', '', 'g'), '')::bigint as question_id,
         e->>'subject' as subject,
         coalesce((e->>'correct')::boolean, false) as correct,
         case when jsonb_typeof(e->'date') = 'number'
              then to_timestamp((e->>'date')::double precision / 1000.0) else null end as at
  from public.user_data ud, jsonb_array_elements(coalesce(ud.history, '[]'::jsonb)) e
  where public.is_admin()
    and (days <= 0 or (jsonb_typeof(e->'date') = 'number'
         and to_timestamp((e->>'date')::double precision / 1000.0) >= now() - make_interval(days => days)));
$$;
revoke execute on function public.admin_history(int) from public, anon, authenticated;

create or replace function public.admin_overview(days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  with h as (select * from public.admin_history(days)),
  daily as (
    select date_trunc('day', at) as d, count(*) as attempts, count(*) filter (where correct) as correct, count(distinct user_id) as users
    from h where at is not null group by 1
  )
  select jsonb_build_object(
    'days', days,
    'generated_at', now(),
    'accounts_total', (select count(*) from public.profiles),
    'accounts_new', (select count(*) from public.profiles where days <= 0 or created_at >= now() - make_interval(days => days)),
    'users_active', (select count(distinct user_id) from h),
    'users_synced', (select count(*) from public.user_data where days <= 0 or updated_at >= now() - make_interval(days => days)),
    'attempts', (select count(*) from h),
    'correct', (select count(*) filter (where correct) from h),
    'questions_touched', (select count(distinct question_id) from h where question_id is not null),
    'exams', (select count(*) from public.exam_results where days <= 0 or created_at >= now() - make_interval(days => days)),
    'exams_avg_pct', (select round(avg(pct)) from public.exam_results where days <= 0 or created_at >= now() - make_interval(days => days)),
    'history_rows_total', (select coalesce(sum(jsonb_array_length(coalesce(history, '[]'::jsonb))), 0) from public.user_data),
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
      select nullif(regexp_replace(coalesce(ev.value->>'questionId', ''), '[^0-9]', '', 'g'), '')::bigint as qid,
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
                   and nullif(regexp_replace(coalesce(ev.value->>'questionId', ''), '[^0-9]', '', 'g'), '')::bigint = qid
                 group by 1) s),
    'recent', (select coalesce(jsonb_agg(jsonb_build_object('at', r.at, 'correct', r.correct, 'username', p.username) order by r.at desc), '[]'::jsonb)
               from (select * from h where at is not null order by at desc limit 30) r left join public.profiles p on p.id = r.user_id)
  ) into result;
  return result;
end $$;

create or replace function public.admin_users_list(days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  with h as (select * from public.admin_history(0)),
  per as (
    select user_id, count(*) as attempts, count(*) filter (where correct) as correct, max(at) as last_at,
           count(*) filter (where days <= 0 or at >= now() - make_interval(days => days)) as attempts_range
    from h group by user_id
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'user_id', p.id, 'username', p.username, 'avatar', p.avatar_emoji, 'created_at', p.created_at,
    'streak', p.streak, 'last_study_date', p.last_study_date, 'last_sync', ud.updated_at,
    'attempts', coalesce(per.attempts, 0), 'correct', coalesce(per.correct, 0),
    'attempts_range', coalesce(per.attempts_range, 0), 'last_at', per.last_at,
    'exams', (select count(*) from public.exam_results er where er.user_id = p.id)
  ) order by coalesce(per.last_at, ud.updated_at, p.created_at) desc nulls last), '[]'::jsonb)
  from public.profiles p
  left join public.user_data ud on ud.user_id = p.id
  left join per on per.user_id = p.id
  into result;
  return result;
end $$;

create or replace function public.admin_user_detail(uid uuid) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  with h as (select * from public.admin_history(0) where user_id = uid)
  select jsonb_build_object(
    'user_id', uid,
    'subjects', (select coalesce(jsonb_agg(jsonb_build_object('subject', subject, 'attempts', attempts, 'correct', correct) order by attempts desc), '[]'::jsonb)
                 from (select subject, count(*) as attempts, count(*) filter (where correct) as correct from h where subject is not null group by subject) s),
    'wrong', (select coalesce(jsonb_agg(jsonb_build_object('question_id', question_id, 'subject', subject, 'attempts', attempts, 'wrong', wrong, 'last_at', last_at) order by wrong desc, attempts desc), '[]'::jsonb)
              from (select question_id, max(subject) as subject, count(*) as attempts, count(*) filter (where not correct) as wrong, max(at) as last_at
                    from h where question_id is not null group by question_id having count(*) filter (where not correct) > 0
                    order by count(*) filter (where not correct) desc, count(*) desc limit 80) w),
    'exams', (select coalesce(jsonb_agg(jsonb_build_object('at', created_at, 'subject', subject, 'mode', mode, 'total', total, 'correct', correct, 'pct', pct) order by created_at desc), '[]'::jsonb)
              from (select * from public.exam_results where user_id = uid order by created_at desc limit 30) e)
  ) into result;
  return result;
end $$;

create or replace function public.admin_subjects(days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  with h as (select * from public.admin_history(days))
  select coalesce(jsonb_agg(jsonb_build_object('subject', subject, 'users', users, 'attempts', attempts, 'correct', correct, 'questions', questions) order by attempts desc), '[]'::jsonb)
  from (select subject, count(distinct user_id) as users, count(*) as attempts, count(*) filter (where correct) as correct, count(distinct question_id) as questions
        from h where subject is not null group by subject) s
  into result;
  return result;
end $$;

revoke execute on function public.admin_overview(int) from public, anon;
revoke execute on function public.admin_questions(int, int, int) from public, anon;
revoke execute on function public.admin_question_detail(bigint) from public, anon;
revoke execute on function public.admin_users_list(int) from public, anon;
revoke execute on function public.admin_user_detail(uuid) from public, anon;
revoke execute on function public.admin_subjects(int) from public, anon;
grant execute on function public.admin_overview(int) to authenticated, service_role;
grant execute on function public.admin_questions(int, int, int) to authenticated, service_role;
grant execute on function public.admin_question_detail(bigint) to authenticated, service_role;
grant execute on function public.admin_users_list(int) to authenticated, service_role;
grant execute on function public.admin_user_detail(uuid) to authenticated, service_role;
grant execute on function public.admin_subjects(int) to authenticated, service_role;
