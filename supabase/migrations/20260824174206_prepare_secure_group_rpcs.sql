-- Backward-compatible preparation for secure group create/join.
-- The current direct policies remain until the paired frontend release starts
-- using these RPCs; this migration only adds the safe path and moves recursive
-- membership checks out of the exposed public RPC schema.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table if not exists private.group_join_rate_limits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  window_started_at timestamptz not null,
  attempts integer not null check (attempts > 0)
);
revoke all on table private.group_join_rate_limits from public, anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'group_members_role_check'
      and conrelid = 'public.group_members'::regclass
  ) then
    alter table public.group_members
      add constraint group_members_role_check
      check (role in ('admin', 'member'));
  end if;
end
$$;

create or replace function public.create_study_group(group_name text)
returns public.groups
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  clean_name text := btrim(group_name);
  invite_code text;
  created_group public.groups%rowtype;
  random_bytes bytea;
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  attempt integer;
begin
  if caller_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;
  if clean_name is null or char_length(clean_name) < 1 or char_length(clean_name) > 60 then
    raise exception 'INVALID_GROUP_NAME' using errcode = '22023';
  end if;

  for attempt in 1..20 loop
    random_bytes := extensions.gen_random_bytes(6);
    select string_agg(
      substr(alphabet, (get_byte(random_bytes, n) % char_length(alphabet)) + 1, 1),
      '' order by n
    )
    into invite_code
    from generate_series(0, 5) as n;

    begin
      insert into public.groups (name, code, created_by)
      values (clean_name, invite_code, caller_id)
      returning * into created_group;
      exit;
    exception
      when unique_violation then created_group := null;
    end;
  end loop;

  if created_group.id is null then
    raise exception 'GROUP_CODE_GENERATION_FAILED' using errcode = '55000';
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (created_group.id, caller_id, 'admin');
  return created_group;
end;
$$;

create or replace function public.join_study_group(invite_code text)
returns public.groups
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
  clean_code text := upper(btrim(invite_code));
  matched_group public.groups%rowtype;
  attempt_count integer;
begin
  if caller_id is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = '42501';
  end if;
  if clean_code is null or clean_code !~ '^[A-HJ-NP-Z2-9]{6}$' then
    raise exception 'INVALID_GROUP_CODE' using errcode = '22023';
  end if;

  insert into private.group_join_rate_limits (user_id, window_started_at, attempts)
  values (caller_id, now(), 1)
  on conflict (user_id) do update
  set
    window_started_at = case
      when private.group_join_rate_limits.window_started_at <= now() - interval '10 minutes'
        then now()
      else private.group_join_rate_limits.window_started_at
    end,
    attempts = case
      when private.group_join_rate_limits.window_started_at <= now() - interval '10 minutes'
        then 1
      else private.group_join_rate_limits.attempts + 1
    end
  returning attempts into attempt_count;

  if attempt_count > 20 then
    raise exception 'GROUP_JOIN_RATE_LIMIT' using errcode = 'P0001';
  end if;

  select g.* into matched_group
  from public.groups as g
  where g.code = clean_code;
  if matched_group.id is null then
    raise exception 'GROUP_NOT_FOUND' using errcode = 'P0002';
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (matched_group.id, caller_id, 'member')
  on conflict (group_id, user_id) do nothing;
  return matched_group;
end;
$$;

revoke all on function public.create_study_group(text) from public, anon;
revoke all on function public.join_study_group(text) from public, anon;
grant execute on function public.create_study_group(text) to authenticated, service_role;
grant execute on function public.join_study_group(text) to authenticated, service_role;

create or replace function private.is_current_user_group_member(group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null
    and exists (
      select 1 from public.group_members as gm
      where gm.group_id = $1 and gm.user_id = auth.uid()
    );
$$;

revoke all on function private.is_current_user_group_member(uuid) from public, anon;
grant execute on function private.is_current_user_group_member(uuid) to authenticated;

drop policy if exists "groups_select_members" on public.groups;
create policy "groups_select_members" on public.groups
  for select to authenticated
  using (
    created_by = (select auth.uid())
    or private.is_current_user_group_member(id)
  );

drop policy if exists "members_select_same_group" on public.group_members;
create policy "members_select_same_group" on public.group_members
  for select to authenticated
  using (private.is_current_user_group_member(group_id));

drop policy if exists "results_select_own_or_group" on public.exam_results;
create policy "results_select_own_or_group" on public.exam_results
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or (group_id is not null and private.is_current_user_group_member(group_id))
  );

drop policy if exists "sq_select_group_members" on public.shared_questions;
create policy "sq_select_group_members" on public.shared_questions
  for select to authenticated
  using (private.is_current_user_group_member(group_id));

drop policy if exists "sq_insert_member" on public.shared_questions;
create policy "sq_insert_member" on public.shared_questions
  for insert to authenticated
  with check (
    author_id = (select auth.uid())
    and private.is_current_user_group_member(group_id)
  );

revoke all on function public.is_group_member(uuid, uuid)
  from public, anon, authenticated;
