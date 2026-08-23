"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import TiltCard from "@/components/ui/TiltCard";
import ProgressRing from "@/components/ui/ProgressRing";
import {
  Lock,
  ArrowRight,
  BookOpen,
  Dumbbell,
  Code2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
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
      <header className="sticky top-0 z-50 w-full bg-[#090D10]/80 backdrop-blur-2xl border-b border-[#1E293B]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-sans text-2xl font-black tracking-tight text-[#F8FAFC]">
            <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center text-[#090D10] font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="flex items-center leading-none">
              Commit<span className="text-[#10B981]">X</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#94A3B8]">
            <Link href="#calculator" className="hover:text-[#10B981] transition-colors">Stake Calculator</Link>
            <Link href="#protocol" className="hover:text-[#10B981] transition-colors">How Protocol Works</Link>
            <Link href="#guarantee" className="hover:text-[#10B981] transition-colors">Refund Escrow</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-[#94A3B8] hover:text-[#F8FAFC] px-3 py-2 transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary text-xs uppercase tracking-wider !py-2.5 !px-5 inline-flex items-center gap-2">
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section with 3D Floating Sandbox ── */}
      <section className="relative pt-16 pb-24 lg:pt-28 lg:pb-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2.5 bg-[#12181E] border border-[#10B981]/30 px-4 py-1.5 rounded-full w-max text-xs font-mono text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>COMMITTED CAPITAL PROTOCOL</span>
            </div>

            <h1 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.08]">
              Pledge your money. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#06B6D4]">
                Earn it all back.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#94A3B8] leading-relaxed max-w-2xl">
              Lock in your financial stake in an automated escrow vault. Submit verified proof via AI quizzes, GPS camera check-ins, or code deliverables to trigger <strong>instant automated refunds</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup" className="btn-primary text-base !py-4 !px-8 text-center inline-flex items-center justify-center gap-2">
                <span>Lock In Your Commitment</span>
                <Lock className="w-5 h-5" />
              </Link>
              <Link href="#calculator" className="btn-glass text-base !py-4 !px-8 text-center inline-flex items-center justify-center">
                Calculate Stake & ROI
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="pt-8 border-t border-[#1E293B] grid grid-cols-3 gap-6">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#10B981]">₹1,42,500+</p>
                <p className="text-xs font-mono text-[#94A3B8] mt-0.5">Refunded to Users</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">94.2%</p>
                <p className="text-xs font-mono text-[#94A3B8] mt-0.5">Completion Rate</p>
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-[#06B6D4]">100% Free</p>
                <p className="text-xs font-mono text-[#94A3B8] mt-0.5">AI Engine Verification</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: 3D Interactive Commitment Ticket */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard glow="emerald" className="w-full max-w-md p-6 sm:p-8 bg-[#12181E]/90 backdrop-blur-2xl border border-[#1E293B]">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-[#10B981] uppercase">ACTIVE COMMITMENT VAULT</span>
                </div>
                <span className="text-xs font-mono text-[#94A3B8]">ID #8291</span>
              </div>

              <div className="py-6 flex items-center justify-between gap-6">
                <div>
                  <h3 className="font-sans text-xl font-extrabold text-[#F8FAFC]">Master System Design</h3>
                  <p className="text-xs text-[#94A3B8] mt-1">Study Sprint • 5 Milestones</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs font-mono text-[#94A3B8]">PLEDGE STAKE:</span>
                    <span className="font-mono text-lg font-extrabold text-[#10B981]">₹1,000</span>
                  </div>
                </div>
                <ProgressRing progress={80} size={90} label="4/5" sublabel="DONE" color="emerald" />
              </div>

              {/* Milestone Mini Path */}
              <div className="bg-[#090D10] p-4 rounded-xl border border-[#1E293B] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#10B981]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>M1 (₹200)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#10B981]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>M2 (₹200)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#F59E0B] animate-pulse">
                  <Clock className="w-4 h-4" />
                  <span>M3 (TODAY)</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-xs font-mono text-[#94A3B8]">NEXT DEADLINE IN:</span>
                <span className="font-mono text-sm font-bold text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-1 rounded-full">
                  03h 42m 19s
                </span>
              </div>
            </TiltCard>
          </div>

        </div>
      </section>

      {/* ── Interactive Stake & Escrow Calculator Section ── */}
      <section id="calculator" className="py-24 bg-[#0E141A] border-y border-[#1E293B]">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981]">FINANCIAL STAKE ENGINE</span>
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-2">
              Interactive Stake Calculator
            </h2>
            <p className="text-sm text-[#94A3B8] mt-3">
              See how CommitX distributes your stake per milestone with automated refunds upon passing verification.
            </p>
          </div>

          <TiltCard className="p-8 sm:p-12 bg-[#12181E] border border-[#1E293B]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* Controls */}
              <div className="space-y-8">
                {/* Stake Slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase">YOUR STAKE PLEDGE</label>
                    <span className="font-mono text-2xl font-black text-[#10B981]">₹{stakeAmount}</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Number(e.target.value))}
                    className="w-full accent-[#10B981] h-2 bg-[#090D10] rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#64748B] mt-2">
                    <span>₹100 (Micro)</span>
                    <span>₹2,500</span>
                    <span>₹5,000 (Serious)</span>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase block mb-3">GOAL CATEGORY</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "study", label: "Study Sprint", Icon: BookOpen },
                      { id: "habit", label: "Habit / Gym", Icon: Dumbbell },
                      { id: "work", label: "Code / Deliverable", Icon: Code2 },
                    ].map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setCategory(id as any)}
                        className={`p-3.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-2.5 transition-all cursor-pointer ${
                          category === id
                            ? "bg-[#10B981]/15 border-[#10B981] text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-[#090D10] border-[#1E293B] text-[#94A3B8] hover:border-[#334155] hover:text-[#F8FAFC]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-center font-medium leading-tight">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Milestones Count */}
                <div>
                  <label className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase block mb-3">MILESTONE SPLIT</label>
                  <div className="flex gap-2">
                    {[3, 5, 7, 14].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setMilestones(cnt)}
                        className={`flex-1 py-2 rounded-xl font-mono text-xs font-bold border transition-all cursor-pointer ${
                          milestones === cnt
                            ? "bg-[#10B981] text-[#090D10] border-[#10B981]"
                            : "bg-[#090D10] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
                        }`}
                      >
                        {cnt} Days
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Breakdown Card */}
              <div className="p-6 rounded-2xl bg-[#090D10] border border-[#1E293B] flex flex-col justify-between h-full space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#10B981] font-bold">ESCROW LEDGER SIMULATION</span>
                  <h4 className="font-sans text-lg font-bold text-[#F8FAFC] mt-1">
                    {milestones} Milestones × ₹{stakePerMilestone} / Milestone
                  </h4>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-3 bg-[#12181E] rounded-xl border border-[#1E293B]">
                    <span className="text-[#94A3B8]">Total Locked in Escrow:</span>
                    <span className="text-[#F8FAFC] font-bold">₹{stakeAmount}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#12181E] rounded-xl border border-[#1E293B]">
                    <span className="text-[#94A3B8]">Refund on Each Verified Step:</span>
                    <span className="text-[#10B981] font-bold">₹{stakePerMilestone} (100% Back)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#12181E] rounded-xl border border-[#1E293B]">
                    <span className="text-[#94A3B8]">AI Verification Engine Cost:</span>
                    <span className="text-[#06B6D4] font-bold">₹0 (Free OpenRouter)</span>
                  </div>
                </div>

                <Link href="/signup" className="btn-primary w-full text-center !py-3.5 inline-flex items-center justify-center gap-2">
                  <span>Start This Goal Commitment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ── The 3-Step Protocol ── */}
      <section id="protocol" className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981]">THE COMMITX PROTOCOL</span>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-2">
            Engineered for Zero-Excuses Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Lock Your Pledge",
              description: "Choose your goal, set concrete deadlines, and deposit your stake into an encrypted escrow contract.",
              Icon: Lock,
              accent: "emerald",
            },
            {
              step: "02",
              title: "Submit Dynamic Proof",
              description: "Take live 5-question AI quizzes for study goals, snap GPS camera check-ins for fitness, or link code commits for work.",
              Icon: ShieldCheck,
              accent: "cyan",
            },
            {
              step: "03",
              title: "Instant Stake Refund",
              description: "As soon as your proof passes verification, your stake is unlocked and credited straight back to you. Zero fees.",
              Icon: Sparkles,
              accent: "amber",
            },
          ].map(({ step, title, description, Icon }) => (
            <TiltCard key={step} className="p-8 bg-[#12181E] border border-[#1E293B] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-3xl font-black text-[#1E293B]">{step}</span>
                  <div className="w-12 h-12 rounded-xl bg-[#090D10] border border-[#1E293B] flex items-center justify-center text-[#10B981]">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-sans text-xl font-bold text-[#F8FAFC]">{title}</h3>
                <p className="text-sm text-[#94A3B8] mt-3 leading-relaxed">{description}</p>
              </div>
              <div className="mt-8 pt-4 border-t border-[#1E293B]/60 flex items-center gap-2 text-xs font-mono text-[#10B981]">
                <Zap className="w-4 h-4" />
                <span>AUTOMATED PROTOCOL</span>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* ── Call To Action Banner ── */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8 w-full mb-12">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-r from-[#12181E] via-[#10B981]/10 to-[#12181E] border border-[#10B981]/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center text-center gap-6">
          <h2 className="font-sans text-3xl sm:text-5xl font-black text-[#F8FAFC] tracking-tight">
            Stop breaking promises to yourself.
          </h2>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl">
            Put your money where your ambition is. Join committed professionals, students, and builders today.
          </p>
          <Link href="/signup" className="btn-primary text-base !py-4 !px-10 mt-2 inline-flex items-center gap-2">
            <span>Create Your First Commitment Vault</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
