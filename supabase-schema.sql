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
-- v5.1.2 — handles username collisions + hardened against trigger
-- failures that would otherwise abort signup:
--   • SET search_path = public, pg_temp — required for SECURITY
--     DEFINER funcs in newer Supabase, otherwise the bare table
--     reference 'profiles' may not resolve and the trigger throws
--   • Explicit public.profiles in SQL — defense in depth
--   • EXCEPTION WHEN OTHERS at the end — if anything goes wrong,
--     log a WARNING and let auth.users INSERT succeed anyway. The
--     frontend's ensure_profile() RPC + retry-with-fallback in
--     useAuth will paper over a missing profile row.
--   • Reads username from metadata or derives from email local-part
--   • Sanitizes to [A-Za-z0-9_], 1-25 chars, fallback 'user'
--   • If taken, appends _2, _3, ... up to _99 to find a free slot
--   • Final fallback: substring(uuid) suffix — guaranteed unique
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  base_username TEXT;
  candidate TEXT;
  counter INT := 0;
BEGIN
  -- 1) Source: user-provided > derived from email
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'user'
  );

  -- 2) Sanitize: only alphanumeric + underscore, trim length
  base_username := regexp_replace(COALESCE(base_username, 'user'), '[^a-zA-Z0-9_]', '', 'g');
  IF base_username IS NULL OR length(base_username) = 0 THEN
    base_username := 'user';
  END IF;
  IF length(base_username) > 25 THEN
    base_username := substring(base_username FROM 1 FOR 25);
  END IF;

  -- 3) Find a free username — try base, then base_2, base_3, …
  candidate := base_username;
  WHILE counter < 99 AND EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate) LOOP
    counter := counter + 1;
    candidate := base_username || '_' || counter;
  END LOOP;

  -- 4) Last-resort: append short uuid hash if 99 collisions
  IF EXISTS (SELECT 1 FROM public.profiles WHERE username = candidate) THEN
    candidate := base_username || '_' || substring(NEW.id::text FROM 1 FOR 6);
  END IF;

  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, candidate)
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Never let profile creation fail signup. If something throws
    -- (RLS, constraint quirk, etc.), log it and let auth.users
    -- INSERT succeed. The app retries profile fetch + falls back
    -- to a synthesized local profile if the row is still missing.
    RAISE WARNING 'handle_new_user: % — sqlstate %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

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

-- Auto-create user_data row on signup — same hardening as handle_new_user:
-- explicit search_path + EXCEPTION handler so a failure here can never
-- abort the chained signup.
CREATE OR REPLACE FUNCTION handle_new_user_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.user_data (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user_data: % — sqlstate %', SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$;

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

-- Users can insert their own profile row (used by ensure_profile RPC
-- if the trigger ever fails and the app needs to retry creation).
-- The trigger itself runs SECURITY DEFINER and bypasses RLS, but
-- having this policy means an in-app fallback path is also possible.
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

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
