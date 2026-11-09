-- library_search asks the Chula wall itself.
--
-- The wall (20261101170000_chula_wall.sql) has layers that each stand on
-- their own, but row security cannot see into a SECURITY DEFINER function,
-- so library_search stood on one layer alone: the Data API's pre-request,
-- which refuses a non-member before any RPC runs. Taking that layer out (the
-- emergency step the wall migration documents) would have served page
-- snippets to anyone while the wall still read as on: in SQL, as the anon
-- role, it answered as fully as for a member. It now returns nothing unless
-- public.chula_access() lets the caller in, the same rule as the restrictive
-- policies, so with the wall switched off it answers everyone as before.
-- Members see the same results; the held-document rule from
-- 20261107140012_library_pii_held_not_served.sql stays.
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
  if not public.chula_access() then
    return;
  end if;
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
