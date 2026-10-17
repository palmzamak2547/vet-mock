-- VetMock VCA community (vca.vetmock.com): profiles, an open exam board, and chat.
--
-- Owned by the VCA site and kept in its own schema, apart from VetMock's tables. The two sites
-- share the account (auth.users) and the moderators (public.is_admin()); nothing else. VCA
-- never writes a VetMock table and VetMock never reads this schema. The one way across is
-- vca.vetmock_snapshot(): a signed-in student's own VetMock name, emoji and practice totals,
-- read-only, to start a VCA profile from when they ask for it.
--
-- Every row hangs off an auth user and goes with it (on delete cascade), so VetMock's
-- delete-account function, which ends by deleting the auth user, removes a student's VCA rows
-- without having to know they exist.
--
-- Who can do what (the policies below say it exactly):
--   anyone        reads profiles, the board and its comments (hidden ones excepted)
--   signed in     makes one profile; posts, comments, likes and reports once it has one;
--                 reads and writes the open chat rooms and their own direct rooms
--   the author    edits or deletes their own posts, comments and messages
--   moderators    (public.is_admin()) hide, restore or remove anything, and close reports
-- Three people reporting the same thing hide it until a moderator looks. Posting, commenting,
-- messaging and reporting are rate-limited per person.
--
-- Applying it: by hand, when the community opens, after the owner's go-ahead. Then add "vca"
-- to the API's exposed schemas (Dashboard > Project Settings > Data API) so the site can reach
-- it. Tests: vca/scripts/test-community-db.mjs, against a disposable database only.

create schema if not exists vca;
revoke all on schema vca from public;
grant usage on schema vca to anon, authenticated, service_role;

-- ── Profiles ───────────────────────────────────────────────────────────────────────────────

create table vca.profiles (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  handle text not null unique check (handle ~ '^[a-z0-9][a-z0-9_]{2,19}$'),
  display_name text not null check (char_length(btrim(display_name)) between 1 and 40),
  avatar text not null default '🐾' check (char_length(avatar) between 1 and 16),
  tone text not null default 'verd' check (tone in ('verd', 'brass', 'cinn', 'cobalt', 'plum', 'ink')),
  school text check (char_length(school) <= 60),
  cohort text check (char_length(cohort) <= 24),
  target_round text check (target_round ~ '^[12]/25[6-9][0-9]$'),
  bio text check (char_length(bio) <= 160),
  -- What the student chose to show of their practice: { answered, correct, streak, mocks }.
  stats jsonb not null default '{}'::jsonb check (jsonb_typeof(stats) = 'object' and pg_column_size(stats) <= 512),
  from_vetmock boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── The board ──────────────────────────────────────────────────────────────────────────────

create table vca.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references vca.profiles(user_id) on delete cascade,
  kind text not null default 'question' check (kind in ('question', 'tip', 'experience', 'general')),
  domain text check (domain ~ '^[a-z][a-z-]{1,39}$'),
  question_no integer check (question_no between 1 and 9999999),
  title text not null check (char_length(btrim(title)) between 4 and 140),
  body text not null check (char_length(btrim(body)) between 1 and 8000),
  comment_count integer not null default 0,
  like_count integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  last_activity_at timestamptz not null default now()
);
create index posts_feed on vca.posts (last_activity_at desc) where not hidden;
create index posts_by_domain on vca.posts (domain, last_activity_at desc) where not hidden;
create index posts_by_author on vca.posts (author_id, created_at desc);

create table vca.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references vca.posts(id) on delete cascade,
  author_id uuid not null default auth.uid() references vca.profiles(user_id) on delete cascade,
  parent_id uuid references vca.comments(id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 4000),
  like_count integer not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);
create index comments_by_post on vca.comments (post_id, created_at);
create index comments_by_author on vca.comments (author_id, created_at desc);

create table vca.likes (
  user_id uuid not null default auth.uid() references vca.profiles(user_id) on delete cascade,
  post_id uuid references vca.posts(id) on delete cascade,
  comment_id uuid references vca.comments(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (num_nonnulls(post_id, comment_id) = 1)
);
create unique index likes_one_per_post on vca.likes (post_id, user_id) where post_id is not null;
create unique index likes_one_per_comment on vca.likes (comment_id, user_id) where comment_id is not null;
create index likes_by_user on vca.likes (user_id);

-- ── Chat ───────────────────────────────────────────────────────────────────────────────────

-- The open rooms are fixed: the lobby and one per family of domains. Direct rooms are made by
-- vca.open_direct() for two people, and only those two read or write them.
create table vca.rooms (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('open', 'direct')),
  slug text unique check (slug ~ '^[a-z][a-z0-9-]{1,31}$'),
  created_at timestamptz not null default now(),
  last_message_at timestamptz,
  check ((kind = 'open') = (slug is not null))
);

create table vca.room_members (
  room_id uuid not null references vca.rooms(id) on delete cascade,
  user_id uuid not null references vca.profiles(user_id) on delete cascade,
  joined_at timestamptz not null default now(),
  last_read_at timestamptz not null default now(),
  primary key (room_id, user_id)
);
create index room_members_by_user on vca.room_members (user_id);

create table vca.messages (
  id bigint generated always as identity primary key,
  room_id uuid not null references vca.rooms(id) on delete cascade,
  author_id uuid not null default auth.uid() references vca.profiles(user_id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  reply_to bigint references vca.messages(id) on delete set null,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);
create index messages_by_room on vca.messages (room_id, id desc);
create index messages_by_author on vca.messages (author_id, created_at desc);

insert into vca.rooms (kind, slug) values
  ('open', 'lobby'), ('open', 'bio'), ('open', 'species'), ('open', 'clinic'), ('open', 'public');

-- ── Safety: blocks and reports ────────────────────────────────────────────────────────────

create table vca.blocks (
  blocker_id uuid not null default auth.uid() references vca.profiles(user_id) on delete cascade,
  blocked_id uuid not null references vca.profiles(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create table vca.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  post_id uuid references vca.posts(id) on delete cascade,
  comment_id uuid references vca.comments(id) on delete cascade,
  message_id bigint references vca.messages(id) on delete cascade,
  reason text not null check (reason in ('spam', 'rude', 'wrong', 'leak', 'other')),
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id) on delete set null,
  outcome text check (outcome in ('kept', 'removed')),
  check (num_nonnulls(post_id, comment_id, message_id) = 1)
);
create unique index reports_once_per_post on vca.reports (post_id, reporter_id) where post_id is not null;
create unique index reports_once_per_comment on vca.reports (comment_id, reporter_id) where comment_id is not null;
create unique index reports_once_per_message on vca.reports (message_id, reporter_id) where message_id is not null;
create index reports_open on vca.reports (created_at) where resolved_at is null;
create index reports_by_reporter on vca.reports (reporter_id, created_at desc);

-- ── Helpers the policies use ──────────────────────────────────────────────────────────────

-- Moderators are VetMock's admins. Wrapped so a policy can call it for a signed-in reader
-- (public.is_admin() is not executable by anon, and anon never reaches these policies).
create function vca.is_moderator() returns boolean
language sql stable security definer set search_path = ''
as $$ select coalesce((select public.is_admin()), false) $$;

create function vca.has_profile() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from vca.profiles p where p.user_id = auth.uid()) $$;

create function vca.blocked_between(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from vca.blocks k where (k.blocker_id = a and k.blocked_id = b) or (k.blocker_id = b and k.blocked_id = a)) $$;

-- An open room, or a direct room the reader is in.
create function vca.can_read_room(room uuid) returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from vca.rooms r
    where r.id = room
      and (r.kind = 'open' or exists (select 1 from vca.room_members m where m.room_id = r.id and m.user_id = auth.uid()))
  )
$$;

-- Readable, with a profile, and in a direct room not between people who have blocked each other.
create function vca.can_write_room(room uuid) returns boolean
language sql stable security definer set search_path = ''
as $$
  select vca.has_profile() and vca.can_read_room(room) and not exists (
    select 1 from vca.rooms r join vca.room_members o on o.room_id = r.id and o.user_id <> auth.uid()
    where r.id = room and r.kind = 'direct' and vca.blocked_between(auth.uid(), o.user_id)
  )
$$;

revoke all on function vca.is_moderator(), vca.has_profile(), vca.blocked_between(uuid, uuid),
  vca.can_read_room(uuid), vca.can_write_room(uuid) from public, anon;
grant execute on function vca.is_moderator(), vca.has_profile(), vca.blocked_between(uuid, uuid),
  vca.can_read_room(uuid), vca.can_write_room(uuid) to authenticated, service_role;

-- ── Guards: who wrote it, how often, and what a writer may not set ────────────────────────

-- A handle is a name on the board; some names would read as the site speaking.
create function vca.guard_profile() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.handle in ('admin', 'admins', 'moderator', 'mod', 'mods', 'vetmock', 'vca', 'support', 'help', 'system', 'staff', 'official', 'root', 'null', 'me', 'new')
    or new.handle like 'vetmock%' or new.handle like 'admin%' then
    raise exception 'handle is reserved' using errcode = '22023';
  end if;
  new.display_name := btrim(new.display_name);
  new.updated_at := now();
  return new;
end $$;
create trigger profiles_guard before insert or update on vca.profiles for each row execute function vca.guard_profile();

-- Rate limits count the writer's own recent rows; a moderator is never limited.
create function vca.guard_post() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if not vca.is_moderator() and (select count(*) from vca.posts p where p.author_id = new.author_id and p.created_at > now() - interval '1 hour') >= 6 then
      raise exception 'too many posts; try again later' using errcode = 'P0001';
    end if;
    new.comment_count := 0; new.like_count := 0; new.hidden := false;
    new.created_at := now(); new.last_activity_at := now(); new.edited_at := null;
  else
    new.edited_at := now();
  end if;
  new.title := btrim(new.title);
  return new;
end $$;
create trigger posts_guard before insert or update of title, body, kind, domain, question_no on vca.posts for each row execute function vca.guard_post();

create function vca.guard_comment() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare parent_post uuid;
begin
  if tg_op = 'INSERT' then
    if new.parent_id is not null then
      select c.post_id into parent_post from vca.comments c where c.id = new.parent_id;
      if parent_post is distinct from new.post_id then
        raise exception 'a reply belongs to the same post' using errcode = '22023';
      end if;
    end if;
    if not exists (select 1 from vca.posts p where p.id = new.post_id and (not p.hidden or vca.is_moderator())) then
      raise exception 'post not found' using errcode = 'P0002';
    end if;
    if not vca.is_moderator() and (select count(*) from vca.comments c where c.author_id = new.author_id and c.created_at > now() - interval '1 hour') >= 40 then
      raise exception 'too many comments; try again later' using errcode = 'P0001';
    end if;
    new.like_count := 0; new.hidden := false; new.created_at := now(); new.edited_at := null;
  else
    new.edited_at := now();
  end if;
  return new;
end $$;
create trigger comments_guard before insert or update of body on vca.comments for each row execute function vca.guard_comment();

create function vca.guard_message() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if not vca.is_moderator() and (
      (select count(*) from vca.messages m where m.author_id = new.author_id and m.created_at > now() - interval '1 minute') >= 20
      or (select count(*) from vca.messages m where m.author_id = new.author_id and m.created_at > now() - interval '1 day') >= 600
    ) then
      raise exception 'too many messages; slow down' using errcode = 'P0001';
    end if;
    if new.reply_to is not null and not exists (select 1 from vca.messages m where m.id = new.reply_to and m.room_id = new.room_id) then
      raise exception 'a reply belongs to the same room' using errcode = '22023';
    end if;
    new.hidden := false; new.created_at := now(); new.edited_at := null;
  else
    new.edited_at := now();
  end if;
  return new;
end $$;
create trigger messages_guard before insert or update of body on vca.messages for each row execute function vca.guard_message();

create function vca.guard_report() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if (select count(*) from vca.reports r where r.reporter_id = new.reporter_id and r.created_at > now() - interval '1 day') >= 30 then
    raise exception 'too many reports today' using errcode = 'P0001';
  end if;
  new.created_at := now(); new.resolved_at := null; new.resolved_by := null; new.outcome := null;
  return new;
end $$;
create trigger reports_guard before insert on vca.reports for each row execute function vca.guard_report();

-- ── Counts, activity and the hide-on-reports rule ─────────────────────────────────────────

create function vca.count_comments() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update vca.posts set comment_count = comment_count + 1, last_activity_at = now() where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update vca.posts set comment_count = greatest(comment_count - 1, 0) where id = old.post_id;
  end if;
  return null;
end $$;
create trigger comments_count after insert or delete on vca.comments for each row execute function vca.count_comments();

create function vca.count_likes() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare r record;
begin
  r := case when tg_op = 'DELETE' then old else new end;
  if r.post_id is not null then
    update vca.posts set like_count = greatest(like_count + case when tg_op = 'DELETE' then -1 else 1 end, 0) where id = r.post_id;
  else
    update vca.comments set like_count = greatest(like_count + case when tg_op = 'DELETE' then -1 else 1 end, 0) where id = r.comment_id;
  end if;
  return null;
end $$;
create trigger likes_count after insert or delete on vca.likes for each row execute function vca.count_likes();

create function vca.touch_room() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update vca.rooms set last_message_at = new.created_at where id = new.room_id;
  insert into vca.room_members (room_id, user_id, last_read_at) values (new.room_id, new.author_id, new.created_at)
    on conflict (room_id, user_id) do update set last_read_at = excluded.last_read_at;
  return null;
end $$;
create trigger messages_touch after insert on vca.messages for each row execute function vca.touch_room();

-- Three different people reporting the same thing hide it until a moderator decides.
create function vca.hide_reported() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if new.post_id is not null and (select count(distinct reporter_id) from vca.reports where post_id = new.post_id and resolved_at is null) >= 3 then
    update vca.posts set hidden = true where id = new.post_id;
  elsif new.comment_id is not null and (select count(distinct reporter_id) from vca.reports where comment_id = new.comment_id and resolved_at is null) >= 3 then
    update vca.comments set hidden = true where id = new.comment_id;
  elsif new.message_id is not null and (select count(distinct reporter_id) from vca.reports where message_id = new.message_id and resolved_at is null) >= 3 then
    update vca.messages set hidden = true where id = new.message_id;
  end if;
  return null;
end $$;
create trigger reports_hide after insert on vca.reports for each row execute function vca.hide_reported();

-- ── Row-level security ─────────────────────────────────────────────────────────────────────

alter table vca.profiles enable row level security;
alter table vca.posts enable row level security;
alter table vca.comments enable row level security;
alter table vca.likes enable row level security;
alter table vca.rooms enable row level security;
alter table vca.room_members enable row level security;
alter table vca.messages enable row level security;
alter table vca.blocks enable row level security;
alter table vca.reports enable row level security;

revoke all on all tables in schema vca from public, anon, authenticated;

create policy "profiles are public" on vca.profiles for select to anon, authenticated using (true);
create policy "a profile is made by its owner" on vca.profiles for insert to authenticated with check (user_id = (select auth.uid()));
create policy "a profile is edited by its owner" on vca.profiles for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "a profile is removed by its owner" on vca.profiles for delete to authenticated using (user_id = (select auth.uid()));
grant select on vca.profiles to anon, authenticated;
grant insert (handle, display_name, avatar, tone, school, cohort, target_round, bio, stats, from_vetmock) on vca.profiles to authenticated;
grant update (handle, display_name, avatar, tone, school, cohort, target_round, bio, stats, from_vetmock) on vca.profiles to authenticated;
grant delete on vca.profiles to authenticated;

create policy "the board is open to read" on vca.posts for select to anon using (not hidden);
create policy "the board, and your own hidden posts" on vca.posts for select to authenticated
  using (not hidden or author_id = (select auth.uid()) or (select vca.is_moderator()));
create policy "posts are written by their author" on vca.posts for insert to authenticated
  with check (author_id = (select auth.uid()) and (select vca.has_profile()));
create policy "posts are edited by their author" on vca.posts for update to authenticated
  using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "posts are removed by their author or a moderator" on vca.posts for delete to authenticated
  using (author_id = (select auth.uid()) or (select vca.is_moderator()));
grant select on vca.posts to anon, authenticated;
grant insert (kind, domain, question_no, title, body), update (kind, domain, question_no, title, body), delete on vca.posts to authenticated;

create policy "comments are open to read" on vca.comments for select to anon
  using (not hidden and exists (select 1 from vca.posts p where p.id = post_id and not p.hidden));
create policy "comments, and your own hidden ones" on vca.comments for select to authenticated
  using (not hidden or author_id = (select auth.uid()) or (select vca.is_moderator()));
create policy "comments are written by their author" on vca.comments for insert to authenticated
  with check (author_id = (select auth.uid()) and (select vca.has_profile()));
create policy "comments are edited by their author" on vca.comments for update to authenticated
  using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "comments are removed by their author or a moderator" on vca.comments for delete to authenticated
  using (author_id = (select auth.uid()) or (select vca.is_moderator()));
grant select on vca.comments to anon, authenticated;
grant insert (post_id, parent_id, body), update (body), delete on vca.comments to authenticated;

create policy "likes are open to read" on vca.likes for select to anon, authenticated using (true);
create policy "a like is your own" on vca.likes for insert to authenticated
  with check (user_id = (select auth.uid()) and (select vca.has_profile()));
create policy "a like is taken back by its owner" on vca.likes for delete to authenticated using (user_id = (select auth.uid()));
grant select on vca.likes to anon, authenticated;
grant insert (post_id, comment_id), delete on vca.likes to authenticated;

create policy "rooms you can read" on vca.rooms for select to authenticated using ((select vca.can_read_room(id)));
grant select on vca.rooms to authenticated;

-- Your own seat in any room, and who else sits in your direct rooms.
create policy "room members you may see" on vca.room_members for select to authenticated
  using (user_id = (select auth.uid()) or exists (
    select 1 from vca.rooms r where r.id = room_id and r.kind = 'direct' and (select vca.can_read_room(r.id))
  ));
grant select on vca.room_members to authenticated;

create policy "messages in rooms you can read" on vca.messages for select to authenticated
  using ((select vca.can_read_room(room_id)) and (not hidden or author_id = (select auth.uid()) or (select vca.is_moderator())));
create policy "messages are written where you may write" on vca.messages for insert to authenticated
  with check (author_id = (select auth.uid()) and (select vca.can_write_room(room_id)));
create policy "messages are edited by their author" on vca.messages for update to authenticated
  using (author_id = (select auth.uid())) with check (author_id = (select auth.uid()));
create policy "messages are removed by their author or a moderator" on vca.messages for delete to authenticated
  using (author_id = (select auth.uid()) or (select vca.is_moderator()));
grant select on vca.messages to authenticated;
grant insert (room_id, body, reply_to), update (body), delete on vca.messages to authenticated;

create policy "your own blocks" on vca.blocks for select to authenticated using (blocker_id = (select auth.uid()));
create policy "you block for yourself" on vca.blocks for insert to authenticated with check (blocker_id = (select auth.uid()));
create policy "you unblock for yourself" on vca.blocks for delete to authenticated using (blocker_id = (select auth.uid()));
grant select on vca.blocks to authenticated;
grant insert (blocked_id), delete on vca.blocks to authenticated;

create policy "your own reports, or all for a moderator" on vca.reports for select to authenticated
  using (reporter_id = (select auth.uid()) or (select vca.is_moderator()));
create policy "you report for yourself" on vca.reports for insert to authenticated with check (reporter_id = (select auth.uid()));
grant select on vca.reports to authenticated;
grant insert (post_id, comment_id, message_id, reason, note) on vca.reports to authenticated;

grant all on all tables in schema vca to service_role;

-- ── Calls ──────────────────────────────────────────────────────────────────────────────────

-- The bridge from VetMock: what this student's own VetMock account already says about them,
-- to fill in a new VCA profile. Read-only, only for the caller, and nothing about anyone else.
create function vca.vetmock_snapshot() returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'username', p.username,
    'avatar', p.avatar_emoji,
    'name', coalesce(u.raw_user_meta_data ->> 'line_name', u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
    'year', u.raw_user_meta_data ->> 'year',
    'cohort', u.raw_user_meta_data ->> 'cohort',
    'bio', u.raw_user_meta_data ->> 'bio',
    'answered', p.total_attempts,
    'correct', p.total_correct,
    'streak', p.streak,
    'lastStudy', p.last_study_date
  ))
  from auth.users u
  left join public.profiles p on p.id = u.id
  where u.id = auth.uid()
$$;

-- A direct room for the caller and one other person, made once and reused.
create function vca.open_direct(other uuid) returns uuid
language plpgsql security definer set search_path = ''
as $$
declare me uuid := auth.uid(); room uuid;
begin
  if me is null or not vca.has_profile() then raise exception 'make a profile first' using errcode = '42501'; end if;
  if other is null or other = me or not exists (select 1 from vca.profiles p where p.user_id = other) then
    raise exception 'no such person' using errcode = 'P0002';
  end if;
  if vca.blocked_between(me, other) then raise exception 'not available' using errcode = '42501'; end if;
  select r.id into room from vca.rooms r
    join vca.room_members a on a.room_id = r.id and a.user_id = me
    join vca.room_members b on b.room_id = r.id and b.user_id = other
    where r.kind = 'direct' limit 1;
  if room is not null then return room; end if;
  if (select count(*) from vca.room_members m join vca.rooms r on r.id = m.room_id
      where m.user_id = me and r.kind = 'direct' and m.joined_at > now() - interval '1 day') >= 20 then
    raise exception 'too many new conversations today' using errcode = 'P0001';
  end if;
  insert into vca.rooms (kind) values ('direct') returning id into room;
  insert into vca.room_members (room_id, user_id) values (room, me), (room, other);
  return room;
end $$;

-- Mark a room read up to now, for the unread dots.
create function vca.mark_read(room uuid) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null or not vca.has_profile() or not vca.can_read_room(room) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  insert into vca.room_members (room_id, user_id) values (room, auth.uid())
    on conflict (room_id, user_id) do update set last_read_at = now();
end $$;

-- Moderators: hide, restore or remove one thing, and close the reports about it.
create function vca.moderate(target text, target_id text, action text) returns void
language plpgsql security definer set search_path = ''
as $$
declare verdict text := case when action = 'restore' then 'kept' else 'removed' end;
begin
  if not vca.is_moderator() then raise exception 'forbidden' using errcode = '42501'; end if;
  if action not in ('hide', 'restore', 'remove') or target not in ('post', 'comment', 'message') then
    raise exception 'bad request' using errcode = '22023';
  end if;
  if target = 'post' then
    update vca.reports set resolved_at = now(), resolved_by = auth.uid(), outcome = verdict where post_id = target_id::uuid and resolved_at is null;
    if action = 'remove' then delete from vca.posts where id = target_id::uuid;
    else update vca.posts set hidden = (action = 'hide') where id = target_id::uuid; end if;
  elsif target = 'comment' then
    update vca.reports set resolved_at = now(), resolved_by = auth.uid(), outcome = verdict where comment_id = target_id::uuid and resolved_at is null;
    if action = 'remove' then delete from vca.comments where id = target_id::uuid;
    else update vca.comments set hidden = (action = 'hide') where id = target_id::uuid; end if;
  else
    update vca.reports set resolved_at = now(), resolved_by = auth.uid(), outcome = verdict where message_id = target_id::bigint and resolved_at is null;
    if action = 'remove' then delete from vca.messages where id = target_id::bigint;
    else update vca.messages set hidden = (action = 'hide') where id = target_id::bigint; end if;
  end if;
end $$;

revoke all on function vca.vetmock_snapshot(), vca.open_direct(uuid), vca.mark_read(uuid), vca.moderate(text, text, text) from public, anon;
grant execute on function vca.vetmock_snapshot(), vca.open_direct(uuid), vca.mark_read(uuid), vca.moderate(text, text, text) to authenticated, service_role;

-- Trigger functions run only as triggers.
revoke all on function vca.guard_profile(), vca.guard_post(), vca.guard_comment(), vca.guard_message(), vca.guard_report(),
  vca.count_comments(), vca.count_likes(), vca.touch_room(), vca.hide_reported() from public, anon, authenticated;

-- ── Live updates ───────────────────────────────────────────────────────────────────────────

-- Chat and comment threads arrive as they are written. Realtime applies the same policies, so
-- a reader is sent only the rows they could have selected.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table vca.messages, vca.comments;
  end if;
end $$;

notify pgrst, 'reload schema';
