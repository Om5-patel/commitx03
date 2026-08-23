"use client";

import { useState } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { CheckCheck, AlertTriangle, Check, Loader2 } from "lucide-react";

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
      await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reviewer_note: notes[id] || (action === "approve" ? "Verified pass by admin" : "Insufficient proof"),
        }),
      });

      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-[#F59E0B] uppercase">
          AUDIT QUEUE
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Manual Review Queue
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Flagged submissions requiring human adjudication. Approving triggers an immediate stake refund; rejecting converts the stake to platform revenue.
        </p>
      </div>

      {reviews.length === 0 ? (
        <TiltCard className="p-12 text-center bg-[#12181E] border border-[#1E293B] max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#10B981]/15 text-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCheck className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="font-sans text-xl font-bold text-[#F8FAFC] mb-1">
            Review Queue Clean!
          </h3>
          <p className="text-xs text-[#94A3B8]">
            All submitted milestones have been automatically resolved or audited.
          </p>
        </TiltCard>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <TiltCard
              key={r.id}
              className="p-8 bg-[#12181E] border border-[#1E293B] flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F59E0B] bg-[#F59E0B]/15 border border-[#F59E0B]/30 px-3 py-0.5 rounded-full">
                      {r.method}
                    </span>
                    <span className="text-xs font-mono text-[#94A3B8]">
                      {r.submittedAt}
                    </span>
                  </div>
                  <h3 className="font-sans text-2xl font-bold text-[#F8FAFC] mt-2">
                    {r.taskTitle}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Submitted by: <strong className="text-[#F8FAFC]">{r.userName}</strong> ({r.userEmail})
                  </p>
                </div>

                <div className="bg-[#090D10] px-5 py-3 rounded-xl border border-[#1E293B] text-right">
                  <span className="text-xs font-mono text-[#94A3B8] uppercase block">
                    Stake in Escrow
                  </span>
                  <div className="font-mono text-2xl font-extrabold text-[#10B981]">
                    ₹{r.stakeAmount}
                  </div>
                </div>
              </div>

              {/* Flag reason box */}
              <div className="p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F8FAFC] block mb-0.5 font-mono">
                    Flag Trigger Reason:
                  </strong>
                  <span className="text-[#94A3B8] leading-relaxed">
                    {r.flagReason}
                  </span>
                </div>
              </div>

              {/* Submitted content preview */}
              <div className="p-4 rounded-xl bg-[#090D10] border border-[#1E293B] text-xs font-mono text-[#F8FAFC] leading-relaxed whitespace-pre-wrap">
                {r.artifactContent}
              </div>

              {/* Review note input */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Reviewer Audit Note
                </label>
                <input
                  type="text"
                  placeholder="Provide brief justification for approval or rejection..."
                  value={notes[r.id] || ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [r.id]: e.target.value })
                  }
                  className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-4 py-3 text-xs font-mono text-[#F8FAFC] outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleAction(r.id, "reject")}
                  disabled={processingId === r.id}
                  className="btn-destructive text-xs !py-2.5 !px-5 font-mono cursor-pointer disabled:opacity-50"
                >
                  Reject & Forfeit Stake
                </button>
                <button
                  type="button"
                  onClick={() => handleAction(r.id, "approve")}
                  disabled={processingId === r.id}
                  className="btn-primary text-xs !py-2.5 !px-6 font-mono cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {processingId === r.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Approve & Refund Stake (₹{r.stakeAmount})</span>
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </TiltCard>
          ))}
        </div>
      )}
    </div>
  );
}
