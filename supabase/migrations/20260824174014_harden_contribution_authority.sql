-- Close direct-write paths that bypass VetMock's contribution workflow.

-- These RPCs derive identity from auth.uid() and are called only by signed-in
-- screens. Anonymous EXECUTE was inherited from old default privileges.
revoke all on function public.ensure_contributor_row() from public, anon;
revoke all on function public.submit_q_proposal(jsonb) from public, anon;
revoke all on function public.cast_review_vote(uuid, text, text) from public, anon;

grant execute on function public.ensure_contributor_row()
  to authenticated, service_role;
grant execute on function public.submit_q_proposal(jsonb)
  to authenticated, service_role;
grant execute on function public.cast_review_vote(uuid, text, text)
  to authenticated, service_role;

-- contributor_reputation.role is authorization data. The former self-insert
-- policy let a new account choose role='founder', then call the privileged
-- review/final-approval RPC. Submission/review inserts also bypassed the
-- server-side screening and state transition logic.
drop policy if exists "self insert reputation" on public.contributor_reputation;
drop policy if exists "contributors insert own submission" on public.q_submissions;
drop policy if exists "reviewers insert own review" on public.submission_reviews;

revoke insert on table public.contributor_reputation from authenticated;
revoke insert on table public.q_submissions from authenticated;
revoke insert on table public.submission_reviews from authenticated;

-- Profiles are created by the auth trigger or ensure_profile(). Direct INSERT
-- is unnecessary and could populate future metric/authorization columns.
drop policy if exists "profiles_insert_own" on public.profiles;
revoke insert on table public.profiles from authenticated;

-- Enforce the same cheap shape limits at the database boundary. NOT VALID
-- preserves historical rows while enforcing every new insert/update.
alter table public.profiles
  add constraint profiles_username_length_check
  check (char_length(username) between 2 and 30) not valid;

alter table public.profiles
  add constraint profiles_avatar_length_check
  check (avatar_emoji is null or char_length(avatar_emoji) <= 32) not valid;

alter table public.q_comments
  add constraint q_comments_body_length_check
  check (char_length(btrim(body)) between 1 and 2000) not valid;

alter table public.exam_results
  add constraint exam_results_score_shape_check
  check (
    total > 0
    and correct between 0 and total
    and pct between 0 and 100
    and pct = round(correct * 100.0 / total)::integer
    and (duration_sec is null or duration_sec >= 0)
  ) not valid;

alter table public.race_results
  add constraint race_results_score_shape_check
  check (
    question_count > 0
    and correct_count between 0 and question_count
    and duration_ms >= 0
  ) not valid;
