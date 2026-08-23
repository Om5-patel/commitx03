"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl text-on-surface mb-2">
          Dispute Center
        </h1>
        <p className="text-on-surface-variant text-base">
          If you believe a verification decision was inaccurate, our audit team will manually review your case.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : disputes.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/30 shadow-sm">
          <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">
              gavel
            </span>
          </div>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-1">
            No active disputes
          </h3>
          <p className="text-on-surface-variant text-sm">
            All your submitted milestones have been verified automatically or are currently in good standing.
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
                className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-headline font-bold text-lg text-on-surface">
                      Milestone: {d.tasks?.title || "Disputed Milestone"}
                    </h3>
                    <span className="text-xs text-on-surface-variant">
                      Filed on {new Date(d.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider ${
                      isOpen
                        ? "bg-tertiary-container text-on-tertiary-container"
                        : isWon
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-error-container text-on-error-container"
                    }`}
                  >
                    {d.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="bg-surface-container-low p-4 rounded-xl text-xs text-on-surface leading-relaxed">
                  <strong>Your Reason:</strong> {d.reason}
                </div>

                {d.admin_note && (
                  <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 text-xs leading-relaxed">
                    <strong className="text-primary">Admin Resolution Note:</strong> {d.admin_note}
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
