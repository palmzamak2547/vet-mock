-- Anonymous visitors need the public directory fields for username checks and
-- public attribution, never study totals/streak/last-study timestamps.
revoke select on table public.profiles from anon;
grant select (id, username, avatar_emoji, created_at)
  on table public.profiles to anon;
