-- The study-buddies presence channel becomes a private Realtime channel.
--
-- 'vet-mock-buddies' was a public channel: any holder of the shipped anon
-- key could join it and read every signed-in student's presence (which
-- subject, which screen, which question). A private channel is authorised
-- at join against the RLS policies on realtime.messages with the student's
-- JWT, so only a signed-in account may read or publish here. The Realtime
-- server keys a private topic separately from the public one of the same
-- name ("<tenant>-private:<topic>" vs "<tenant>:<topic>", Tenants.tenant_topic),
-- so a public join of 'vet-mock-buddies' cannot see this presence.
--
-- RLS on realtime.messages is already on (live, 2026-10-11) and the schema
-- had no policies. Nothing here is for anon; the online count, the
-- annotation sync and the qc: channels stay public and are unaffected.
--
-- Client: src/hooks/useStudyBuddies.js joins with config.private = true
-- after realtime.setAuth(). Apply this before that client ships: it only
-- affects private channels, so clients still on the public topic keep
-- working until they update. Until every student has updated, the two
-- groups do not see each other.

drop policy if exists "vet-mock-buddies presence read" on realtime.messages;
create policy "vet-mock-buddies presence read" on realtime.messages
  for select to authenticated
  using (realtime.topic() = 'vet-mock-buddies' and realtime.messages.extension = 'presence');

drop policy if exists "vet-mock-buddies presence write" on realtime.messages;
create policy "vet-mock-buddies presence write" on realtime.messages
  for insert to authenticated
  with check (realtime.topic() = 'vet-mock-buddies' and realtime.messages.extension = 'presence');
