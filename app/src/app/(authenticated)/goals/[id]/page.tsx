"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CATEGORY_LABELS, VERIFICATION_LABELS } from "@/lib/types";

interface GoalDetailProps {
  params: Promise<{ id: string }>;
}

export default function GoalDetailPage({ params }: GoalDetailProps) {
  const { id } = use(params);
  const router = useRouter();

  const [goal, setGoal] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadGoal() {
      try {
        const res = await fetch(`/api/goals/${id}`);
        if (res.ok) {
          const data = await res.json();
          setGoal(data.goal);
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
      <div className="flex items-center justify-center p-20">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="p-12 text-center bg-surface-container rounded-3xl">
        <h2 className="font-headline text-2xl font-bold mb-4">Goal not found</h2>
        <Link href="/dashboard" className="text-primary underline">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const tasks = goal.tasks || [];
  const completedCount = tasks.filter((t: any) => t.status === "verified_pass").length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
      {/* Back button */}
      <Link
        href="/goals"
        className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold w-max"
      >
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Back to Commitments
      </Link>

      {/* Goal Header Card */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 border border-outline-variant/30 shadow-organic flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-3 py-1 rounded-full">
              {CATEGORY_LABELS[goal.category as keyof typeof CATEGORY_LABELS] || goal.category}
            </span>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mt-3">
              {goal.title}
            </h1>
            {goal.description && (
              <p className="text-on-surface-variant text-base mt-2 max-w-2xl leading-relaxed">
                {goal.description}
              </p>
            )}
          </div>

          <div className="flex flex-col items-start md:items-end bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">
              Total Escrow Stake
            </span>
            <span className="font-headline text-3xl md:text-4xl font-bold text-primary">
              ₹{goal.total_stake}
            </span>
            <span className="text-xs text-on-surface-variant mt-1">
              Held in Razorpay Trust
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-sm font-semibold mb-2">
            <span className="text-on-surface">
              Overall Progress ({completedCount} of {tasks.length} completed)
            </span>
            <span className="text-primary font-headline text-base">
              {progressPct}%
            </span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-3.5 overflow-hidden shadow-inner">
            <div
              className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Milestones & Tasks Section */}
      <div className="flex flex-col gap-4">
        <h2 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary filled">
            checklist
          </span>
          Milestones & Verifications
        </h2>

        <div className="space-y-4">
          {tasks.map((task: any, index: number) => {
            const isCompleted = task.status === "verified_pass";
            const isFailed = task.status === "verified_fail" || task.status === "expired";
            const isPendingReview = task.status === "submitted";

            return (
              <div
                key={task.id}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-primary-container text-on-primary-container"
                        : isFailed
                        ? "bg-error-container text-on-error-container"
                        : "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {isCompleted
                        ? "check_circle"
                        : isFailed
                        ? "cancel"
                        : isPendingReview
                        ? "hourglass_top"
                        : "pending"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface">
                      {task.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant mt-1">
                      <span>
                        Method:{" "}
                        <strong>
                          {VERIFICATION_LABELS[task.verification_method as keyof typeof VERIFICATION_LABELS] ||
                            task.verification_method}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Deadline:{" "}
                        <strong>
                          {new Date(task.deadline).toLocaleDateString()}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Stake:{" "}
                        <strong className="text-primary">
                          ₹{task.stake_amount}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status / Action CTA */}
                <div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-primary bg-primary-fixed/40 px-4 py-2 rounded-xl text-xs font-bold">
                      <span className="material-symbols-outlined text-base">check</span>
                      Verified Pass (Refunded)
                    </span>
                  ) : isPendingReview ? (
                    <span className="inline-flex items-center gap-1 text-tertiary bg-tertiary-fixed/40 px-4 py-2 rounded-xl text-xs font-bold">
                      <span className="material-symbols-outlined text-base">hourglass_top</span>
                      Under Review
                    </span>
                  ) : isFailed ? (
                    <span className="inline-flex items-center gap-1 text-error bg-error-container px-4 py-2 rounded-xl text-xs font-bold">
                      <span className="material-symbols-outlined text-base">close</span>
                      Forfeited
                    </span>
                  ) : (
                    <Link
                      href={`/goals/${goal.id}/tasks/${task.id}/submit`}
                      className="bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">upload_file</span>
                      Submit Proof
                    </Link>
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
