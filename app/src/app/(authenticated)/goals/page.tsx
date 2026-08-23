"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORY_LABELS } from "@/lib/types";

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
    <div className="w-full">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="font-headline text-4xl text-on-surface mb-2">
            Your Commitments
          </h1>
          <p className="text-on-surface-variant text-base">
            Every goal represents an intention backed by real capital.
          </p>
        </div>

        <Link
          href="/goals/new"
          className="bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-xl shadow-organic hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Commitment
        </Link>
      </header>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : goals.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/30 max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-primary-container">
            <span className="material-symbols-outlined text-3xl filled">
              psychiatry
            </span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
            No active commitments yet
          </h3>
          <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
            Take the first step towards grounded accountability by staking your pledge on a real goal.
          </p>
          <Link
            href="/goals/new"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold px-6 py-3 rounded-xl shadow-organic hover:bg-primary/90 transition-all"
          >
            Create Your First Goal
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const completed = (goal.tasks || []).filter(
              (t: any) => t.status === "verified_pass"
            ).length;
            const total = (goal.tasks || []).length || 1;
            const pct = Math.round((completed / total) * 100);

            return (
              <Link
                key={goal.id}
                href={`/goals/${goal.id}`}
                className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 hover:border-primary/40 shadow-sm hover:shadow-organic transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-3 py-1 rounded-full">
                      {CATEGORY_LABELS[goal.category] || goal.category}
                    </span>
                    <span className="font-headline font-bold text-lg text-primary">
                      ₹{goal.total_stake}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-xl text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {goal.title}
                  </h3>
                  {goal.description && (
                    <p className="text-on-surface-variant text-xs line-clamp-2 mb-4 leading-relaxed">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-outline-variant/20">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-on-surface-variant">
                      {completed} of {total} milestones
                    </span>
                    <span className="font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
