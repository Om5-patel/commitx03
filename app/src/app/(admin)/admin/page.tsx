"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    pendingReviews: 3,
    openDisputes: 1,
    totalRevenue: 14250,
    activeStakes: 42500,
  });

  return (
    <div className="w-full flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl text-on-surface mb-2">
          Admin Control Center
        </h1>
        <p className="text-on-surface-variant text-base">
          Audit verification queues, adjudicate disputes, and oversee platform escrow health.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-tertiary uppercase tracking-wider">
              Pending Reviews
            </span>
            <div className="w-9 h-9 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">rate_review</span>
            </div>
          </div>
          <div className="font-headline text-4xl font-bold text-on-surface">
            {stats.pendingReviews}
          </div>
          <Link
            href="/admin/review"
            className="text-xs text-primary font-bold mt-4 inline-flex items-center gap-1 hover:underline"
          >
            Review queue →
          </Link>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-error uppercase tracking-wider">
              Open Disputes
            </span>
            <div className="w-9 h-9 rounded-xl bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">gavel</span>
            </div>
          </div>
          <div className="font-headline text-4xl font-bold text-on-surface">
            {stats.openDisputes}
          </div>
          <Link
            href="/admin/disputes"
            className="text-xs text-error font-bold mt-4 inline-flex items-center gap-1 hover:underline"
          >
            Adjudicate cases →
          </Link>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Platform Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">monetization_on</span>
            </div>
          </div>
          <div className="font-headline text-4xl font-bold text-primary">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-xs text-on-surface-variant mt-4 block">
            Forfeited milestone revenue
          </span>
        </div>

        <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
              Escrow Vault
            </span>
            <div className="w-9 h-9 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">account_balance</span>
            </div>
          </div>
          <div className="font-headline text-4xl font-bold text-on-surface">
            ₹{stats.activeStakes.toLocaleString("en-IN")}
          </div>
          <span className="text-xs text-on-surface-variant mt-4 block">
            Currently held in trust
          </span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 flex flex-col justify-between gap-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">rate_review</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
              Manual Review Queue
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Submissions with image hash collisions, borderline AI relevance scores (0.40–0.69), or flagged timestamps require human sign-off.
            </p>
          </div>
          <Link
            href="/admin/review"
            className="bg-primary text-on-primary font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:bg-primary/90 transition-all text-center"
          >
            Open Review Queue
          </Link>
        </div>

        <div className="bg-surface rounded-3xl p-8 border border-outline-variant/30 flex flex-col justify-between gap-6">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
              Treasury & Forfeiture Ledger
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Complete historical ledger of all deposits, refunds, and forfeited commitments converted to platform earnings.
            </p>
          </div>
          <Link
            href="/admin/revenue"
            className="bg-secondary text-on-secondary font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:bg-secondary/90 transition-all text-center"
          >
            View Treasury Ledger
          </Link>
        </div>
      </div>
    </div>
  );
}
