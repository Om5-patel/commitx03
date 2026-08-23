-- CommitX Row Level Security (RLS) Policies
-- Run this in Supabase SQL Editor AFTER schema.sql
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- USERS
-- Users can read/update their own row
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- GOALS
-- Users can only CRUD their own goals
-- ============================================================
CREATE POLICY "Users can view own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- TASKS
-- Users can only CRUD tasks belonging to their own goals
-- ============================================================
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- SUBMISSIONS
-- Users can read/create their own submissions
-- Admins can read all submissions
-- ============================================================
CREATE POLICY "Users can view own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions"
  ON submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can update submissions"
  ON submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- ============================================================
-- STAKES
-- Users can only read their own stakes
-- No direct user writes - all via API with service role
-- ============================================================
CREATE POLICY "Users can view own stakes"
  ON stakes FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- TRANSACTIONS
-- Read-only for users; written only by server via service role
-- ============================================================
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- DISPUTES
-- Users can create disputes for their own submissions
-- Users can view their own disputes
-- Admins can view and update all disputes
-- ============================================================
CREATE POLICY "Users can view own disputes"
  ON disputes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own disputes"
  ON disputes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all disputes"
  ON disputes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

CREATE POLICY "Admins can update disputes"
  ON disputes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true
    )
  );

-- ============================================================
-- QUIZ QUESTIONS
-- Users can view quiz questions for their own tasks
-- ============================================================
CREATE POLICY "Users can view own quiz questions"
  ON quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tasks WHERE tasks.id = quiz_questions.task_id AND tasks.user_id = auth.uid()
    )
  );

-- ============================================================
-- NOTIFICATIONS
-- Users can read/update their own notifications
-- ============================================================
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE POLICIES
-- ============================================================
-- Create submissions bucket (run in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);

-- Users can upload to their own folder
-- CREATE POLICY "Users can upload own submissions"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can view own files
-- CREATE POLICY "Users can view own submission files"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all files
-- CREATE POLICY "Admins can view all submission files"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'submissions' AND
--     EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
--   );
