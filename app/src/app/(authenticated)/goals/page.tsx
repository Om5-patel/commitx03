"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/types";
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4 sm:pb-6">
        <div>
          <span className="type-label text-[#10B981]">
            ESCROW VAULT DIRECTORY
          </span>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
            Active Commitments
          </h1>
        </div>

        <Link
          href="/goals/new"
          className="btn-glass text-xs font-mono uppercase tracking-wider !py-2.5 !px-4 inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-[#10B981]" />
          <span>Create New Vault</span>
        </Link>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
        </div>
      ) : goals.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#12181E] border border-[#1E293B] rounded-2xl max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#10B981]/15 text-[#10B981] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="type-heading text-lg text-white mb-2">
            No Active Commitment Vaults
          </h3>
          <p className="type-body text-xs mb-5 leading-relaxed">
            Lock your financial capital in escrow to guarantee focus on your highest-priority ambitions.
          </p>
          <Link
            href="/goals/new"
            className="verify-btn text-xs !py-2.5 !px-5 inline-flex items-center gap-2"
          >
            <span>Create Your First Goal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {goals.map((goal) => {
            const completed = (goal.tasks || []).filter(
              (t: any) => t.status === "verified_pass"
            ).length;
            const total = (goal.tasks || []).length || 1;
            const pct = Math.round((completed / total) * 100);

            return (
              <div
                key={goal.id}
                className="p-5 bg-[#12181E] border border-[#1E293B] rounded-2xl flex flex-col justify-between h-64 hover:border-[#334155] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="type-label text-[10px] px-2 py-0.5 rounded bg-[#090D10] border border-[#1E293B]">
                      {CATEGORY_LABELS[goal.category] || goal.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#10B981]">
                      ₹{goal.total_stake}
                    </span>
                  </div>

                  <h3 className="type-heading text-sm text-white line-clamp-2">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="type-body text-xs line-clamp-2 mt-1.5 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="py-2.5 flex items-center justify-between border-y border-[#1E293B]">
                  <div className="space-y-0.5">
                    <span className="type-body text-[10px] block">Progress</span>
                    <span className="font-mono text-xs font-bold text-white">{completed} / {total} Verified</span>
                  </div>
                  <ProgressRing
                    progress={pct}
                    size={42}
                    strokeWidth={4.5}
                    label={`${pct}%`}
                    color={pct >= 60 ? "emerald" : "amber"}
                  />
                </div>

                <div className="pt-1">
                  <Link
                    href={`/goals/${goal.id}`}
                    className="btn-glass w-full text-center !py-2 text-xs font-mono"
                  >
                    Open Commitment Vault
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
