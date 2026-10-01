-- A client read/merge followed by an unconditional upsert is not atomic:
-- two devices can read the same row and then replace each other's ink or
-- tombstones. Merge at the existing write boundary, including old PWA clients.
-- No new endpoint, column, grant, RLS policy or elevated function is needed.

create or replace function public.pdf_annotations_atomic_merge()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
declare
  payloads jsonb[];
  payload jsonb;
  pages jsonb;
  field_name text;
  max_finite numeric := 1.7976931348623157e308;
  new_pages jsonb;
  old_pages jsonb;
  merged_ink jsonb;
  merged_deleted jsonb;
  new_opened numeric;
  old_opened numeric;
  merged_count numeric;
  merged_page jsonb;
  merged_slug text;
  extras jsonb;
begin
  if tg_op = 'UPDATE' then
    -- Neither an account reassignment nor a document rename may carry ink
    -- from a different row. Existing ownership policies remain authoritative.
    if new.user_id is distinct from old.user_id
       or new.doc_hash is distinct from old.doc_hash then
      raise exception 'PDF annotation row identity cannot change'
        using errcode = '22023';
    end if;
    payloads := array[old.data, new.data];
  else
    payloads := array[new.data];
  end if;

  -- Missing fields are legitimate legacy/default {} records. Present bad
  -- fields are rejected, never coerced to empty arrays (which could lose ink).
  -- Validate OLD too: a malformed account copy must not be silently rewritten.
  foreach payload in array payloads loop
    if payload is null or jsonb_typeof(payload) is distinct from 'object' then
      raise exception 'PDF annotation data must be an object'
        using errcode = '22023';
    end if;
    if payload ? 'fileName'
       and jsonb_typeof(payload->'fileName') is distinct from 'string' then
      raise exception 'PDF annotation fileName must be a string'
        using errcode = '22023';
    end if;
    foreach field_name in array array['pageCount', 'lastPage', 'lastOpened'] loop
      if payload ? field_name then
        if jsonb_typeof(payload->field_name) is distinct from 'number' then
          raise exception 'PDF annotation % must be a number', field_name
            using errcode = '22023';
        end if;
        if abs((payload->>field_name)::numeric) > max_finite then
          raise exception 'PDF annotation % must be finite', field_name
            using errcode = '22023';
        end if;
      end if;
    end loop;
    -- slug is an optional older shelf identity; a null/empty slug is absent.
    if payload ? 'slug'
       and jsonb_typeof(payload->'slug') not in ('string', 'null') then
      raise exception 'PDF annotation slug must be a string or null'
        using errcode = '22023';
    end if;
    if payload ? 'strokesByPage'
       and jsonb_typeof(payload->'strokesByPage') is distinct from 'object' then
      raise exception 'PDF annotation strokesByPage must be an object'
        using errcode = '22023';
    end if;
    pages := coalesce(payload->'strokesByPage', '{}'::jsonb);
    if exists (
      select 1 from jsonb_each(pages) p
      where p.key !~ '^[1-9][0-9]*$'
         or jsonb_typeof(p.value) is distinct from 'array'
    ) then
      raise exception 'PDF annotation pages must be positive page keys with stroke arrays'
        using errcode = '22023';
    end if;
    if exists (
      select 1
      from jsonb_each(pages) p
      cross join lateral jsonb_array_elements(p.value) s(stroke)
      where jsonb_typeof(s.stroke) is distinct from 'object'
         or jsonb_typeof(s.stroke->'id') is distinct from 'string'
         or btrim(s.stroke->>'id') = ''
    ) then
      raise exception 'PDF annotation strokes must be objects with nonempty string ids'
        using errcode = '22023';
    end if;
    -- Modern points and legacy pts are optional; preserve the whole stroke
    -- object, including paint/pressure metadata. If supplied, coordinate tuples
    -- must be numeric arrays; no invalid point is dropped or repacked here.
    foreach field_name in array array['points', 'pts'] loop
      if exists (
        select 1
        from jsonb_each(pages) p
        cross join lateral jsonb_array_elements(p.value) s(stroke)
        where s.stroke ? field_name
          and jsonb_typeof(s.stroke->field_name) is distinct from 'array'
      ) then
        raise exception 'PDF annotation stroke % must be an array', field_name
          using errcode = '22023';
      end if;
      if exists (
        select 1
        from jsonb_each(pages) p
        cross join lateral jsonb_array_elements(p.value) s(stroke)
        cross join lateral jsonb_array_elements(coalesce(s.stroke->field_name, '[]'::jsonb)) t(point)
        where case when jsonb_typeof(t.point) = 'array'
          then jsonb_array_length(t.point) < 2 else true end
      ) then
        raise exception 'PDF annotation stroke % must contain coordinate tuples', field_name
          using errcode = '22023';
      end if;
      if exists (
        select 1
        from jsonb_each(pages) p
        cross join lateral jsonb_array_elements(p.value) s(stroke)
        cross join lateral jsonb_array_elements(coalesce(s.stroke->field_name, '[]'::jsonb)) t(point)
        cross join lateral jsonb_array_elements(t.point) c(coordinate)
        where case when jsonb_typeof(c.coordinate) = 'number'
          then abs((c.coordinate #>> '{}')::numeric) > max_finite else true end
      ) then
        raise exception 'PDF annotation stroke coordinates must be finite numbers'
          using errcode = '22023';
      end if;
    end loop;
    if payload ? 'deleted'
       and jsonb_typeof(payload->'deleted') is distinct from 'array' then
      raise exception 'PDF annotation deleted must be an array'
        using errcode = '22023';
    end if;
    if exists (
      select 1 from jsonb_array_elements(coalesce(payload->'deleted', '[]'::jsonb)) d(id)
      where jsonb_typeof(d.id) is distinct from 'string'
         or btrim(d.id #>> '{}') = ''
    ) then
      raise exception 'PDF annotation tombstones must be nonempty string ids'
        using errcode = '22023';
    end if;
  end loop;

  if tg_op = 'INSERT' then
    -- Validation only for a first row: keep valid initial/legacy payloads.
    -- Concurrent INSERT .. ON CONFLICT enters UPDATE with the locked OLD row.
    return new;
  end if;

  -- Same orientation as pushNow's mergeRecords(incoming, accountCopy).
  -- Set insertion order is incoming tombstones first, then old-only ones.
  select coalesce(jsonb_agg(u.id order by u.first_seen), '[]'::jsonb)
  into merged_deleted
  from (
    select d.id, min(d.position) as first_seen
    from (
      select d.id, d.ordinality as position
      from jsonb_array_elements(coalesce(new.data->'deleted', '[]'::jsonb))
        with ordinality d(id, ordinality)
      union all
      select d.id, jsonb_array_length(coalesce(new.data->'deleted', '[]'::jsonb)) + d.ordinality
      from jsonb_array_elements(coalesce(old.data->'deleted', '[]'::jsonb))
        with ordinality d(id, ordinality)
    ) d
    group by d.id
  ) u;

  new_pages := coalesce(new.data->'strokesByPage', '{}'::jsonb);
  old_pages := coalesce(old.data->'strokesByPage', '{}'::jsonb);
  -- JS Map keeps first-seen paint order but the last value for an id. Incoming
  -- strokes are visited first; locked OLD strokes win a same-page id collision
  -- (including their paint attributes), since existing ids are immutable.
  -- Within either side the last duplicate wins, as in the existing JS oracle.
  -- Aggregate/window operations avoid per-stroke growing-json concatenation.
  with ink as (
    select p.key collate "C" as page, s.stroke,
      (s.stroke->>'id') collate "C" as id, 0 as side,
      s.ordinality, s.ordinality as position
    from jsonb_each(new_pages) p
    cross join lateral jsonb_array_elements(p.value) with ordinality s(stroke, ordinality)
    union all
    select p.key collate "C", s.stroke, (s.stroke->>'id') collate "C", 1,
      s.ordinality, jsonb_array_length(coalesce(new_pages->p.key, '[]'::jsonb)) + s.ordinality
    from jsonb_each(old_pages) p
    cross join lateral jsonb_array_elements(p.value) with ordinality s(stroke, ordinality)
  ), ranked as (
    select ink.*,
      min(position) over (partition by page, id) as first_seen,
      row_number() over (partition by page, id order by side desc, ordinality desc) as winner
    from ink
  ), tombstones as (
    select d.id collate "C" as id from jsonb_array_elements_text(merged_deleted) d(id)
  ), kept as (
    select r.page, r.stroke, r.first_seen
    from ranked r left join tombstones t on t.id = r.id
    where r.winner = 1 and t.id is null
  ), by_page as (
    select page, jsonb_agg(stroke order by first_seen) as strokes
    from kept group by page
  )
  select coalesce(jsonb_object_agg(page, strokes), '{}'::jsonb)
  into merged_ink from by_page;

  new_opened := coalesce((new.data->>'lastOpened')::numeric, 0);
  old_opened := coalesce((old.data->>'lastOpened')::numeric, 0);
  -- Reading position uses lastOpened, not arrival time; ties favor incoming,
  -- matching mergeRecords(NEW, OLD). A missing chosen page falls back to the
  -- other side before page 1. Do not clamp to pageCount (the JS oracle does not).
  if new_opened >= old_opened then
    merged_page := coalesce(new.data->'lastPage', old.data->'lastPage', '1'::jsonb);
  else
    merged_page := coalesce(old.data->'lastPage', new.data->'lastPage', '1'::jsonb);
  end if;
  merged_count := greatest(coalesce((new.data->>'pageCount')::numeric, 0),
                           coalesce((old.data->>'pageCount')::numeric, 0));
  if merged_count = 0 then merged_count := 1; end if;
  merged_slug := coalesce(nullif(new.data->>'slug', ''), nullif(old.data->>'slug', ''));

  -- Preserve compatible legacy extension fields instead of destructively
  -- rewriting an old record. Canonical fields below always follow the oracle;
  -- a null/empty slug is omitted, as it is in mergeRecords.
  extras := (old.data || new.data)
    - 'fileName' - 'pageCount' - 'strokesByPage' - 'deleted' - 'lastPage' - 'lastOpened' - 'slug';
  new.data := extras || jsonb_build_object(
    'fileName', coalesce(nullif(new.data->>'fileName', ''), nullif(old.data->>'fileName', ''), 'untitled.pdf'),
    'pageCount', merged_count,
    'strokesByPage', merged_ink,
    'deleted', merged_deleted,
    'lastPage', merged_page,
    'lastOpened', greatest(new_opened, old_opened)
  );
  if merged_slug is not null then
    new.data := new.data || jsonb_build_object('slug', merged_slug);
  end if;
  -- The existing pdf_annotations_data_size CHECK runs on this merged NEW row:
  -- an oversized union fails the entire write, never trims work or tombstones.
  return new;
end;
$$;

drop trigger if exists pdf_annotations_atomic_merge_before_write on public.pdf_annotations;
create trigger pdf_annotations_atomic_merge_before_write
before insert or update on public.pdf_annotations
for each row execute function public.pdf_annotations_atomic_merge();
