"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import TiltCard from "@/components/ui/TiltCard";
import FlipCountdown from "@/components/ui/FlipCountdown";
import ProgressRing from "@/components/ui/ProgressRing";
import CountUpNumber from "@/components/ui/CountUpNumber";

interface GoalItem {
  id: string;
  title: string;
  category: "generic_habit" | "study" | "business_creative";
  progress: number;
  totalTasks: number;
  completedTasks: number;
  stake: number;
  nextTaskDeadline?: string;
  nextTaskId?: string;
}

interface LogItem {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "refund" | "deposit" | "forfeiture";
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const isNewGoal = searchParams.get("new_goal");

  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: "demo-1",
      title: "Daily Morning Meditation & Focus",
      category: "generic_habit",
      progress: 80,
      totalTasks: 10,
      completedTasks: 8,
      stake: 150,
      nextTaskId: "task-101",
    },
    {
      id: "demo-2",
      title: "Clean Architecture & Code Refactoring",
      category: "business_creative",
      progress: 60,
      totalTasks: 5,
      completedTasks: 3,
      stake: 300,
      nextTaskId: "task-102",
    },
    {
      id: "demo-3",
      title: "System Design & Distributed Systems",
      category: "study",
      progress: 25,
      totalTasks: 4,
      completedTasks: 1,
      stake: 200,
      nextTaskId: "task-103",
    },
  ]);

  const [totalCapital, setTotalCapital] = useState<number>(4250);
  const [successRate, setSuccessRate] = useState<number>(94);
  const [refundedTotal, setRefundedTotal] = useState<number>(3150);
  const [streakDays, setStreakDays] = useState<number>(14);

  const [treasuryLogs, setTreasuryLogs] = useState<LogItem[]>([
    {
      id: "log-1",
      title: "Verified: Read 30 Pages System Design",
      date: "Today • 14:30",
      amount: 50,
      type: "refund",
    },
    {
      id: "log-2",
      title: "Vault Deposit: Morning Focus Sprint",
      date: "Yesterday • 08:15",
      amount: 150,
      type: "deposit",
    },
    {
      id: "log-3",
      title: "Missed Deadline: Late Night Commit",
      date: "Oct 20 • 23:59",
      amount: 25,
      type: "forfeiture",
    },
  ]);

  // Trigger celebration confetti if arriving from newly created goal
  useEffect(() => {
    if (isNewGoal) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10B981", "#F59E0B", "#06B6D4", "#F8FAFC"],
      });
    }
  }, [isNewGoal]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* ── 1. Top Section: Header & Quick Action ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
              PORTFOLIO ACCOUNTABILITY VAULT
            </span>
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            Commitment Terminal
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/goals/new" className="btn-primary text-xs uppercase tracking-wider !py-3 !px-5">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Lock New Goal
          </Link>
        </div>
      </div>

      {/* ── 2. Urgent Active Commitment Card with 3D Flip Clock ── */}
      <TiltCard glow="amber" className="p-8 bg-gradient-to-br from-[#12181E] via-[#12181E]/95 to-[#1A1A1A] border border-[#F59E0B]/40 shadow-[0_0_40px_rgba(245,158,11,0.12)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left info */}
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold">
              <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              <span>VERIFICATION WINDOW OPEN</span>
            </div>

            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Daily Morning Meditation & Focus
            </h2>

            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Milestone 9 of 10: Complete today&apos;s check-in before the deadline ticker reaches zero to recover your ₹150 stake.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/goals/demo-1/tasks/task-101/submit"
                className="btn-primary !py-3.5 !px-6 text-sm"
              >
                <span className="material-symbols-outlined text-lg">camera_alt</span>
                Verify Milestone Now
              </Link>
              <Link
                href="/goals/demo-1"
                className="btn-glass !py-3.5 !px-5 text-sm"
              >
                View Roadmap
              </Link>
            </div>
          </div>

          {/* Right: 3D Flip Clock Container */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#090D10]/80 border border-[#1E293B]">
            <FlipCountdown label="ESCROW AUTO-FORFEIT TICKER" />
            <span className="text-[11px] font-mono text-[#94A3B8] mt-3">
              Stake at Risk: <strong className="text-[#F8FAFC]">₹150</strong> (100% Refund upon Pass)
            </span>
          </div>
        </div>
      </TiltCard>

      {/* ── 3. Four Metric Tiles with Count-Up & Watermarks ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "TOTAL CAPITAL PROTECTED",
            value: totalCapital,
            prefix: "₹",
            color: "text-[#10B981]",
            glow: "emerald",
            icon: "shield_lock",
            sub: "Locked in Escrow",
          },
          {
            label: "HISTORIC SUCCESS RATE",
            value: successRate,
            suffix: "%",
            color: "text-[#F8FAFC]",
            glow: "none",
            icon: "trending_up",
            sub: "Top 5% of Protocol",
          },
          {
            label: "TOTAL STAKE REFUNDED",
            value: refundedTotal,
            prefix: "₹",
            color: "text-[#06B6D4]",
            glow: "cyan",
            icon: "currency_rupee",
            sub: "Returned to Account",
          },
          {
            label: "CURRENT STREAK",
            value: streakDays,
            suffix: " Days",
            color: "text-[#F59E0B]",
            glow: "amber",
            icon: "local_fire_department",
            sub: "Zero missed milestones",
          },
        ].map((tile, i) => (
          <TiltCard key={i} glow={tile.glow as any} className="p-6 bg-[#12181E] border border-[#1E293B] flex flex-col justify-between h-44">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold tracking-wider text-[#94A3B8] uppercase">
                {tile.label}
              </span>
              <span className={`material-symbols-outlined text-xl ${tile.color}`}>
                {tile.icon}
              </span>
            </div>

            <div>
              <CountUpNumber
                value={tile.value}
                prefix={tile.prefix}
                suffix={tile.suffix}
                className={`text-3xl sm:text-4xl ${tile.color}`}
              />
              <p className="text-xs font-mono text-[#64748B] mt-1">{tile.sub}</p>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* ── 4. Active Vault Commitments ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#10B981]">folder_special</span>
            <h3 className="font-sans text-xl font-bold text-[#F8FAFC]">Active Commitment Vaults</h3>
          </div>
          <Link href="/goals" className="text-xs font-mono text-[#10B981] hover:underline flex items-center gap-1">
            View All Vaults
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((g) => {
            const isStudy = g.category === "study";
            const isWork = g.category === "business_creative";

            return (
              <TiltCard key={g.id} className="p-6 bg-[#12181E] border border-[#1E293B] flex flex-col justify-between h-80">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#090D10] text-[#94A3B8] border border-[#1E293B]">
                      {isStudy ? "AI Study Quiz" : isWork ? "Artifact / Code" : "GPS Photo"}
                    </span>
                    <span className="text-xs font-mono text-[#10B981] font-bold">
                      ₹{g.stake} Staked
                    </span>
                  </div>

                  <h4 className="font-sans text-lg font-bold text-[#F8FAFC] line-clamp-2">
                    {g.title}
                  </h4>
                </div>

                <div className="py-4 flex items-center justify-between border-y border-[#1E293B]/60">
                  <div className="text-xs font-mono space-y-1">
                    <p className="text-[#94A3B8]">Completed:</p>
                    <p className="text-[#F8FAFC] font-bold">{g.completedTasks} / {g.totalTasks} Tasks</p>
                  </div>
                  <ProgressRing
                    progress={g.progress}
                    size={75}
                    strokeWidth={7}
                    label={`${g.progress}%`}
                    color={g.progress >= 70 ? "emerald" : "amber"}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    href={`/goals/${g.id}`}
                    className="btn-glass flex-1 text-center !py-2.5 text-xs font-mono"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/goals/${g.id}/tasks/${g.nextTaskId || "t1"}/submit`}
                    className="btn-primary flex-1 text-center !py-2.5 text-xs font-mono"
                  >
                    Submit Proof
                  </Link>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* ── 5. Treasury Ledger / Transaction Log ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F59E0B]">receipt_long</span>
            <h3 className="font-sans text-xl font-bold text-[#F8FAFC]">Financial Audit Ledger</h3>
          </div>
          <span className="text-xs font-mono text-[#64748B]">Automated Escrow Logs</span>
        </div>

        <div className="rounded-2xl bg-[#12181E] border border-[#1E293B] overflow-hidden">
          <div className="divide-y divide-[#1E293B]">
            {treasuryLogs.map((log) => {
              const isRefund = log.type === "refund";
              const isForfeit = log.type === "forfeiture";

              return (
                <div key={log.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                        isRefund
                          ? "bg-[#10B981]/15 text-[#10B981]"
                          : isForfeit
                          ? "bg-[#F43F5E]/15 text-[#F43F5E]"
                          : "bg-[#F59E0B]/15 text-[#F59E0B]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {isRefund ? "arrow_downward" : isForfeit ? "close" : "lock"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#F8FAFC]">{log.title}</p>
                      <p className="text-xs font-mono text-[#64748B] mt-0.5">{log.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-mono text-sm sm:text-base font-extrabold ${
                        isRefund
                          ? "text-[#10B981]"
                          : isForfeit
                          ? "text-[#F43F5E]"
                          : "text-[#F59E0B]"
                      }`}
                    >
                      {isRefund ? `+₹${log.amount}` : `-₹${log.amount}`}
                    </p>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isRefund
                          ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                          : isForfeit
                          ? "bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/30"
                          : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30"
                      }`}
                    >
                      {isRefund ? "Refunded" : isForfeit ? "Forfeited" : "Held in Escrow"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#10B981]">
            progress_activity
          </span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
