-- profiles.card_style: the card style a student picks in "ปรับแต่งการ์ด",
-- seen by classmates on a study group's member cards.
--
-- HOW TO TAKE IT BACK (run as one transaction)
--   begin;
--   drop function if exists public.set_card_style(text);
--   drop function if exists public.card_styles(uuid[]);
--   revoke update (card_style) on public.profiles from authenticated;
--   alter table public.profiles drop constraint if exists profiles_card_style_shape;
--   alter table public.profiles drop column if exists card_style;
--   commit;
--   The app keeps working after this: it reads and writes card styles only
--   through the two functions, treats "function not found" as "no card styles
--   yet", shows every classmate the default card, and keeps each student's own
--   style on their device.
--
-- Written 16 Nov 2026 for release 5.286.0. The pull request that adds this
-- file does not apply it: migrations here are applied by hand, after a second
-- reader. Safe to apply with any build from 5.286.0 on, and harmless with an
-- older one (nothing older calls these functions or reads the column).
--
-- WHAT IT DOES
--   1. public.profiles.card_style text, null by default. A check keeps it to
--      the card token's shape (lib/card-style.js): "c1" then dot-separated
--      parts of a lower-case letter and [a-z0-9,-], at most 120 characters.
--      The app parses it strictly again on read.
--   2. card_styles(p_ids uuid[]): (id, card_style) for up to 200 ids, only for
--      a signed-in account behind the Chula wall (chula_access), only rows
--      with a style. SECURITY DEFINER with an empty search_path, like
--      buddy_profiles, so classmates read this one column and no other.
--   3. set_card_style(p_style text) -> boolean: the caller's own row only.
--      SECURITY INVOKER, so the row policy below and the column grant decide.
--   4. Grants: authenticated may update card_style and nothing new besides;
--      execute on both functions for authenticated only (not anon, not
--      PUBLIC). No new select grant on profiles.
--   5. Row policy: profiles_update_own is re-made exactly as live has it
--      (USING and WITH CHECK both "own row"), so the update path the new
--      function relies on is stated here, not assumed.
--
-- WHAT IT NEVER TOUCHES
--   No row's other columns; the name and picture rules (tr_guard_public_identity
--   fires on username and avatar_emoji only); tr_protect_profile_metrics keeps
--   the metric columns as before. No other table, policy or function.
--
-- LOCKS
--   One transaction with lock_timeout 3s. ADD COLUMN with no default and a
--   check that every existing row (all null) passes is a metadata change plus
--   one scan; a timeout fails the whole file cleanly and it can be run again.
--
-- HOW TO COUNT AFTER APPLYING (counts only)
--   select count(*) filter (where card_style is not null) as styled from public.profiles;

begin;
set local lock_timeout = '3s';

alter table public.profiles add column if not exists card_style text;

alter table public.profiles drop constraint if exists profiles_card_style_shape;
alter table public.profiles add constraint profiles_card_style_shape check (
  card_style is null
  or (char_length(card_style) <= 120 and card_style ~ '^c1(\.[a-z][a-z0-9,-]*){0,8}$')
);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

grant update (card_style) on public.profiles to authenticated;

create or replace function public.card_styles(p_ids uuid[])
returns table(id uuid, card_style text)
language sql stable security definer set search_path = '' as $$
  select p.id, p.card_style
  from public.profiles p
  where p.id = any (p_ids[1:200])
    and p.card_style is not null
    and (select auth.uid()) is not null
    and (select public.chula_access());
$$;
revoke all on function public.card_styles(uuid[]) from public, anon;
grant execute on function public.card_styles(uuid[]) to authenticated;

create or replace function public.set_card_style(p_style text)
returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  changed int;
begin
  if me is null then
    return false;
  end if;
  update public.profiles set card_style = nullif(p_style, 'c1') where id = me;
  get diagnostics changed = row_count;
  return changed = 1;
end;
$$;
revoke all on function public.set_card_style(text) from public, anon;
grant execute on function public.set_card_style(text) to authenticated;

commit;
