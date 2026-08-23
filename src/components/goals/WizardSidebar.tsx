"use client";

import { GoalFormData, TaskFormData, VERIFICATION_LABELS } from "@/lib/types";
import TiltCard from "@/components/ui/TiltCard";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

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

  return (
    <aside className="w-full lg:w-[380px] shrink-0">
      <TiltCard glow="emerald" className="sticky top-28 p-6 bg-[#12181E] border border-[#1E293B] flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#1E293B] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#10B981] text-[#090D10] flex items-center justify-center font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-[#F8FAFC]">Vault Summary</h3>
            <p className="text-xs text-[#94A3B8] font-mono">Live Configuration</p>
          </div>
        </div>

        {/* Commitment Specs */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center p-3 bg-[#090D10] rounded-xl border border-[#1E293B]">
            <span className="text-[#94A3B8]">Final Deadline:</span>
            <span className="text-[#F8FAFC] font-bold">{formatDisplayDate(goal.end_date)}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-[#090D10] rounded-xl border border-[#1E293B]">
            <span className="text-[#94A3B8]">Verification:</span>
            <span className="text-[#10B981] font-bold">{VERIFICATION_LABELS[primaryVerification] || "Photo Proof"}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-[#090D10] rounded-xl border border-[#1E293B]">
            <span className="text-[#94A3B8]">Milestones:</span>
            <span className="text-[#F8FAFC] font-bold">{tasks.length} Steps</span>
          </div>
        </div>

        {/* Capital at Risk */}
        <div className="p-5 rounded-xl bg-[#090D10] border border-[#1E293B] text-center space-y-1">
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#F59E0B] uppercase">
            ESCROW CAPITAL AT RISK
          </span>
          <div className="font-mono text-4xl font-black text-[#10B981] tracking-tight">
            ₹{Number(goal.total_stake || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-[#64748B] pt-1">
            100% refunded as tasks are verified.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onNext}
          disabled={isLoading}
          className="btn-primary w-full text-center !py-3.5 text-sm inline-flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : currentStep === 3 ? (
            <>
              <span>Confirm & Deposit Stake</span>
              <Lock className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </TiltCard>
    </aside>
  );
}
