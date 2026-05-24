-- Palm bug 2026-05-24: LeaderboardView fails with
-- "Could not find a relationship between 'exam_results' and 'profiles'
-- in the schema cache".
--
-- Root cause: src/lib/api.js getLeaderboard() runs
--   .from('exam_results')
--   .select('... profiles(username, avatar_emoji)')
-- PostgREST needs a FK on exam_results.user_id pointing at
-- public.profiles(id) to resolve that embed. The existing FK pointed
-- at auth.users(id) — PostgREST doesn't auto-bridge across schemas.
--
-- Pre-flight audit:
--   • 224 total exam_results · 0 NULL user_id · 91 orphan rows
--   • 91 orphans = 11 distinct users · all 11 EXIST in auth.users
--     but lacked profiles rows (trigger missed them at signup)
--
-- Plan:
--   1. Backfill 11 missing profiles from auth.users (email local-part
--      + id suffix for unique username)
--   2. Add FK exam_results.user_id → profiles.id (distinct constraint
--      name from the existing auth.users FK; both coexist)
--   3. NOTIFY pgrst to reload the schema cache
--
-- Applied via mcp__supabase apply_migration on 2026-05-24, name
-- "leaderboard_fk_to_profiles_with_backfill". This file is the
-- canonical record for local devs running `supabase db reset`.

-- Step 1: backfill missing profiles
INSERT INTO public.profiles (id, username, avatar_emoji)
SELECT
  u.id,
  COALESCE(
    NULLIF(split_part(u.email, '@', 1), ''),
    'user'
  ) || '_' || substring(u.id::text, 1, 6) AS username,
  '🐾' AS avatar_emoji
FROM auth.users u
WHERE EXISTS (
    SELECT 1 FROM public.exam_results er
     WHERE er.user_id = u.id
       AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = er.user_id)
  )
ON CONFLICT (id) DO NOTHING;

-- Step 2: add the FK that PostgREST will use for embed resolution.
-- ON DELETE SET NULL so profile deletion doesn't cascade-wipe history.
ALTER TABLE public.exam_results
  ADD CONSTRAINT exam_results_user_id_profiles_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

-- Step 3: nudge PostgREST cache so the new relationship is picked up
NOTIFY pgrst, 'reload schema';
