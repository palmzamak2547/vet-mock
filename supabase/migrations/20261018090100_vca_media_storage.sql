-- VetMock VCA: where the community's photos and videos are kept (see 20261018090000_vca_media.sql
-- for the paths and the checks on the rows that point at them).
--
--   vca-media    public: profile pictures, and media on posts, comments and open rooms. Names are
--                random, and the rows that show them are public anyway.
--   vca-private  private: media in direct rooms, read only by the room's two people.
--
-- Everyone uploads into their own folder only (<user id>/...), and removes only their own files.
-- Size and type are capped by the bucket as well as by the site.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('vca-media', 'vca-media', true, 52428800, array['image/webp', 'video/mp4', 'video/webm', 'video/quicktime']),
  ('vca-private', 'vca-private', false, 52428800, array['image/webp', 'video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- The public bucket is read without a policy (its object URLs are public); listing it is not offered.
create policy "vca-media: upload into your own folder" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'vca-media'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (storage.foldername(name))[2] in ('avatar', 'post', 'comment', 'chat')
  );
create policy "vca-media: remove your own files" on storage.objects for delete to authenticated
  using (bucket_id = 'vca-media' and owner_id = (select auth.uid())::text);

-- Direct rooms: <user id>/dm/<room id>/<file>, by and for the room's members.
create function vca.in_room_folder(object_name text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select (storage.foldername(object_name))[2] = 'dm'
    and (storage.foldername(object_name))[3] ~ '^[0-9a-f-]{36}$'
    and exists (
      select 1 from vca.room_members m join vca.rooms r on r.id = m.room_id
      where r.kind = 'direct' and m.user_id = auth.uid() and m.room_id = ((storage.foldername(object_name))[3])::uuid
    )
$$;
revoke all on function vca.in_room_folder(text) from public, anon;
grant execute on function vca.in_room_folder(text) to authenticated, service_role;

create policy "vca-private: upload into your own folder of a room you are in" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'vca-private'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select vca.in_room_folder(name))
  );
create policy "vca-private: read in rooms you are in" on storage.objects for select to authenticated
  using (bucket_id = 'vca-private' and (select vca.in_room_folder(name)));
create policy "vca-private: remove your own files" on storage.objects for delete to authenticated
  using (bucket_id = 'vca-private' and owner_id = (select auth.uid())::text);
