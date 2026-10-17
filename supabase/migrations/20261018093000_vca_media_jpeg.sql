-- VetMock VCA media: JPEG as well as WebP for pictures. The site converts photos in the browser,
-- and Safari's canvas cannot encode WebP on every version; it falls back to JPEG.

create or replace function vca.media_path_ok(p text, owner uuid, kind text, room uuid default null) returns boolean
language sql immutable set search_path = ''
as $$
  select p is not null and owner is not null and case
    when room is not null then p ~ ('^' || owner::text || '/dm/' || room::text || '/[A-Za-z0-9_-]{8,48}\.(webp|jpg|mp4|webm|mov)$')
    else p ~ ('^' || owner::text || '/' || kind || '/[A-Za-z0-9_-]{8,48}\.(webp|jpg|mp4|webm|mov)$')
  end
$$;

create or replace function vca.media_ok(m jsonb, owner uuid, kind text, max_images int, allow_video boolean, room uuid default null)
returns boolean
language plpgsql immutable set search_path = ''
as $$
declare
  it jsonb;
  videos int := 0;
  n int;
begin
  if m is null or m = '[]'::jsonb then return true; end if;
  if jsonb_typeof(m) <> 'array' then return false; end if;
  n := jsonb_array_length(m);
  if n > max_images then return false; end if;
  for it in select * from jsonb_array_elements(m) loop
    if jsonb_typeof(it) <> 'object' then return false; end if;
    if not (it ?& array['path', 'kind', 'w', 'h']) then return false; end if;
    if (select count(*) from jsonb_object_keys(it) k where k not in ('path', 'kind', 'w', 'h', 'poster', 'dur', 'alt')) > 0 then return false; end if;
    if jsonb_typeof(it->'w') <> 'number' or jsonb_typeof(it->'h') <> 'number'
      or (it->>'w')::numeric not between 1 and 10000 or (it->>'h')::numeric not between 1 and 10000 then return false; end if;
    if it ? 'alt' and (jsonb_typeof(it->'alt') <> 'string' or char_length(it->>'alt') > 300) then return false; end if;
    if not vca.media_path_ok(it->>'path', owner, kind, room) then return false; end if;
    if it->>'kind' = 'image' then
      if it->>'path' !~ '\.(webp|jpg)$' or it ? 'poster' or it ? 'dur' then return false; end if;
    elsif it->>'kind' = 'video' then
      if not allow_video or it->>'path' !~ '\.(mp4|webm|mov)$' then return false; end if;
      if not (it ? 'poster') or not vca.media_path_ok(it->>'poster', owner, kind, room) or it->>'poster' !~ '\.(webp|jpg)$' then return false; end if;
      if not (it ? 'dur') or jsonb_typeof(it->'dur') <> 'number' or (it->>'dur')::numeric not between 0 and 120 then return false; end if;
      videos := videos + 1;
    else
      return false;
    end if;
  end loop;
  return videos = 0 or (videos = 1 and n = 1);
end $$;

-- The first check on photo was named by Postgres (profiles_check, as it reads two columns):
-- find it by what it checks, and name the new one.
do $$
declare c text;
begin
  for c in select conname from pg_constraint
    where conrelid = 'vca.profiles'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%media_path_ok(photo%'
  loop
    execute format('alter table vca.profiles drop constraint %I', c);
  end loop;
end $$;
alter table vca.profiles add constraint profiles_photo_check check (photo is null or vca.media_path_ok(photo, user_id, 'avatar') and photo ~ '\.(webp|jpg)$');

-- (Guarded: the schema test runs without Supabase's storage schema.)
do $$
begin
  if to_regclass('storage.buckets') is not null then
    update storage.buckets set allowed_mime_types = array['image/webp', 'image/jpeg', 'video/mp4', 'video/webm', 'video/quicktime']
    where id in ('vca-media', 'vca-private');
  end if;
end $$;
