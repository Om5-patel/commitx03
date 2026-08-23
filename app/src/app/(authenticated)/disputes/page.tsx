"use client";

import { useEffect, useState } from "react";
import TiltCard from "@/components/ui/TiltCard";

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
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#1E293B] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#06B6D4] uppercase">
          ARBITRATION PROTOCOL
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Dispute Resolution Center
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          If you believe an automated verification decision was inaccurate, our human arbitration team conducts fair reviews.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#06B6D4]">
            progress_activity
          </span>
        </div>
      ) : disputes.length === 0 ? (
        <TiltCard className="p-12 text-center bg-[#12181E] border border-[#1E293B] max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#06B6D4]/15 text-[#06B6D4] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl font-bold">
              gavel
            </span>
          </div>
          <h3 className="font-sans text-xl font-bold text-[#F8FAFC] mb-2">
            No Active Arbitration Cases
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            All submitted milestones have either passed automated AI inspection or remain in good standing.
          </p>
        </TiltCard>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => {
            const isOpen = d.status === "open" || d.status === "under_review";
            const isWon = d.status === "resolved_in_favour";

            return (
              <TiltCard
                key={d.id}
                className="p-6 bg-[#12181E] border border-[#1E293B] space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans font-bold text-base text-[#F8FAFC]">
                      {d.tasks?.title || "Disputed Milestone Claim"}
                    </h3>
                    <span className="text-xs font-mono text-[#94A3B8]">
                      Filed: {new Date(d.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
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

                <div className="bg-[#090D10] p-4 rounded-xl text-xs font-mono text-[#94A3B8] border border-[#1E293B]">
                  <strong className="text-[#F8FAFC] block mb-1">YOUR CLAIM:</strong>
                  {d.reason}
                </div>

                {d.admin_note && (
                  <div className="bg-[#090D10] p-4 rounded-xl text-xs font-mono text-[#10B981] border border-[#10B981]/30">
                    <strong className="text-[#10B981] block mb-1">ARBITRATION DECISION:</strong>
                    {d.admin_note}
                  </div>
                )}
              </TiltCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
