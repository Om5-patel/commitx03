"use client";

import { useState } from "react";

interface RevenueRecord {
  id: string;
  date: string;
  userName: string;
  taskTitle: string;
  amount: number;
  reason: string;
  txRef: string;
}

export default function AdminRevenuePage() {
  const [records, setRecords] = useState<RevenueRecord[]>([
    {
      id: "tx-1",
      date: "Aug 19, 2026",
      userName: "Vikram Mehta",
      taskTitle: "5 AM Daily Wakeup Routine",
      amount: 150,
      reason: "Expired: Missed deadline cutoff without proof",
      txRef: "forfeit_89b21a",
    },
    {
      id: "tx-2",
      date: "Aug 18, 2026",
      userName: "Sneha Rao",
      taskTitle: "Machine Learning Chapter 4 Quiz",
      amount: 250,
      reason: "Failed: Scored 40% on quiz retry (below 60% threshold)",
      txRef: "forfeit_91c44d",
    },
    {
      id: "tx-3",
      date: "Aug 17, 2026",
      userName: "Karan Johar",
      taskTitle: "Figma UI Redesign Prototype",
      amount: 500,
      reason: "Rejected: File artifact relevance 0.22 (empty link)",
      txRef: "forfeit_12f90e",
    },
  ]);

  const totalRevenue = records.reduce((acc, r) => acc + r.amount, 0);

  const exportCSV = () => {
    const headers = "ID,Date,User,Task,Amount,Reason,TxRef\n";
    const rows = records
      .map(
        (r) =>
          `"${r.id}","${r.date}","${r.userName}","${r.taskTitle}",${r.amount},"${r.reason}","${r.txRef}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `commitx-revenue-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-headline text-4xl text-on-surface mb-2">
            Platform Revenue & Treasury
          </h1>
          <p className="text-on-surface-variant text-base">
            Audit log of all forfeited stakes converting directly into CommitX platform earnings.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Export Audit CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-2">
            Total Forfeiture Earnings
          </span>
          <div className="font-headline text-4xl font-bold text-primary">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-xs text-on-surface-variant mt-2 block">
            Retained in Razorpay Merchant Account
          </span>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <span className="text-xs font-bold text-tertiary uppercase tracking-wider block mb-2">
            Total Stakes Deposited
          </span>
          <div className="font-headline text-4xl font-bold text-on-surface">
            ₹1,42,500
          </div>
          <span className="text-xs text-on-surface-variant mt-2 block">
            Across 240 active commitments
          </span>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">
            Refund Payout Rate
          </span>
          <div className="font-headline text-4xl font-bold text-on-surface">
            93.7%
          </div>
          <span className="text-xs text-on-surface-variant mt-2 block">
            ₹1,33,500 returned to verified users
          </span>
        </div>
      </div>

      {/* Revenue Ledger Table */}
      <div className="bg-surface rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center">
          <h2 className="font-headline font-bold text-xl text-on-surface">
            Forfeiture Transaction History
          </h2>
          <span className="text-xs text-on-surface-variant">
            Showing {records.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant/20">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Milestone Commitment</th>
                <th className="py-4 px-6">Forfeiture Reason</th>
                <th className="py-4 px-6 text-right">Revenue (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-xs">
              {records.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-on-surface">
                    {r.date}
                  </td>
                  <td className="py-4 px-6 font-bold text-on-surface">
                    {r.userName}
                  </td>
                  <td className="py-4 px-6 text-on-surface-variant">
                    {r.taskTitle}
                  </td>
                  <td className="py-4 px-6 text-error">
                    {r.reason}
                  </td>
                  <td className="py-4 px-6 text-right font-headline font-bold text-primary text-sm">
                    + ₹{r.amount}.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
