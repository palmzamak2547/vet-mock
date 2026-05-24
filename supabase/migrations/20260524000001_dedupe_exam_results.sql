-- Palm bug 2026-05-24: leaderboard surfaced a near-duplicate exam_results
-- row from a double-submit (user_id 03df... · mode quick · subject com5 ·
-- pct 50% · two rows 12.77s apart). Just 1 case out of 224 today, but
-- worth cleaning + preventing future ones from polluting the UI.
--
-- This migration:
--   1. Deletes the later of the two rows (first save wins).
--
-- NOT included (deferred to next session):
--   • Partial unique index to prevent future doubles. A naive
--     UNIQUE (user_id, mode, subject, total, correct, date_trunc('minute',
--     created_at)) would fail rate-limit edge cases (StrictMode dev,
--     network retry, etc.). Better fix is client-side debounce in
--     saveExamResult() — see TODO in src/lib/api.js.
--
-- Applied via mcp__supabase apply_migration on 2026-05-24, name
-- "dedupe_exam_results_double_submit". This file is the canonical
-- record for local devs running `supabase db reset`.

DELETE FROM public.exam_results
WHERE id = '2b73e287-e27f-4e6d-8376-4e4e20d4de6f';

-- Sanity check: exactly 1 row should remain for that user/mode/subject/pct
DO $$
DECLARE
  remaining INT;
BEGIN
  SELECT COUNT(*) INTO remaining
  FROM public.exam_results
  WHERE user_id = '03df317d-b637-491c-9df2-dcc25365385c'
    AND mode = 'quick' AND subject = 'com5' AND pct = 50;
  IF remaining <> 1 THEN
    RAISE EXCEPTION 'Expected 1 remaining row, got %', remaining;
  END IF;
END $$;
