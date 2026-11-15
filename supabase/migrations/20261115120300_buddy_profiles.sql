-- buddy_profiles: the names on "เพื่อนร่วมรุ่นที่ออนไลน์" come from the
-- server's profile of each account, never from what a phone sends.
--
-- What it closes. The study-buddies presence channel carried each student's
-- username and avatar inside their own presence payload. Presence is written
-- by the client, so anyone signed in could publish any name and emoji, a
-- classmate's included, and Home showed it as that person being online.
-- From this release the app sends no name at all (useStudyBuddies.js): the
-- payload holds subject, view, question and join time, under a key that is
-- 'b-' and the first 16 hex digits of sha256('vet-mock-buddies:' || user id).
-- This function turns such keys back into the profile name and emoji of the
-- account behind each one.
--
-- Who is named: only accounts that have not turned off being shown online
-- (user_metadata.show_online) nor the leaderboard (show_on_leaderboard);
-- anyone else is left out and the panel counts them without a name. Only a
-- signed-in account behind the Chula wall may ask, at most 200 keys a call.
-- A copied key can only ever show its real owner's profile name.
--
-- Client first: the app already calls buddy_profiles and treats an error as
-- "no names". Until this is applied, the online panel shows how many
-- classmates are on each subject and no names.
--
-- Undo: DROP FUNCTION public.buddy_profiles(text[]);
-- (the panel goes back to counts without names).

CREATE OR REPLACE FUNCTION public.buddy_profiles(p_keys text[])
RETURNS TABLE(key text, username text, avatar_emoji text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  WITH wanted AS (
    SELECT DISTINCT k FROM unnest(p_keys[1:200]) AS k
    WHERE k ~ '^b-[0-9a-f]{16}$'
  ), keyed AS (
    SELECT 'b-' || left(encode(extensions.digest('vet-mock-buddies:' || p.id::text, 'sha256'), 'hex'), 16) AS key,
      p.username, p.avatar_emoji
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE lower(btrim(COALESCE(u.raw_user_meta_data->>'show_online', 'true'))) IN ('true', 't', 'yes', 'y', 'on', '1')
      AND lower(btrim(COALESCE(u.raw_user_meta_data->>'show_on_leaderboard', 'true'))) IN ('true', 't', 'yes', 'y', 'on', '1')
  )
  SELECT keyed.key, keyed.username, keyed.avatar_emoji
  FROM keyed JOIN wanted ON wanted.k = keyed.key
  WHERE (SELECT auth.uid()) IS NOT NULL AND (SELECT public.chula_access());
$$;
REVOKE ALL ON FUNCTION public.buddy_profiles(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.buddy_profiles(text[]) TO authenticated;
