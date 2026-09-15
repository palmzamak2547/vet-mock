-- Back-office v2: sign-in facts on the people list, and admin_extras — every
-- other number the owner asked for, in one call. Same gate as v1: is_admin()
-- first, 42501 otherwise. Reads auth.users and private.client_error_counts as
-- the definer, which no browser role can do directly.

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
    'exams', (select count(*) from public.exam_results er where er.user_id = p.id),
    'email', au.email, 'last_sign_in_at', au.last_sign_in_at,
    'providers', (select string_agg(i.provider, ', ' order by i.provider) from auth.identities i where i.user_id = p.id)
  ) order by coalesce(per.last_at, ud.updated_at, p.created_at) desc nulls last), '[]'::jsonb)
  from public.profiles p
  left join public.user_data ud on ud.user_id = p.id
  left join per on per.user_id = p.id
  left join auth.users au on au.id = p.id
  into result;
  return result;
end $$;

create or replace function public.admin_extras(days int default 30) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb; since timestamptz;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  since := case when days <= 0 then '-infinity'::timestamptz else now() - make_interval(days => days) end;
  select jsonb_build_object(
    'signins_range', (select count(*) from auth.users where last_sign_in_at >= since),
    'recent_signins', (select coalesce(jsonb_agg(jsonb_build_object('username', p.username, 'avatar', p.avatar_emoji, 'at', au.last_sign_in_at) order by au.last_sign_in_at desc), '[]'::jsonb)
                       from (select id, last_sign_in_at from auth.users where last_sign_in_at is not null order by last_sign_in_at desc limit 12) au
                       left join public.profiles p on p.id = au.id),
    'identities', (select coalesce(jsonb_object_agg(provider, n), '{}'::jsonb) from (select provider, count(*) as n from auth.identities group by 1) s),
    'recent_exams', (select coalesce(jsonb_agg(jsonb_build_object('username', p.username, 'avatar', p.avatar_emoji, 'subject', e.subject, 'mode', e.mode,
                       'total', e.total, 'correct', e.correct, 'pct', e.pct, 'duration_sec', e.duration_sec, 'year', e.year, 'phase', e.phase, 'at', e.created_at) order by e.created_at desc), '[]'::jsonb)
                     from (select * from public.exam_results order by created_at desc limit 40) e left join public.profiles p on p.id = e.user_id),
    'pulse', (select coalesce(jsonb_agg(jsonb_build_object('d', pulse_date, 'attempts', total_attempts, 'correct', correct_attempts) order by pulse_date desc), '[]'::jsonb)
              from (select * from public.daily_q_pulse order by pulse_date desc limit 60) q),
    'event_kinds', (select coalesce(jsonb_object_agg(k, n), '{}'::jsonb) from (select split_part(ev.key, ':', 1) as k, count(*) as n from public.study_event_batches b, jsonb_each(b.events) ev group by 1) s),
    'errors', (select coalesce(jsonb_agg(jsonb_build_object('day', day, 'release', release, 'view', view, 'kind', kind, 'category', category, 'count', count) order by day desc, count desc), '[]'::jsonb)
               from private.client_error_counts),
    'contributors', (select coalesce(jsonb_agg(jsonb_build_object('name', coalesce(c.display_name, p.username), 'role', c.role, 'score', c.score, 'submissions', c.submissions_total,
                       'approved', c.approved_count, 'rejected', c.rejected_count, 'reviews', c.reviews_done) order by c.score desc), '[]'::jsonb)
                     from public.contributor_reputation c left join public.profiles p on p.id = c.user_id),
    'submissions', (select coalesce(jsonb_agg(jsonb_build_object('id', s.id, 'subject', s.subject, 'topic', s.topic, 'status', s.status, 'q_text', left(s.q_text, 120), 'by', p.username, 'at', s.created_at) order by s.created_at desc), '[]'::jsonb)
                    from (select * from public.q_submissions order by created_at desc limit 50) s left join public.profiles p on p.id = s.contributor_id),
    'groups', (select coalesce(jsonb_agg(jsonb_build_object('name', g.name, 'code', g.code, 'members', (select count(*) from public.group_members m where m.group_id = g.id), 'at', g.created_at) order by g.created_at desc), '[]'::jsonb)
               from public.groups g),
    'stash', (select jsonb_build_object(
        'bookmarks', coalesce(sum(case when jsonb_typeof(bookmarks) = 'array' then jsonb_array_length(bookmarks) else 0 end), 0),
        'notes', coalesce(sum(case when jsonb_typeof(notes) = 'object' then (select count(*) from jsonb_object_keys(notes)) else 0 end), 0),
        'sr_cards', coalesce(sum(case when jsonb_typeof(sr_cards) = 'object' then (select count(*) from jsonb_object_keys(sr_cards)) else 0 end), 0),
        'custom_questions', coalesce(sum(case when jsonb_typeof(custom_questions) = 'array' then jsonb_array_length(custom_questions) else 0 end), 0),
        'reading_checklist', coalesce(sum(case when jsonb_typeof(reading_checklist) = 'object' then (select count(*) from jsonb_object_keys(reading_checklist)) else 0 end), 0),
        'pdf_annotations', (select count(*) from public.pdf_annotations)
      ) from public.user_data),
    'library', jsonb_build_object(
        'by_status', (select coalesce(jsonb_object_agg(status, n), '{}'::jsonb) from (select coalesce(status, '?') as status, count(*) as n from public.library_docs group by 1) s),
        'by_year', (select coalesce(jsonb_object_agg(y, n), '{}'::jsonb) from (select coalesce(year::text, '?') as y, count(*) as n from public.library_docs group by 1) s),
        'by_kind', (select coalesce(jsonb_object_agg(kind, n), '{}'::jsonb) from (select coalesce(kind, '?') as kind, count(*) as n from public.library_docs group by 1) s),
        'bytes', (select coalesce(sum(byte_size), 0) from public.library_docs)),
    'imaging', jsonb_build_object('cases', (select count(*) from public.imaging_cases), 'files', (select count(*) from public.imaging_case_files), 'attempts', (select count(*) from public.imaging_attempts)),
    'tables', (select jsonb_agg(jsonb_build_object('name', t.name, 'rows', t.n) order by t.n desc, t.name) from (
        select 'profiles' as name, count(*) as n from public.profiles
        union all select 'user_data', count(*) from public.user_data
        union all select 'exam_results', count(*) from public.exam_results
        union all select 'study_event_batches', count(*) from public.study_event_batches
        union all select 'daily_q_pulse', count(*) from public.daily_q_pulse
        union all select 'library_docs', count(*) from public.library_docs
        union all select 'pdf_annotations', count(*) from public.pdf_annotations
        union all select 'groups', count(*) from public.groups
        union all select 'group_members', count(*) from public.group_members
        union all select 'shared_questions', count(*) from public.shared_questions
        union all select 'race_results', count(*) from public.race_results
        union all select 'q_submissions', count(*) from public.q_submissions
        union all select 'submission_reviews', count(*) from public.submission_reviews
        union all select 'q_comments', count(*) from public.q_comments
        union all select 'contributor_reputation', count(*) from public.contributor_reputation
        union all select 'imaging_cases', count(*) from public.imaging_cases
        union all select 'imaging_case_files', count(*) from public.imaging_case_files
        union all select 'imaging_attempts', count(*) from public.imaging_attempts
        union all select 'admin_users', count(*) from public.admin_users
        union all select 'auth.users', count(*) from auth.users
        union all select 'auth.identities', count(*) from auth.identities
        union all select 'private.client_error_counts', count(*) from private.client_error_counts
      ) t)
  ) into result;
  return result;
end $$;

revoke execute on function public.admin_extras(int) from public, anon;
grant execute on function public.admin_extras(int) to authenticated, service_role;
