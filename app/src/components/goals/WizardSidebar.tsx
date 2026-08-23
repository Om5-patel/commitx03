"use client";

import { GoalFormData, TaskFormData, VERIFICATION_LABELS } from "@/lib/types";

interface WizardSidebarProps {
  goal: GoalFormData;
  tasks: TaskFormData[];
  currentStep: number;
  onNext: () => void;
  isLoading?: boolean;
}

export default function WizardSidebar({
  goal,
  tasks,
  currentStep,
  onNext,
  isLoading,
}: WizardSidebarProps) {
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Not set";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const primaryVerification = tasks[0]?.verification_method || "photo";
  const verificationIconMap: Record<string, string> = {
    photo: "photo_camera",
    quiz: "quiz",
    file_ai: "upload_file",
  };

  return (
    <aside className="w-full lg:w-[420px] shrink-0">
      <div className="sticky top-28 bg-secondary-container rounded-[2rem] p-8 flex flex-col gap-6 shadow-[0_8px_30px_rgba(46,50,48,0.04)] overflow-hidden relative border border-secondary-fixed/50">
        {/* Decorative background blur */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-tertiary-container/30 rounded-full blur-3xl pointer-events-none" />

        {/* Header Visual & Info */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined filled text-2xl">
                psychiatry
              </span>
            </div>
            <div>
              <h3 className="font-headline text-xl font-bold text-on-secondary-container mb-1">
                Your Commitment
              </h3>
              <p className="text-on-secondary-container/80 text-sm leading-relaxed">
                {goal.title || "Laying the groundwork for real accountability."}
              </p>
            </div>
          </div>

          {/* Details Pill Box */}
          <div className="bg-surface-bright/80 backdrop-blur-sm rounded-2xl p-5 flex flex-col gap-4 border border-surface-container/60 shadow-sm">
            <div className="flex justify-between items-center text-sm">
              <span className="font-label text-on-surface-variant">Deadline</span>
              <span className="font-headline font-semibold text-on-surface">
                {formatDisplayDate(goal.end_date)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-label text-on-surface-variant">Verification</span>
              <span className="font-headline font-semibold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  {verificationIconMap[primaryVerification] || "verified"}
                </span>
                {VERIFICATION_LABELS[primaryVerification] || "Photo Proof"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-label text-on-surface-variant">Sub-Tasks</span>
              <span className="font-headline font-semibold text-on-surface">
                {tasks.length} {tasks.length === 1 ? "milestone" : "milestones"}
              </span>
            </div>
          </div>

          {/* Capital at Risk Card */}
          <div className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-2xl border border-tertiary/20 shadow-sm">
            <span className="font-label text-xs font-bold text-tertiary uppercase tracking-wider mb-2">
              Capital at Risk
            </span>
            <div className="flex items-baseline text-on-surface">
              <span className="text-2xl font-headline mr-1 text-tertiary font-semibold">
                ₹
              </span>
              <span className="text-5xl font-headline font-bold tracking-tight text-primary">
                {Number(goal.total_stake || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-xs text-on-surface-variant mt-3 text-center leading-relaxed">
              This amount is held in escrow upon confirmation and fully refunded upon completion.
            </span>
          </div>

          {/* Action Button */}
          <button
            onClick={onNext}
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary font-headline font-medium text-lg py-4 rounded-xl transition-all duration-200 shadow-organic active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                Processing...
              </span>
            ) : currentStep === 3 ? (
              <>
                Lock Stake & Proceed
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </>
            ) : (
              <>
                Proceed to Next Step
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
