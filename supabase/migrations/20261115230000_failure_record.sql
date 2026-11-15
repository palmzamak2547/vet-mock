-- The failure record: what failed in a student's browser, and which new
-- accounts did not get their profile, where the owner can see it.
--
-- WRITTEN, NOT APPLIED. Applied by hand after a second reader, in one go.
-- The live app (release 5.239.0 and older) keeps working before and after:
-- the browser already sends a scrubbed `message`, which the old
-- record_client_diagnostic ignores; /app/admin says the record is not
-- installed until admin_failures exists.
--
-- WHAT IT ADDS
--   private.client_error_counts.message   an engine or browser message only,
--                                         reduced, or a short hash of any other
--                                         text, never the text (safeMessage in
--                                         src/lib/client-diagnostics.js, run in
--                                         the browser and again by the endpoint,
--                                         cut to 160 here). Part of the key.
--   private.client_error_counts.frame     assets/<bundle>.js:line:column of our
--                                         own code, or empty; checked here too.
--                                         Part of the key.
--   private.client_error_counts.last_at   when the count last grew, so the
--                                         admin screen can say "last 24 hours".
--   private.account_setup_failures        one count per day, step and SQLSTATE
--                                         when handle_new_user or
--                                         handle_new_user_data fails. No account
--                                         id, no name, no address.
--   public.admin_failures(p_hours)        the admin's read of both, plus the
--                                         count of accounts with no profile and
--                                         with no user_data row, and each
--                                         pg_cron job's last run when pg_cron
--                                         exists (null when it does not).
--                                         is_admin() only.
--
-- WHAT IT CHANGES
--   public.record_client_diagnostic       also stores message and last_at.
--   public.handle_new_user                same body as production (catalog,
--   public.handle_new_user_data           15 Nov 2026); the WHEN OTHERS branch
--                                         still returns NEW, so a sign-up is
--                                         never refused because the profile
--                                         failed, and now also counts the
--                                         failure. The app repairs the account
--                                         with ensure_profile on its next load
--                                         (src/hooks/useAuth.js).
--
-- WHAT IT NEVER TOUCHES
--   No row of a person is read, changed or deleted. No policy changes; no
--   grant to anon on anything new. Who may read or write what is unchanged.
--
-- HOW TO COUNT BEFORE APPLYING (the admin's SQL editor)
--   select count(*) as error_rows from private.client_error_counts;
--   select count(*) as without_profile from auth.users u
--     where not exists (select 1 from public.profiles p where p.id = u.id);
-- AFTER APPLYING the first count is the same (old rows get message '' and
-- last_at now()), and:
--   select count(*) as setup_failure_rows from private.account_setup_failures;  -- 0
--
-- HOW TO TAKE IT BACK
--   drop function if exists public.admin_failures(int);
--   drop table if exists private.account_setup_failures;
--   then re-create record_client_diagnostic, handle_new_user and
--   handle_new_user_data from 20260907061044_private_error_counts.sql and the
--   production bodies quoted in scripts/test-failure-record-db.mjs, and
--   alter table private.client_error_counts drop constraint client_error_counts_pkey,
--     add primary key (day, release, view, kind, category),
--     drop column message, drop column frame, drop column last_at;
--   (the last step fails if two rows differ only by message or frame: delete the
--   newer ones first).

begin;
set local lock_timeout = '3s';

alter table private.client_error_counts add column if not exists message text not null default '';
alter table private.client_error_counts add column if not exists last_at timestamptz not null default now();
alter table private.client_error_counts add column if not exists frame text not null default '';
alter table private.client_error_counts drop constraint if exists client_error_counts_pkey;
alter table private.client_error_counts add constraint client_error_counts_pkey primary key (day, release, view, kind, category, message, frame);

create table if not exists private.account_setup_failures (
  day date not null default current_date,
  step text not null,
  sqlstate text not null,
  count bigint not null default 1,
  last_at timestamptz not null default now(),
  primary key (day, step, sqlstate)
);
alter table private.account_setup_failures enable row level security;
revoke all on private.account_setup_failures from public, anon, authenticated;

create or replace function private.count_account_setup_failure(p_step text, p_sqlstate text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  insert into private.account_setup_failures as previous (step, sqlstate)
    values (left(coalesce(p_step, '?'), 40), left(coalesce(p_sqlstate, '?'), 5))
    on conflict (day, step, sqlstate) do update set count = previous.count + 1, last_at = now();
exception when others then
  -- Counting must never be the reason a sign-up fails.
  raise warning 'count_account_setup_failure: % (sqlstate %)', sqlerrm, sqlstate;
end $$;
revoke all on function private.count_account_setup_failure(text, text) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.record_client_diagnostic(p_payload text, p_signature text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE signing_key text; envelope jsonb; body jsonb;
BEGIN
  IF p_payload IS NULL OR octet_length(p_payload) > 1024 OR p_signature IS NULL OR p_signature !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid report' USING ERRCODE = '22023';
  END IF;
  SELECT secret INTO signing_key FROM private.application_signing_keys WHERE name = 'app-rpc';
  IF signing_key IS NULL OR encode(extensions.hmac(p_payload, signing_key, 'sha256'), 'hex') IS DISTINCT FROM p_signature THEN
    RAISE EXCEPTION 'Invalid report' USING ERRCODE = '42501';
  END IF;
  envelope := p_payload::jsonb; body := envelope->'data';
  IF envelope->>'purpose' IS DISTINCT FROM 'client-diagnostic'
    OR NOT ((envelope->>'issuedAt')::numeric BETWEEN extract(epoch FROM now()) - 300 AND extract(epoch FROM now()) + 30)
    OR length(body::text) > 600 THEN RAISE EXCEPTION 'Invalid report' USING ERRCODE = '42501'; END IF;
  DELETE FROM private.client_error_counts WHERE day < current_date - 14;
  DELETE FROM private.account_setup_failures WHERE day < current_date - 30;
  INSERT INTO private.client_error_counts AS previous (release, view, kind, category, message, frame)
    VALUES (left(body->>'release', 20), left(body->>'view', 40), left(body->>'kind', 20), left(body->>'category', 40), left(coalesce(body->>'message', ''), 160),
      CASE WHEN coalesce(body->>'frame', '') ~ '^assets/[A-Za-z0-9_.-]{1,80}\.js:[0-9]{1,7}:[0-9]{1,7}$' THEN body->>'frame' ELSE '' END)
    ON CONFLICT (day, release, view, kind, category, message, frame) DO UPDATE SET count = previous.count + 1, last_at = now();
  RETURN jsonb_build_object('ok', true);
END;
$$;
REVOKE ALL ON FUNCTION public.record_client_diagnostic(text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_client_diagnostic(text,text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  base_username TEXT;
  candidate TEXT;
  counter INT := 0;
BEGIN
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'user'
  );
  base_username := regexp_replace(COALESCE(base_username, 'user'), '[^a-zA-Z0-9_]', '', 'g');
  IF base_username IS NULL OR length(base_username) = 0 THEN
    base_username := 'user';
  END IF;
  IF length(base_username) > 25 THEN
    base_username := substring(base_username FROM 1 FOR 25);
  END IF;

  candidate := base_username;
  WHILE counter < 99 AND EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate) LOOP
    counter := counter + 1;
    candidate := base_username || '_' || counter;
  END LOOP;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate) THEN
    candidate := base_username || '_' || substring(NEW.id::text FROM 1 FOR 6);
  END IF;

  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, candidate)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- The sign-up goes through (refusing it would lock the student out); the
    -- failure is counted for /app/admin, and the app repairs the profile with
    -- ensure_profile on its next load.
    RAISE WARNING 'handle_new_user: % (sqlstate %)', SQLERRM, SQLSTATE;
    PERFORM private.count_account_setup_failure('handle_new_user', SQLSTATE);
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_data()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO public.user_data (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user_data: % (sqlstate %)', SQLERRM, SQLSTATE;
    PERFORM private.count_account_setup_failure('handle_new_user_data', SQLSTATE);
    RETURN NEW;
END;
$function$;

create or replace function public.admin_failures(p_hours int default 24) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  since timestamptz := now() - make_interval(hours => greatest(1, least(coalesce(p_hours, 24), 24 * 14)));
  jobs jsonb := null;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  -- Scheduled database jobs, when pg_cron is installed (it is not on 15 Nov
  -- 2026; null then says so instead of an empty list that reads as healthy).
  if to_regclass('cron.job') is not null then
    execute $q$select coalesce(jsonb_agg(jsonb_build_object('name', j.jobname, 'schedule', j.schedule, 'active', j.active,
      'last_status', (select d.status from cron.job_run_details d where d.jobid = j.jobid order by d.start_time desc limit 1),
      'last_at', (select max(d.start_time) from cron.job_run_details d where d.jobid = j.jobid))), '[]'::jsonb) from cron.job j$q$ into jobs;
  end if;
  return jsonb_build_object(
    'since', since,
    'db_jobs', jobs,
    'errors', (select coalesce(jsonb_agg(jsonb_build_object('release', release, 'view', view, 'kind', kind, 'category', category,
                 'message', message, 'frame', frame, 'count', count, 'last_at', last_at) order by count desc, last_at desc), '[]'::jsonb)
               from (select * from private.client_error_counts where last_at >= since order by count desc limit 200) e),
    'setup_failures', (select coalesce(jsonb_agg(jsonb_build_object('day', day, 'step', step, 'sqlstate', sqlstate, 'count', count) order by day desc), '[]'::jsonb)
                       from private.account_setup_failures),
    'without_profile', (select count(*) from auth.users u where not exists (select 1 from public.profiles p where p.id = u.id)),
    'without_user_data', (select count(*) from auth.users u where not exists (select 1 from public.user_data d where d.user_id = u.id))
  );
end $$;
revoke all on function public.admin_failures(int) from public, anon;
grant execute on function public.admin_failures(int) to authenticated;

commit;
