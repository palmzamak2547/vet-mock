-- A student's own profile picture: where its key and state live, how classmates
-- report it, and how the admin hides or restores it.
--
-- WRITTEN, NOT APPLIED. Applied by hand after a second reader, in one go.
-- Release 5.283.0 (docs/releases/5.283.0.md) works before and after: until this
-- file is applied, /api/profile-picture finds no profile_pictures_for and every
-- student keeps the ready-made picture, and an upload is answered "not ready".
--
-- UNDO (one transaction; nothing outside the objects below is touched):
--   begin;
--   drop function if exists public.admin_set_profile_picture(uuid, text);
--   drop function if exists public.admin_profile_pictures();
--   drop function if exists public.report_profile_picture(uuid);
--   drop function if exists public.set_profile_picture(text, text);
--   drop function if exists public.profile_pictures_for(uuid[]);
--   drop trigger if exists tr_guard_profile_picture on public.profiles;
--   drop function if exists private.guard_profile_picture();
--   drop table if exists public.profile_picture_reports;
--   alter table public.profiles
--     drop constraint if exists profiles_picture_key_shape,
--     drop constraint if exists profiles_picture_state_known,
--     drop constraint if exists profiles_picture_key_state,
--     drop column if exists picture_key,
--     drop column if exists picture_state,
--     drop column if exists picture_changed_at;
--   commit;
--   The stored pictures (keys under profile-pictures/ in the private bucket) are
--   then signed by nothing and reach nobody; delete that prefix to remove them.
--
-- WHAT IT ADDS
--   public.profiles.picture_key         the storage key the server chose:
--                                       profile-pictures/<uuid>.webp, nothing else
--                                       (no account id, no file name).
--   public.profiles.picture_state       none | shown | hidden_reports | hidden_admin.
--   public.profiles.picture_changed_at  when the key or state last changed.
--   private.guard_profile_picture       a client's own token never writes these
--                                       three columns (insert or update), so only
--                                       the functions below move them. It is NOT
--                                       security definer on purpose: it reads
--                                       current_user, which inside a definer
--                                       function is the owner and in a direct
--                                       PATCH is anon or authenticated.
--   public.profile_picture_reports      one row per (owner, picture, reporter).
--                                       A new picture is a new key, so reports
--                                       of an old picture never count against
--                                       the next. Both ids cascade from
--                                       auth.users, so the delete-account
--                                       function (which ends by deleting the auth
--                                       user) removes a student's reports, made
--                                       and received, with no change to it.
--   public.profile_pictures_for(uuid[]) for a Chula member only: the key and
--                                       state of up to 60 accounts, a picture
--                                       shown to everyone, a hidden one only to
--                                       its owner and the admin. Called by
--                                       /api/profile-picture with the caller's
--                                       own token; that server alone signs.
--   public.set_profile_picture(p,s)     signed by /api/profile-picture
--                                       (VETMOCK_RPC_SIGNING_KEY, purpose
--                                       'profile-picture', five minutes): sets
--                                       or clears the key. A picture the admin
--                                       hid stays hidden: a new upload is
--                                       refused until the admin restores it.
--   public.report_profile_picture(uuid) a member reports a shown picture that is
--                                       not their own; at PICTURE_REPORT_LIMIT
--                                       (3) distinct reporters of the same
--                                       picture it becomes hidden_reports. Its
--                                       owner reads that state on their profile.
--   public.admin_profile_pictures()     is_admin() only: reported or hidden
--                                       pictures, with counts.
--   public.admin_set_profile_picture()  is_admin() only: hide (hidden_admin) or
--                                       restore (shown, the reports of that
--                                       picture cleared so it is not re-hidden
--                                       at once).
--
-- GRANTS
--   profile_picture_reports: SELECT to authenticated (a reporter reads only
--   their own rows, by policy); no insert, update or delete for any client role.
--   Functions: execute to authenticated only (admin ones check is_admin()).
--   picture_key is readable where profiles already is. A key alone opens
--   nothing: the bucket is private and only the server signs a link, after
--   asking profile_pictures_for.
--
-- LOCKS
--   One transaction with lock_timeout 3s. ADD COLUMN with a constant default
--   rewrites no row. A timeout fails the whole file cleanly; run it again as is.
--
-- COUNT QUERIES (before and after; counts only)
--   select count(*) as pictures_shown from public.profiles where picture_state = 'shown';
--   select count(*) as pictures_hidden from public.profiles where picture_state like 'hidden%';
--   select count(*) as picture_reports from public.profile_picture_reports;

begin;
set local lock_timeout = '3s';

alter table public.profiles
  add column if not exists picture_key text,
  add column if not exists picture_state text not null default 'none',
  add column if not exists picture_changed_at timestamptz;

alter table public.profiles
  add constraint profiles_picture_key_shape
    check (picture_key is null or picture_key ~ '^profile-pictures/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'),
  add constraint profiles_picture_state_known
    check (picture_state in ('none', 'shown', 'hidden_reports', 'hidden_admin')),
  add constraint profiles_picture_key_state
    check ((picture_key is null) = (picture_state = 'none'));

create or replace function private.guard_profile_picture() returns trigger
language plpgsql set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated') then
    if tg_op = 'INSERT' then
      if new.picture_key is not null or new.picture_state <> 'none' or new.picture_changed_at is not null then
        raise exception 'profile picture columns are written by the server' using errcode = '42501';
      end if;
    elsif new.picture_key is distinct from old.picture_key
      or new.picture_state is distinct from old.picture_state
      or new.picture_changed_at is distinct from old.picture_changed_at then
      raise exception 'profile picture columns are written by the server' using errcode = '42501';
    end if;
  end if;
  return new;
end $$;
revoke all on function private.guard_profile_picture() from public, anon, authenticated;

drop trigger if exists tr_guard_profile_picture on public.profiles;
create trigger tr_guard_profile_picture
  before insert or update on public.profiles
  for each row execute function private.guard_profile_picture();

create table if not exists public.profile_picture_reports (
  owner_id uuid not null references auth.users(id) on delete cascade,
  picture_key text not null,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (owner_id, picture_key, reporter_id),
  constraint profile_picture_reports_not_self check (owner_id <> reporter_id)
);
create index if not exists profile_picture_reports_reporter on public.profile_picture_reports (reporter_id);

alter table public.profile_picture_reports enable row level security;
revoke all on table public.profile_picture_reports from public, anon, authenticated;
grant select on table public.profile_picture_reports to authenticated;

drop policy if exists "a reporter reads their own reports" on public.profile_picture_reports;
create policy "a reporter reads their own reports" on public.profile_picture_reports
  for select to authenticated
  using (reporter_id = (select auth.uid()));

-- The Chula wall's restrictive policy, which 20261101170000_chula_wall.sql put on
-- every table that existed then.
drop policy if exists "chula members only" on public.profile_picture_reports;
create policy "chula members only" on public.profile_picture_reports
  as restrictive for all to anon, authenticated
  using ((select public.chula_access()))
  with check ((select public.chula_access()));

create or replace function public.profile_pictures_for(p_users uuid[])
returns table (user_id uuid, picture_key text, picture_state text)
language plpgsql stable security definer set search_path = '' as $$
declare me uuid := auth.uid();
begin
  if me is null or not public.chula_allowed(me) then
    raise exception 'chula_member_required' using errcode = '42501';
  end if;
  if p_users is null or cardinality(p_users) > 60 then
    raise exception 'between 0 and 60 accounts' using errcode = '22023';
  end if;
  return query
    select p.id, p.picture_key, p.picture_state
    from public.profiles p
    where p.id = any (p_users)
      and p.picture_key is not null
      and (p.picture_state = 'shown' or p.id = me or public.is_admin());
end $$;
revoke all on function public.profile_pictures_for(uuid[]) from public, anon;
grant execute on function public.profile_pictures_for(uuid[]) to authenticated;

create or replace function public.set_profile_picture(p_payload text, p_signature text)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  signing_key text; envelope jsonb; body jsonb; owner uuid; next_key text; row_now record;
begin
  if p_payload is null or octet_length(p_payload) > 600 or p_signature is null or p_signature !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid picture request' using errcode = '22023';
  end if;
  select secret into signing_key from private.application_signing_keys where name = 'app-rpc';
  if signing_key is null or encode(extensions.hmac(p_payload, signing_key, 'sha256'), 'hex') is distinct from p_signature then
    raise exception 'invalid picture request' using errcode = '42501';
  end if;
  envelope := p_payload::jsonb;
  body := envelope->'data';
  if envelope->>'purpose' is distinct from 'profile-picture'
    or not ((envelope->>'issuedAt')::numeric between extract(epoch from now()) - 300 and extract(epoch from now()) + 30) then
    raise exception 'invalid picture request' using errcode = '42501';
  end if;
  owner := (body->>'user_id')::uuid;
  next_key := nullif(body->>'key', '');
  select p.picture_key, p.picture_state into row_now from public.profiles p where p.id = owner for update;
  if not found then
    return jsonb_build_object('ok', false, 'reason', 'no_profile');
  end if;
  if next_key is not null and row_now.picture_state = 'hidden_admin' then
    return jsonb_build_object('ok', false, 'reason', 'refused');
  end if;
  update public.profiles
    set picture_key = next_key,
        picture_state = case when next_key is null then 'none' else 'shown' end,
        picture_changed_at = now()
    where id = owner;
  return jsonb_build_object('ok', true, 'previous_key', row_now.picture_key);
end $$;
revoke all on function public.set_profile_picture(text, text) from public, anon;
grant execute on function public.set_profile_picture(text, text) to authenticated;

create or replace function public.report_profile_picture(p_owner uuid)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := auth.uid();
  PICTURE_REPORT_LIMIT constant int := 3;
  current_key text; current_state text; reporters int;
begin
  if me is null or not public.chula_allowed(me) then
    raise exception 'chula_member_required' using errcode = '42501';
  end if;
  if p_owner is null or p_owner = me then
    raise exception 'a picture of your own is not reported' using errcode = '22023';
  end if;
  select p.picture_key, p.picture_state into current_key, current_state
    from public.profiles p where p.id = p_owner for update;
  if current_key is null or current_state <> 'shown' then
    return jsonb_build_object('reported', false, 'hidden', current_state like 'hidden%');
  end if;
  insert into public.profile_picture_reports (owner_id, picture_key, reporter_id)
    values (p_owner, current_key, me)
    on conflict do nothing;
  select count(*) into reporters from public.profile_picture_reports r
    where r.owner_id = p_owner and r.picture_key = current_key;
  if reporters >= PICTURE_REPORT_LIMIT then
    update public.profiles set picture_state = 'hidden_reports', picture_changed_at = now() where id = p_owner;
  end if;
  return jsonb_build_object('reported', true, 'hidden', reporters >= PICTURE_REPORT_LIMIT);
end $$;
revoke all on function public.report_profile_picture(uuid) from public, anon;
grant execute on function public.report_profile_picture(uuid) to authenticated;

create or replace function public.admin_profile_pictures()
returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  return coalesce((
    select jsonb_agg(row_to_json(x) order by x.hidden desc, x.reports desc, x.changed_at desc)
    from (
      select p.id as user_id, p.username, p.picture_state as state, p.picture_changed_at as changed_at,
             p.picture_state like 'hidden%' as hidden,
             (select count(*) from public.profile_picture_reports r
               where r.owner_id = p.id and r.picture_key = p.picture_key) as reports,
             (select max(r.created_at) from public.profile_picture_reports r
               where r.owner_id = p.id and r.picture_key = p.picture_key) as last_report_at
      from public.profiles p
      where p.picture_key is not null
        and (p.picture_state like 'hidden%'
          or exists (select 1 from public.profile_picture_reports r where r.owner_id = p.id and r.picture_key = p.picture_key))
      limit 200
    ) x), '[]'::jsonb);
end $$;
revoke all on function public.admin_profile_pictures() from public, anon;
grant execute on function public.admin_profile_pictures() to authenticated;

create or replace function public.admin_set_profile_picture(p_owner uuid, p_state text)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare current_key text;
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  if p_state not in ('shown', 'hidden_admin') then
    raise exception 'state is shown or hidden_admin' using errcode = '22023';
  end if;
  select p.picture_key into current_key from public.profiles p where p.id = p_owner for update;
  if current_key is null then return jsonb_build_object('ok', false, 'reason', 'no_picture'); end if;
  if p_state = 'shown' then
    delete from public.profile_picture_reports r where r.owner_id = p_owner and r.picture_key = current_key;
  end if;
  update public.profiles set picture_state = p_state, picture_changed_at = now() where id = p_owner;
  return jsonb_build_object('ok', true, 'state', p_state);
end $$;
revoke all on function public.admin_set_profile_picture(uuid, text) from public, anon;
grant execute on function public.admin_set_profile_picture(uuid, text) to authenticated;

commit;
