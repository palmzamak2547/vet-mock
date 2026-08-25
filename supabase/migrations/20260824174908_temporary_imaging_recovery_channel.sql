-- One-time, header-gated channel for recovering the two quarantined Coffee
-- DICOM objects without exposing them publicly or extracting service-role
-- credentials. The follow-up migration drops both policies.

drop policy if exists "lab-dicom one-time recovery read" on storage.objects;
drop policy if exists "lab-dicom one-time recovery upload" on storage.objects;

create policy "lab-dicom one-time recovery read"
  on storage.objects
  for select
  to anon
  using (
    bucket_id = 'lab-dicom'
    and name in (
      'coffee/VD.dcm',
      'coffee/Lateral.dcm',
      'sanitized/coffee/VD.dcm',
      'sanitized/coffee/Lateral.dcm'
    )
    and encode(
      extensions.digest(
        coalesce(
          coalesce(current_setting('request.headers', true), '{}')::jsonb
            ->> 'x-vetmock-recovery',
          ''
        ),
        'sha256'
      ),
      'hex'
    ) = '9b3dc47b84a326a44c7c625ebd602c20f2df5cdb1cb6f380d6705872a2f4e6f5'
  );

create policy "lab-dicom one-time recovery upload"
  on storage.objects
  for insert
  to anon
  with check (
    bucket_id = 'lab-dicom'
    and name in (
      'sanitized/coffee/VD.dcm',
      'sanitized/coffee/Lateral.dcm'
    )
    and encode(
      extensions.digest(
        coalesce(
          coalesce(current_setting('request.headers', true), '{}')::jsonb
            ->> 'x-vetmock-recovery',
          ''
        ),
        'sha256'
      ),
      'hex'
    ) = '9b3dc47b84a326a44c7c625ebd602c20f2df5cdb1cb6f380d6705872a2f4e6f5'
  );
