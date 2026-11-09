-- pii_held means a document's text is not served, whatever is stored.
--
-- scripts/library-pages.py stores no page of a document it holds for personal
-- data, so "pii_held" and "no stored text" used to be one fact, and nothing
-- that serves text looked at text_status. On 7 Nov 2026 seventy public
-- documents whose stored pages list students (gen-ed group reports, class
-- lists) were marked pii_held after the fact. library_search, the policy on
-- library_doc_pages and the AI's page fetch read status alone, so their text
-- stayed findable. Every path that serves page text now skips a held document:
--   - library_search, which is SECURITY DEFINER and so applies the rule itself;
--   - the select policy on library_doc_pages, which every direct read passes
--     (the browser, the AI's page fetch, the video pipeline);
--   - the select policy on library_doc_links, whose evidence is page text
--     (library_related is SECURITY INVOKER and reads through it).
-- The status rules are unchanged, and nothing is deleted: what happens to a
-- held document's file and stored text is a person's decision.

alter policy "library_doc_pages follow their document" on public.library_doc_pages
  using (exists (
    select 1 from public.library_docs d
    where d.id = doc_id and d.text_status is distinct from 'pii_held'
  ));

alter policy "library_doc_links follow their document" on public.library_doc_links
  using (exists (
    select 1 from public.library_docs d
    where d.id = doc_id and d.text_status is distinct from 'pii_held'
  ));

-- As in 20261020230000_library_doc_pages.sql, with one more condition on the
-- documents: the status rule and the trigram path are unchanged.
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
      where %s and d.status = any ($1) and d.text_status is distinct from 'pii_held'
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
