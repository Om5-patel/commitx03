"use client";

import { GoalFormData, TaskFormData, VERIFICATION_LABELS, CATEGORY_LABELS } from "@/lib/types";
import TiltCard from "@/components/ui/TiltCard";

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
        <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
          STEP 03 // LOCK & DEPOSIT
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Review & Lock Escrow
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1">
          Confirm your commitment details before depositing stake capital into escrow.
        </p>
      </div>

      {/* Review Tilt Card */}
      <TiltCard glow="emerald" className="p-6 sm:p-8 bg-[#12181E] border border-[#1E293B] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 rounded-full">
              {CATEGORY_LABELS[goal.category]}
            </span>
            <h3 className="font-sans text-2xl font-extrabold text-[#F8FAFC] mt-3">
              {goal.title}
            </h3>
            {goal.description && (
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-xl">
                {goal.description}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] font-mono text-[#94A3B8] uppercase block">TOTAL ESCROW PLEDGE</span>
            <span className="font-mono text-3xl font-black text-[#10B981]">₹{goal.total_stake}</span>
          </div>
        </div>

        <hr className="border-[#1E293B]" />

        {/* Milestone Path */}
        <div>
          <h4 className="font-sans text-sm font-bold text-[#F8FAFC] mb-3">
            Milestones & Scheduled Deadlines ({tasks.length})
          </h4>
          <div className="space-y-2.5">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-[#090D10] rounded-xl border border-[#1E293B]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#12181E] text-[#10B981] border border-[#10B981]/30 text-xs font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-[#F8FAFC] text-xs sm:text-sm">{task.title}</h5>
                    <span className="text-[11px] font-mono text-[#94A3B8]">
                      {VERIFICATION_LABELS[task.verification_method]} • Due: {task.deadline}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-sm font-extrabold text-[#10B981]">
                  ₹{task.stake_amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Escrow Guarantee Callout */}
        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-start gap-3 text-xs text-[#F8FAFC]">
          <span className="material-symbols-outlined text-[#10B981] text-xl shrink-0 mt-0.5">
            shield_lock
          </span>
          <div className="leading-relaxed">
            <strong className="text-[#10B981]">The CommitX Escrow Guarantee:</strong> Your ₹{goal.total_stake} stake is safely held in trust. As you complete and verify each milestone, 100% of that milestone&apos;s stake is instantly refunded back to you.
          </div>
        </div>
      </TiltCard>

      {/* Lock CTA Button */}
      <button
        onClick={onConfirm}
        disabled={isLoading}
        className="btn-primary w-full text-center !py-4 text-base tracking-wide"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
            Locking In Escrow Capital...
          </span>
        ) : (
          <>
            Deposit Stake & Lock Commitment (₹{goal.total_stake})
            <span className="material-symbols-outlined text-xl">lock</span>
          </>
        )}
      </button>
    </div>
  );
}
