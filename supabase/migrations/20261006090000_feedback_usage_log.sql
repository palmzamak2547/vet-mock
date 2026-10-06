-- Feedback usage counts, developer-only (หลังบ้านเท่านั้น).
--
-- /api/send-feedback writes ONE row per send attempt it saw, via the service
-- role, so the back-office can answer "ใช้ feature นี้เท่าไหร่ กี่คน". The
-- table holds counts, never content: the coarse feedback type, the outcome,
-- and two SHA-256 fingerprints (optional reply email, client IP) so a unique
-- count is possible without storing who anyone is. RLS is on with no
-- policies and no grants — REST cannot read or write the table at all; only
-- the service-role logger writes and the SECURITY DEFINER reader below
-- answers to is_admin().
--
-- Source copy for the provider migration (see the atomic-annotation
-- migration for the same pattern): apply on the provider, keep this file as
-- the reviewed source of truth.

create table if not exists public.feedback_usage_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  feedback_type text not null default 'Feedback',
  outcome text not null check (outcome in ('sent', 'mailer_error', 'capped_burst', 'capped_daily')),
  reporter_email_hash text,
  reporter_ip_hash text
);
alter table public.feedback_usage_log enable row level security;
revoke all on table public.feedback_usage_log from public, anon, authenticated;

create or replace function public.admin_feedback_usage()
returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  select jsonb_build_object(
    'generated_at', now(),
    'attempts_total', (select count(*) from public.feedback_usage_log),
    'sent_total', (select count(*) from public.feedback_usage_log where outcome = 'sent'),
    'sent_last_7_days', (select count(*) from public.feedback_usage_log
                         where outcome = 'sent' and created_at >= now() - interval '7 days'),
    'sent_last_30_days', (select count(*) from public.feedback_usage_log
                          where outcome = 'sent' and created_at >= now() - make_interval(days => 30)),
    'capped_total', (select count(*) from public.feedback_usage_log
                     where outcome in ('capped_burst', 'capped_daily')),
    'unique_reporters', (select count(distinct reporter_email_hash) from public.feedback_usage_log
                         where reporter_email_hash is not null),
    'unique_devices', (select count(distinct reporter_ip_hash) from public.feedback_usage_log
                       where reporter_ip_hash is not null),
    'sent_by_type', (
      select coalesce(jsonb_object_agg(feedback_type, n) order by feedback_type, '{}'::jsonb)
      from (select feedback_type, count(*) as n
            from public.feedback_usage_log where outcome = 'sent' group by feedback_type) t
    ),
    'recent', (
      select coalesce(jsonb_agg(jsonb_build_object(
               'at', to_char(r.created_at, 'YYYY-MM-DD HH24:MI'),
               'type', r.feedback_type, 'outcome', r.outcome) order by r.created_at desc), '[]'::jsonb)
      from (select created_at, feedback_type, outcome
            from public.feedback_usage_log order by created_at desc limit 20) r
    )
  ) into result;
  return result;
end $$;
revoke execute on function public.admin_feedback_usage() from public, anon, authenticated;
grant execute on function public.admin_feedback_usage() to authenticated;
