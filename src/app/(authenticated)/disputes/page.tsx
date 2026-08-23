"use client";

import { useEffect, useState } from "react";
import { Gavel, Loader2 } from "lucide-react";

interface DisputeItem {
  id: string;
  reason: string;
  status: "open" | "under_review" | "resolved_in_favour" | "resolved_against";
  admin_note: string | null;
  created_at: string;
  tasks?: any;
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<DisputeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDisputes() {
      try {
        const res = await fetch("/api/disputes");
        if (res.ok) {
          const data = await res.json();
          setDisputes(data.disputes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDisputes();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
      <div className="border-b border-[#1E293B] pb-4 sm:pb-6">
        <span className="type-label text-[#06B6D4]">
          ARBITRATION PROTOCOL
        </span>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
          Dispute Resolution Center
        </h1>
        <p className="type-body text-xs mt-1">
          If you believe an automated verification decision was inaccurate, our human arbitration team conducts fair reviews.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" />
        </div>
      ) : disputes.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#12181E] border border-[#1E293B] rounded-2xl max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#06B6D4]/15 text-[#06B6D4] rounded-xl flex items-center justify-center mx-auto mb-3">
            <Gavel className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h3 className="type-heading text-lg text-white mb-2">
            No Active Arbitration Cases
          </h3>
          <p className="type-body text-xs leading-relaxed">
            All submitted milestones have either passed automated AI inspection or remain in good standing.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => {
            const isOpen = d.status === "open" || d.status === "under_review";
            const isWon = d.status === "resolved_in_favour";

            return (
              <div
                key={d.id}
                className="p-5 bg-[#12181E] border border-[#1E293B] rounded-2xl space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="type-heading text-sm text-white">
                      {d.tasks?.title || "Disputed Milestone Claim"}
                    </h3>
                    <span className="type-body text-[11px] font-mono">
                      Filed: {new Date(d.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border shrink-0 ${
                      isOpen
                        ? "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30"
                        : isWon
                        ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                        : "bg-[#F43F5E]/15 text-[#F43F5E] border-[#F43F5E]/30"
                    }`}
                  >
                    {d.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="bg-[#090D10] p-3.5 rounded-xl text-xs font-mono text-white/70 border border-[#1E293B]">
                  <strong className="text-white block mb-1">YOUR CLAIM:</strong>
                  {d.reason}
                </div>

                {d.admin_note && (
                  <div className="bg-[#090D10] p-3.5 rounded-xl text-xs font-mono text-[#10B981] border border-[#10B981]/30">
                    <strong className="text-[#10B981] block mb-1">ARBITRATION DECISION:</strong>
                    {d.admin_note}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
