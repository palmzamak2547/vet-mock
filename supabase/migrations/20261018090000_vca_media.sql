-- VetMock VCA: photos and video in the community, a profile picture, and onboarding.
--
-- Files live in Supabase Storage (20261018090100_vca_media_storage.sql); rows only point at them.
-- A pointer is a path the database checks itself, so a client cannot attach someone else's file
-- or a file from anywhere else:
--
--   <owner uuid>/<kind>/<random name>.<ext>        public bucket vca-media
--   <owner uuid>/dm/<room uuid>/<random name>.<ext> private bucket vca-private (direct rooms)
--
-- kind is avatar, post, comment or chat. A row's media is a JSON array of
--   { "path": text, "kind": "image"|"video", "w": int, "h": int, "poster"?: path, "dur"?: seconds }
-- at most 4 images, or 1 video on its own. Images are WebP (the site converts them before
-- upload); a video is MP4, WebM or MOV up to 2 minutes, with a WebP poster.

-- ── The checks ─────────────────────────────────────────────────────────────────────────────

create function vca.media_path_ok(p text, owner uuid, kind text, room uuid default null) returns boolean
language sql immutable set search_path = ''
as $$
  select p is not null and owner is not null and case
    when room is not null then p ~ ('^' || owner::text || '/dm/' || room::text || '/[A-Za-z0-9_-]{8,48}\.(webp|mp4|webm|mov)$')
    else p ~ ('^' || owner::text || '/' || kind || '/[A-Za-z0-9_-]{8,48}\.(webp|mp4|webm|mov)$')
  end
$$;

-- max_images: how many images a row may carry; allow_video: whether one video may stand alone.
create function vca.media_ok(m jsonb, owner uuid, kind text, max_images int, allow_video boolean, room uuid default null)
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
      if it->>'path' !~ '\.webp$' or it ? 'poster' or it ? 'dur' then return false; end if;
    elsif it->>'kind' = 'video' then
      if not allow_video or it->>'path' !~ '\.(mp4|webm|mov)$' then return false; end if;
      if not (it ? 'poster') or not vca.media_path_ok(it->>'poster', owner, kind, room) or it->>'poster' !~ '\.webp$' then return false; end if;
      if not (it ? 'dur') or jsonb_typeof(it->'dur') <> 'number' or (it->>'dur')::numeric not between 0 and 120 then return false; end if;
      videos := videos + 1;
    else
      return false;
    end if;
  end loop;
  -- A video stands alone.
  return videos = 0 or (videos = 1 and n = 1);
end $$;

revoke all on function vca.media_path_ok(text, uuid, text, uuid), vca.media_ok(jsonb, uuid, text, int, boolean, uuid) from public;
grant execute on function vca.media_path_ok(text, uuid, text, uuid), vca.media_ok(jsonb, uuid, text, int, boolean, uuid) to anon, authenticated, service_role;

-- ── Profiles: a picture, what they are revising, and whether onboarding is done ──────────────

alter table vca.profiles
  add column photo text check (photo is null or vca.media_path_ok(photo, user_id, 'avatar') and photo ~ '\.webp$'),
  add column focus text[] not null default '{}' check (cardinality(focus) <= 8 and array_to_string(focus, ',') ~ '^([a-z][a-z-]{1,39}(,[a-z][a-z-]{1,39})*)?$'),
  add column onboarded_at timestamptz;

grant insert (photo, focus, onboarded_at), update (photo, focus, onboarded_at) on vca.profiles to authenticated;

-- ── Posts, comments and messages carry media ──────────────────────────────────────────────

alter table vca.posts add column media jsonb not null default '[]'::jsonb
  check (vca.media_ok(media, author_id, 'post', 4, true));
alter table vca.comments add column media jsonb not null default '[]'::jsonb
  check (vca.media_ok(media, author_id, 'comment', 1, false));
alter table vca.messages add column media jsonb not null default '[]'::jsonb;

-- A message's media sits in the public bucket in an open room and in the private one, under the
-- room, in a direct room; which room it is decides, so this is a trigger, not a column check.
create function vca.guard_message_media() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare direct boolean;
begin
  if new.media is null or new.media = '[]'::jsonb then return new; end if;
  select r.kind = 'direct' into direct from vca.rooms r where r.id = new.room_id;
  if not vca.media_ok(new.media, new.author_id, 'chat', 1, true, case when direct then new.room_id end) then
    raise exception 'media not allowed here' using errcode = '22023';
  end if;
  return new;
end $$;
create trigger messages_media before insert or update of media on vca.messages for each row execute function vca.guard_message_media();
revoke all on function vca.guard_message_media() from public, anon, authenticated;

-- A body may be empty when the post, comment or message is a picture or a video.
alter table vca.comments drop constraint comments_body_check;
alter table vca.comments add constraint comments_body_check check (char_length(btrim(body)) <= 4000 and (char_length(btrim(body)) >= 1 or media <> '[]'::jsonb));
alter table vca.messages drop constraint messages_body_check;
alter table vca.messages add constraint messages_body_check check (char_length(btrim(body)) <= 2000 and (char_length(btrim(body)) >= 1 or media <> '[]'::jsonb));

grant insert (media), update (media) on vca.posts to authenticated;
grant insert (media) on vca.comments to authenticated;
grant insert (media) on vca.messages to authenticated;

notify pgrst, 'reload schema';
