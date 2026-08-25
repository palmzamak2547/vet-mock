-- Backward-compatible containment while production still runs the legacy
-- two-request create/join client. The paired frontend release will remove
-- these direct policies entirely and use create_study_group/join_study_group.

drop policy if exists "groups_select_by_code" on public.groups;
create policy "groups_select_by_code"
  on public.groups
  for select
  to authenticated
  using (true);

revoke select on table public.groups from anon;
grant select on table public.groups to authenticated;

drop policy if exists "members_insert_self" on public.group_members;
create policy "members_insert_self"
  on public.group_members
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and (
      role = 'member'
      or (
        role = 'admin'
        and exists (
          select 1
          from public.groups as g
          where g.id = group_id
            and g.created_by = (select auth.uid())
        )
      )
    )
  );

revoke insert on table public.group_members from anon;
grant insert on table public.group_members to authenticated;
