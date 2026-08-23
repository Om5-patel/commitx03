"use client";

import { useEffect, useState } from "react";

interface AdminDisputeItem {
  id: string;
  userName: string;
  userEmail: string;
  taskTitle: string;
  reason: string;
  stakeAmount: number;
  createdAt: string;
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<AdminDisputeItem[]>([
    {
      id: "disp-1",
      userName: "Rohan Patel",
      userEmail: "rohan.p@example.com",
      taskTitle: "Gym Upper Body Session",
      reason: "The gym lighting was dim so the camera capture was slightly grainy, but my workout tracking watch confirmed 60 minutes active training.",
      stakeAmount: 200,
      createdAt: "Today • 10:20 AM",
    },
  ]);

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleResolve = async (
    id: string,
    resolution: "resolved_in_favour" | "resolved_against"
  ) => {
    setProcessingId(id);
    try {
      await fetch(`/api/disputes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resolution,
          admin_note:
            notes[id] ||
            (resolution === "resolved_in_favour"
              ? "Overturned after manual evidence review"
              : "Dispute rejected: evidence insufficient"),
        }),
      });

      setDisputes((prev) => prev.filter((d) => d.id !== id));
    } catch (e) {
      console.error(e);
      setDisputes((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl text-on-surface mb-2">
          Dispute Adjudication
        </h1>
        <p className="text-on-surface-variant text-base">
          Review contested milestone failures. Resolving in favor triggers an immediate refund.
        </p>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-surface rounded-3xl p-12 text-center border border-outline-variant/30 shadow-sm">
          <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl filled">
              gavel
            </span>
          </div>
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-1">
            No Open Disputes
          </h3>
          <p className="text-on-surface-variant text-sm">
            All user dispute requests have been resolved.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {disputes.map((d) => (
            <div
              key={d.id}
              className="bg-surface rounded-3xl p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-error bg-error-container text-on-error-container px-3 py-1 rounded-full">
                    Contested Forfeiture
                  </span>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mt-2">
                    Milestone: {d.taskTitle}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    Filed by <strong>{d.userName}</strong> ({d.userEmail}) • {d.createdAt}
                  </p>
                </div>

                <div className="bg-surface-container-low px-5 py-3 rounded-2xl border border-outline-variant/20 text-right">
                  <span className="text-xs font-bold text-on-surface-variant uppercase">
                    Disputed Stake
                  </span>
                  <div className="font-headline text-2xl font-bold text-primary">
                    ₹{d.stakeAmount}
                  </div>
                </div>
              </div>

              {/* User statement */}
              <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-xs leading-relaxed">
                <strong className="text-on-surface block mb-1">
                  User Dispute Statement:
                </strong>
                <p className="text-on-surface-variant italic">
                  &ldquo;{d.reason}&rdquo;
                </p>
              </div>

              {/* Admin note */}
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Official Adjudication Finding
                </label>
                <input
                  type="text"
                  placeholder="Reason for overturning or upholding forfeiture..."
                  value={notes[d.id] || ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [d.id]: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <button
                  onClick={() => handleResolve(d.id, "resolved_against")}
                  disabled={processingId === d.id}
                  className="px-6 py-3 rounded-xl border border-error/40 text-error font-bold text-sm hover:bg-error-container/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  Uphold Forfeiture (Reject Claim)
                </button>
                <button
                  onClick={() => handleResolve(d.id, "resolved_in_favour")}
                  disabled={processingId === d.id}
                  className="bg-primary text-on-primary font-bold text-sm px-8 py-3 rounded-xl shadow-sm hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === d.id ? (
                    "Processing..."
                  ) : (
                    <>
                      Overturn & Refund Stake (₹{d.stakeAmount})
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
