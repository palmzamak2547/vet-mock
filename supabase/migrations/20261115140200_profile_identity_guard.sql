-- The name and picture rules at the database boundary, and no new public name made
-- from a mail address or a Google name.
--
-- Written 15 Nov 2026 for release 5.228.0 (docs/releases/5.228.0.md, "Database
-- steps, final", step 3 of 4). The pull request that adds this file does not
-- apply it: migrations here are applied by hand, after a second reader. Needs
-- file 1 (20261115140000_profile_name_rules.sql). Apply only while production
-- runs 5.228.0 or later: older builds proposed names this file refuses.
--
-- WHAT IT DOES
--   1. tr_guard_public_identity, BEFORE UPDATE OF username, avatar_emoji on
--      public.profiles: a request from the app (a member's token) that changes
--      the name gets private.public_name_problem's verdict, and a refusal
--      raises SQLSTATE 23514 with the message "public name refused: <reason>"
--      (reasons: empty, length, address, characters, separators, mark on a
--      digit, digits, no letter, email, reserved). A picture outside the app's
--      16 is refused with "public picture refused", also 23514. A value that
--      does not change is not checked, so a student whose old name breaks a
--      rule can still change the picture alone. The database's own sessions
--      (no request claims: the SQL editor, the auth trigger) and the service
--      role keep their own paths, as tr_protect_profile_metrics does.
--   2. tr_neutral_name_on_insert, BEFORE INSERT on public.profiles: a new row
--      whose name is a student number, the account's mail local part, an
--      address, handle_new_user's handle of the Google name, or a name another
--      member already holds in the folded form (file 4) gets the neutral
--      handle instead (private.neutral_handle). A name the student typed at
--      signup (metadata username) that is none of these is kept. This
--      covers both ways a row is made, handle_new_user and the ensure_profile
--      RPC, without rewriting either (neither is defined in this repository,
--      so their live bodies stay as they are). Thai Google names still arrive
--      as user, user_2 and so on, which the app already reads as not chosen.
--   3. profiles_update_own written out with WITH CHECK beside USING. The same
--      rule as before (own row only), so no request changes its outcome.
--
-- WHICH LIVE CLIENT CALLS MEET IT
--   - saveIdentity (src/lib/identity-write.js): profiles.update of username
--     and avatar_emoji. The app checks the same rules first (checkPublicName,
--     the picture set) and every refusal here is also one there, so a save the
--     app allows is never refused here. If one were, the app says it beside the
--     name box (identityWriteError: 23514 naming "length" reads as the length
--     rule, any other 23514 as "ชื่อหรือรูปนี้ใช้ไม่ได้").
--   - ensure_profile (called by saveIdentity and lib/api.js before group
--     work) and handle_new_user (sign-up): inserts, which now get the neutral
--     handle when the name would leak. Nothing in the app reads the name it
--     expected them to make.
--   No function the app calls is changed.
--
-- WHAT IT NEVER TOUCHES
--   No row is changed by applying it; rows already there are not checked
--   (a name that breaks a rule stays until its student renames). No grant, no
--   other policy, no other trigger.
--
-- HOW TO COUNT BEFORE APPLYING (counts only)
--   The rows this file changes when applied: 0. Rows whose present name or
--   picture a rename would no longer accept (they stay as they are):
--   select count(*) filter (where private.public_name_problem(p.username, u.email) is not null) as names_outside_rules,
--          count(*) filter (where p.avatar_emoji is not null and p.avatar_emoji <> all (array[
--            '🐾','🐶','🐱','🐰','🐹','🐴','🐮','🐷','🐑','🐐','🐔','🦆','🐢','🐠','🦜','🐍'])) as pictures_outside_set
--   from public.profiles p left join auth.users u on u.id = p.id;
--
-- HOW TO TAKE IT BACK
--   drop trigger if exists tr_guard_public_identity on public.profiles;
--   drop trigger if exists tr_neutral_name_on_insert on public.profiles;
--   drop function if exists private.guard_public_identity();
--   drop function if exists private.neutral_name_on_insert();
--   The policy is the same rule as before and can stay.

create or replace function private.guard_public_identity()
returns trigger
language plpgsql security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  claims text := coalesce(current_setting('request.jwt.claims', true), '');
  problem text;
begin
  -- Two steps, not one OR: '' is not JSON, and SQL does not promise to test the left side first.
  if claims = '' then
    return new;
  end if;
  if claims::jsonb ->> 'role' = 'service_role' then
    return new;
  end if;
  if new.username is distinct from old.username then
    problem := private.public_name_problem(new.username, (select u.email from auth.users u where u.id = new.id));
    if problem is not null then
      raise exception 'public name refused: %', problem using errcode = '23514';
    end if;
  end if;
  if new.avatar_emoji is distinct from old.avatar_emoji and new.avatar_emoji is not null
     and new.avatar_emoji <> all (array['🐾','🐶','🐱','🐰','🐹','🐴','🐮','🐷','🐑','🐐','🐔','🦆','🐢','🐠','🦜','🐍']) then
    raise exception 'public picture refused' using errcode = '23514';
  end if;
  return new;
end
$$;

create or replace function private.neutral_name_on_insert()
returns trigger
language plpgsql security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  account_email text;
  meta jsonb;
begin
  select u.email, coalesce(u.raw_user_meta_data, '{}'::jsonb) into account_email, meta
    from auth.users u where u.id = new.id;
  if new.username is null
     or private.public_name_leak(new.username, account_email) is not null
     or private.made_from_google_name(new.username, coalesce(meta, '{}'::jsonb))
     or exists (select 1 from public.profiles p
                where p.id <> new.id and private.compact_name(p.username) = private.compact_name(new.username)) then
    new.username := private.neutral_handle();
  end if;
  return new;
end
$$;

revoke execute on function private.guard_public_identity() from public, anon, authenticated;
revoke execute on function private.neutral_name_on_insert() from public, anon, authenticated;

drop trigger if exists tr_guard_public_identity on public.profiles;
create trigger tr_guard_public_identity
  before update of username, avatar_emoji on public.profiles
  for each row execute function private.guard_public_identity();

drop trigger if exists tr_neutral_name_on_insert on public.profiles;
create trigger tr_neutral_name_on_insert
  before insert on public.profiles
  for each row execute function private.neutral_name_on_insert();

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
