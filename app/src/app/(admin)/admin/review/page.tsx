"use client";

import { useEffect, useState } from "react";

interface ReviewItem {
  id: string;
  taskTitle: string;
  userName: string;
  userEmail: string;
  method: string;
  flagReason: string;
  submittedAt: string;
  artifactContent: string;
  stakeAmount: number;
}

export default function AdminReviewQueuePage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "sub-1",
      taskTitle: "5km Morning Jog Route",
      userName: "Alex Chen",
      userEmail: "alex.chen@example.com",
      method: "Photo Proof",
      flagReason: "Perceptual image hash collision (92% similarity to previous submission)",
      submittedAt: "Today • 07:15 AM",
      artifactContent: "GPS Coordinates: 12.97° N, 77.59° E • EXIF Time: 07:12 AM",
      stakeAmount: 150,
    },
    {
      id: "sub-2",
      taskTitle: "Q3 Product Architecture Spec",
      userName: "Priya Sharma",
      userEmail: "priya.s@example.com",
      method: "File Artifact",
      flagReason: "Borderline AI relevance score (0.58 / 1.00) — requires human confirmation",
      submittedAt: "Yesterday • 18:30 PM",
      artifactContent: "Link: github.com/commitx/arch-v1/commit/8f92a1\nSummary: Added auth middleware and Supabase RLS policies.",
      stakeAmount: 300,
    },
  ]);

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reviewer_note: notes[id] || (action === "approve" ? "Verified pass by admin" : "Insufficient proof"),
        }),
      });

      // Remove from list on completion
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      // Still remove for smooth demo
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl text-on-surface mb-2">
          Manual Review Queue
        </h1>
        <p className="text-on-surface-variant text-base">
          Flagged submissions requiring human adjudication. Approving triggers an immediate stake refund; rejecting converts the stake to platform revenue.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-surface rounded-3xl p-12 text-center border border-outline-variant/30 shadow-sm">
          <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl filled">
              task_alt
            </span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-1">
            Review Queue Clean!
          </h3>
          <p className="text-on-surface-variant text-sm">
            All submitted milestones have been automatically resolved or audited.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="bg-surface rounded-3xl p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-tertiary bg-tertiary-fixed/40 px-3 py-1 rounded-full">
                      {r.method}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      {r.submittedAt}
                    </span>
                  </div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mt-2">
                    {r.taskTitle}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Submitted by: <strong>{r.userName}</strong> ({r.userEmail})
                  </p>
                </div>

                <div className="bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/20 text-right">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">
                    Stake in Escrow
                  </span>
                  <div className="font-headline text-2xl font-bold text-primary">
                    ₹{r.stakeAmount}
                  </div>
                </div>
              </div>

              {/* Flag reason box */}
              <div className="p-4 rounded-2xl bg-tertiary-container/20 border border-tertiary/30 text-xs flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-lg shrink-0 mt-0.5">
                  warning
                </span>
                <div>
                  <strong className="text-on-surface block mb-0.5">
                    Flag Trigger Reason:
                  </strong>
                  <span className="text-on-surface-variant leading-relaxed">
                    {r.flagReason}
                  </span>
                </div>
              </div>

              {/* Submitted content preview */}
              <div className="p-4 rounded-2xl bg-surface-container text-xs font-mono text-on-surface leading-relaxed whitespace-pre-wrap">
                {r.artifactContent}
              </div>

              {/* Review note input */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Reviewer Audit Note
                </label>
                <input
                  type="text"
                  placeholder="Provide brief justification for approval or rejection..."
                  value={notes[r.id] || ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [r.id]: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <button
                  onClick={() => handleAction(r.id, "reject")}
                  disabled={processingId === r.id}
                  className="px-6 py-3 rounded-xl border border-error/40 text-error font-bold text-sm hover:bg-error-container/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  Reject & Forfeit Stake
                </button>
                <button
                  onClick={() => handleAction(r.id, "approve")}
                  disabled={processingId === r.id}
                  className="bg-primary text-on-primary font-bold text-sm px-8 py-3 rounded-xl shadow-sm hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === r.id ? (
                    "Processing..."
                  ) : (
                    <>
                      Approve & Refund Stake (₹{r.stakeAmount})
                      <span className="material-symbols-outlined text-base">
                        check
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
