"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CATEGORY_LABELS, VERIFICATION_LABELS } from "@/lib/types";
import CommitmentCard from "@/components/ui/CommitmentCard";
import MilestoneRail from "@/components/ui/MilestoneRail";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

interface GoalDetailProps {
  params: Promise<{ id: string }>;
}

export default function GoalDetailPage({ params }: GoalDetailProps) {
  const { id } = use(params);

  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadGoal() {
      try {
        const res = await fetch(`/api/goals/${id}`);
        if (res.ok) {
          const data = await res.json();
          setGoal(data.goal);
        } else {
          // Demo fallback
          setGoal({
            id,
            title: "Master System Design & Distributed Services",
            description: "Study and pass verified checks for microservices, cache invalidation, and replication.",
            category: "study",
            total_stake: 1000,
            status: "active",
            tasks: [
              { id: "t1", title: "Microservices & RPC", stake_amount: 200, status: "verified_pass", verification_method: "quiz" },
              { id: "t2", title: "Cache & Redis Strategies", stake_amount: 200, status: "verified_pass", verification_method: "quiz" },
              { id: "t3", title: "Sharding & Consistency", stake_amount: 200, status: "pending", verification_method: "quiz" },
              { id: "t4", title: "Message Queues & Kafka", stake_amount: 200, status: "locked", verification_method: "quiz" },
              { id: "t5", title: "System Architecture Audit", stake_amount: 200, status: "locked", verification_method: "quiz" },
            ],
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadGoal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="p-8 sm:p-12 text-center bg-[#12181E] border border-[#1E293B] rounded-2xl max-w-lg mx-auto my-12">
        <h2 className="type-heading text-lg text-white mb-4">Goal Commitment Not Found</h2>
        <Link href="/dashboard" className="btn-glass text-xs !py-2.5 !px-4">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const tasks = goal.tasks || [];
  const completedCount = tasks.filter((t: any) => t.status === "verified_pass").length;
  const refundedCapital = completedCount * (tasks[0]?.stake_amount || 0);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 space-y-8 sm:space-y-10">
      {/* Back button */}
      <Link
        href="/goals"
        className="inline-flex items-center gap-2 type-label text-[#94A3B8] hover:text-[#10B981] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO COMMITMENTS</span>
      </Link>

      {/* ── Signature 3D Commitment Card & Specs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        <div className="lg:col-span-6 flex justify-center w-full">
          <CommitmentCard
            stakeAmount={goal.total_stake}
            goalTitle={goal.title}
            deadline="Active Vault"
            vaultId="COMMITX VAULT"
          />
        </div>

        <div className="lg:col-span-6 bg-[#12181E] border border-[#1E293B] rounded-2xl p-5 sm:p-6 space-y-4">
          <span className="type-label text-[#10B981] px-2.5 py-0.5 rounded bg-[#090D10] border border-[#1E293B]">
            {CATEGORY_LABELS[goal.category as keyof typeof CATEGORY_LABELS] || goal.category}
          </span>
          <h1 className="type-heading text-lg sm:text-xl text-white">
            {goal.title}
          </h1>
          {goal.description && (
            <p className="type-body text-xs leading-relaxed">
              {goal.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]">
            <div>
              <span className="type-label text-[10px] block">TOTAL STAKE</span>
              <span className="font-mono text-base sm:text-lg font-bold text-white">₹{goal.total_stake}</span>
            </div>
            <div>
              <span className="type-label text-[10px] block">REFUNDED TO DATE</span>
              <span className="font-mono text-base sm:text-lg font-bold text-[#10B981]">₹{refundedCapital}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Physical Milestone Rail Track ── */}
      <div className="bg-[#12181E] border border-[#1E293B] rounded-2xl p-5 sm:p-6 space-y-3 overflow-x-auto">
        <div className="flex items-center justify-between">
          <span className="type-heading text-xs sm:text-sm text-white">
            Milestone Verification Rail
          </span>
          <span className="font-mono text-xs text-white/50">
            {completedCount} of {tasks.length} Completed
          </span>
        </div>

        <MilestoneRail tasks={tasks} goalId={id} />
      </div>

      {/* ── Milestone Deliverable Requirements ── */}
      <div className="space-y-3">
        <h3 className="type-heading text-xs sm:text-sm text-white">
          Milestone Breakdown
        </h3>

        <div className="space-y-2.5">
          {tasks.map((task: any, index: number) => {
            const isPassed = task.status === "verified_pass";
            const isPending = task.status === "pending";
            const isFailed = task.status === "verified_fail";

            return (
              <div
                key={task.id || index}
                className="p-4 sm:p-5 rounded-2xl bg-[#12181E] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-[#334155] transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isPassed
                        ? "bg-[#10B981] text-[#090D10]"
                        : isPending
                        ? "bg-[#090D10] text-[#F59E0B] border border-[#F59E0B]"
                        : isFailed
                        ? "bg-[#F43F5E] text-white"
                        : "bg-[#090D10] text-white/30 border border-[#1E293B]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="type-heading text-xs sm:text-sm text-white">
                      {task.title}
                    </h4>
                    <p className="type-body text-[11px] sm:text-xs mt-0.5">
                      {VERIFICATION_LABELS[task.verification_method as keyof typeof VERIFICATION_LABELS] || task.verification_method}
                      {task.deadline && ` • Due: ${task.deadline}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1E293B]">
                  <span className="font-mono text-xs sm:text-sm font-bold text-white">
                    ₹{task.stake_amount}
                  </span>

                  {isPending ? (
                    <Link
                      href={`/goals/${id}/tasks/${task.id}/submit`}
                      className="verify-btn !py-2 sm:!py-2.5 !px-4 sm:!px-5 text-xs font-mono"
                    >
                      Verify Now
                    </Link>
                  ) : isPassed ? (
                    <span className="text-xs font-mono font-semibold text-[#10B981] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Refunded</span>
                    </span>
                  ) : isFailed ? (
                    <span className="text-xs font-mono text-[#F43F5E]">
                      Forfeited
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-white/30">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
