"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { CATEGORY_LABELS, VERIFICATION_LABELS } from "@/lib/types";
import TiltCard from "@/components/ui/TiltCard";
import ProgressRing from "@/components/ui/ProgressRing";
import MilestoneRoadmap from "@/components/ui/MilestoneRoadmap";

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
        <span className="material-symbols-outlined animate-spin text-4xl text-[#10B981]">
          progress_activity
        </span>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="p-12 text-center bg-[#12181E] border border-[#1E293B] rounded-3xl max-w-lg mx-auto my-12">
        <h2 className="font-sans text-xl font-bold mb-4">Goal Commitment Not Found</h2>
        <Link href="/dashboard" className="btn-primary text-xs !py-2.5 !px-4">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const tasks = goal.tasks || [];
  const completedCount = tasks.filter((t: any) => t.status === "verified_pass").length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const refundedCapital = completedCount * (tasks[0]?.stake_amount || 0);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Back button */}
      <Link
        href="/goals"
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#94A3B8] hover:text-[#10B981] transition-colors"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        BACK TO ALL COMMITMENTS
      </Link>

      {/* Hero Header Card */}
      <TiltCard glow="emerald" className="p-8 sm:p-10 bg-[#12181E] border border-[#1E293B] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 rounded-full">
              {CATEGORY_LABELS[goal.category as keyof typeof CATEGORY_LABELS] || goal.category}
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              {goal.title}
            </h1>
            {goal.description && (
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                {goal.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6 p-5 rounded-2xl bg-[#090D10] border border-[#1E293B]">
            <ProgressRing
              progress={progressPct}
              size={85}
              strokeWidth={8}
              label={`${progressPct}%`}
              color="emerald"
            />
            <div className="font-mono text-xs space-y-1">
              <p className="text-[#94A3B8]">TOTAL ESCROW PLEDGE:</p>
              <p className="text-2xl font-black text-[#10B981]">₹{goal.total_stake}</p>
              <p className="text-[#64748B]">Refunded: ₹{refundedCapital}</p>
            </div>
          </div>
        </div>
      </TiltCard>

      {/* ── Isometric Milestone Roadmap ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10B981]">alt_route</span>
            <h3 className="font-sans text-xl font-bold text-[#F8FAFC]">Milestone Verification Track</h3>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">{completedCount} of {tasks.length} Completed</span>
        </div>

        <TiltCard className="p-6 bg-[#12181E] border border-[#1E293B]">
          <MilestoneRoadmap tasks={tasks} goalId={id} />
        </TiltCard>
      </div>

      {/* ── Detailed Task Step Cards ── */}
      <div className="space-y-4">
        <h3 className="font-sans text-lg font-bold text-[#F8FAFC]">Milestone Deliverable Requirements</h3>

        <div className="space-y-3">
          {tasks.map((task: any, index: number) => {
            const isPassed = task.status === "verified_pass";
            const isPending = task.status === "pending";
            const isFailed = task.status === "verified_fail";

            return (
              <div
                key={task.id || index}
                className="p-5 rounded-2xl bg-[#12181E] border border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#334155] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isPassed
                        ? "bg-[#10B981]/20 text-[#10B981]"
                        : isPending
                        ? "bg-[#F59E0B]/20 text-[#F59E0B] animate-pulse"
                        : isFailed
                        ? "bg-[#F43F5E]/20 text-[#F43F5E]"
                        : "bg-[#1E293B] text-[#94A3B8]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="font-sans font-bold text-sm sm:text-base text-[#F8FAFC]">
                      {task.title}
                    </h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Mode: <span className="text-[#F8FAFC] font-semibold">{VERIFICATION_LABELS[task.verification_method as keyof typeof VERIFICATION_LABELS] || task.verification_method}</span>
                      {task.deadline && ` • Due: ${task.deadline}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <span className="font-mono text-sm font-extrabold text-[#10B981]">
                    ₹{task.stake_amount}
                  </span>

                  {isPending ? (
                    <Link
                      href={`/goals/${id}/tasks/${task.id}/submit`}
                      className="btn-primary text-xs !py-2 !px-4"
                    >
                      Submit Proof
                    </Link>
                  ) : isPassed ? (
                    <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      REFUNDED
                    </span>
                  ) : isFailed ? (
                    <span className="text-xs font-mono font-bold text-[#F43F5E] bg-[#F43F5E]/15 border border-[#F43F5E]/30 px-3 py-1 rounded-full">
                      FORFEITED
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-[#64748B] px-3 py-1 rounded-full bg-[#090D10]">
                      LOCKED
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
