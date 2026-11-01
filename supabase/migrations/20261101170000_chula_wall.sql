-- Chula sign-in wall (docs/CHULA-SIGNIN.md).
--
-- A member is an account holding a Google identity whose email Google verified
-- and whose domain is exactly student.chula.ac.th or chula.ac.th. The account in
-- public.admin_users also passes, so the back office cannot lock its owner out.
--
-- Every layer reads one switch, private.chula_wall.enforce. This migration
-- ships it OFF: nothing changes until public.admin_set_chula_wall(true) runs
-- after the release is live. Off restores the behaviour from before this file.
--
-- Layers here, each standing on its own:
--   1. creation gate: the Auth hook public.hook_before_user_created (registered
--      in Auth settings) and the trigger chula_only_signup on auth.users
--   2. Data API gate: PostgREST's db_pre_request, public.chula_pre_request()
--   3. a RESTRICTIVE policy on every table in public and vca, storage.objects
--      and realtime.messages
-- Emergency removal of layer 2 alone:
--   alter role authenticator reset pgrst.db_pre_request; notify pgrst, 'reload config';

create schema if not exists private;

-- ---------------------------------------------------------------- the switch
create table if not exists private.chula_wall (
  id boolean primary key default true check (id),
  enforce boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid
);
insert into private.chula_wall (id, enforce) values (true, false) on conflict (id) do nothing;
alter table private.chula_wall enable row level security;
revoke all on private.chula_wall from public, anon, authenticated;

-- A missing row reads as ON: deleting the switch must not open the wall.
create or replace function public.chula_wall_enforced() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((select w.enforce from private.chula_wall w where w.id), true)
$$;

-- ------------------------------------------------------------- the rule
-- Mirrored by CHULA_DOMAINS and isChulaEmail in src/lib/chula.js; the unit
-- suite fails when the two lists differ.
create or replace function public.is_chula_email(email text) returns boolean
language sql immutable parallel safe set search_path = '' as $$
  select coalesce(
    length(email) - length(replace(email, '@', '')) = 1
    and lower(split_part(btrim(email), '@', 2)) in ('student.chula.ac.th', 'chula.ac.th'),
    false)
$$;

-- Member or admin. The Google identity is the proof: an email/password account
-- was auto-confirmed and never proved its address.
create or replace function public.chula_allowed(uid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select uid is not null and (
    exists (
      select 1 from auth.identities i
      where i.user_id = uid
        and i.provider = 'google'
        and public.is_chula_email(i.identity_data->>'email')
        and i.identity_data->>'email_verified' = 'true'
    )
    or exists (select 1 from public.admin_users a where a.user_id = uid)
  )
$$;

-- What every policy and the pre-request ask: is the wall off, or is this caller let in?
create or replace function public.chula_access() returns boolean
language sql stable security definer set search_path = '' as $$
  select not public.chula_wall_enforced() or public.chula_allowed(auth.uid())
$$;

-- Read before sign-in by every front end and by the Vercel API (allow-listed in
-- the pre-request). Never reveals anything about another account.
create or replace function public.chula_access_state() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'enforce', public.chula_wall_enforced(),
    'signed_in', auth.uid() is not null,
    'member', public.chula_allowed(auth.uid()),
    'uid', auth.uid())
$$;

create or replace function public.admin_set_chula_wall(p_enforce boolean) returns jsonb
language plpgsql volatile security definer set search_path = '' as $$
begin
  if p_enforce is null then
    raise exception using errcode = '22004', message = 'enforce must be true or false';
  end if;
  if not public.is_admin() then
    raise exception using errcode = '42501', message = 'admin_only';
  end if;
  update private.chula_wall set enforce = p_enforce, updated_at = now(), updated_by = auth.uid() where id;
  return public.chula_access_state();
end
$$;

-- ------------------------------------------------------- 1. creation gate
-- Auth hook "before user created". Only Google with a Chula address may create
-- an account, so nobody can pre-register a student's address with a password
-- and later receive their Google identity by automatic linking.
create or replace function public.hook_before_user_created(event jsonb) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.chula_wall_enforced() then
    return '{}'::jsonb;
  end if;
  if coalesce(event->'user'->'app_metadata'->>'provider', '') = 'google'
     and public.is_chula_email(event->'user'->>'email') then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'บัญชีนี้ไม่ใช่อีเมลจุฬา ใช้บัญชี Google ของ @student.chula.ac.th หรือ @chula.ac.th'));
end
$$;

-- The same rule inside the schema, for any path the hook does not cover (the hook
-- switched off in settings, the admin API, an edge function). A row without a
-- provider is judged by its email alone; an explicit non-Google provider is refused.
create or replace function private.chula_only_signup() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if public.chula_wall_enforced()
     and not (public.is_chula_email(new.email)
              and coalesce(new.raw_app_meta_data->>'provider', 'google') = 'google') then
    raise exception using errcode = '42501', message = 'chula_only';
  end if;
  return new;
end
$$;

drop trigger if exists chula_only_signup on auth.users;
create trigger chula_only_signup before insert on auth.users
  for each row execute function private.chula_only_signup();

-- ------------------------------------------------------- 2. Data API gate
-- Runs before every PostgREST request, SECURITY DEFINER RPCs included, which row
-- security cannot see into. Invoker rights, so current_user is the request role.
create or replace function public.chula_pre_request() returns void
language plpgsql stable security invoker set search_path = '' as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return;
  end if;
  -- chula_access_state: the wall's own state, read before sign-in.
  -- seeside_public_stats: an external site's public counters.
  -- record_client_diagnostic: crash counts, HMAC-signed by our own server.
  -- library_doc_for_signing: storage metadata only; the bytes need a link our
  --   server signs, and /api/library-file signs only for a member's bearer or
  --   a member's open ticket (api/_lib/open-ticket.js).
  if coalesce(current_setting('request.path', true), '') in (
       '/rpc/chula_access_state',
       '/rpc/seeside_public_stats',
       '/rpc/record_client_diagnostic',
       '/rpc/library_doc_for_signing') then
    return;
  end if;
  if public.chula_access() then
    return;
  end if;
  raise exception using errcode = '42501', message = 'chula_member_required',
    hint = 'Sign in with a Chula Google account (@student.chula.ac.th or @chula.ac.th).';
end
$$;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'authenticator') then
    execute 'alter role authenticator set pgrst.db_pre_request = ''public.chula_pre_request''';
  end if;
end
$$;
notify pgrst, 'reload config';

-- ------------------------------------------------------- 3. row security
-- Restrictive, so it is ANDed with every existing permissive policy: it can only
-- take access away, never grant it. Wrapped in a sub-select so it runs once per
-- statement, not once per row.
do $$
declare
  t record;
begin
  for t in
    select n.nspname as s, c.relname as r
    from pg_class c join pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p') and n.nspname in ('public', 'vca')
  loop
    execute format('drop policy if exists "chula members only" on %I.%I', t.s, t.r);
    execute format('create policy "chula members only" on %I.%I as restrictive for all to anon, authenticated '
                   'using ((select public.chula_access())) with check ((select public.chula_access()))', t.s, t.r);
  end loop;
  if to_regclass('storage.objects') is not null then
    execute 'drop policy if exists "chula members only" on storage.objects';
    execute 'create policy "chula members only" on storage.objects as restrictive for all to anon, authenticated '
            'using ((select public.chula_access())) with check ((select public.chula_access()))';
  end if;
  if to_regclass('realtime.messages') is not null then
    execute 'drop policy if exists "chula members only" on realtime.messages';
    execute 'create policy "chula members only" on realtime.messages as restrictive for all to anon, authenticated '
            'using ((select public.chula_access())) with check ((select public.chula_access()))';
  end if;
end
$$;

-- ------------------------------------------------------------- grants
revoke execute on function public.chula_wall_enforced() from public, anon, authenticated;
revoke execute on function public.chula_allowed(uuid) from public, anon, authenticated;
revoke execute on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
revoke execute on function private.chula_only_signup() from public, anon, authenticated;
revoke execute on function public.admin_set_chula_wall(boolean) from public, anon;
grant execute on function public.chula_access() to anon, authenticated;
grant execute on function public.chula_access_state() to anon, authenticated;
grant execute on function public.chula_pre_request() to anon, authenticated;
grant execute on function public.admin_set_chula_wall(boolean) to authenticated;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then
    execute 'grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin';
  end if;
end
$$;
