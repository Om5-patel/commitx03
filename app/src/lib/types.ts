// ============================================================
// CommitX — TypeScript Type Definitions
// ============================================================

// Database row types (matching Supabase schema)

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export type GoalCategory = "generic_habit" | "study" | "business_creative";
export type GoalStatus = "active" | "completed" | "failed" | "disputed";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  status: GoalStatus;
  total_stake: number;
  currency: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export type VerificationMethod = "photo" | "quiz" | "file_ai";
export type TaskStatus =
  | "pending"
  | "submitted"
  | "verified_pass"
  | "verified_fail"
  | "disputed"
  | "expired";

export interface Task {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  description: string | null;
  verification_method: VerificationMethod;
  stake_amount: number;
  deadline: string;
  status: TaskStatus;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus =
  | "pending"
  | "auto_approved"
  | "auto_rejected"
  | "manual_review"
  | "approved"
  | "rejected";

export interface Submission {
  id: string;
  task_id: string;
  user_id: string;
  submitted_at: string;
  media_url: string | null;
  media_type: string | null;
  gps_lat: number | null;
  gps_lng: number | null;
  gps_accuracy: number | null;
  exif_timestamp: string | null;
  image_hash: string | null;
  quiz_score: number | null;
  quiz_attempted: boolean;
  ai_relevance_score: number | null;
  ai_relevance_note: string | null;
  status: SubmissionStatus;
  reviewer_id: string | null;
  reviewer_note: string | null;
  reviewed_at: string | null;
}

export type StakeStatus = "held" | "refunded" | "forfeited";

export interface Stake {
  id: string;
  task_id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: StakeStatus;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_refund_id: string | null;
  forfeited_at: string | null;
  refunded_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TransactionType = "deposit" | "refund" | "forfeiture";

export interface Transaction {
  id: string;
  stake_id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  razorpay_ref: string | null;
  description: string | null;
  created_at: string;
}

export type DisputeStatus =
  | "open"
  | "under_review"
  | "resolved_in_favour"
  | "resolved_against";

export interface Dispute {
  id: string;
  submission_id: string;
  task_id: string;
  user_id: string;
  reason: string;
  status: DisputeStatus;
  admin_note: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  task_id: string;
  question: string;
  options: { id: string; text: string }[];
  correct_option: string;
  explanation: string | null;
  created_at: string;
}

export type NotificationType =
  | "deadline_reminder"
  | "result"
  | "dispute_update"
  | "payment_confirmed"
  | "submission_review"
  | "task_expired";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  related_id: string | null;
  created_at: string;
}

// ============================================================
// Derived / View Types (for UI)
// ============================================================

export interface GoalWithTasks extends Goal {
  tasks: Task[];
}

export interface GoalWithProgress extends Goal {
  tasks_total: number;
  tasks_completed: number;
  tasks_failed: number;
  next_deadline: string | null;
}

export interface TaskWithSubmission extends Task {
  submission: Submission | null;
  stake: Stake | null;
}

export interface SubmissionWithContext extends Submission {
  task: Task;
  goal: Goal;
  user: Pick<User, "id" | "full_name" | "email">;
}

// ============================================================
// Form / Wizard Types
// ============================================================

export interface GoalFormData {
  title: string;
  description: string;
  category: GoalCategory;
  total_stake: number;
  start_date: string;
  end_date: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  verification_method: VerificationMethod;
  stake_amount: number;
  deadline: string;
}

export interface WizardState {
  step: number;
  goal: GoalFormData;
  tasks: TaskFormData[];
}

// Verification method mapped per category
export const CATEGORY_VERIFICATION_MAP: Record<GoalCategory, VerificationMethod> = {
  generic_habit: "photo",
  study: "quiz",
  business_creative: "file_ai",
};

export const CATEGORY_LABELS: Record<GoalCategory, string> = {
  generic_habit: "Generic Habit",
  study: "Study",
  business_creative: "Business / Creative",
};

export const VERIFICATION_LABELS: Record<VerificationMethod, string> = {
  photo: "Photo Proof",
  quiz: "Knowledge Quiz",
  file_ai: "File + AI Check",
};

export const STAKE_LIMITS = {
  min: 100, // ₹100
  max: 10000, // ₹10,000
} as const;
