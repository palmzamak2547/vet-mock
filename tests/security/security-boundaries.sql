-- Run in the SQL editor / execute_sql. All fixtures and writes roll back.
BEGIN;
DO $test$
<<security_fixture>>
DECLARE
  author_id uuid := gen_random_uuid();
  reviewer_id uuid := gen_random_uuid();
  group_row public.groups;
  joined public.groups;
  submission_id uuid;
  wrong_code text := 'AAAAAA';
  counter integer;
BEGIN
  INSERT INTO auth.users (id, email, raw_user_meta_data, raw_app_meta_data)
  VALUES (author_id, author_id::text || '@security-test.invalid', '{}'::jsonb, '{}'::jsonb),
         (reviewer_id, reviewer_id::text || '@security-test.invalid', '{}'::jsonb, '{}'::jsonb);
  PERFORM set_config('request.jwt.claims', jsonb_build_object('sub',author_id,'role','authenticated')::text, true);
  group_row := public.create_study_group('transaction-only security fixture');
  WHILE EXISTS (SELECT 1 FROM public.groups WHERE code = wrong_code) LOOP
    wrong_code := replace(upper(substr(md5(random()::text),1,6)), '0','A');
    wrong_code := replace(replace(replace(wrong_code,'1','B'),'I','C'),'O','D');
  END LOOP;
  PERFORM set_config('request.jwt.claims', jsonb_build_object('sub',reviewer_id,'role','authenticated')::text, true);
  FOR i IN 1..21 LOOP
    SELECT g.* INTO joined FROM public.join_study_group(wrong_code) g;
    IF joined.id IS NOT NULL THEN RAISE EXCEPTION 'invalid invite joined'; END IF;
  END LOOP;
  SELECT attempts INTO counter FROM private.group_join_rate_limits WHERE user_id=reviewer_id;
  IF counter <> 21 THEN RAISE EXCEPTION 'failed guesses did not persist: %',counter; END IF;
  SELECT g.* INTO joined FROM public.join_study_group(group_row.code) g;
  IF joined.id IS NOT NULL THEN RAISE EXCEPTION 'valid invite bypassed exhausted limit'; END IF;
  UPDATE private.group_join_rate_limits SET window_started_at=now()-interval '11 minutes' WHERE user_id=reviewer_id;
  SELECT g.* INTO joined FROM public.join_study_group(group_row.code) g;
  IF joined.id IS DISTINCT FROM group_row.id THEN RAISE EXCEPTION 'normal join failed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.group_members WHERE group_id=group_row.id AND user_id=reviewer_id AND role='member') THEN
    RAISE EXCEPTION 'join did not assign member';
  END IF;

  INSERT INTO public.contributor_reputation(user_id,role) VALUES(author_id,'banned') ON CONFLICT(user_id) DO UPDATE SET role='banned';
  PERFORM set_config('request.jwt.claims', jsonb_build_object('sub',author_id,'role','authenticated')::text, true);
  BEGIN
    EXECUTE 'SET LOCAL ROLE authenticated';
    DELETE FROM public.contributor_reputation WHERE user_id=author_id;
    RAISE EXCEPTION 'banned contributor deleted moderation authority';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  PERFORM public.ensure_contributor_row();
  IF NOT EXISTS (SELECT 1 FROM public.contributor_reputation WHERE user_id=author_id AND role='banned') THEN RAISE EXCEPTION 'ban lost'; END IF;
  BEGIN
    PERFORM public.submit_q_proposal('{}'::jsonb);
    RAISE EXCEPTION 'banned account submitted';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'CONTRIBUTOR_BANNED' THEN RAISE; END IF;
  END;

  UPDATE public.contributor_reputation SET role='contributor' WHERE user_id=author_id;
  submission_id := public.submit_q_proposal(jsonb_build_object(
    'subject','com5','topic','security-fixture','q_text','Transaction-only security test question',
    'options',jsonb_build_array('option one','option two'),'answer_idx',0,
    'explain_text','This is a transaction-only fixture and never published.','source_type','other','source_ref','rollback fixture'));
  PERFORM set_config('request.jwt.claims', jsonb_build_object('sub',reviewer_id,'role','authenticated')::text, true);
  DELETE FROM public.contributor_reputation WHERE user_id=reviewer_id;
  BEGIN
    PERFORM public.cast_review_vote(submission_id,'approve','unauthorized');
    RAISE EXCEPTION 'missing role accepted a review';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'NOT_AUTHORIZED_REVIEWER' THEN RAISE; END IF;
  END;
  INSERT INTO public.contributor_reputation(user_id,role) VALUES(reviewer_id,NULL);
  BEGIN
    PERFORM public.cast_review_vote(submission_id,'approve','unauthorized');
    RAISE EXCEPTION 'null role accepted a review';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'NOT_AUTHORIZED_REVIEWER' THEN RAISE; END IF;
  END;
  UPDATE public.contributor_reputation SET role='verified' WHERE user_id=reviewer_id;
  IF public.cast_review_vote(submission_id,'approve','legitimate fixture') <> 'pending' THEN RAISE EXCEPTION 'normal peer review failed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.submission_reviews r WHERE r.submission_id=security_fixture.submission_id AND r.reviewer_id=security_fixture.reviewer_id AND r.is_palm_review=false) THEN
    RAISE EXCEPTION 'peer review not recorded';
  END IF;
  INSERT INTO public.user_data(user_id) VALUES(author_id),(reviewer_id) ON CONFLICT DO NOTHING;
  INSERT INTO public.pdf_annotations(user_id,doc_hash,data) VALUES(author_id,'security-fixture','{}'),(reviewer_id,'security-fixture','{}');
  EXECUTE 'SET LOCAL ROLE authenticated';
  IF (SELECT count(*) FROM public.user_data WHERE user_id=author_id) <> 0 THEN RAISE EXCEPTION 'other study data visible'; END IF;
  IF (SELECT count(*) FROM public.user_data WHERE user_id=reviewer_id) <> 1 THEN RAISE EXCEPTION 'own study data inaccessible'; END IF;
  IF (SELECT count(*) FROM public.pdf_annotations WHERE user_id=author_id) <> 0 THEN RAISE EXCEPTION 'other PDF annotations visible'; END IF;
  IF (SELECT count(*) FROM public.pdf_annotations WHERE user_id=reviewer_id) <> 1 THEN RAISE EXCEPTION 'own PDF annotations inaccessible'; END IF;
  UPDATE public.pdf_annotations SET data='{"unexpected":true}' WHERE user_id=author_id;
  GET DIAGNOSTICS counter=ROW_COUNT;
  IF counter <> 0 THEN RAISE EXCEPTION 'other PDF annotations writable'; END IF;
  BEGIN
    UPDATE public.pdf_annotations SET user_id=author_id WHERE user_id=reviewer_id;
    RAISE EXCEPTION 'annotation owner could be reassigned';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  EXECUTE 'RESET ROLE';
END
$test$;
ROLLBACK;
SELECT 'security-boundaries assertions passed; fixtures rolled back' AS result;
