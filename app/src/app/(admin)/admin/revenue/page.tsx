"use client";

import { useState } from "react";
import TiltCard from "@/components/ui/TiltCard";
import { Download } from "lucide-react";

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
  const [records] = useState<RevenueRecord[]>([
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
            ESCROW TREASURY
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            Platform Revenue & Treasury
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Audit log of all forfeited stakes converting directly into CommitX platform earnings.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="btn-primary text-xs font-mono !py-3 !px-5 inline-flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <TiltCard glow="emerald" className="p-6 bg-[#12181E] border border-[#1E293B]">
          <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider block mb-2">
            TOTAL FORFEITURE EARNINGS
          </span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#10B981]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-[10px] font-mono text-[#64748B] mt-2 block">
            Retained in Merchant Trust Account
          </span>
        </TiltCard>

        <TiltCard glow="amber" className="p-6 bg-[#12181E] border border-[#1E293B]">
          <span className="text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider block mb-2">
            TOTAL STAKES DEPOSITED
          </span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#F8FAFC]">
            ₹1,42,500
          </div>
          <span className="text-[10px] font-mono text-[#64748B] mt-2 block">
            Across 240 active commitments
          </span>
        </TiltCard>

        <TiltCard glow="cyan" className="p-6 bg-[#12181E] border border-[#1E293B]">
          <span className="text-[10px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider block mb-2">
            REFUND PAYOUT RATE
          </span>
          <div className="font-mono text-3xl sm:text-4xl font-black text-[#06B6D4]">
            93.7%
          </div>
          <span className="text-[10px] font-mono text-[#64748B] mt-2 block">
            ₹1,33,500 returned to verified users
          </span>
        </TiltCard>
      </div>

      {/* Revenue Ledger Table */}
      <TiltCard className="p-6 bg-[#12181E] border border-[#1E293B] overflow-hidden">
        <div className="border-b border-[#1E293B] pb-4 mb-4 flex justify-between items-center">
          <h2 className="font-sans font-bold text-lg text-[#F8FAFC]">
            Forfeiture Transaction History
          </h2>
          <span className="text-xs font-mono text-[#94A3B8]">
            Showing {records.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-[#090D10] text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider border-b border-[#1E293B]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Milestone Commitment</th>
                <th className="py-3 px-4">Forfeiture Reason</th>
                <th className="py-3 px-4 text-right">Revenue (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/60">
              {records.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#F8FAFC]">
                    {r.date}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#F8FAFC]">
                    {r.userName}
                  </td>
                  <td className="py-3.5 px-4 text-[#94A3B8]">
                    {r.taskTitle}
                  </td>
                  <td className="py-3.5 px-4 text-[#F43F5E]">
                    {r.reason}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#10B981] text-sm">
                    + ₹{r.amount}.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TiltCard>
    </div>
  );
}
