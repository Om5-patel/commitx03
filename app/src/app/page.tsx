"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import CommitmentCard from "@/components/ui/CommitmentCard";
import {
  Lock,
  ArrowRight,
  BookOpen,
  Dumbbell,
  Code2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  // Stake calculator state
  const [stakeAmount, setStakeAmount] = useState<number>(500);
  const [category, setCategory] = useState<"habit" | "study" | "work">("study");
  const [milestones, setMilestones] = useState<number>(5);

  const stakePerMilestone = Math.round(stakeAmount / milestones);

  return (
    <div className="min-h-screen flex flex-col bg-[#090D10] text-[#F8FAFC]">
      {/* ── Public Navbar ── */}
      <header className="sticky top-0 z-50 w-full bg-[#090D10]/90 backdrop-blur-md border-b border-[#1E293B]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-sans text-xl font-bold tracking-tight text-white">
            <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-[#090D10] font-black">
              <Lock className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="flex items-center leading-none">
              Commit<span className="text-[#10B981]">X</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 type-heading text-xs">
            <Link href="#calculator" className="hover:text-[#10B981] transition-colors">Stake Calculator</Link>
            <Link href="#protocol" className="hover:text-[#10B981] transition-colors">Protocol Specs</Link>
            <Link href="/how-it-works" className="hover:text-[#10B981] transition-colors">How It Works</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="type-heading text-xs hover:text-white px-3 py-2 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="verify-btn !py-2.5 !px-5 text-xs font-mono">
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section with 3D Signature Vault Card ── */}
      <section className="pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <span className="type-label text-[#10B981] px-3 py-1 rounded-full bg-[#12181E] border border-[#10B981]/30">
                COMMITTED CAPITAL PROTOCOL
              </span>
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12]">
              Pledge your stake. <br />
              <span className="text-[#10B981]">
                Earn it all back.
              </span>
            </h1>

            <p className="type-body text-sm sm:text-base leading-relaxed max-w-xl">
              Lock in your financial pledge in an automated escrow vault. Complete milestones verified by AI study quizzes, GPS photo check-ins, or code deliverables to trigger <strong>instant 100% refunds</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/signup" className="verify-btn text-sm !py-3.5 !px-7">
                <span>Lock In Your Commitment</span>
                <Lock className="w-4 h-4" />
              </Link>
              <Link href="#calculator" className="btn-glass text-xs font-mono !py-3.5 !px-6">
                Calculate Stake & ROI
              </Link>
            </div>

            {/* Quiet Stats */}
            <div className="pt-8 border-t border-[#1E293B] grid grid-cols-3 gap-6">
              <div>
                <p className="type-data text-xl sm:text-2xl text-[#10B981]">₹1,42,500+</p>
                <p className="type-body text-[11px] mt-0.5">Refunded to Users</p>
              </div>
              <div>
                <p className="type-data text-xl sm:text-2xl text-white">94.2%</p>
                <p className="type-body text-[11px] mt-0.5">Completion Rate</p>
              </div>
              <div>
                <p className="type-data text-xl sm:text-2xl text-[#06B6D4]">₹0 Fees</p>
                <p className="type-body text-[11px] mt-0.5">Free Verification</p>
              </div>
            </div>
          </div>

          {/* Right Hero: Signature 3D Commitment Vault Card */}
          <div className="lg:col-span-5 flex justify-center">
            <CommitmentCard
              stakeAmount={1000}
              goalTitle="Master System Design & Services"
              deadline="04d 18h"
              vaultId="COMMITX VAULT #8291"
            />
          </div>

        </div>
      </section>

      {/* ── Interactive Stake & Escrow Calculator Section ── */}
      <section id="calculator" className="py-20 bg-[#0E141A] border-y border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="type-label text-[#10B981]">FINANCIAL STAKE ENGINE</span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mt-1">
              Interactive Stake Calculator
            </h2>
            <p className="type-body text-xs mt-2">
              See how CommitX distributes your pledge per milestone with 100% refunds upon passing verification.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-[#12181E] border border-[#1E293B] rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Controls */}
              <div className="space-y-6">
                {/* Stake Slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="type-label">STAKE PLEDGE</span>
                    <span className="type-data text-xl text-[#10B981]">₹{stakeAmount}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    className="w-full accent-[#10B981] h-1.5 bg-[#090D10] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between type-body text-[10px] mt-1 font-mono">
                    <span>₹100 (Micro)</span>
                    <span>₹2,500</span>
                    <span>₹5,000 (Serious)</span>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <span className="type-label block mb-2">CATEGORY</span>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: "study", label: "Study Sprint", Icon: BookOpen },
                      { id: "habit", label: "Habit / Gym", Icon: Dumbbell },
                      { id: "work", label: "Code / Artifact", Icon: Code2 },
                    ].map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCategory(id as any)}
                        className={`p-3 rounded-xl border text-xs flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          category === id
                            ? "bg-[#10B981]/15 border-[#10B981] text-[#10B981]"
                            : "bg-[#090D10] border-[#1E293B] text-white/50 hover:border-[#334155]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="type-heading text-[11px]">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milestones Count */}
                <div>
                  <span className="type-label block mb-2">MILESTONE SPLIT</span>
                  <div className="flex gap-2">
                    {[3, 5, 7, 14].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setMilestones(cnt)}
                        className={`flex-1 py-1.5 rounded-lg font-mono text-xs border transition-colors cursor-pointer ${
                          milestones === cnt
                            ? "bg-[#10B981] text-[#090D10] font-bold border-[#10B981]"
                            : "bg-[#090D10] border-[#1E293B] text-white/50 hover:text-white"
                        }`}
                      >
                        {cnt} Steps
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Breakdown Card */}
              <div className="p-5 rounded-xl bg-[#090D10] border border-[#1E293B] flex flex-col justify-between h-full space-y-4">
                <div>
                  <span className="type-label text-[#10B981]">ESCROW SIMULATION</span>
                  <h4 className="type-heading text-sm text-white mt-1">
                    {milestones} Milestones × ₹{stakePerMilestone} / Step
                  </h4>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-[#12181E] rounded-lg border border-[#1E293B]">
                    <span className="text-white/50">Total in Escrow:</span>
                    <span className="font-bold text-white">₹{stakeAmount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-[#12181E] rounded-lg border border-[#1E293B]">
                    <span className="text-white/50">Refund / Step:</span>
                    <span className="font-bold text-[#10B981]">₹{stakePerMilestone}</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 bg-[#12181E] rounded-lg border border-[#1E293B]">
                    <span className="text-white/50">Verification Fee:</span>
                    <span className="font-bold text-[#06B6D4]">₹0 (Free)</span>
                  </div>
                </div>

                <Link href="/signup" className="verify-btn w-full text-center !py-3 text-xs font-mono">
                  <span>Start This Goal Commitment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The 3-Step Protocol ── */}
      <section id="protocol" className="py-20 max-w-5xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="type-label text-[#10B981]">THE COMMITX PROTOCOL</span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mt-1">
            Engineered for Zero-Excuses Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Lock Your Pledge",
              description: "Choose your goal, set concrete deadlines, and deposit your stake into an automated escrow contract.",
              Icon: Lock,
            },
            {
              step: "02",
              title: "Submit Dynamic Proof",
              description: "Take live 5-question AI quizzes for study goals, snap GPS camera check-ins for fitness, or link code commits for work.",
              Icon: ShieldCheck,
            },
            {
              step: "03",
              title: "Instant 100% Refund",
              description: "As soon as your proof passes verification, your stake is unlocked and credited straight back to you.",
              Icon: Sparkles,
            },
          ].map(({ step, title, description, Icon }) => (
            <div key={step} className="p-6 bg-[#12181E] border border-[#1E293B] rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-bold text-white/20">{step}</span>
                  <div className="w-9 h-9 rounded-xl bg-[#090D10] border border-[#1E293B] flex items-center justify-center text-[#10B981]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="type-heading text-base text-white">{title}</h3>
                <p className="type-body text-xs mt-2 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Call To Action Banner ── */}
      <section className="py-16 max-w-5xl mx-auto px-6 w-full mb-8">
        <div className="p-8 sm:p-12 rounded-2xl bg-[#12181E] border border-[#1E293B] flex flex-col items-center text-center gap-4">
          <h2 className="font-sans text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Stop breaking promises to yourself.
          </h2>
          <p className="type-body text-sm max-w-lg">
            Put your money where your ambition is. Join committed professionals, students, and builders today.
          </p>
          <Link href="/signup" className="verify-btn text-sm !py-3.5 !px-8 mt-2">
            <span>Create Your Commitment Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
