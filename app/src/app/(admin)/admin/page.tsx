"use client";

import { useState } from "react";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";
import CountUpNumber from "@/components/ui/CountUpNumber";

export default function AdminOverviewPage() {
  const [stats] = useState({
    pendingReviews: 3,
    openDisputes: 1,
    totalRevenue: 14250,
    activeStakes: 42500,
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-[#F59E0B] uppercase">
          AUDIT TERMINAL
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Admin Control Station
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Audit verification queues, adjudicate disputes, and oversee platform escrow health.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <TiltCard glow="amber" className="p-6 bg-[#12181E] border border-[#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono font-bold text-[#F59E0B] uppercase tracking-wider">
              PENDING REVIEWS
            </span>
            <span className="material-symbols-outlined text-lg text-[#F59E0B]">rate_review</span>
          </div>
          <CountUpNumber value={stats.pendingReviews} className="text-3xl sm:text-4xl text-[#F8FAFC]" />
          <Link
            href="/admin/review"
            className="text-xs font-mono text-[#F59E0B] font-bold mt-4 inline-flex items-center gap-1 hover:underline"
          >
            Review Queue →
          </Link>
        </TiltCard>

        <TiltCard glow="rose" className="p-6 bg-[#12181E] border border-[#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono font-bold text-[#F43F5E] uppercase tracking-wider">
              OPEN DISPUTES
            </span>
            <span className="material-symbols-outlined text-lg text-[#F43F5E]">gavel</span>
          </div>
          <CountUpNumber value={stats.openDisputes} className="text-3xl sm:text-4xl text-[#F43F5E]" />
          <Link
            href="/admin/disputes"
            className="text-xs font-mono text-[#F43F5E] font-bold mt-4 inline-flex items-center gap-1 hover:underline"
          >
            Adjudicate Cases →
          </Link>
        </TiltCard>

        <TiltCard glow="emerald" className="p-6 bg-[#12181E] border border-[#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
              PLATFORM REVENUE
            </span>
            <span className="material-symbols-outlined text-lg text-[#10B981]">payments</span>
          </div>
          <CountUpNumber value={stats.totalRevenue} prefix="₹" className="text-3xl sm:text-4xl text-[#10B981]" />
          <span className="text-[10px] font-mono text-[#64748B] mt-4 block">
            Forfeited stake revenue
          </span>
        </TiltCard>

        <TiltCard glow="cyan" className="p-6 bg-[#12181E] border border-[#1E293B]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono font-bold text-[#06B6D4] uppercase tracking-wider">
              ESCROW VAULT
            </span>
            <span className="material-symbols-outlined text-lg text-[#06B6D4]">account_balance</span>
          </div>
          <CountUpNumber value={stats.activeStakes} prefix="₹" className="text-3xl sm:text-4xl text-[#06B6D4]" />
          <span className="text-[10px] font-mono text-[#64748B] mt-4 block">
            Active capital in trust
          </span>
        </TiltCard>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TiltCard className="p-8 bg-[#12181E] border border-[#1E293B] flex flex-col justify-between gap-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">rate_review</span>
            </div>
            <h3 className="font-sans text-xl font-bold text-[#F8FAFC] mb-2">
              Manual Review Queue
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Submissions with image hash collisions or borderline AI relevance scores require human auditor sign-off.
            </p>
          </div>
          <Link
            href="/admin/review"
            className="btn-primary text-xs font-mono !py-3 text-center"
          >
            Open Review Queue
          </Link>
        </TiltCard>

        <TiltCard className="p-8 bg-[#12181E] border border-[#1E293B] flex flex-col justify-between gap-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <h3 className="font-sans text-xl font-bold text-[#F8FAFC] mb-2">
              Treasury & Forfeiture Ledger
            </h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Complete historical audit ledger of all deposits, refunds, and forfeited commitments converted to platform earnings.
            </p>
          </div>
          <Link
            href="/admin/revenue"
            className="btn-glass text-xs font-mono !py-3 text-center"
          >
            View Treasury Ledger
          </Link>
        </TiltCard>
      </div>
    </div>
  );
}
