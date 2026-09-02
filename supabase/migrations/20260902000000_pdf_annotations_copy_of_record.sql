-- pdf_annotations — the repo's copy of record for a table that was created
-- live (migrations pdf_annotations_sync, pdf_annotations_size_guard and
-- pdf_annotations_realtime, 2026-08-31 / 2026-09-01) and never committed.
-- src/lib/annotation-sync.js has read and written it since v5.60; a database
-- rebuilt from this repo came out without it, and a reviewer had no file to
-- check its policies against.
--
-- Shape, as read back from production on 2026-09-02:
--   one row per (user, document); `data` is the merged stroke record from
--   src/lib/pdf-annotations.js (a two-phase set: strokes by id plus
--   tombstones), capped at 8 MB so a runaway record cannot fill the row.
--
-- Every statement is idempotent, so applying this over the live table is a
-- no-op except for one deliberate tightening: the table inherited the
-- project's default grants because it was created AFTER
-- 20260824180000 revoked anonymous writes "on all tables in schema public".
-- RLS already denied anon every row (auth.uid() is null), but the
-- least-privilege baseline that migration established is restored here so the
-- policies are the second lock, not the only one.

create table if not exists public.pdf_annotations (
  user_id uuid not null references auth.users(id) on delete cascade,
  doc_hash text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, doc_hash)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'pdf_annotations_data_size'
      and conrelid = 'public.pdf_annotations'::regclass
  ) then
    alter table public.pdf_annotations
      add constraint pdf_annotations_data_size
      check (pg_column_size(data) <= 8 * 1024 * 1024);
  end if;
end
$$;

create index if not exists pdf_annotations_user_updated_idx
  on public.pdf_annotations (user_id, updated_at desc);

alter table public.pdf_annotations enable row level security;

-- Least privilege for browser roles. Anonymous visitors never touch this
-- table (the reader syncs only with a real session); signed-in users get the
-- four verbs the client uses, gated row-by-row below.
revoke all privileges on table public.pdf_annotations from anon;
revoke truncate, references, trigger on table public.pdf_annotations
  from anon, authenticated;
grant select, insert, update, delete on table public.pdf_annotations
  to authenticated;

drop policy if exists "pdf_annotations_select_own" on public.pdf_annotations;
create policy "pdf_annotations_select_own"
  on public.pdf_annotations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "pdf_annotations_insert_own" on public.pdf_annotations;
create policy "pdf_annotations_insert_own"
  on public.pdf_annotations
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "pdf_annotations_update_own" on public.pdf_annotations;
create policy "pdf_annotations_update_own"
  on public.pdf_annotations
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "pdf_annotations_delete_own" on public.pdf_annotations;
create policy "pdf_annotations_delete_own"
  on public.pdf_annotations
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Live cross-device sync listens to postgres_changes on this table
-- (src/lib/annotation-sync.js subscribeLive). Realtime applies RLS, so a
-- client only ever hears about its own rows.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'pdf_annotations'
  ) then
    alter publication supabase_realtime add table public.pdf_annotations;
  end if;
end
$$;
