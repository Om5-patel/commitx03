"use client";

import { useState } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { Gavel, Check, Loader2 } from "lucide-react";

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
        <span className="text-xs font-mono font-bold tracking-widest text-[#06B6D4] uppercase">
          ARBITRATION PANEL
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Dispute Adjudication
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Review contested milestone failures. Resolving in favor triggers an immediate refund.
        </p>
      </div>

      {disputes.length === 0 ? (
        <TiltCard className="p-12 text-center bg-[#12181E] border border-[#1E293B] max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#06B6D4]/15 text-[#06B6D4] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Gavel className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h3 className="font-sans text-xl font-bold text-[#F8FAFC] mb-1">
            No Open Disputes
          </h3>
          <p className="text-xs text-[#94A3B8]">
            All user dispute requests have been resolved.
          </p>
        </TiltCard>
      ) : (
        <div className="space-y-6">
          {disputes.map((d) => (
            <TiltCard
              key={d.id}
              className="p-8 bg-[#12181E] border border-[#1E293B] flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F43F5E] bg-[#F43F5E]/15 border border-[#F43F5E]/30 px-3 py-0.5 rounded-full">
                    Contested Forfeiture
                  </span>
                  <h3 className="font-sans text-2xl font-bold text-[#F8FAFC] mt-2">
                    Milestone: {d.taskTitle}
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Filed by <strong className="text-[#F8FAFC]">{d.userName}</strong> ({d.userEmail}) • {d.createdAt}
                  </p>
                </div>

                <div className="bg-[#090D10] px-5 py-3 rounded-xl border border-[#1E293B] text-right">
                  <span className="text-xs font-mono text-[#94A3B8] uppercase block">
                    Disputed Stake
                  </span>
                  <div className="font-mono text-2xl font-extrabold text-[#10B981]">
                    ₹{d.stakeAmount}
                  </div>
                </div>
              </div>

              {/* User statement */}
              <div className="p-5 rounded-xl bg-[#090D10] border border-[#1E293B] text-xs leading-relaxed font-mono">
                <strong className="text-[#F8FAFC] block mb-1">
                  USER DISPUTE STATEMENT:
                </strong>
                <p className="text-[#94A3B8] italic">
                  &ldquo;{d.reason}&rdquo;
                </p>
              </div>

              {/* Admin note */}
              <div>
                <label className="block text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Official Adjudication Finding
                </label>
                <input
                  type="text"
                  placeholder="Reason for overturning or upholding forfeiture..."
                  value={notes[d.id] || ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [d.id]: e.target.value })
                  }
                  className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-4 py-3 text-xs font-mono text-[#F8FAFC] outline-none focus:border-[#10B981]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleResolve(d.id, "resolved_against")}
                  disabled={processingId === d.id}
                  className="btn-destructive text-xs !py-2.5 !px-5 font-mono cursor-pointer disabled:opacity-50"
                >
                  Uphold Forfeiture (Reject Claim)
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve(d.id, "resolved_in_favour")}
                  disabled={processingId === d.id}
                  className="btn-primary text-xs !py-2.5 !px-6 font-mono cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {processingId === d.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Overturn & Refund Stake (₹{d.stakeAmount})</span>
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
