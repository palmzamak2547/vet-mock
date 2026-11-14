-- A document held for personal data is not listed and not opened by a member.
--
-- text_status = 'pii_held' marks a file whose pages look like personal data
-- (student or national IDs, class lists). Migration 20261107140012 stopped
-- serving its page text, but the row itself stayed in the catalogue and its
-- file still opened: the select policies on library_docs test status alone,
-- and library_doc_for_signing hands /api/library-file the storage key of any
-- public row, so the link was signed. On 14 Nov 2026 81 public rows were held.
--
-- Every door a member has to a held document, and what closes it:
--   - the catalogue (the shelf, findLibraryDoc, the AI's title and slug reads):
--     the two select policies below;
--   - the file: library_doc_for_signing returns no row for it, the same answer
--     as a draft or an archived row, so /api/library-file answers 404;
--   - page text, search and topic links: unchanged, already closed by
--     20261107140012 (library_doc_pages and library_doc_links policies,
--     library_search's own filter);
--   - library_related (SECURITY INVOKER) joins library_docs and the links, so
--     both policies apply to it;
--   - the 'library-docs' storage bucket: its two read policies (dashboard-made,
--     owned by the storage role, so a migration cannot alter them) ask
--     `exists (select 1 from library_docs d ...)` as the caller, so the
--     policies below apply inside them too.
--
-- The admin (is_admin()) still lists and opens a held document, so a person can
-- review it and clear the flag. Scripts read through the Management API, which
-- row security does not apply to, and admin_overview / admin_extras are
-- SECURITY DEFINER counts: neither changes. Nothing is deleted or rewritten;
-- clearing text_status serves the document again at once.

drop policy if exists "library_docs public read" on public.library_docs;
drop policy if exists "library_docs anon read" on public.library_docs;
create policy "library_docs anon read"
  on public.library_docs for select
  to anon
  using (status = 'public' and text_status is distinct from 'pii_held');

drop policy if exists "library_docs member read" on public.library_docs;
create policy "library_docs member read"
  on public.library_docs for select
  to authenticated
  using (
    status in ('public', 'restricted')
    and (text_status is distinct from 'pii_held' or (select public.is_admin()))
  );

-- As in 20260828000000_library_doc_for_signing_rpc.sql, with the held rule in
-- WHERE: a held row is indistinguishable from a missing slug, except to the
-- admin. The admin's row says `held`, so /api/library-file signs it as it signs
-- a restricted one: no cached link response, and a file the service worker
-- never keeps as a public offline copy (api/_lib/blob-token.js `a`). A new
-- column changes the return type, so the function is dropped and made again
-- (one transaction: no moment without it) and its grants are given again.
drop function if exists public.library_doc_for_signing(text);
create function public.library_doc_for_signing(p_slug text)
returns table (
  slug text,
  status text,
  storage_provider text,
  storage_bucket text,
  storage_key text,
  mime text,
  byte_size bigint,
  held boolean
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    d.slug,
    d.status,
    d.storage_provider,
    d.storage_bucket,
    case
      when d.status = 'public' then d.storage_key
      when d.status = 'restricted' and auth.uid() is not null then d.storage_key
      else null
    end as storage_key,
    d.mime,
    d.byte_size,
    d.text_status is not distinct from 'pii_held' as held
  from public.library_docs d
  where d.slug = p_slug
    and d.status in ('public', 'restricted')
    and (d.text_status is distinct from 'pii_held' or public.is_admin())
  limit 1;
$$;

revoke all on function public.library_doc_for_signing(text) from public;
grant execute on function public.library_doc_for_signing(text) to anon, authenticated, service_role;
