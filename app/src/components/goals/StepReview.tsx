"use client";

import { GoalFormData, TaskFormData, VERIFICATION_LABELS, CATEGORY_LABELS } from "@/lib/types";

interface StepReviewProps {
  goal: GoalFormData;
  tasks: TaskFormData[];
  onConfirm: () => void;
  isLoading: boolean;
}

export default function StepReview({
  goal,
  tasks,
  onConfirm,
  isLoading,
}: StepReviewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
          Review & Lock Commitment
        </h2>
        <p className="text-on-surface-variant text-base">
          Verify all details before depositing your stake into escrow.
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-3 py-1 rounded-full">
              {CATEGORY_LABELS[goal.category]}
            </span>
            <h3 className="font-headline text-2xl font-bold text-on-surface mt-3">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
                {goal.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
              Total Escrow Stake
            </span>
            <span className="font-headline text-3xl font-bold text-primary">
              ₹{goal.total_stake}
            </span>
          </div>
        </div>

        <hr className="border-outline-variant/20" />

        {/* Milestones list */}
        <div>
          <h4 className="font-headline font-bold text-lg text-on-surface mb-4">
            Milestones & Verifications ({tasks.length})
          </h4>
          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-surface rounded-xl border border-outline-variant/20"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-on-surface text-sm">
                      {task.title}
                    </h5>
                    <span className="text-xs text-on-surface-variant">
                      Method: {VERIFICATION_LABELS[task.verification_method]} • Deadline: {task.deadline}
                    </span>
                  </div>
                </div>
                <span className="font-headline font-bold text-sm text-primary">
                  ₹{task.stake_amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Accountability terms */}
        <div className="bg-primary-container/20 p-5 rounded-2xl border border-primary/20 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary text-2xl shrink-0 mt-0.5">
            shield
          </span>
          <div className="text-xs text-on-surface leading-relaxed">
            <strong>The CommitX Guarantee:</strong> Your ₹{goal.total_stake} stake will be safely held in Razorpay escrow. Each sub-task passed will trigger an instant 100% refund.
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-on-primary font-headline font-bold text-lg py-4 rounded-xl transition-all duration-200 shadow-organic active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            Locking In Stake...
          </span>
        ) : (
          <>
            Deposit Stake & Begin Journey (₹{goal.total_stake})
            <span className="material-symbols-outlined text-xl">lock</span>
          </>
        )}
      </button>
    </div>
  );
}
