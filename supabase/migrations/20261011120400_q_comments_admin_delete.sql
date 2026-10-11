-- The back-office account may remove any per-question comment.
--
-- q_comments had select for everyone and insert, update and delete for the
-- comment's own author only, so nothing could take down a comment that
-- should not stay (supabase-migration-v6-social.sql; the live delete policy
-- is "users self-delete q_comments" from 20260829044015, one policy per role
-- and action). An admin delete used to run under RLS, delete 0 rows and
-- report no error.
--
-- Production keeps one permissive policy per (role, action) since
-- 2026-08-29 (the multiple_permissive_policies advisor is clear except
-- q_submissions), so the admin rule joins the author's rule in a single
-- DELETE policy instead of a second one. The author's predicate is kept
-- word for word; only "or is_admin()" is added. Nothing changes for anon,
-- and the DELETE grant to authenticated already exists.
--
-- The client (QComments.jsx) shows the delete control to the admin and
-- removes the row only on the realtime DELETE event or a read-back, so a
-- delete that RLS refused stays on screen.

drop policy if exists "qc_delete_own" on public.q_comments;
drop policy if exists "users self-delete q_comments" on public.q_comments;
drop policy if exists "qc_delete_own_or_admin" on public.q_comments;

create policy "qc_delete_own_or_admin" on public.q_comments
  for delete to authenticated
  using ((select auth.uid()) = user_id or (select public.is_admin()));
