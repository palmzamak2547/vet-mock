-- Study library: per-page text of each PDF, searchable in Thai and English.
--
-- Filled by scripts/library-pages.py (extract, then load). The text is what
-- the PDF itself says, page by page; nothing is summarised or reworded. A page
-- whose Thai came out mis-encoded is not stored, and a document that shows a
-- student or national ID is not stored at all (text_status = 'pii_held').
--
-- Search is pg_trgm + ILIKE, not PGroonga or tsvector: on this database
-- (en_US.UTF-8) PGroonga's tokenizers missed Thai words carrying above/below
-- vowels ("ผิดปกติ"), and Postgres has no Thai text-search parser. ILIKE is an
-- exact substring match, rechecked on every candidate row, so the trigram index
-- only makes it fast; it can never make a result wrong. Tested 2026-10-20.

create extension if not exists pg_trgm with schema extensions;

alter table public.library_docs
  add column if not exists text_status text
    check (text_status in ('ok', 'partial', 'garbled', 'no_text', 'pii_held', 'unreadable')),
  add column if not exists text_checked_at timestamptz;

create table if not exists public.library_doc_pages (
  doc_id uuid not null references public.library_docs(id) on delete cascade,
  page int not null check (page > 0),
  body text not null,
  primary key (doc_id, page)
);

create index if not exists library_doc_pages_body_trgm
  on public.library_doc_pages using gin (body extensions.gin_trgm_ops);

-- A page is readable exactly when its document is: the policy's subquery runs
-- under the reader's own RLS on library_docs, so anon sees pages of public
-- documents and a signed-in account also those of restricted ones.
alter table public.library_doc_pages enable row level security;
revoke insert, update, delete on table public.library_doc_pages from anon, authenticated;

drop policy if exists "library_doc_pages follow their document" on public.library_doc_pages;
create policy "library_doc_pages follow their document"
  on public.library_doc_pages for select
  to anon, authenticated
  using (exists (select 1 from public.library_docs d where d.id = doc_id));

-- library_search(q): documents whose pages contain every term of q, most
-- matching pages first, each with its first matching page and a snippet
-- around the first term. Terms are whitespace-separated, at most six; a query
-- under three characters returns nothing (it would match most of the shelf).
--
-- SECURITY DEFINER on purpose. Under RLS, Postgres must evaluate the pages
-- policy before any non-leakproof qual, and ILIKE is not leakproof, so the
-- trigram index was never used: every search ran the policy on all ~51k pages
-- (EXPLAIN as anon: 760 ms, seq scan). The function instead applies exactly
-- the library_docs read policies itself (anon: public; authenticated: public
-- and restricted) and lets the index do its job. Keep this in step with the
-- policies on library_docs.
create or replace function public.library_search(q text, max_docs int default 30)
returns table (slug text, page int, hits int, snippet text)
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  terms text[];
  cond text;
  visible text[] := case when auth.role() = 'authenticated'
    then array['public', 'restricted'] else array['public'] end;
begin
  terms := array(
    select t from regexp_split_to_table(lower(trim(coalesce(q, ''))), '\s+') as t
    where t <> '' limit 6
  );
  if coalesce(array_length(terms, 1), 0) = 0 or length(array_to_string(terms, '')) < 3 then
    return;
  end if;
  -- One ILIKE per term, joined with AND: `body ilike all (array)` is never
  -- served by the trigram index (measured 782 ms seq scan vs 30 ms bitmap scan
  -- for the same term). %L quotes each pattern, so the query text is safe.
  select string_agg(format('p.body ilike %L', '%' || replace(replace(replace(t, '\', '\\'), '%', '\%'), '_', '\_') || '%'), ' and ')
    into cond
    from unnest(terms) as t;
  return query execute format($q$
    with m as materialized (
      select d.slug, p.page, p.body
      from public.library_doc_pages p
      join public.library_docs d on d.id = p.doc_id
      where %s and d.status = any ($1)
    ),
    ranked as (
      select m.slug, min(m.page) as first_page, count(*)::int as hits
      from m group by m.slug
      order by count(*) desc, m.slug
      limit $2
    )
    select r.slug, r.first_page, r.hits,
      (select substr(m.body, greatest(1, strpos(lower(m.body), $3) - 60), 200)
       from m where m.slug = r.slug and m.page = r.first_page)
    from ranked r
    order by r.hits desc, r.slug
  $q$, cond) using visible, least(greatest(max_docs, 1), 50), terms[1];
end
$$;

revoke all on function public.library_search(text, int) from public;
grant execute on function public.library_search(text, int) to anon, authenticated;
