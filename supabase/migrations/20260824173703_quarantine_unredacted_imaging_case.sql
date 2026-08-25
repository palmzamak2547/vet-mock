-- Emergency privacy containment for the public Imaging Practical.
-- Read-only scan on 2026-08-25 found one two-view case whose legacy files
-- still contained OtherPatientIDs, OtherPatientNames, telephone, and a
-- ResponsiblePerson value. Preserve the rows/files for controlled recovery,
-- but remove the case from public delivery immediately.
update public.imaging_cases
set status = 'private', updated_at = now()
where id = '6794f8d6-11f9-4128-a406-0cef17d9e4cc'
  and status = 'public';

-- RLS limits rows, not columns. Public clients need descriptive teaching
-- fields, never reference_findings, consent audit state, or creator UUIDs.
revoke select on table public.imaging_cases from anon, authenticated;
grant select (
  id,
  slug,
  title,
  species,
  signalment,
  history,
  body_part,
  modality,
  learning_objectives,
  difficulty,
  status,
  created_at,
  updated_at,
  license,
  source_url,
  attribution,
  credibility
)
  on table public.imaging_cases to anon, authenticated;

-- The previous Storage policies checked only bucket_id, so knowing/listing a
-- path was enough to sign even a draft/private object. Authorize an object only
-- while its exact path belongs to a public case.
drop policy if exists "lab-dicom read for anon (public cases only)"
  on storage.objects;
drop policy if exists "lab-dicom read for authed users"
  on storage.objects;
drop policy if exists "lab-dicom read for public cases only"
  on storage.objects;

create policy "lab-dicom read for public cases only"
  on storage.objects
  for select
  to anon, authenticated
  using (
    bucket_id = 'lab-dicom'
    and exists (
      select 1
      from public.imaging_case_files as f
      join public.imaging_cases as c on c.id = f.case_id
      where f.storage_path = storage.objects.name
        and c.status = 'public'
    )
  );

create index if not exists imaging_case_files_storage_path_idx
  on public.imaging_case_files (storage_path);
