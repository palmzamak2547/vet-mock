-- ============================================================
-- VetMock v4.0 — Supabase Database Schema
-- ============================================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- (Supabase Dashboard → SQL Editor → New query → Paste → Run)
-- ============================================================

-- ========= PROFILES =========
-- User profile info; auto-created when user signs up
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_emoji TEXT DEFAULT '🐾',
  total_attempts INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  streak INT DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========= GROUPS =========
-- Study groups
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,        -- invite code (6 chars)
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Group membership
CREATE TABLE IF NOT EXISTS group_members (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',       -- 'admin' | 'member'
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- ========= SHARED QUESTIONS =========
-- Questions contributed to a group
CREATE TABLE IF NOT EXISTS shared_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name TEXT,
  data JSONB NOT NULL,              -- full question object
  upvotes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========= EXAM RESULTS =========
-- Stored for leaderboard + cloud sync
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,               -- 'quick' | 'exam' | 'sr'
  subject TEXT,
  total INT NOT NULL,
  correct INT NOT NULL,
  pct INT NOT NULL,
  duration_sec INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========= USER DATA (cloud sync) =========
-- Syncs bookmarks, notes, sr_cards, custom_questions, history
CREATE TABLE IF NOT EXISTS user_data (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  bookmarks JSONB DEFAULT '[]'::JSONB,
  notes JSONB DEFAULT '{}'::JSONB,
  sr_cards JSONB DEFAULT '{}'::JSONB,
  custom_questions JSONB DEFAULT '[]'::JSONB,
  history JSONB DEFAULT '[]'::JSONB,
  streak_data JSONB DEFAULT '{}'::JSONB,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create user_data row on signup
CREATE OR REPLACE FUNCTION handle_new_user_data()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_data (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_data();

-- ============================================================
-- ROW LEVEL SECURITY (RLS) - CRITICAL FOR SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- ========= PROFILES POLICIES =========
-- Anyone can view profiles (for leaderboard display)
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ========= GROUPS POLICIES =========
-- Anyone can view groups they are members of
DROP POLICY IF EXISTS "groups_select_members" ON groups;
CREATE POLICY "groups_select_members" ON groups FOR SELECT USING (
  id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
  OR created_by = auth.uid()
);

-- Authenticated users can create groups
DROP POLICY IF EXISTS "groups_insert_auth" ON groups;
CREATE POLICY "groups_insert_auth" ON groups FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Only creator can delete
DROP POLICY IF EXISTS "groups_delete_creator" ON groups;
CREATE POLICY "groups_delete_creator" ON groups FOR DELETE USING (auth.uid() = created_by);

-- ========= GROUP_MEMBERS POLICIES =========
-- Members of a group can see other members
DROP POLICY IF EXISTS "members_select_same_group" ON group_members;
CREATE POLICY "members_select_same_group" ON group_members FOR SELECT USING (
  group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
);

-- Users can join groups (insert themselves)
DROP POLICY IF EXISTS "members_insert_self" ON group_members;
CREATE POLICY "members_insert_self" ON group_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave groups (delete themselves)
DROP POLICY IF EXISTS "members_delete_self" ON group_members;
CREATE POLICY "members_delete_self" ON group_members FOR DELETE USING (auth.uid() = user_id);

-- ========= SHARED_QUESTIONS POLICIES =========
-- Members of group can see shared questions
DROP POLICY IF EXISTS "sq_select_group_members" ON shared_questions;
CREATE POLICY "sq_select_group_members" ON shared_questions FOR SELECT USING (
  group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
);

-- Group members can contribute questions
DROP POLICY IF EXISTS "sq_insert_member" ON shared_questions;
CREATE POLICY "sq_insert_member" ON shared_questions FOR INSERT WITH CHECK (
  auth.uid() = author_id
  AND group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
);

-- Author can delete own questions
DROP POLICY IF EXISTS "sq_delete_author" ON shared_questions;
CREATE POLICY "sq_delete_author" ON shared_questions FOR DELETE USING (auth.uid() = author_id);

-- ========= EXAM_RESULTS POLICIES =========
-- Users can see their own results + results from their groups (for leaderboard)
DROP POLICY IF EXISTS "results_select_own_or_group" ON exam_results;
CREATE POLICY "results_select_own_or_group" ON exam_results FOR SELECT USING (
  auth.uid() = user_id
  OR group_id IN (SELECT group_id FROM group_members WHERE user_id = auth.uid())
);

-- Users can insert their own results
DROP POLICY IF EXISTS "results_insert_own" ON exam_results;
CREATE POLICY "results_insert_own" ON exam_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========= USER_DATA POLICIES =========
-- Users only see their own data
DROP POLICY IF EXISTS "udata_select_own" ON user_data;
CREATE POLICY "udata_select_own" ON user_data FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "udata_update_own" ON user_data;
CREATE POLICY "udata_update_own" ON user_data FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "udata_insert_own" ON user_data;
CREATE POLICY "udata_insert_own" ON user_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- INDEXES (for performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_results_user_date ON exam_results(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_results_group_date ON exam_results(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sq_group ON shared_questions(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_groups_code ON groups(code);

-- ============================================================
-- DONE! Your VetMock database is ready.
-- ============================================================
