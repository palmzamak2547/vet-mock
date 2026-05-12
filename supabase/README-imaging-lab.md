# Imaging Practice Lab — Supabase setup

Phase 5 lays the schema for `/lab` cases. Apply once; subsequent phases (VHS, case library UI) read from these tables.

## Apply the migration

Option 1 — Supabase Studio (web UI):
1. Open the project's SQL editor
2. Paste the contents of `migrations/20260513000000_imaging_lab_init.sql`
3. Run

Option 2 — Supabase CLI:
```
supabase migration up
```

## Storage bucket

The migration only creates tables. You also need a private storage bucket for DICOM files:

1. Studio → Storage → New bucket → name `lab-dicom`, **Public access OFF**
2. Optional: add a bucket policy that lets `authenticated` read paths under a folder per case:
```sql
create policy "lab-dicom read for authed users"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'lab-dicom');
```

## Tables created

| table | rows-per | what it holds |
|---|---|---|
| `imaging_cases` | case | metadata (title, species, history, learning objectives, status: draft/public/private, consent flag) |
| `imaging_case_files` | view | one row per DICOM file (VD, lateral, etc.) — pointer into `lab-dicom` storage |
| `imaging_attempts` | session | user practice records (which tool, points, computed angle, classification) |

## RLS

- `imaging_cases` — `status = 'public'` is readable by anon + authed. Authors can also read/write their own drafts.
- `imaging_case_files` — readable when the parent case is `public`.
- `imaging_attempts` — owner-only (read + write own attempts).

## Privacy checklist before publishing a case

⚠️ Real patient DICOM has identifying info. Before flipping a case to `status = 'public'`:

1. Run a DICOM anonymizer (e.g. dcm-anonymize, or Python pydicom script) on the file
2. Strip these tags: PatientName, PatientID, InstitutionName, StationName, AccessionNumber, ReferringPhysicianName, DeviceSerialNumber, OperatorsName, PerformingPhysicianName
3. Get owner consent and set `consent_documented = true` on the case row
4. Only then flip `status` to `'public'`

The schema **does not enforce** consent — it's an operational discipline.

## Rolling back

```sql
drop table if exists public.imaging_attempts;
drop table if exists public.imaging_case_files;
drop table if exists public.imaging_cases;
drop function if exists public.touch_updated_at;
```

(The function is generic and may be used by other tables; only drop if unused.)
