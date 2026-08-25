-- Publish the verified sanitized copies while preserving the inaccessible
-- originals for rollback. Both path changes and the public status flip commit
-- atomically, so the public Storage policy never points at a half-migrated case.
update public.imaging_case_files
set storage_path = case storage_path
  when 'coffee/VD.dcm' then 'sanitized/coffee/VD.dcm'
  when 'coffee/Lateral.dcm' then 'sanitized/coffee/Lateral.dcm'
  else storage_path
end
where case_id = '6794f8d6-11f9-4128-a406-0cef17d9e4cc'
  and storage_path in ('coffee/VD.dcm', 'coffee/Lateral.dcm');

update public.imaging_cases
set
  status = 'public',
  attribution = 'CUVET teaching case · anonymized via in-app (expanded identifier set, 2026-08-25) · consent on file',
  updated_at = now()
where id = '6794f8d6-11f9-4128-a406-0cef17d9e4cc'
  and consent_documented is true;

-- Close the one-time channel regardless of whether this migration is replayed
-- against a fresh database with no Coffee case rows.
drop policy if exists "lab-dicom one-time recovery read" on storage.objects;
drop policy if exists "lab-dicom one-time recovery upload" on storage.objects;
