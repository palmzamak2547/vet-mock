-- Study library — catalog table for downloadable documents.
--
-- The bytes do NOT live here and they do NOT live in the repo. `public/figures`
-- is already 157 MB across 2,234 tracked files; a textbook shelf added the same
-- way would push clones past a gigabyte and re-upload the whole shelf on every
-- Vercel build. This table stores only the catalog row and points at an object
-- store via (storage_provider, storage_bucket, storage_key).
--
-- Two providers are supported from day one so the cheap migration is a column
-- update rather than a rewrite:
--
--   'supabase' → private bucket + createSignedUrl(), same shape as lab-dicom.
--                Zero new infrastructure; egress is billed by Supabase.
--   'r2'       → Cloudflare R2 behind a custom domain. Egress is free, so a
--                shelf that 100 students hit costs storage only.
--
-- Apply via:
--   supabase migration up
-- or paste into Supabase Studio → SQL editor.
--
-- Bucket setup (Studio → Storage → New bucket), only for the 'supabase'
-- provider: create a PRIVATE bucket named "library-docs". Objects are read
-- through short-lived signed URLs; the browser never gets object-management
-- privileges (see 20260824174418_revoke_browser_object_management_privileges).

-- ─────────────────────────────────────────────────────────
-- library_docs
-- ─────────────────────────────────────────────────────────
create table if not exists public.library_docs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,

  -- Classification. `subject` and `year` mirror src/data/curriculum.js ids so
  -- the catalog can be filtered with the same vocabulary as the question bank.
  kind text not null default 'handout'
    check (kind in ('handout', 'slide', 'summary', 'textbook', 'pastpaper', 'guideline', 'other')),
  subject text,
  year int check (year between 1 and 6),
  topics text[] not null default '{}',
  lang text not null default 'th',

  -- Object location.
  storage_provider text not null default 'supabase'
    check (storage_provider in ('supabase', 'r2')),
  storage_bucket text not null default 'library-docs',
  storage_key text not null,
  mime text not null default 'application/pdf',
  byte_size bigint not null check (byte_size > 0),
  page_count int check (page_count is null or page_count > 0),

  -- SHA-256 of the file bytes, first 16 hex chars — the exact key
  -- src/lib/pdf-annotations.js derives from an uploaded File. Storing it here
  -- means a library PDF can stream by HTTP range request (no full download)
  -- and still restore the reader's strokes, because the annotation key no
  -- longer has to be computed from bytes the browser never downloaded.
  sha256_16 text not null check (sha256_16 ~ '^[0-9a-f]{16}$'),

  -- Linearized ("fast web view") PDFs let pdf.js paint page 1 after ~100 KB
  -- instead of the whole file. The ingest script sets this; the reader uses it
  -- to decide between range-streaming and a plain download.
  linearized boolean not null default false,

  -- Provenance. `license` is NOT NULL on purpose: a row cannot exist without an
  -- explicit answer to "why may we host this?". `permission_evidence` records
  -- where the permission is on file for anything that is not openly licensed.
  license text not null,
  source_url text,
  attribution text,
  permission_evidence text,

  -- draft      — staged, not visible to anyone but the ingest role
  -- public     — readable by anonymous visitors
  -- restricted — readable by signed-in accounts only
  -- archived   — superseded, kept for referential history
  status text not null default 'draft'
    check (status in ('draft', 'public', 'restricted', 'archived')),

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists library_docs_status_idx on public.library_docs(status);
create index if not exists library_docs_subject_idx on public.library_docs(subject);
create index if not exists library_docs_year_idx on public.library_docs(year);
create index if not exists library_docs_kind_idx on public.library_docs(kind);
create index if not exists library_docs_topics_idx on public.library_docs using gin(topics);

-- One catalog row per object per bucket. Content-addressed keys mean the same
-- PDF uploaded twice resolves to the same storage_key, and this constraint
-- turns that into a visible conflict instead of a duplicate shelf entry.
create unique index if not exists library_docs_object_idx
  on public.library_docs(storage_provider, storage_bucket, storage_key);

-- ─────────────────────────────────────────────────────────
-- RLS — browsers read, they never write
-- ─────────────────────────────────────────────────────────
-- Deliberately no INSERT/UPDATE/DELETE policy for anon or authenticated.
-- Ingest runs under service_role via scripts/upload-library-doc.mjs. This
-- follows 20260824174014_harden_contribution_authority: `license`, `status`
-- and `storage_key` are authorization data, and a browser-writable row would
-- let any signed-in account publish arbitrary bytes under the VetMock name.
--
-- If a future curator UI ever needs browser writes, it must arrive as a
-- SECURITY DEFINER RPC that derives identity from auth.uid() — not as a
-- `for all using (auth.uid() = created_by)` policy, and never without an
-- explicit WITH CHECK naming the statuses a row may end up in (a USING-only
-- UPDATE policy reuses USING for the post-update row and blocks every legal
-- draft → public transition).
alter table public.library_docs enable row level security;

revoke insert, update, delete on table public.library_docs from anon, authenticated;

drop policy if exists "library_docs public read" on public.library_docs;
create policy "library_docs public read"
  on public.library_docs for select
  to anon, authenticated
  using (status = 'public');

drop policy if exists "library_docs member read" on public.library_docs;
create policy "library_docs member read"
  on public.library_docs for select
  to authenticated
  using (status in ('public', 'restricted'));

-- ─────────────────────────────────────────────────────────
-- updated_at trigger — reuses the shared helper installed by
-- 20260513000000_imaging_lab_init.sql
-- ─────────────────────────────────────────────────────────
drop trigger if exists library_docs_touch_updated_at on public.library_docs;
create trigger library_docs_touch_updated_at
  before update on public.library_docs
  for each row execute function public.touch_updated_at();
