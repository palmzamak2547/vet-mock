-- One public name per student, compared the way the app compares them.
--
-- Written 15 Nov 2026 for release 5.228.0 (docs/releases/5.228.0.md, "Database
-- steps, final", step 4 of 4). The pull request that adds this file does not
-- apply it: migrations here are applied by hand, after a second reader. Needs
-- file 1 (20261115140000_profile_name_rules.sql).
--
-- SEND EACH STATEMENT ON ITS OWN, OUTSIDE A TRANSACTION. CREATE INDEX
-- CONCURRENTLY cannot run inside one, and several statements sent together
-- run as one. In the SQL editor run the CREATE alone, then the check alone;
-- psql -f without --single-transaction sends them one by one. It builds the
-- index without blocking reads or writes. A second run after a good one stops
-- at "already exists", on purpose.
--
-- WHAT IT DOES
--   A unique index on private.compact_name(username): the folded form the app
--   already uses to call a name taken or alike (compactName in
--   src/lib/public-identity.js: NFKC, sara am recomposed, invisible characters
--   removed, no case, no separators, I l 1 | read as l, O 0 read as o). So
--   "Ploy", "ploy", "P.loy" and "PIoy" become one name. The exact unique index
--   on username stays. The last statement raises unless the index exists and
--   pg_index says it is valid and ready.
--
-- WHICH LIVE CLIENT CALLS MEET IT
--   saveIdentity (src/lib/identity-write.js), profiles.update of username: a
--   name alike in this form to another member's is now refused with 23505,
--   which the app already says as "ชื่อนี้มีคนใช้แล้ว ลองชื่ออื่น". The app's
--   own check (isPublicNameFree) already warns about such a name before
--   saving. Inserts from handle_new_user and ensure_profile never meet it
--   once file 3 is applied: its insert trigger gives the neutral handle to a
--   new row whose name is taken in this form. Apply file 3 first. No function
--   the app calls is changed.
--   Postgres checks EXECUTE on an index expression for whoever writes the row;
--   file 1 grants private.compact_name to authenticated and service_role by
--   name, so this does not rest on the schema's default privileges.
--
-- WHAT IT NEVER TOUCHES
--   No row is changed or deleted by this file. If two rows are already one
--   name in the folded form, the build fails; nothing else happens.
--
-- HOW TO COUNT BEFORE APPLYING (counts only)
--   select count(*) as folded_groups, coalesce(sum(n), 0) as rows_in_groups
--   from (select count(*) as n from public.profiles
--         group by private.compact_name(username) having count(*) > 1) s;
--
--   When it is not 0, choose before building. To keep the name for the oldest
--   account in each group and give every later one the neutral handle (with an
--   undo record, reason 'collision', and the first-run step asking again):
--     select private.neutralise_folded_collisions() as accounts_changed;
--   then count again: 0. To undo one of those accounts:
--     select private.undo_neutral_handle('<user id>');
--   (it fails while this index stands, since the old name would collide again).
--
-- IF THE BUILD FAILS OR THE CHECK RAISES
--   A failed CONCURRENTLY build (for example a colliding rename landing
--   between the count and the build) leaves an INVALID index that still
--   refuses some writes. Recover in three steps:
--     1. drop index concurrently if exists public.profiles_username_folded_key;
--     2. run the collision count above again, and the pass if it is not 0;
--     3. run this file again, each statement on its own.
--
-- HOW TO TAKE IT BACK
--   drop index concurrently if exists public.profiles_username_folded_key;

create unique index concurrently profiles_username_folded_key
  on public.profiles (private.compact_name(username));

do $$
begin
  if not exists (
    select 1 from pg_index i
    where i.indexrelid = to_regclass('public.profiles_username_folded_key')
      and i.indisvalid and i.indisready
  ) then
    raise exception 'profiles_username_folded_key is missing, invalid or not ready: drop it concurrently, count the collisions again, and run this file again';
  end if;
end
$$;
