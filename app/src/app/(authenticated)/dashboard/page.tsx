"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import CommitmentCard from "@/components/ui/CommitmentCard";
import FlipCountdown from "@/components/ui/FlipCountdown";
import ProgressRing from "@/components/ui/ProgressRing";
import {
  Plus,
  ArrowRight,
  ArrowDownLeft,
  X,
  Lock,
  Loader2,
} from "lucide-react";

interface GoalItem {
  id: string;
  title: string;
  category: "generic_habit" | "study" | "business_creative";
  progress: number;
  totalTasks: number;
  completedTasks: number;
  stake: number;
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
  const [goals] = useState<GoalItem[]>([
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

  const [treasuryLogs] = useState<LogItem[]>([
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

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* ── Level 1: Header Bar & New Goal Action ── */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-5">
        <div>
          <span className="type-label text-[#10B981]">
            PORTFOLIO ACCOUNTABILITY VAULT
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight mt-0.5">
            Commitment Terminal
          </h1>
        </div>

        <Link
          href="/goals/new"
          className="btn-glass text-xs font-mono uppercase tracking-wider !py-2.5 !px-4 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4 text-[#10B981]" />
          <span>New Goal</span>
        </Link>
      </div>

      {/* ── Level 1 Signature Element: 3D Credit-Card Vault Hero ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Physical 3D Commitment Card */}
        <div className="lg:col-span-5 flex justify-center">
          <CommitmentCard
            stakeAmount={4250}
            goalTitle="Daily Morning Meditation & Focus"
            deadline="07d 14h"
            vaultId="COMMITX VAULT"
          />
        </div>

        {/* Hero Action & Countdown */}
        <div className="lg:col-span-7 bg-[#12181E] border border-[#1E293B] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="type-label text-[#F59E0B]">
              VERIFICATION WINDOW OPEN
            </span>
            <span className="font-mono text-xs text-white/50">
              Milestone 9 of 10
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="type-heading text-lg text-white">
                Daily Morning Meditation & Focus
              </h2>
              <p className="type-body text-xs mt-1">
                Complete check-in before expiry to unlock your ₹150 stake refund.
              </p>
            </div>
            
            {/* Ticker */}
            <div className="shrink-0">
              <FlipCountdown label="AUTO-FORFEIT" />
            </div>
          </div>

          {/* THE ONE HERO MOMENT: Verify Now Button with Physical Sweep */}
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/goals/demo-1/tasks/task-101/submit"
              className="verify-btn flex-1 text-center"
            >
              Verify Milestone Now
            </Link>
            <Link
              href="/goals/demo-1"
              className="btn-glass !py-3.5 !px-4 text-xs font-mono"
            >
              Roadmap
            </Link>
          </div>
        </div>
      </div>

      {/* ── Level 2: Flat Stat Tiles (No glow, no drop-shadow) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#12181E] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between h-32">
          <span className="type-label">CAPITAL PROTECTED</span>
          <div className="type-data">₹ 4,250</div>
          <span className="type-body text-[11px]">In Escrow Trust</span>
        </div>

        <div className="bg-[#12181E] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between h-32">
          <span className="type-label">SUCCESS RATE</span>
          <div className="type-data">94%</div>
          <span className="type-body text-[11px]">Top 5% Protocol</span>
        </div>

        <div className="bg-[#12181E] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between h-32">
          <span className="type-label">STAKE REFUNDED</span>
          <div className="type-data">₹ 3,150</div>
          <span className="type-body text-[11px]">Returned to You</span>
        </div>

        <div className="bg-[#12181E] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between h-32">
          <span className="type-label">ACTIVE STREAK</span>
          {/* Active streak gets emerald accent color */}
          <div className="type-data !text-[#10B981]">14 Days</div>
          <span className="type-body text-[11px]">Zero missed steps</span>
        </div>
      </div>

      {/* ── Level 2: Active Commitment Vaults ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="type-heading text-base text-white">Active Commitments</h3>
          <Link
            href="/goals"
            className="type-label text-[#10B981] hover:underline inline-flex items-center gap-1 normal-case font-mono"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((g) => (
            <div
              key={g.id}
              className="bg-[#12181E] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between h-64 hover:border-[#334155] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="type-label text-[10px] px-2 py-0.5 rounded bg-[#090D10] border border-[#1E293B]">
                    {g.category === "study" ? "Study Quiz" : g.category === "business_creative" ? "Code Review" : "GPS Photo"}
                  </span>
                  <span className="font-mono text-xs text-[#10B981] font-bold">
                    ₹{g.stake}
                  </span>
                </div>

                <h4 className="type-heading text-sm text-white line-clamp-2">
                  {g.title}
                </h4>
              </div>

              <div className="py-3 flex items-center justify-between border-y border-[#1E293B]">
                <div className="space-y-0.5">
                  <span className="type-body text-[11px] block">Progress</span>
                  <span className="font-mono text-xs font-bold text-white">
                    {g.completedTasks} / {g.totalTasks} Tasks
                  </span>
                </div>
                <ProgressRing
                  progress={g.progress}
                  size={46}
                  strokeWidth={5}
                  label={`${g.progress}%`}
                  color={g.progress >= 70 ? "emerald" : "amber"}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href={`/goals/${g.id}`}
                  className="btn-glass flex-1 text-center !py-2 text-xs font-mono"
                >
                  View
                </Link>
                <Link
                  href={`/goals/${g.id}/tasks/${g.nextTaskId || "t1"}/submit`}
                  className="bg-[#10B981] text-[#090D10] font-semibold flex-1 text-center py-2 px-3 rounded-lg text-xs font-mono hover:bg-[#10B981]/90 transition-colors"
                >
                  Submit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Level 2: Financial Audit Ledger ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="type-heading text-base text-white">Financial Audit Ledger</h3>
          <span className="type-label">Automated Escrow Logs</span>
        </div>

        <div className="rounded-2xl bg-[#12181E] border border-[#1E293B] divide-y divide-[#1E293B] overflow-hidden">
          {treasuryLogs.map((log) => {
            const isRefund = log.type === "refund";
            const isForfeit = log.type === "forfeiture";

            return (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isRefund
                        ? "bg-[#10B981]/15 text-[#10B981]"
                        : isForfeit
                        ? "bg-[#F43F5E]/15 text-[#F43F5E]"
                        : "bg-[#F59E0B]/15 text-[#F59E0B]"
                    }`}
                  >
                    {isRefund ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : isForfeit ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="type-heading text-sm text-white">{log.title}</p>
                    <p className="type-body text-[11px] font-mono mt-0.5">{log.date}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-mono text-sm font-bold ${
                      isRefund
                        ? "text-[#10B981]"
                        : isForfeit
                        ? "text-[#F43F5E]"
                        : "text-[#F59E0B]"
                    }`}
                  >
                    {isRefund ? `+₹${log.amount}` : `-₹${log.amount}`}
                  </p>
                  <span className="type-label text-[10px]">
                    {isRefund ? "Refunded" : isForfeit ? "Forfeited" : "Held in Escrow"}
                  </span>
                </div>
              </div>
            );
          })}
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
          <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
