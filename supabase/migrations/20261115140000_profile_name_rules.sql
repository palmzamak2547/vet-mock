-- Public names: the rules, a neutral handle and an undo record, as functions only.
--
-- Written 15 Nov 2026 for release 5.228.0 (docs/releases/5.228.0.md, "Database
-- steps, final", step 1 of 4). The pull request that adds this file does not
-- apply it: migrations here are applied by hand, after a second reader.
--
-- WHAT IT DOES
--   Adds, in the private schema, the functions the next three files use, and
--   one empty table:
--     private.public_name_leak(name, email)     the recogniser: 'student number',
--                                               'email', 'address' or null
--     private.public_name_problem(name, email)  why a NEW name is refused, or null
--     private.compact_name(name)                the form two names are compared in
--     private.made_from_google_name(name, meta) handle_new_user's Google-name handle
--     private.neutral_handle()                  a free handle: user_ + 6 letters a to f
--     private.give_neutral_handle(id, reason)   one account to the handle, recorded
--     private.undo_neutral_handle(id)           takes one account back
--     private.neutralise_leaking_names()        every leaking name; returns a count
--     private.neutralise_folded_collisions()    names alike once folded; returns a count
--     private.profile_name_undo                 old and new value per change
--
-- WHAT IT NEVER TOUCHES
--   No row anywhere is changed or deleted. No existing function, policy, grant
--   or trigger changes. Nothing the live app calls (the 5.228.0 build) reads or
--   calls anything defined here, so applying this file changes nothing a
--   student sees. The functions run only when a person calls them (file 2 and
--   file 4) or when file 3 installs its triggers.
--
-- WHO CAN READ AND CALL
--   private.profile_name_undo holds the old names, so it is the admin's alone:
--   no grant to public, anon, authenticated or service_role, and row level
--   security on with no policy. It is read in the database's SQL editor by the
--   person who applies these files. Every function that writes is revoked from
--   public, anon and authenticated. private.compact_name stays executable by
--   everyone, on purpose: file 4 indexes it, and Postgres checks EXECUTE on an
--   index expression for whoever writes the row, so a member renaming
--   themselves must be able to run it. It reads nothing and returns a folded
--   copy of its argument.
--
-- THE RECOGNISER (private.public_name_leak), taken from the app's own guards
--   'student number'  what shownName (src/lib/public-display.js) draws as an id:
--                     after NFKC (full-width digits become 0 to 9), with Thai
--                     digits read as digits, invisible and bidi characters
--                     removed, and at most one space, dot, dash or underscore
--                     between two digits joined, a run of 7 or more digits; or
--                     the whole name a run of 5 or more digits (isAutoName in
--                     src/lib/identity-gate.js). Thai vowel and tone marks are
--                     dropped before counting, as checkPublicName does, so a
--                     mark cannot hide a run ("643" + mai ek + "1234567").
--   'email'           the name, trimmed and in lower case, is the part of the
--                     account's own address before the @ (isAutoName), or that
--                     part as handle_new_user stores it (only a to z, 0 to 9
--                     and _, at most 25, with its _2 or _<6 hex> suffix).
--   'address'         an @, http: or https:, or www. in the name (shownName).
--   A name with digits that is none of these ("ploy55555", "vet86 2567",
--   "Room 101") is not matched. Digits of scripts other than Latin and Thai are
--   not counted here (shownName still draws them as an id).
--
-- HOW TO COUNT BEFORE APPLYING
--   This file affects no row. After it is applied, and before anything else:
--     select count(*) as undo_rows from private.profile_name_undo;   -- 0
--
-- HOW TO TAKE IT BACK
--   Only once the undo table is no longer needed (file 2 can no longer be taken
--   back after this), and after file 3 and file 4 have been taken back:
--     drop function if exists private.neutralise_folded_collisions();
--     drop function if exists private.neutralise_leaking_names();
--     drop function if exists private.undo_neutral_handle(uuid);
--     drop function if exists private.give_neutral_handle(uuid, text);
--     drop function if exists private.neutral_handle();
--     drop function if exists private.made_from_google_name(text, jsonb);
--     drop function if exists private.public_name_problem(text, text);
--     drop function if exists private.public_name_leak(text, text);
--     drop function if exists private.compact_name(text);
--     drop table if exists private.profile_name_undo;

create schema if not exists private;

-- ── The recogniser ───────────────────────────────────────────────────────────────────

create or replace function private.public_name_leak(p_name text, p_email text)
returns text
language sql immutable parallel safe
set search_path = pg_catalog, pg_temp
as $$
  with shown as (
    -- shownName's form: NFKC, no invisible or bidi characters, one space, trimmed.
    select btrim(regexp_replace(
             regexp_replace(normalize(coalesce(p_name, ''), nfkc),
               '[\u0001-\u001f\u007f-\u009f­؜᠎​-‏‪-‮⁠-⁯﻿]', '', 'g'),
             '\s+', ' ', 'g')) as v
  ), digits as (
    -- Thai digits read as digits, Thai marks dropped, one separator between two digits joined.
    select regexp_replace(
             regexp_replace(translate(v, '๐๑๒๓๔๕๖๗๘๙', '0123456789'), '[ัิ-ฺ็-๎]', '', 'g'),
             '([0-9])[ ._-](?=[0-9])', '\1', 'g') as joined
    from shown
  ), mail as (
    select case when position('@' in coalesce(p_email, '')) > 1
             then lower(btrim(split_part(p_email, '@', 1))) else '' end as local
  ), stored as (
    -- The local part as handle_new_user turns it into a name.
    select local, left(regexp_replace(local, '[^a-z0-9_]', '', 'g'), 25) as handle from mail
  )
  select case
    when v = '' then null
    when joined ~ '[0-9]{7,}' or joined ~ '^[0-9]{5,}$' then 'student number'
    when local <> '' and lower(v) = local then 'email'
    when handle <> '' and (lower(v) = handle
      or (left(lower(v), char_length(handle) + 1) = handle || '_'
          and substr(lower(v), char_length(handle) + 2) ~ '^([0-9]{1,2}|[0-9a-f]{6})$')) then 'email'
    when v ~* '@|https?:|www\.' then 'address'
    else null
  end
  from shown, digits, stored
$$;

-- ── The rules for a NEW name ─────────────────────────────────────────────────────────
-- checkPublicName (src/lib/public-identity.js) applied to the stored value, which the
-- app sends already normalised. Every refusal here is also a refusal there, so a name
-- the app accepts is never refused by the database. The app refuses a little more
-- (look-alike reserved words such as "adm1n", the auto-made names), which is safe.

create or replace function private.public_name_problem(p_name text, p_email text)
returns text
language sql immutable parallel safe
set search_path = pg_catalog, pg_temp
as $$
  select case
    when p_name is null or p_name = '' then 'empty'
    when char_length(p_name) < 3 or char_length(p_name) > 24 then 'length'
    when p_name ~ '@' or p_name ~* '(^|\.)(com|net|org|ac\.th|co\.th|in\.th)$' or p_name ~* 'www\.|https?:' then 'address'
    when p_name !~ '^[ก-๛A-Za-z0-9_ .-]+$' then 'characters'
    when p_name ~ '^[ ._-]|[ ._-]$|  ' then 'separators'
    when p_name ~ '[0-9๐-๙][ัิ-ฺ็-๎]' then 'mark on a digit'
    when regexp_replace(translate(p_name, '๐๑๒๓๔๕๖๗๘๙', '0123456789'), '[ ._ัิ-ฺ็-๎-]', '', 'g') ~ '[0-9]{5,}' then 'digits'
    when p_name !~ '[ก-ฮA-Za-z]' then 'no letter'
    when position('@' in coalesce(p_email, '')) > 1
      and lower(p_name) = lower(btrim(split_part(p_email, '@', 1))) then 'email'
    when lower(regexp_replace(p_name, '[\s._-]', '', 'g')) in ('mod', 'dev', 'team', 'null', 'undefined') then 'reserved'
    when regexp_replace(p_name, '[\s._-]', '', 'g') ~ '(แอดมิน|ทีมงาน|ผู้ดูแล|เจ้าหน้าที่|อาจารย์)' then 'reserved'
    when lower(p_name) ~ '^(admin|administrator|staff|vetmock|moderator|support|system|official|owner|root)($|[\s._0-9๐-๙-])' then 'reserved'
    else null
  end
$$;

-- ── The folded form (compactName in src/lib/public-identity.js) ──────────────────────
-- NFKC, sara am recomposed (NFKC splits it), invisible characters removed, one space,
-- trimmed, lower case, no separators, and I l 1 | read as l, O 0 read as o.

create or replace function private.compact_name(p_name text)
returns text
language sql immutable parallel safe
set search_path = pg_catalog, pg_temp
as $$
  select translate(
    regexp_replace(
      lower(btrim(regexp_replace(
        regexp_replace(
          regexp_replace(normalize(coalesce(p_name, ''), nfkc), 'ํ([่-๋]?)า', '\1' || chr(3635), 'g'),
          '[\u0001-\u001f\u007f-\u009f­؜᠎​-‏‪-‮⁠-⁯﻿]', '', 'g'),
        '\s+', ' ', 'g'))),
      '[\s._-]', '', 'g'),
    'i1|0', 'lllo')
$$;

-- ── handle_new_user's Google-name handle (madeFromGoogleName in identity-gate.js) ────
-- The ASCII letters, digits and _ of the Google name, at most 25, then _2, _3 or
-- _<6 hex> on a collision. A name the student typed (metadata username) is a choice.

create or replace function private.made_from_google_name(p_name text, p_meta jsonb)
returns boolean
language sql immutable parallel safe
set search_path = pg_catalog, pg_temp
as $$
  select p_name is not null
    and (p_meta ->> 'username') is distinct from p_name
    and exists (
      select 1
      from (values (p_meta ->> 'full_name'), (p_meta ->> 'name')) as s(src),
        lateral (select left(regexp_replace(coalesce(s.src, ''), '[^a-zA-Z0-9_]', '', 'g'), 25) as base) as b
      where b.base <> ''
        and (p_name = b.base
          or (left(p_name, char_length(b.base) + 1) = b.base || '_'
              and substr(p_name, char_length(b.base) + 2) ~ '^([0-9]{1,2}|[0-9a-f]{6})$'))
    )
$$;

-- ── The neutral handle ───────────────────────────────────────────────────────────────
-- user_ and six letters from a to f. The app already reads it as a name nobody chose
-- (isAutoName: /^user(?:_\d{1,2}|_[0-9a-f]{6})?$/i), so Home greets the student as
-- "นิสิต" and the first-run step asks for a name; other members see the handle. No
-- digit in it, so it can never read as a number, and it says nothing about the person.
-- Free both exactly and in the folded form file 4 makes unique.

create or replace function private.neutral_handle()
returns text
language plpgsql volatile
set search_path = pg_catalog, pg_temp
as $$
declare
  candidate text;
begin
  for attempt in 1..100 loop
    candidate := 'user_' || (select string_agg(chr(97 + floor(random() * 6)::int), '') from generate_series(1, 6));
    if not exists (
      select 1 from public.profiles p
      where p.username = candidate or private.compact_name(p.username) = private.compact_name(candidate)
    ) then
      return candidate;
    end if;
  end loop;
  raise exception 'no free neutral handle after 100 tries';
end
$$;

-- ── The undo record ──────────────────────────────────────────────────────────────────

create table if not exists private.profile_name_undo (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  reason text not null check (reason in ('student number', 'email', 'address', 'collision')),
  old_username text not null,
  new_username text not null,
  -- The account's metadata identity_intro_done before the change (null when it had none).
  old_intro_done jsonb,
  changed_at timestamptz not null default now(),
  undone_at timestamptz
);
create index if not exists profile_name_undo_user_idx on private.profile_name_undo (user_id);
alter table private.profile_name_undo enable row level security;
revoke all on table private.profile_name_undo from public, anon, authenticated, service_role;

-- ── One account to the neutral handle ────────────────────────────────────────────────
-- Records the old and new name and the old first-run flag, gives the handle, and takes
-- identity_intro_done out of the account's metadata so the first-run step on Home asks
-- again (App mounts the step only while that flag is absent). Nothing else in the
-- metadata changes. Returns false when the account has no profile row.

create or replace function private.give_neutral_handle(p_user uuid, p_reason text)
returns boolean
language plpgsql volatile
set search_path = pg_catalog, pg_temp
as $$
declare
  old_name text;
  new_name text;
  old_intro jsonb;
begin
  select p.username into old_name from public.profiles p where p.id = p_user for update;
  if not found then
    return false;
  end if;
  select u.raw_user_meta_data -> 'identity_intro_done' into old_intro from auth.users u where u.id = p_user for update;
  new_name := private.neutral_handle();
  insert into private.profile_name_undo (user_id, reason, old_username, new_username, old_intro_done)
    values (p_user, p_reason, old_name, new_name, old_intro);
  update public.profiles set username = new_name where id = p_user;
  update auth.users set raw_user_meta_data = raw_user_meta_data - 'identity_intro_done'
    where id = p_user and raw_user_meta_data ? 'identity_intro_done';
  return true;
end
$$;

-- ── Take one account back ────────────────────────────────────────────────────────────
-- The latest change not yet undone, and only while the account still carries the
-- handle it was given: a name the student chose since is theirs, and stays (false).
-- Puts back the old name and the old first-run flag, and marks the record undone.

create or replace function private.undo_neutral_handle(p_user uuid)
returns boolean
language plpgsql volatile
set search_path = pg_catalog, pg_temp
as $$
declare
  r private.profile_name_undo;
begin
  select * into r from private.profile_name_undo
    where user_id = p_user and undone_at is null
    order by id desc limit 1 for update;
  if not found then
    return false;
  end if;
  update public.profiles set username = r.old_username where id = p_user and username = r.new_username;
  if not found then
    return false;
  end if;
  if r.old_intro_done is not null then
    update auth.users
      set raw_user_meta_data = jsonb_set(coalesce(raw_user_meta_data, '{}'::jsonb), '{identity_intro_done}', r.old_intro_done)
      where id = p_user;
  end if;
  update private.profile_name_undo set undone_at = now() where id = r.id;
  return true;
end
$$;

-- ── The two passes; each returns how many accounts it changed, nothing else ──────────

create or replace function private.neutralise_leaking_names()
returns integer
language plpgsql volatile
set search_path = pg_catalog, pg_temp
as $$
declare
  r record;
  changed integer := 0;
begin
  for r in
    select p.id, private.public_name_leak(p.username, u.email) as reason
    from public.profiles p
    left join auth.users u on u.id = p.id
    where private.public_name_leak(p.username, u.email) is not null
    order by p.created_at nulls last, p.id
  loop
    if private.give_neutral_handle(r.id, r.reason) then
      changed := changed + 1;
    end if;
  end loop;
  return changed;
end
$$;

-- Names that are one name once folded: the oldest account keeps it, each later one
-- gets the neutral handle (reason 'collision'), so file 4's unique index can be built.
create or replace function private.neutralise_folded_collisions()
returns integer
language plpgsql volatile
set search_path = pg_catalog, pg_temp
as $$
declare
  r record;
  changed integer := 0;
begin
  for r in
    select s.id from (
      select p.id, row_number() over (
        partition by private.compact_name(p.username) order by p.created_at nulls last, p.id) as n
      from public.profiles p
    ) s
    where s.n > 1
  loop
    if private.give_neutral_handle(r.id, 'collision') then
      changed := changed + 1;
    end if;
  end loop;
  return changed;
end
$$;

revoke execute on function private.public_name_leak(text, text) from public, anon, authenticated;
revoke execute on function private.public_name_problem(text, text) from public, anon, authenticated;
revoke execute on function private.made_from_google_name(text, jsonb) from public, anon, authenticated;
revoke execute on function private.neutral_handle() from public, anon, authenticated;
revoke execute on function private.give_neutral_handle(uuid, text) from public, anon, authenticated;
revoke execute on function private.undo_neutral_handle(uuid) from public, anon, authenticated;
revoke execute on function private.neutralise_leaking_names() from public, anon, authenticated;
revoke execute on function private.neutralise_folded_collisions() from public, anon, authenticated;
