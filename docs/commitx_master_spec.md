# CommitX — Master Technical Specification
**Version:** 1.0  
**Date:** 19 August 2026  
**Status:** Ready for Development  
**Platform:** Web App (PWA-ready)

---

## 1. Project Overview

CommitX is a commitment and accountability web platform. Users set a personal goal, deposit a monetary stake against it, and receive that money back (in full) upon verified completion — or forfeit it (marked as CommitX revenue) upon verified failure or missed deadline.

The core value proposition: people follow through more reliably when real money is on the line, and CommitX provides the verification layer that makes the stake credible.

**Beta launch scope:** 3 goal types only — Generic Habit, Study, Business/Creative.  
**Fitness (wearable/API) is deferred to Phase 2.**

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn/ui |
| Auth | Supabase Auth (email + phone OTP) |
| Database | Supabase (PostgreSQL) |
| File Storage | Supabase Storage |
| Payments | Razorpay (Orders API + Refunds API) |
| AI Checks | OpenRouter API (claude-sonnet-4-6) |
| Email | Resend |
| Deployment | Vercel |
| Error Tracking | Sentry (optional, Phase 2) |

---

## 3. Database Schema

### 3.1 Table: `users`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
email            text UNIQUE
phone            text UNIQUE
full_name        text NOT NULL
avatar_url       text
created_at       timestamptz DEFAULT now()
updated_at       timestamptz DEFAULT now()
```

### 3.2 Table: `goals`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id          uuid REFERENCES users(id) ON DELETE CASCADE
title            text NOT NULL
description      text
category         text NOT NULL CHECK (category IN ('generic_habit','study','business_creative'))
status           text NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','failed','disputed'))
total_stake      numeric(10,2) NOT NULL
currency         text NOT NULL DEFAULT 'INR'
start_date       date NOT NULL
end_date         date NOT NULL
created_at       timestamptz DEFAULT now()
updated_at       timestamptz DEFAULT now()
```

### 3.3 Table: `tasks`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
goal_id          uuid REFERENCES goals(id) ON DELETE CASCADE
user_id          uuid REFERENCES users(id) ON DELETE CASCADE
title            text NOT NULL
description      text
verification_method  text NOT NULL CHECK (verification_method IN ('photo','quiz','file_ai'))
stake_amount     numeric(10,2) NOT NULL
deadline         timestamptz NOT NULL
status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','submitted','verified_pass','verified_fail','disputed','expired'))
order_index      integer NOT NULL DEFAULT 0
created_at       timestamptz DEFAULT now()
updated_at       timestamptz DEFAULT now()
```

### 3.4 Table: `submissions`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
task_id          uuid REFERENCES tasks(id) ON DELETE CASCADE
user_id          uuid REFERENCES users(id) ON DELETE CASCADE
submitted_at     timestamptz DEFAULT now()
media_url        text                        -- Supabase Storage URL (photo/file)
media_type       text                        -- 'image','document','video'
gps_lat          numeric(10,6)               -- captured at submission time
gps_lng          numeric(10,6)
gps_accuracy     numeric(8,2)                -- metres
exif_timestamp   timestamptz                 -- extracted from image EXIF
image_hash       text                        -- perceptual hash for duplicate check
quiz_score       integer                     -- percentage 0-100 (study goals)
quiz_attempted   boolean DEFAULT false
ai_relevance_score  numeric(4,2)             -- 0.00 to 1.00
ai_relevance_note   text                     -- AI explanation
status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','auto_approved','auto_rejected','manual_review','approved','rejected'))
reviewer_id      uuid REFERENCES users(id)   -- admin who reviewed (if manual)
reviewer_note    text
reviewed_at      timestamptz
```

### 3.5 Table: `stakes`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
task_id          uuid REFERENCES tasks(id) ON DELETE CASCADE
user_id          uuid REFERENCES users(id) ON DELETE CASCADE
amount           numeric(10,2) NOT NULL
currency         text NOT NULL DEFAULT 'INR'
status           text NOT NULL DEFAULT 'held' CHECK (status IN ('held','refunded','forfeited'))
razorpay_order_id    text UNIQUE NOT NULL
razorpay_payment_id  text
razorpay_refund_id   text
forfeited_at     timestamptz                 -- when marked as CommitX revenue
refunded_at      timestamptz
created_at       timestamptz DEFAULT now()
updated_at       timestamptz DEFAULT now()
```

### 3.6 Table: `transactions`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
stake_id         uuid REFERENCES stakes(id)
user_id          uuid REFERENCES users(id)
type             text NOT NULL CHECK (type IN ('deposit','refund','forfeiture'))
amount           numeric(10,2) NOT NULL
currency         text NOT NULL DEFAULT 'INR'
razorpay_ref     text
description      text
created_at       timestamptz DEFAULT now()
```

### 3.7 Table: `disputes`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
submission_id    uuid REFERENCES submissions(id)
task_id          uuid REFERENCES tasks(id)
user_id          uuid REFERENCES users(id)
reason           text NOT NULL
status           text NOT NULL DEFAULT 'open' CHECK (status IN ('open','under_review','resolved_in_favour','resolved_against'))
admin_note       text
resolved_by      uuid REFERENCES users(id)
resolved_at      timestamptz
created_at       timestamptz DEFAULT now()
```

### 3.8 Table: `quiz_questions`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
task_id          uuid REFERENCES tasks(id) ON DELETE CASCADE
question         text NOT NULL
options          jsonb NOT NULL              -- array of {id, text}
correct_option   text NOT NULL
explanation      text
created_at       timestamptz DEFAULT now()
```

### 3.9 Table: `notifications`
```sql
id               uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id          uuid REFERENCES users(id) ON DELETE CASCADE
type             text NOT NULL              -- 'deadline_reminder','result','dispute_update'
title            text NOT NULL
body             text NOT NULL
read             boolean DEFAULT false
related_id       uuid                       -- goal_id or task_id
created_at       timestamptz DEFAULT now()
```

---

## 4. Verification Logic (per goal type)

### 4.1 Generic Habit — Photo Proof
**Primary:** In-app camera capture only (no gallery upload)  
**Fraud check:** Perceptual image hash compared against all prior submissions by this user for this goal — reject if similarity > 90%  
**Secondary:** EXIF timestamp extracted and compared to submission time — flag if > 30 minutes difference  
**GPS:** Recorded at capture time, stored but not used for pass/fail in beta  
**Pass condition:** Hash check passes + EXIF check passes → auto-approved  
**Fail/flag condition:** Hash collision or EXIF mismatch → routed to manual review  

### 4.2 Study — Quiz
**Primary:** AI-generated 5-question multiple choice quiz based on the task's stated study material/topic  
**Quiz generation:** On task creation, call OpenRouter with the task description to generate 5 MCQ questions (stored in `quiz_questions` table)  
**Pass condition:** Score ≥ 60% → auto-approved  
**Fail condition:** Score < 60% → one retry allowed after 24 hours; second fail → verified_fail  
**Secondary fraud check:** AI checks submitted notes/summary (if user provides one) for relevance to stated topic  

### 4.3 Business/Creative — File + AI Check
**Primary:** User uploads a file artifact (document, GitHub commit URL, design file, image)  
**AI check:** OpenRouter receives the file content/URL + task description → returns relevance score (0–1) and explanation  
**Pass condition:** AI relevance score ≥ 0.70 → auto-approved  
**Low confidence:** Score 0.40–0.69 → routed to manual review  
**Fail condition:** Score < 0.40 → auto-rejected (user can dispute)  
**Optional referee:** User can optionally add a referee email at task creation; referee receives a confirmation email and must approve via link  

---

## 5. Payment Flow (Razorpay)

### 5.1 Stake Deposit
1. User creates goal + tasks with total stake amount
2. Backend creates a Razorpay Order (`amount`, `currency: 'INR'`, `receipt: goal_id`)
3. Frontend opens Razorpay checkout modal
4. On payment success: `razorpay_payment_id` captured, stake record updated to `held`, transaction record `deposit` created
5. Razorpay signature verified server-side before marking payment confirmed

### 5.2 Stake Refund (on verified pass)
1. Submission marked `approved`
2. Backend calls Razorpay Refunds API with `razorpay_payment_id` and `amount`
3. On refund success: stake status → `refunded`, `razorpay_refund_id` stored, transaction record `refund` created

### 5.3 Stake Forfeiture (on verified fail or expiry)
1. Task marked `verified_fail` or `expired` (cron job checks deadlines)
2. Stake status → `forfeited`, `forfeited_at` → now()
3. Transaction record `forfeiture` created with description "CommitX revenue"
4. No Razorpay API call needed — money stays in Razorpay account
5. User notified via email + in-app notification

### 5.4 Idempotency
- All stake status transitions must be idempotent (check current status before updating)
- Use Supabase Row Level Security + database transactions for atomic updates
- Never allow a stake to be both refunded and forfeited

---

## 6. Application Routes

### Public Routes
```
/                    Landing page (hero, how it works, pricing/model, waitlist CTA)
/login               Email/phone login
/signup              Registration
/how-it-works        Detailed explainer
```

### Authenticated User Routes
```
/dashboard           Goal overview, active stakes, notifications
/goals/new           Goal creation wizard (multi-step)
/goals/[id]          Goal detail: tasks, progress, stake status
/goals/[id]/tasks/[taskId]/submit    Submission page (camera/file/quiz)
/profile             User profile, linked payment method
/disputes            User's dispute history
/notifications       All notifications
```

### Admin Routes
```
/admin               Admin dashboard (protected, role-based)
/admin/review        Manual review queue
/admin/review/[submissionId]   Review a specific submission
/admin/disputes      Dispute management
/admin/revenue       Forfeiture/revenue log
```

---

## 7. Key UI Screens & Components

### 7.1 Goal Creation Wizard (multi-step)
**Step 1:** Goal title + description + category selection  
**Step 2:** Set total stake amount (min ₹100, max ₹10,000 in beta)  
**Step 3:** Break into tasks — title, deadline, verification method auto-selected by category, individual stake per task  
**Step 4:** Review summary — all tasks, total stake, deadlines  
**Step 5:** Payment — Razorpay checkout  
**Step 6:** Confirmation screen  

### 7.2 Submission Screen (per task type)

**Generic Habit:**
- Camera opens automatically (no gallery button shown)
- Capture button prominent
- GPS silently recorded on capture
- Submit button with confirmation

**Study:**
- Task description shown for reference
- "Start Quiz" CTA → 5 MCQ questions shown one at a time
- Score revealed at end
- Pass: green result screen → stake status updated
- Fail: red result screen → retry date shown

**Business/Creative:**
- File upload dropzone (PDF, DOCX, image, .zip accepted)
- OR: paste a URL (GitHub, Figma, etc.)
- Submit → AI check runs (loading state shown)
- Result shown with AI explanation

### 7.3 Dashboard
- Cards per active goal: title, progress bar (tasks completed/total), stake amount, next deadline
- Quick status badges: On track / At risk / Completed / Failed
- Recent notifications strip at top

### 7.4 Admin Review Screen
- Submission list sorted by date (oldest first)
- Per submission: user name, goal title, task title, verification method, media preview, AI score if applicable
- Approve / Reject buttons with mandatory note field
- Rejection triggers dispute window for user

---

## 8. API Routes (Next.js App Router)

```
POST   /api/goals                    Create goal
GET    /api/goals                    List user's goals
GET    /api/goals/[id]               Get goal detail
PATCH  /api/goals/[id]               Update goal status

POST   /api/goals/[id]/tasks         Create tasks for a goal
GET    /api/goals/[id]/tasks         List tasks

POST   /api/tasks/[id]/submit        Submit proof for a task
GET    /api/tasks/[id]/submission    Get submission status

POST   /api/payments/create-order    Create Razorpay order
POST   /api/payments/verify          Verify payment signature
POST   /api/payments/refund          Trigger refund on pass

POST   /api/verify/photo             Run photo hash + EXIF check
POST   /api/verify/quiz              Score quiz submission
POST   /api/verify/file-ai           Run AI relevance check via OpenRouter

POST   /api/disputes                 Create dispute
PATCH  /api/disputes/[id]            Admin resolves dispute

GET    /api/admin/review-queue       Get pending manual reviews
PATCH  /api/admin/submissions/[id]   Admin approve/reject

POST   /api/notifications/send       Send email via Resend
GET    /api/notifications            Get user's notifications
PATCH  /api/notifications/[id]/read  Mark notification read

POST   /api/cron/check-deadlines     Cron: expire overdue tasks (called by Vercel Cron)
```

---

## 9. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# OpenRouter
OPENROUTER_API_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@commitx.in

# App
NEXT_PUBLIC_APP_URL=https://commitx.in
ADMIN_SECRET_KEY=                    # For protecting admin routes
CRON_SECRET=                         # For protecting cron endpoint
```

---

## 10. Security & RLS Rules

### Supabase Row Level Security
- `users`: users can only read/update their own row
- `goals`: users can only CRUD their own goals
- `tasks`: users can only CRUD tasks belonging to their own goals
- `submissions`: users can only read/create their own submissions; admins can read all
- `stakes`: users can only read their own stakes; no direct user writes (all via API)
- `transactions`: read-only for users; written only by server via service role
- `disputes`: users can create disputes for their own submissions; admins can update

### Admin Role
- Implemented via a `is_admin` boolean on the `users` table
- Admin API routes check `is_admin` via Supabase service role client
- Admin routes in Next.js middleware-protected

---

## 11. Cron Jobs

### Check Deadlines (runs every hour via Vercel Cron)
```
1. Query all tasks where deadline < now() AND status = 'pending'
2. For each: set status = 'expired', set stake status = 'forfeited'
3. Create forfeiture transaction record
4. Send notification to user
```

---

## 12. Notifications (via Resend)

| Trigger | Email subject | In-app |
|---|---|---|
| Goal created + payment confirmed | "Your commitment is locked in 🔒" | Yes |
| Task deadline in 24 hours | "Deadline tomorrow: [task title]" | Yes |
| Task deadline in 1 hour | "1 hour left for: [task title]" | Yes |
| Submission auto-approved | "Task completed ✅ Refund initiated" | Yes |
| Submission sent to manual review | "Your submission is being reviewed" | Yes |
| Submission rejected | "Submission not approved — ₹X forfeited" | Yes |
| Dispute opened | "Dispute received — we'll review within 48h" | Yes |
| Dispute resolved | "Dispute resolved: [outcome]" | Yes |
| Task expired (missed deadline) | "Deadline missed — ₹X forfeited" | Yes |

---

## 13. Design System

**Colour palette:**
- Primary: `#1a1a2e` (deep navy — trust, seriousness)
- Accent: `#e94560` (CommitX red — urgency, stakes)
- Success: `#22c55e` (green — completion, refund)
- Warning: `#f59e0b` (amber — at risk, review)
- Background: `#0f0f1a` (near black)
- Surface: `#1e1e30` (card background)
- Text primary: `#f1f5f9`
- Text secondary: `#94a3b8`

**Typography:** Inter (Google Fonts)  
**Border radius:** 12px cards, 8px buttons  
**Tone:** Serious, credible, minimal — not gamified or playful. Money is involved.

---

## 14. Out of Scope for Beta

- Fitness goal type (wearable/Strava API integration)
- Company/Employee module
- Restaurant/Hotel loyalty module
- Points-based stakes (money only in beta)
- Referee flow (optional field exists in DB but email flow not built)
- Mobile native app (iOS/Android)
- Social sharing of completed goals
- Public leaderboards
