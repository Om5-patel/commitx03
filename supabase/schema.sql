-- CommitX Database Schema Migration
-- Run this in Supabase SQL Editor
-- Version: 1.0 | Date: 19 August 2026

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email            text UNIQUE,
  phone            text UNIQUE,
  full_name        text NOT NULL,
  avatar_url       text,
  is_admin         boolean DEFAULT false,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ============================================================
-- 2. GOALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES users(id) ON DELETE CASCADE,
  title            text NOT NULL,
  description      text,
  category         text NOT NULL CHECK (category IN ('generic_habit','study','business_creative')),
  status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','failed','disputed')),
  total_stake      numeric(10,2) NOT NULL,
  currency         text NOT NULL DEFAULT 'INR',
  start_date       date NOT NULL,
  end_date         date NOT NULL,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ============================================================
-- 3. TASKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id              uuid REFERENCES goals(id) ON DELETE CASCADE,
  user_id              uuid REFERENCES users(id) ON DELETE CASCADE,
  title                text NOT NULL,
  description          text,
  verification_method  text NOT NULL CHECK (verification_method IN ('photo','quiz','file_ai')),
  stake_amount         numeric(10,2) NOT NULL,
  deadline             timestamptz NOT NULL,
  status               text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','submitted','verified_pass','verified_fail','disputed','expired')),
  order_index          integer NOT NULL DEFAULT 0,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ============================================================
-- 4. SUBMISSIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS submissions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id             uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id             uuid REFERENCES users(id) ON DELETE CASCADE,
  submitted_at        timestamptz DEFAULT now(),
  media_url           text,
  media_type          text,
  gps_lat             numeric(10,6),
  gps_lng             numeric(10,6),
  gps_accuracy        numeric(8,2),
  exif_timestamp      timestamptz,
  image_hash          text,
  quiz_score          integer,
  quiz_attempted      boolean DEFAULT false,
  ai_relevance_score  numeric(4,2),
  ai_relevance_note   text,
  status              text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','auto_approved','auto_rejected','manual_review','approved','rejected')),
  reviewer_id         uuid REFERENCES users(id),
  reviewer_note       text,
  reviewed_at         timestamptz
);

-- ============================================================
-- 5. STAKES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS stakes (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id              uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id              uuid REFERENCES users(id) ON DELETE CASCADE,
  amount               numeric(10,2) NOT NULL,
  currency             text NOT NULL DEFAULT 'INR',
  status               text NOT NULL DEFAULT 'held' CHECK (status IN ('held','refunded','forfeited')),
  razorpay_order_id    text UNIQUE NOT NULL,
  razorpay_payment_id  text,
  razorpay_refund_id   text,
  forfeited_at         timestamptz,
  refunded_at          timestamptz,
  created_at           timestamptz DEFAULT now(),
  updated_at           timestamptz DEFAULT now()
);

-- ============================================================
-- 6. TRANSACTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stake_id         uuid REFERENCES stakes(id),
  user_id          uuid REFERENCES users(id),
  type             text NOT NULL CHECK (type IN ('deposit','refund','forfeiture')),
  amount           numeric(10,2) NOT NULL,
  currency         text NOT NULL DEFAULT 'INR',
  razorpay_ref     text,
  description      text,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- 7. DISPUTES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS disputes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id    uuid REFERENCES submissions(id),
  task_id          uuid REFERENCES tasks(id),
  user_id          uuid REFERENCES users(id),
  reason           text NOT NULL,
  status           text NOT NULL DEFAULT 'open' CHECK (status IN ('open','under_review','resolved_in_favour','resolved_against')),
  admin_note       text,
  resolved_by      uuid REFERENCES users(id),
  resolved_at      timestamptz,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- 8. QUIZ QUESTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id          uuid REFERENCES tasks(id) ON DELETE CASCADE,
  question         text NOT NULL,
  options          jsonb NOT NULL,
  correct_option   text NOT NULL,
  explanation      text,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- 9. NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES users(id) ON DELETE CASCADE,
  type             text NOT NULL,
  title            text NOT NULL,
  body             text NOT NULL,
  read             boolean DEFAULT false,
  related_id       uuid,
  created_at       timestamptz DEFAULT now()
);

-- ============================================================
-- INDEXES (Performance)
-- ============================================================
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_tasks_goal_id ON tasks(goal_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_submissions_task_id ON submissions(task_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_stakes_task_id ON stakes(task_id);
CREATE INDEX idx_stakes_user_id ON stakes(user_id);
CREATE INDEX idx_stakes_status ON stakes(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_disputes_user_id ON disputes(user_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_goals BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_tasks BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at_stakes BEFORE UPDATE ON stakes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED: Admin User
-- ============================================================
-- This will be upserted when Parthgholap18@gmail.com signs up.
-- The auth trigger or signup API will check for this email and set is_admin = true.
