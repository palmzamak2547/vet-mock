# Student profile (pending, to be folded into a wave release)

## Where I stopped (11 Nov 2026, machine shut down)
- Done: items 1 to 9 of the brief in code; the coordinator's three follow-ups (level rebuilt from
  synced records with no caveat, no algorithm names in the review row, one streak for tile and
  trophies); unit tests `tests/unit/student-identity.test.mjs` (27 pass) and
  `account-settings-copy.test.mjs` (7 pass); e2e `tests/e2e/student-profile.spec.js` (added to the
  connected job in `smoke-e2e.yml`); `profile-nav.spec.js` updated; perf:budget passed on the plain
  build (firstLoad JS within budget after the gate and the write path moved out of the first load).
- Running when stopped: nothing. The full rerun (plain and connected builds, perf:budget,
  profile-nav and student-profile on four engines, lint:data, test:unit) was queued and withdrawn
  before it took the lock. The previous rerun's e2e failures were time-outs of lazy chunks on a
  loaded machine; the spec now allows 120 s a test. That has not been proven yet.
- Next: (1) rerun the scratchpad `checks.sh` under the shared lock and fix what it finds;
  (2) retake the screenshots (dev server on 4327, `shots.mjs`) and build the contact sheet
  (`sheet.mjs`), looking at each; (3) push `claude/student-profile` (no pull request) and report.

```js
// Changelog entry (Thai, for students). Number taken by the wave's pull request.
headline: 'โปรไฟล์ใหม่ ตั้งชื่อและรูปที่เพื่อนเห็นได้จริง',
changes: [
  { kind: 'feature', scope: 'system', title: 'ตั้งชื่อและรูปที่เพื่อนเห็นได้ในที่เดียว', desc: 'แตะการ์ดชื่อในหน้าโปรไฟล์เพื่อแก้ชื่อ รูป และการแสดงบนกระดานอันดับ เห็นแถวที่เพื่อนจะเห็นก่อนบันทึก และรูปที่เลือกขึ้นทุกหน้าทันที' },
  { kind: 'feature', scope: 'system', title: 'หน้าโปรไฟล์บอกสอบถัดไป เหรียญ และกราฟ 4 สัปดาห์', desc: 'เห็นวิชาที่จะสอบถัดไปและเวลาที่เหลือ เหรียญที่ได้และเหรียญถัดไปว่าเหลืออีกเท่าไร อันดับของตัวเองในรุ่น และกราฟจำนวนข้อที่ทำและตอบถูกในแต่ละวัน' },
  { kind: 'fix', scope: 'system', title: 'ชื่อไม่ใช้รหัสนิสิตอีกต่อไป', desc: 'แอปไม่เสนออีเมลหรือรหัสนิสิตเป็นชื่อที่เพื่อนเห็น และบอกเมื่อชื่อที่ใช้อยู่เป็นชื่อที่ระบบตั้งให้' },
  { kind: 'feature', scope: 'system', title: 'หน้าบัญชีจัดเป็นหมวด และดาวน์โหลดข้อมูลได้ครบในไฟล์เดียว', desc: 'แยกเป็นการเข้าสู่ระบบ ข้อมูลของคุณ และการออกจากบัญชี ไฟล์ข้อมูลรวมเลเวลและเครื่องมือในเครื่องด้วย และบอกว่าในไฟล์มีอะไร' },
  { kind: 'fix', scope: 'system', title: 'เลเวลเท่ากันทุกเครื่อง', desc: 'เลเวลนับจากข้อที่ทำ การ์ดที่ทบทวน และภารกิจรายวันในบัญชี จึงเห็นเท่ากันทุกเครื่องที่เข้าบัญชีเดียวกัน และไม่ลดลงจากที่เคยเห็น' },
  { kind: 'fix', scope: 'system', title: 'กระดานอันดับบอกตำแหน่งของคุณ', desc: 'ถ้าเลือกไม่แสดงบนกระดาน หน้ากระดานจะบอกและพาไปเปลี่ยนได้ ถ้าแสดงอยู่จะบอกอันดับของคุณ' },
],
```

## What changed (English)

The owner asked for a much better profile system (11 Nov 2026). An audit of main ef993a0e found the
picture a student picked was saved and shown nowhere, the edit form could publish the student number,
year/cohort/bio were collected and read by nothing, the hub claimed the level was kept in the account,
and the board choice was one buried checkbox. This change fixes those and rebuilds the hub and the
account page. No database migration, no row-policy change, no new table or column, no sign-in change.

### Defects
1. **One write path.** `saveIdentity()` (`src/lib/supabase.js`) writes `profiles.username` and
   `profiles.avatar_emoji` first (only those two columns, never the key; own row via
   `profiles_update_own`), then mirrors to auth metadata (`show_on_leaderboard`,
   `identity_intro_done`). The hub, the first-run step and the account page all use it through
   `IdentityEditor.jsx`; App updates its profile state from the returned row, so the header, hub,
   board and comments show the choice with no reload. `updateUsername` is gone.
2. **Never the email local part.** The editor starts empty for an auto-made name, the header shows
   "นิสิต" while the profile loads, signup no longer proposes a name from the email, and
   `validateUsername` refuses five digits in a row. An auto-made name (`user`, `user_N`,
   `user_<hex>`, the stand-in, a digit run, the email local part) is said for what it is.
3. **First-run step** (`IdentityStep.jsx`, gate `src/lib/identity-gate.js`): once per account, on
   Home only, never with a set waiting to resume, never over the wall's welcome or the tour, only
   for a student who never chose a name. Skipping counts (device flag plus `identity_intro_done`).
4. **One year.** The hub reads the app's year (`vmx-selected-year`, App's `selectedYear`) and
   derives the cohort from `SEMESTER.cohortNote`. Year, cohort and bio are no longer asked for;
   values saved earlier stay in metadata and in the export.
5. **Privacy explained.** The editor lists every surface and whether the board choice hides the
   student there. Comments and a group's member list read `profiles` directly and ignore the flag:
   the UI says "แสดงเสมอ เลือกซ่อนไม่ได้". The leaderboard and group board show the student's own
   line (`BoardPresenceNotice.jsx`): hidden by choice, ranked N of M, or not on the board yet.
6. **True statements, one level.** The hub claims nothing about storage and carries no caveat
   (coordinator review, 11 Nov). The level is one function of data that follows the account
   (`shownXp` in `lib/xp.js`, read by the hub and the header chip alike):
   - answers in the synced history (5 right, 2 wrong, the `XP_AWARDS` the app grants) and reviews
     counted on synced SR cards (3 each);
   - plus `xp_extra` in the account's metadata. What the app awards apart from answers and SR
     grades is daily-quest points (`quests.js`, kept per day on the device). The daily question and
     reading grant no XP at all (`XP_AWARDS.dailyQ` and `notesRead` are never awarded), so nothing
     of theirs needs carrying. Quest points are counted on the device until added to `xp_extra`
     (`addAccountXp` in `lib/identity-write.js`, one metadata write per claim, a few a day);
   - the old device counter is taken into account ONCE: the first time a signed-in account is seen
     on a device after this release, the counter's lead over the account's number is added to
     `xp_extra` and the device records that it did (`vmx-xp-carried:<uid>`). Until that write
     lands the device shows its old counter where it is higher, so the level never drops on the
     device in use; afterwards every device shows the same number. A guest's level is the device
     counter, as before.
   - Known edge: two old devices of one account each carry their own lead, so quest points counted
     on both are added twice (never fewer). Measured cost: none at first load (the carry runs in
     the lazy header chip).
   Tests: "the level is one function of what follows the account", "the old counter is taken into
   account once", "quest points are the only award counted" in `tests/unit/student-identity.test.mjs`.
7. **No algorithm names.** The review row read "เลือก SM-2 หรือ FSRS ได้ในหน้านี้"; it now says what
   the student gets: "ข้อที่ผิดกลับมาให้ทบทวน แอปเลือกวันให้เอง". Test: "the review row says what the
   student gets, no algorithm names".
8. **One streak for the tile and the trophies.** The prototype showed a streak tile of 4 beside
   "2 จาก 7 วันต่อเนื่อง": the tile reads the saved streak (it knows a freeze), the trophy read the
   longest run in history. `badgeMetrics` now takes `currentStreak` and counts the longer of the two,
   and the hub hands it the tile's own number, so the tile and "next trophy" cannot disagree (a
   streak-7 trophy is earned when the tile reads 7). The phase summary still counts history alone.
   Test: "the streak tile and the streak trophies read one number".

### Rebuild
- Hub (`ProfileView.jsx`, `styles-profile.css`, lazy): identity card edited in place with a live
  preview row; the next paper from the timetable with time left, its last-7-day count and a practice
  button; a 28-day activity figure (`ActivityFigure.jsx`: stacked bars, right answers in sage, the
  median active day dashed, week ticks); earned badges and the nearest unearned one with progress
  (`nextBadge` in `badges.js`, same thresholds as `earnedBadges`, never the hour-of-day badges);
  the student's own standing with links to the board and groups; an empty state with one next thing.
  Two columns from 1024 px.
- Account page: four groups (identity, sign-in and security, your data, leaving). Linked sign-in
  methods are listed from `user.identities`. One export holds the synced data (restorable on the
  progress page), the public identity and choices, XP and year, and the device tools
  (`exportLocalExtras`); the page lists what it holds and what is downloaded separately. Password,
  passkey, email change and deletion handlers are unchanged.
- Motion: editor entrance, picture settle, figure bars rising with a geometric stagger, save line;
  transform and opacity only; the figures' spring (0.35 s, 0.82) via `linear()`; nothing under
  reduced motion.

### Words (audit findings 13 to 15)
- The wall said it takes "ชื่อ อีเมล และรูปโปรไฟล์จาก Google"; the app uses the name (the welcome)
  and the email, never the photo. It now says "VetMock ใช้แค่ชื่อและอีเมลจาก Google"
  (`ChulaGateView.jsx`). Google's consent screen still lists the photo, because the `profile` scope
  carries it: removing it from the scope is a sign-in change and is not in this branch.
- One language a screen: the leaderboard's "Exam, All", "Practice", "Anon", "cohort", "🌐" and the
  groups' "code", "join", "invite", "Copy" are Thai (`LeaderboardView.jsx`, `GroupsView.jsx`,
  `GroupDetailView.jsx`; `group-create-guard.test.mjs` follows the button's new name).
- One name for one thing: "โปรไฟล์" is the student's own page; the account page is "บัญชีและข้อมูล"
  everywhere it is named (its heading, the hub row, the header menu, the palette entry, the
  sign-in prompt), instead of "ตั้งค่าบัญชี", "บัญชีของคุณ" and "บัญชี".
- A student outside the first 200 on a board: the board and the hub now say "ยังไม่อยู่ใน 200
  อันดับแรก" instead of nothing (or "not on the board"). Their actual rank needs the ranking RPC
  to return the caller's own row (a migration; not in this branch).

### Checks
See the pull request that folds this branch. Unit: `tests/unit/student-identity.test.mjs`.
E2E: `tests/e2e/student-profile.spec.js` (four projects).

## Needs a migration

What the database accepts today for a name: `profiles.username text unique not null`,
`profiles_username_length_check` 2 to 30 characters (NOT VALID, so enforced on every new write), any
character (Thai included). `avatar_emoji` up to 32 characters. Members may update only `username`
and `avatar_emoji` of their own row (`profiles_update_own`, USING and WITH CHECK `auth.uid() = id`).
Everything else in the name rules (reserved words, emails, student numbers, the picture set,
case-insensitive uniqueness) is client-side only until this lands:

```sql
-- 1. Name and picture rules at the database boundary.
create or replace function private.public_name_problem(p_name text, p_email text)
returns text language sql immutable as $$
  select case
    when p_name is null then 'empty'
    when p_name <> btrim(regexp_replace(normalize(p_name, nfc), '\s+', ' ', 'g')) then 'not normalised'
    when char_length(p_name) not between 3 and 24 then 'length'
    when p_name !~ '^[ก-๛A-Za-z0-9_ .-]+$' then 'characters'
    when p_name ~ '@' or p_name ~* '(www\.|https?:|\.(com|net|org)$)' then 'address'
    when translate(regexp_replace(p_name, '[ ._-]', '', 'g'), '๐๑๒๓๔๕๖๗๘๙', '0123456789') ~ '[0-9]{5,}' then 'digits'
    when lower(p_name) = lower(split_part(coalesce(p_email, ''), '@', 1)) then 'email'
    when lower(regexp_replace(p_name, '[\s._-]', '', 'g')) ~ '(admin|staff|vetmock|moderator|support|system|official|owner|root|แอดมิน|ทีมงาน|ผู้ดูแล|เจ้าหน้าที่|อาจารย์)'
      or lower(regexp_replace(p_name, '[\s._-]', '', 'g')) in ('mod','dev','team','null','undefined') then 'reserved'
    else null end
$$;

create or replace function private.guard_public_identity()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare problem text;
begin
  -- The auth trigger and the service role keep their own paths.
  if coalesce(current_setting('request.jwt.claims', true), '') = ''
     or (current_setting('request.jwt.claims', true))::jsonb->>'role' = 'service_role' then
    return new;
  end if;
  if new.username is distinct from old.username then
    problem := private.public_name_problem(new.username, (select email from auth.users where id = new.id));
    if problem is not null then
      raise exception 'public name refused: %', problem using errcode = '23514';
    end if;
  end if;
  if new.avatar_emoji is distinct from old.avatar_emoji and new.avatar_emoji is not null
     and new.avatar_emoji <> all (array['🐾','🐶','🐱','🐰','🐹','🐴','🐮','🐷','🐑','🐐','🐔','🦆','🐢','🐠','🦜','🐍']) then
    raise exception 'picture refused' using errcode = '23514';
  end if;
  return new;
end $$;

drop trigger if exists tr_guard_public_identity on public.profiles;
create trigger tr_guard_public_identity before update of username, avatar_emoji on public.profiles
  for each row execute function private.guard_public_identity();

-- 2. Case-insensitive uniqueness. First list collisions and resolve them by hand:
--    select lower(username), array_agg(username) from public.profiles group by 1 having count(*) > 1;
create unique index concurrently if not exists profiles_username_lower_key on public.profiles (lower(username));

-- 3. Stop making public names from the Google name or the email local part (handle_new_user):
--    replace its base_username with a neutral handle, e.g.
--      base_username := 'นิสิต_' || substring(replace(NEW.id::text, '-', '') from 1 for 6);
--    keeping the collision loop and the EXCEPTION block as they are.
```

The policy stays as it is, written out so its `WITH CHECK` is explicit in the same migration:

```sql
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
```

### Comments honouring the board choice
Comments join `profiles(username, avatar_emoji)` and cannot read another member's auth metadata.
To let a student hide their name there, move the flag into `profiles`:

```sql
alter table public.profiles add column show_on_boards boolean not null default true;
update public.profiles p set show_on_boards = coalesce((u.raw_user_meta_data->>'show_on_leaderboard')::boolean, true)
  from auth.users u where u.id = p.id;
revoke update on table public.profiles from anon, authenticated;
grant update (username, avatar_emoji, show_on_boards) on table public.profiles to authenticated;
grant select (id, username, avatar_emoji, created_at, show_on_boards) on table public.profiles to authenticated;
-- profiles_update_own above (USING and WITH CHECK auth.uid() = id) covers the new column.
```
then the leaderboard RPCs read `p.show_on_boards`, the client writes it in `saveIdentity`, and the
comment list shows "นิสิต" for a row whose author has it off. The `"chula members only"` restrictive
policy already covers `profiles`.

### The level
No migration: the carried number lives in auth metadata, which the student already writes. A
`user_data.xp` column would only matter if quest history itself should be restorable.
