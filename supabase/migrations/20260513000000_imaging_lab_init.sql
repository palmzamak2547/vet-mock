-- Imaging Practice Lab — Phase 5 schema init
--
-- Three tables isolated under the imaging_* prefix so they can be
-- dropped or spun out to a separate project later without affecting
-- the rest of VetMock's schema.
--
-- Apply via:
--   supabase migration up                         (CLI)
-- or paste this file into Supabase Studio → SQL editor and run.
--
-- Storage: a private bucket named "lab-dicom" should be created
-- separately (Studio → Storage → New bucket). Files are uploaded
-- there and case rows reference them via storage_path.

-- ─────────────────────────────────────────────────────────
-- imaging_cases
-- ─────────────────────────────────────────────────────────
create table if not exists public.imaging_cases (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  species text,                    -- e.g. 'canine', 'feline', 'avian'
  signalment text,                 -- free-form: 'MN 5y, 12 kg'
  history text,
  body_part text,                  -- 'whole body', 'thorax', 'pelvis', etc.
  modality text default 'DX',      -- DICOM Modality (DX, CT, US, MR…)
  learning_objectives text[],      -- bulleted goals shown to the learner
  difficulty text default 'medium' check (difficulty in ('intro', 'medium', 'advanced')),
  status text default 'draft' check (status in ('draft', 'public', 'private')),
  reference_findings text,         -- expected normal/abnormal callouts (kept private)
  consent_documented boolean default false,  -- consent on file for public sharing
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists imaging_cases_status_idx on public.imaging_cases(status);
create index if not exists imaging_cases_slug_idx on public.imaging_cases(slug);

-- ─────────────────────────────────────────────────────────
-- imaging_case_files — one row per DICOM file (a case can have
-- multiple views: VD + Lat + obliques, etc.)
-- ─────────────────────────────────────────────────────────
create table if not exists public.imaging_case_files (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.imaging_cases(id) on delete cascade,
  view_name text not null,         -- 'VD', 'Lateral', 'Oblique', 'Pre-contrast', etc.
  storage_path text not null,      -- path inside 'lab-dicom' bucket
  transfer_syntax text,            -- DICOM TS UID
  pixel_spacing_mm numeric,        -- from PixelSpacing tag
  rows int,
  columns int,
  byte_size bigint,
  display_order int default 0,     -- order in case viewer
  created_at timestamptz default now()
);

create index if not exists imaging_case_files_case_id_idx on public.imaging_case_files(case_id);

-- ─────────────────────────────────────────────────────────
-- imaging_attempts — user practice records. One row per
-- measurement session per case per tool.
-- ─────────────────────────────────────────────────────────
create table if not exists public.imaging_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  case_id uuid references public.imaging_cases(id) on delete set null,
  tool text not null check (tool in ('norberg', 'length', 'angle', 'vhs', 'free')),
  measurement_json jsonb,          -- raw points + computed values
  numeric_result numeric,          -- primary scalar (e.g. left Norberg angle)
  secondary_result numeric,        -- e.g. right Norberg angle
  classification text,             -- 'Normal' / 'Borderline' / 'Dysplastic' / etc.
  notes text,
  created_at timestamptz default now()
);

create index if not exists imaging_attempts_user_id_idx on public.imaging_attempts(user_id);
create index if not exists imaging_attempts_case_id_idx on public.imaging_attempts(case_id);

-- ─────────────────────────────────────────────────────────
-- RLS — public cases readable by anyone, attempts private
-- ─────────────────────────────────────────────────────────
alter table public.imaging_cases enable row level security;
alter table public.imaging_case_files enable row level security;
alter table public.imaging_attempts enable row level security;

drop policy if exists "imaging_cases public read" on public.imaging_cases;
create policy "imaging_cases public read"
  on public.imaging_cases for select
  using (status = 'public');

drop policy if exists "imaging_cases owner all" on public.imaging_cases;
create policy "imaging_cases owner all"
  on public.imaging_cases for all
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

drop policy if exists "imaging_case_files public read" on public.imaging_case_files;
create policy "imaging_case_files public read"
  on public.imaging_case_files for select
  using (
    case_id in (select id from public.imaging_cases where status = 'public')
  );

drop policy if exists "imaging_attempts own all" on public.imaging_attempts;
create policy "imaging_attempts own all"
  on public.imaging_attempts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────
-- updated_at trigger for imaging_cases
-- ─────────────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
-- Explicit empty search_path so search_path-injection can't poison
-- a future schema added between public + pg_temp. Addresses Supabase
-- lint 0011_function_search_path_mutable.
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists imaging_cases_touch_updated_at on public.imaging_cases;
create trigger imaging_cases_touch_updated_at
  before update on public.imaging_cases
  for each row execute function public.touch_updated_at();
