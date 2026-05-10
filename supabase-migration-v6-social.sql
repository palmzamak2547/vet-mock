-- ============================================================
-- VetMock v6 — Social Features Migration
-- ============================================================
-- Apply this AFTER supabase-schema.sql is in place.
-- Copy → Supabase Dashboard → SQL Editor → New query → Paste → Run.
--
-- Adds:
--   • q_comments  — discussion thread per question (subject + id key)
--   • race_results — best-of-N race result rows for leaderboard hooks
--                    (race itself is realtime-broadcast, no rows needed
--                     during the run; we only persist final scores).
--
-- Realtime channels (no DB cost):
--   • presence:<topicId>     — study buddies "who's studying X now"
--   • race:<code>            — multiplayer race coordination
-- These don't need tables, just channel auth which is on by default.
-- ============================================================

-- ========= Q_COMMENTS — discussion thread per question ========
CREATE TABLE IF NOT EXISTS q_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  q_subject TEXT NOT NULL,                              -- e.g. 'com3', 'vca'
  q_id INTEGER NOT NULL,                                -- numeric Q id within subject
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  parent_id UUID REFERENCES q_comments(id) ON DELETE CASCADE,  -- threaded replies
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS q_comments_qkey_idx ON q_comments(q_subject, q_id, created_at DESC);
CREATE INDEX IF NOT EXISTS q_comments_user_idx ON q_comments(user_id);
CREATE INDEX IF NOT EXISTS q_comments_parent_idx ON q_comments(parent_id) WHERE parent_id IS NOT NULL;

-- updated_at auto-bump on edit
CREATE OR REPLACE FUNCTION set_q_comments_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public, pg_temp AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS q_comments_updated_at ON q_comments;
CREATE TRIGGER q_comments_updated_at
BEFORE UPDATE ON q_comments
FOR EACH ROW EXECUTE FUNCTION set_q_comments_updated_at();

ALTER TABLE q_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments (study aid is collaborative)
DROP POLICY IF EXISTS "qc_select_all" ON q_comments;
CREATE POLICY "qc_select_all" ON q_comments FOR SELECT USING (true);

-- Only authenticated users can post + must be themselves
DROP POLICY IF EXISTS "qc_insert_own" ON q_comments;
CREATE POLICY "qc_insert_own" ON q_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Edits limited to own comments
DROP POLICY IF EXISTS "qc_update_own" ON q_comments;
CREATE POLICY "qc_update_own" ON q_comments
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Delete limited to own comments
DROP POLICY IF EXISTS "qc_delete_own" ON q_comments;
CREATE POLICY "qc_delete_own" ON q_comments
  FOR DELETE USING (auth.uid() = user_id);

-- ========= RACE_RESULTS — final scores from multiplayer races ===
-- The race itself runs entirely on Supabase Realtime broadcast (no
-- DB rows during the run). Only the final settled score lands here
-- so we have a leaderboard / personal-best surface later.
CREATE TABLE IF NOT EXISTS race_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_code TEXT NOT NULL,                              -- short user-facing code
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  question_count INTEGER NOT NULL CHECK (question_count BETWEEN 1 AND 200),
  correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
  duration_ms INTEGER NOT NULL CHECK (duration_ms >= 0),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS race_results_user_idx ON race_results(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS race_results_code_idx ON race_results(race_code);

ALTER TABLE race_results ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can see race results (small leaderboard scope)
DROP POLICY IF EXISTS "rr_select_auth" ON race_results;
CREATE POLICY "rr_select_auth" ON race_results
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only own results, only insert (no edits — record is final)
DROP POLICY IF EXISTS "rr_insert_own" ON race_results;
CREATE POLICY "rr_insert_own" ON race_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========= ENABLE REALTIME (Postgres CDC) FOR Q_COMMENTS ========
-- Comments stream live so users see new replies without refresh.
-- Race coordination uses the broadcast channel API directly (no
-- DB-level Realtime needed).
ALTER PUBLICATION supabase_realtime ADD TABLE q_comments;

-- ========= GRANTS ===============================================
GRANT SELECT ON q_comments TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON q_comments TO authenticated;
GRANT SELECT, INSERT ON race_results TO authenticated;

-- ============================================================
-- Migration complete. Verify with:
--   SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public' AND tablename IN ('q_comments', 'race_results');
-- Both should show rowsecurity = true.
-- ============================================================
