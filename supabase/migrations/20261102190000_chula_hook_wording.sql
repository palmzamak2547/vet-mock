-- The before-user-created hook says why it refused (docs/CHULA-SIGNIN.md).
--
-- A Chula address arriving by any provider but Google (a password sign-up, say)
-- was told "บัญชีนี้ไม่ใช่อีเมลจุฬา", which is false for that address and left the
-- student no way forward. It is now told to use the Google button. The rule is
-- unchanged from 20261101170000_chula_wall.sql: wall on or off, a Chula address
-- arrives only through Google; while the wall is on, only Google with a Chula
-- address creates an account.
create or replace function public.hook_before_user_created(event jsonb) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  provider text := coalesce(event->'user'->'app_metadata'->>'provider', '');
  chula boolean := public.is_chula_email(event->'user'->>'email');
begin
  if chula and provider <> 'google' then
    return jsonb_build_object('error', jsonb_build_object(
      'http_code', 403,
      'message', 'อีเมลจุฬาเข้าสู่ระบบได้ด้วยปุ่ม Google เท่านั้น กดปุ่ม Google แล้วเลือกอีเมลจุฬาของคุณ'));
  end if;
  if chula or not public.chula_wall_enforced() then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'บัญชีนี้ไม่ใช่อีเมลจุฬา ใช้บัญชี Google ของ @student.chula.ac.th หรือ @chula.ac.th'));
end
$$;

revoke execute on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'supabase_auth_admin') then
    execute 'grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin';
  end if;
end
$$;
