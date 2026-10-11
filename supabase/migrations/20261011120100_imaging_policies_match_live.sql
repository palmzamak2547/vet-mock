-- Imaging policies: make this repo say what production already enforces.
--
-- Production carries two migrations this repo never received,
-- 20260829044015 perf_one_policy_per_role_action and
-- 20260830044346 imaging_cases_students_cannot_self_publish. Together they
-- split the original "imaging_cases owner all" (20260513000000) into one
-- policy per action and stopped a signed-in student from inserting or
-- updating a case into status 'public'. A database rebuilt from this repo
-- would have come back with the looser "owner all" policy.
--
-- Every policy below is the live pg_policies text of project
-- mpovsdzdggvksmeehqfj, read on 2026-10-11 (read-only), rewritten as DDL.
-- Applying it to production therefore changes nothing: the policy digest
-- recorded in work/polish-1011/round2/H.md must be identical before and
-- after (6 rows, cdba5c0abf14b27db16a614ecf5b251f).
--
-- The lab-dicom storage policy is not repeated here: the repo copy in
-- 20260824180000 already matches the live text.

-- imaging_cases: the repo names (dropped if a rebuild created them) and the
-- live names (dropped so the create below is the only definition).
drop policy if exists "imaging_cases public read" on public.imaging_cases;
drop policy if exists "imaging_cases owner all" on public.imaging_cases;
drop policy if exists "imaging_cases read" on public.imaging_cases;
drop policy if exists "imaging_cases owner insert" on public.imaging_cases;
drop policy if exists "imaging_cases owner update" on public.imaging_cases;
drop policy if exists "imaging_cases owner delete" on public.imaging_cases;

create policy "imaging_cases read" on public.imaging_cases
  for select
  using (status = 'public' or (select auth.uid()) = created_by);

create policy "imaging_cases owner insert" on public.imaging_cases
  for insert to authenticated
  with check ((select auth.uid()) = created_by and coalesce(status, 'draft') <> 'public');

create policy "imaging_cases owner update" on public.imaging_cases
  for update to authenticated
  using ((select auth.uid()) = created_by)
  with check ((select auth.uid()) = created_by and coalesce(status, 'draft') <> 'public');

create policy "imaging_cases owner delete" on public.imaging_cases
  for delete to authenticated
  using ((select auth.uid()) = created_by);

-- imaging_case_files: same rule as the repo, same text as live.
drop policy if exists "imaging_case_files public read" on public.imaging_case_files;
create policy "imaging_case_files public read" on public.imaging_case_files
  for select
  using (case_id in (select id from public.imaging_cases where status = 'public'));

-- imaging_attempts: same rule as the repo; live wraps auth.uid() in a
-- subselect so the planner evaluates it once per statement.
drop policy if exists "imaging_attempts own all" on public.imaging_attempts;
create policy "imaging_attempts own all" on public.imaging_attempts
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
