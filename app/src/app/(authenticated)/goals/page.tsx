"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/types";
import TiltCard from "@/components/ui/TiltCard";
import ProgressRing from "@/components/ui/ProgressRing";
import { PlusCircle, Lock, ArrowRight, Loader2 } from "lucide-react";

interface GoalItem {
  id: string;
  title: string;
  description: string;
  category: "generic_habit" | "study" | "business_creative";
  status: string;
  total_stake: number;
  tasks?: any[];
  end_date: string;
}

export default function GoalsListPage() {
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/goals");
        if (res.ok) {
          const data = await res.json();
          setGoals(data.goals || []);
        } else {
          // Demo fallback
          setGoals([
            {
              id: "demo-1",
              title: "Daily Morning Meditation & Focus",
              description: "Maintain 10 days of uninterrupted morning focus sessions.",
              category: "generic_habit",
              status: "active",
              total_stake: 150,
              end_date: "2026-10-31",
              tasks: [{ status: "verified_pass" }, { status: "verified_pass" }, { status: "pending" }],
            },
            {
              id: "demo-2",
              title: "Clean Architecture & Code Refactoring",
              description: "Refactor core modules with clean domain layers and tests.",
              category: "business_creative",
              status: "active",
              total_stake: 300,
              end_date: "2026-11-05",
              tasks: [{ status: "verified_pass" }, { status: "pending" }],
            },
            {
              id: "demo-3",
              title: "System Design & Distributed Systems",
              description: "Master distributed messaging, Kafka, and consensus protocols.",
              category: "study",
              status: "active",
              total_stake: 200,
              end_date: "2026-11-12",
              tasks: [{ status: "verified_pass" }, { status: "locked" }, { status: "locked" }],
            },
          ]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
            ESCROW VAULT DIRECTORY
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            Active Commitments
          </h1>
        </div>

        <Link
          href="/goals/new"
          className="btn-primary text-xs uppercase tracking-wider !py-3 !px-5 inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Vault</span>
        </Link>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <TiltCard className="p-12 text-center bg-[#12181E] border border-[#1E293B] max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#10B981]/15 text-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="font-sans text-xl font-bold text-[#F8FAFC] mb-2">
            No Active Commitment Vaults
          </h3>
          <p className="text-xs text-[#94A3B8] mb-6 leading-relaxed">
            Lock your financial capital in escrow to guarantee focus on your highest-priority ambitions.
          </p>
          <Link
            href="/goals/new"
            className="btn-primary text-xs !py-3 !px-5 inline-flex items-center gap-2"
          >
            <span>Create Your First Goal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </TiltCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const completed = (goal.tasks || []).filter(
              (t: any) => t.status === "verified_pass"
            ).length;
            const total = (goal.tasks || []).length || 1;
            const pct = Math.round((completed / total) * 100);

            return (
              <TiltCard
                key={goal.id}
                className="p-6 bg-[#12181E] border border-[#1E293B] flex flex-col justify-between h-80"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10B981] bg-[#10B981]/15 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full">
                      {CATEGORY_LABELS[goal.category] || goal.category}
                    </span>
                    <span className="font-mono text-sm font-black text-[#10B981]">
                      ₹{goal.total_stake} Staked
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-[#F8FAFC] line-clamp-2">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-[#94A3B8] text-xs line-clamp-2 mt-2 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="py-4 flex items-center justify-between border-y border-[#1E293B]/60">
                  <div className="text-xs font-mono space-y-1">
                    <p className="text-[#94A3B8]">Progress:</p>
                    <p className="text-[#F8FAFC] font-bold">{completed} / {total} Verified</p>
                  </div>
                  <ProgressRing
                    progress={pct}
                    size={65}
                    strokeWidth={6}
                    label={`${pct}%`}
                    color={pct >= 60 ? "emerald" : "amber"}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Link
                    href={`/goals/${goal.id}`}
                    className="btn-primary w-full text-center !py-2.5 text-xs font-mono"
                  >
                    Open Commitment Vault
                  </Link>
                </div>
              </TiltCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
