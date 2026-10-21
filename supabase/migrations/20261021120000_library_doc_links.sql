-- Study library graph: a document PAGE linked to what it covers.
--
-- One row says "page N of this document is about target X", and carries the
-- words on that page that show it (evidence). target_kind 'topic' targets a
-- curriculum topic as '<subject>/<topic>', the same ids VetWiki uses in
-- /wiki/<subject>/<topic>; 'question' and 'wiki' are reserved for later.
--
-- Iron Rule 0 is a database rule here, not a script's promise: the trigger
-- refuses a link whose evidence is not a substring of that page's stored text,
-- and any link to a document held for personal data (text_status 'pii_held').
-- Written by scripts/library-links.mjs (propose, then apply); method 'term'
-- rows are machine-made and start reviewed = false.

create table if not exists public.library_doc_links (
  doc_id uuid not null,
  page int not null,
  target_kind text not null check (target_kind in ('topic', 'question', 'wiki')),
  target_id text not null check (length(target_id) between 3 and 200),
  term text not null check (length(term) between 3 and 120),
  evidence text not null check (length(evidence) between 3 and 300),
  method text not null check (method in ('term', 'manual')),
  reviewed boolean not null default false,
  rank smallint not null default 1 check (rank between 1 and 100), -- the document's place among the target's, 1 = best
  created_at timestamptz not null default now(),
  primary key (target_kind, target_id, doc_id, page),
  foreign key (doc_id, page) references public.library_doc_pages(doc_id, page) on delete cascade
);

create index if not exists library_doc_links_doc on public.library_doc_links (doc_id);

create or replace function public.library_doc_links_check()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1 from public.library_doc_pages p
    where p.doc_id = new.doc_id and p.page = new.page
      and strpos(p.body, new.evidence) > 0
      and strpos(lower(new.evidence), lower(new.term)) > 0
  ) then
    raise exception 'library_doc_links: evidence is not on page % of %', new.page, new.doc_id;
  end if;
  if exists (select 1 from public.library_docs d where d.id = new.doc_id and d.text_status = 'pii_held') then
    raise exception 'library_doc_links: document % is held for personal data', new.doc_id;
  end if;
  return new;
end
$$;

drop trigger if exists library_doc_links_check on public.library_doc_links;
create trigger library_doc_links_check
  before insert or update on public.library_doc_links
  for each row execute function public.library_doc_links_check();

-- A link is readable exactly when its document is (same rule as the pages).
alter table public.library_doc_links enable row level security;
revoke insert, update, delete on table public.library_doc_links from anon, authenticated;

drop policy if exists "library_doc_links follow their document" on public.library_doc_links;
create policy "library_doc_links follow their document"
  on public.library_doc_links for select
  to anon, authenticated
  using (exists (select 1 from public.library_docs d where d.id = doc_id));

-- library_related(targets): for each target, its documents, best first (rank,
-- then most linked pages), each with its first linked page and its evidence.
-- SECURITY INVOKER: the policy above decides visibility; the table is small
-- and the lookup is by primary-key prefix, so RLS costs nothing here.
create or replace function public.library_related(targets text[], kind text default 'topic', per_target int default 8)
returns table (target_id text, slug text, page int, pages int, term text, evidence text, reviewed boolean)
language sql
stable
security invoker
set search_path = public
as $$
  with l as (
    select l.target_id, l.doc_id, l.page, l.term, l.evidence, l.reviewed, l.rank,
      count(*) over (partition by l.target_id, l.doc_id) as pages,
      row_number() over (partition by l.target_id, l.doc_id order by l.page) as rn
    from public.library_doc_links l
    where l.target_kind = kind and l.target_id = any (targets[1:200])
  ),
  best as (
    select l.*, row_number() over (partition by l.target_id order by l.rank, l.pages desc, l.doc_id) as k
    from l where l.rn = 1
  )
  select b.target_id, d.slug, b.page, b.pages::int, b.term, b.evidence, b.reviewed
  from best b join public.library_docs d on d.id = b.doc_id
  where b.k <= least(greatest(per_target, 1), 20)
  order by b.target_id, b.k
$$;

grant execute on function public.library_related(text[], text, int) to anon, authenticated;
