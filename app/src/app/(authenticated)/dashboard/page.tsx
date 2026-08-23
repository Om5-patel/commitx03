"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";

interface GoalItem {
  id: string;
  title: string;
  category: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  stake: number;
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

  const [timeLeft, setTimeLeft] = useState<string>("08h 45m 12s");
  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: "demo-1",
      title: "Daily Morning Meditation",
      category: "generic_habit",
      progress: 80,
      totalTasks: 10,
      completedTasks: 8,
      stake: 150,
    },
    {
      id: "demo-2",
      title: "Clean Code & Refactoring",
      category: "business_creative",
      progress: 60,
      totalTasks: 5,
      completedTasks: 3,
      stake: 300,
    },
    {
      id: "demo-3",
      title: "Deep Work Sprint (Algorithms)",
      category: "study",
      progress: 25,
      totalTasks: 4,
      completedTasks: 1,
      stake: 200,
    },
  ]);

  const [totalStake, setTotalStake] = useState<number>(4250);
  const [successRate, setSuccessRate] = useState<number>(94);

  const [treasuryLogs, setTreasuryLogs] = useState<LogItem[]>([
    {
      id: "log-1",
      title: "Refund: Read 30 Pages",
      date: "Today • 14:30",
      amount: 50,
      type: "refund",
    },
    {
      id: "log-2",
      title: "Stake: Morning Run Sprint",
      date: "Yesterday • 08:15",
      amount: 150,
      type: "deposit",
    },
    {
      id: "log-3",
      title: "Missed: Late Night Coding",
      date: "Oct 20 • 23:59",
      amount: 25,
      type: "forfeiture",
    },
  ]);

  // Trigger celebration confetti if arriving from newly created goal
  useEffect(() => {
    if (isNewGoal) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4a7c59", "#78a886", "#c4a66a", "#f8e0a8"],
      });
    }
  }, [isNewGoal]);

  // Live countdown timer effect
  useEffect(() => {
    let secondsTotal = 8 * 3600 + 45 * 60 + 12;
    const interval = setInterval(() => {
      secondsTotal = Math.max(0, secondsTotal - 1);
      const h = Math.floor(secondsTotal / 3600).toString().padStart(2, "0");
      const m = Math.floor((secondsTotal % 3600) / 60).toString().padStart(2, "0");
      const s = (secondsTotal % 60).toString().padStart(2, "0");
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch real goals if available
  useEffect(() => {
    async function fetchUserGoals() {
      try {
        const res = await fetch("/api/goals");
        if (res.ok) {
          const data = await res.json();
          if (data.goals && data.goals.length > 0) {
            const mapped: GoalItem[] = data.goals.map((g: any) => {
              const tasks = g.tasks || [];
              const completed = tasks.filter((t: any) => t.status === "verified_pass").length;
              const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
              return {
                id: g.id,
                title: g.title,
                category: g.category,
                progress: pct,
                totalTasks: tasks.length || 1,
                completedTasks: completed,
                stake: Number(g.total_stake),
              };
            });
            setGoals(mapped);

            const calculatedTotal = mapped.reduce((acc, curr) => acc + curr.stake, 0);
            if (calculatedTotal > 0) {
              setTotalStake(calculatedTotal);
            }
          }
        }
      } catch (e) {
        // Fallback gracefully to demo goals
      }
    }
    fetchUserGoals();
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-surface-container text-primary px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <span className="material-symbols-outlined text-sm filled">psychiatry</span>
            Rooted in Accountability
          </div>
          <h1 className="font-headline text-4xl text-on-surface">
            Dashboard
          </h1>
          <p className="text-on-surface-variant text-base mt-1">
            Welcome back. Keep your intentions locked and focused.
          </p>
        </div>

        <Link
          href="/goals/new"
          className="bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-xl shadow-organic hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Commitment
        </Link>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
        {/* ── Hero Stat: Total Stakes Held (Span 8) ── */}
        <div className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded-3xl p-8 shadow-organic flex flex-col justify-between relative overflow-hidden group border border-outline-variant/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary-container/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-tertiary-container text-on-tertiary-container p-3 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined icon-fill text-2xl">
                  account_balance
                </span>
              </div>
              <div>
                <h2 className="font-headline text-xl text-on-surface font-semibold">
                  Total Stakes Held in Escrow
                </h2>
                <span className="text-xs text-on-surface-variant">
                  Protected & 100% Refundable
                </span>
              </div>
            </div>
            <span className="bg-surface-container-high text-on-surface-variant px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border border-outline-variant/30">
              Escrow Vault
            </span>
          </div>

          <div className="relative z-10">
            <div className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-tight">
              ₹{totalStake.toLocaleString("en-IN")}
              <span className="text-2xl text-on-surface-variant ml-2 font-body font-normal">
                .00
              </span>
            </div>
            <p className="mt-4 text-on-surface-variant flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-primary text-base">
                trending_up
              </span>
              <span className="text-primary font-semibold">+12%</span> active consistency this month
            </p>
          </div>
        </div>

        {/* ── Side Stats Stack (Span 4) ── */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          {/* Next Deadline */}
          <div className="bg-surface-container rounded-3xl p-6 shadow-organic flex-grow flex flex-col justify-center border border-outline-variant/20">
            <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-xl">
                timer
              </span>
              <h3 className="font-semibold text-xs uppercase tracking-wider">
                Next Deadline
              </h3>
            </div>
            <div className="font-headline text-3xl text-on-surface font-bold mb-1">
              {timeLeft}
            </div>
            <p className="text-on-surface-variant text-xs">
              For: <span className="font-semibold text-on-surface">Daily Morning Meditation</span>
            </p>
          </div>

          {/* Success Rate */}
          <div className="bg-primary-container rounded-3xl p-6 shadow-organic flex-grow flex items-center justify-between text-on-primary-container border border-primary/20">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-lg">
                  hotel_class
                </span>
                <h3 className="font-semibold text-xs uppercase tracking-wider">
                  Success Rate
                </h3>
              </div>
              <div className="font-headline text-4xl font-bold">
                {successRate}%
              </div>
              <span className="text-xs opacity-80 mt-1 block">
                Top 5% consistency tier
              </span>
            </div>
            <div className="w-16 h-16 bg-primary-fixed rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-primary text-3xl filled">
                eco
              </span>
            </div>
          </div>
        </div>

        {/* ── Active Commitments (Span 6) ── */}
        <div className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-organic border border-outline-variant/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-2xl text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary filled">
                local_florist
              </span>
              Active Commitments
            </h2>
            <Link
              href="/goals/new"
              className="text-primary hover:bg-surface-container p-2 rounded-full transition-colors"
              title="Add Goal"
            >
              <span className="material-symbols-outlined">add</span>
            </Link>
          </div>

          <div className="space-y-6">
            {goals.map((goal) => (
              <Link
                key={goal.id}
                href={`/goals/${goal.id}`}
                className="group block p-3 rounded-2xl hover:bg-surface-container-low transition-colors"
              >
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h4 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors">
                      {goal.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      {goal.completedTasks} of {goal.totalTasks} milestones completed • Stake: ₹{goal.stake}
                    </p>
                  </div>
                  <span className="font-headline text-primary font-bold text-sm">
                    {goal.progress}%
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Treasury Log (Span 6) ── */}
        <div className="col-span-1 md:col-span-6 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-organic border border-outline-variant/20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-2xl text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary filled">
                history
              </span>
              Treasury Log
            </h2>
            <span className="text-xs text-primary font-semibold">
              Live Transactions
            </span>
          </div>

          <div className="space-y-3">
            {treasuryLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-outline-variant/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      log.type === "refund"
                        ? "bg-primary-container text-on-primary-container"
                        : log.type === "deposit"
                        ? "bg-surface-container-high text-on-surface"
                        : "bg-error-container text-on-error-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      {log.type === "refund"
                        ? "arrow_downward"
                        : log.type === "deposit"
                        ? "arrow_upward"
                        : "local_fire_department"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-sm">
                      {log.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      {log.date}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-headline font-bold text-sm block ${
                      log.type === "refund"
                        ? "text-primary"
                        : log.type === "deposit"
                        ? "text-on-surface"
                        : "text-error"
                    }`}
                  >
                    {log.type === "refund"
                      ? `+ ₹${log.amount}.00`
                      : log.type === "deposit"
                      ? `- ₹${log.amount}.00`
                      : `- ₹${log.amount}.00`}
                  </span>
                  <span className="text-[10px] text-on-surface-variant uppercase">
                    {log.type === "forfeiture" ? "Forfeited" : "INR Escrow"}
                  </span>
                </div>
              </div>
            ))}
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
        <div className="flex items-center justify-center p-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
