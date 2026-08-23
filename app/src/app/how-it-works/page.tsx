import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import TiltCard from "@/components/ui/TiltCard";
import {
  Lock,
  Banknote,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how CommitX helps you achieve your goals through a 4-step accountability protocol: Lock, Stake, Verify, Refund.",
};

const steps = [
  {
    number: "01",
    title: "Lock Your Goal",
    Icon: Lock,
    accent: "text-[#10B981]",
    bgAccent: "bg-[#10B981]/15",
    borderAccent: "border-[#10B981]/30",
    description:
      "Choose your goal category — Generic Habit, Study, or Business/Creative. Give it a clear title, break it into measurable sub-tasks, and set firm deadlines. This isn't a wish list; it's a commitment contract.",
    details: [
      "3 goal categories tailored to different verification methods",
      "Sub-tasks with individual deadlines and stake allocation",
      "Clear, measurable objectives — no vague intentions",
    ],
  },
  {
    number: "02",
    title: "Stake Your Pledge",
    Icon: Banknote,
    accent: "text-[#F59E0B]",
    bgAccent: "bg-[#F59E0B]/15",
    borderAccent: "border-[#F59E0B]/30",
    description:
      "Deposit a meaningful monetary stake (₹100 – ₹10,000) against your goal. This isn't a fee — it's your own money held in escrow. The real financial risk turns casual goals into serious commitments.",
    details: [
      "Secure payment via Razorpay / Escrow Trust",
      "Your money is held safely — not spent",
      "Stake is divided equally across your milestones",
    ],
  },
  {
    number: "03",
    title: "Verify Completion",
    Icon: ShieldCheck,
    accent: "text-[#06B6D4]",
    bgAccent: "bg-[#06B6D4]/15",
    borderAccent: "border-[#06B6D4]/30",
    description:
      "Submit proof of completion through the method matched to your goal type. Our multi-layer verification system ensures honest effort is recognized and fraud is caught.",
    details: [
      "Photo Proof — in-app viewfinder camera with timestamp + hash checks",
      "Knowledge Quiz — AI-generated MCQs (OpenRouter Free) on your study material",
      "File Upload — AI relevance analysis of your code deliverable or document",
    ],
  },
  {
    number: "04",
    title: "Instant 100% Refund",
    Icon: Sparkles,
    accent: "text-[#10B981]",
    bgAccent: "bg-[#10B981]/15",
    borderAccent: "border-[#10B981]/30",
    description:
      "Pass verification and your full stake is refunded immediately. Miss a deadline or fail verification, and the stake is forfeited. The protocol is simple: follow through, and you lose nothing.",
    details: [
      "Pass → Full stake refunded to your account balance instantly",
      "Fail → Stake forfeited (recorded as CommitX revenue)",
      "Disputed? → Fair human arbitration pathway available",
    ],
  },
];

const faqs = [
  {
    q: "What happens to my money if I fail?",
    a: "If you miss a deadline or fail verification, your stake is forfeited and recorded as CommitX revenue. This is the accountability mechanism — knowing real money is on the line makes you follow through.",
  },
  {
    q: "Can I dispute a failed verification?",
    a: "Yes. If you believe the verification was unfair, you can file a dispute. It will be reviewed manually by our arbitration team, and if resolved in your favour, your stake is refunded.",
  },
  {
    q: "How is photo proof verified?",
    a: "Photos must be taken through our in-app camera (no gallery uploads). We check the GPS data, timestamp, and run a perceptual hash comparison against your previous submissions to prevent reuse.",
  },
  {
    q: "What if the AI quiz or file check is wrong?",
    a: "Low-confidence results are automatically routed to manual review rather than auto-rejecting. For quizzes, you can retry if you need a second attempt.",
  },
  {
    q: "Is my payment information safe?",
    a: "All payments are processed through Razorpay, India's leading payment gateway. We never store your card details. Stake funds are held safely in escrow and refunded directly to you.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D10] text-[#F8FAFC]">
      {/* Public Nav */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 lg:px-8 h-20 w-full bg-[#090D10]/80 backdrop-blur-2xl border-b border-[#1E293B]">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans text-2xl font-black tracking-tight text-[#F8FAFC]"
        >
          <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center text-[#090D10] font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <Lock className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="flex items-center leading-none">
            Commit<span className="text-[#10B981]">X</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[#94A3B8] hover:text-[#F8FAFC] font-semibold text-sm transition-colors px-3 py-2"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="btn-primary text-xs uppercase tracking-wider !py-2.5 !px-5 inline-flex items-center gap-2"
          >
            <span>Launch App</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Header */}
      <section className="py-20 bg-[#0E141A] border-b border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
            PROTOCOL ARCHITECTURE
          </span>
          <h1 className="font-sans text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
            How CommitX Works
          </h1>
          <p className="text-lg text-[#94A3B8] leading-relaxed max-w-2xl mx-auto">
            A four-step financial protocol that transforms good intentions into
            guaranteed execution. Zero excuses, zero fees on success.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 max-w-5xl mx-auto px-6 lg:px-8 space-y-16">
        {steps.map((step, i) => (
          <TiltCard
            key={step.number}
            className="p-8 sm:p-10 bg-[#12181E] border border-[#1E293B]"
          >
            <div
              className={`flex flex-col ${
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-10 items-center`}
            >
              <div className="flex-1 max-w-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${step.bgAccent} ${step.borderAccent} border ${step.accent} flex items-center justify-center`}
                  >
                    <step.Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs text-[#94A3B8] font-bold tracking-widest uppercase">
                    STEP {step.number}
                  </span>
                </div>

                <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                  {step.title}
                </h2>
                <p className="text-[#94A3B8] text-sm sm:text-base leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2.5 pt-2">
                  {step.details.map((detail, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2.5 text-xs font-mono text-[#F8FAFC]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 w-full max-w-sm aspect-video sm:aspect-square rounded-2xl bg-[#090D10] border border-[#1E293B] flex items-center justify-center p-8">
                <div
                  className={`w-24 h-24 ${step.bgAccent} border ${step.borderAccent} rounded-3xl flex items-center justify-center shadow-2xl`}
                >
                  <step.Icon className={`w-12 h-12 ${step.accent}`} />
                </div>
              </div>
            </div>
          </TiltCard>
        ))}
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#0E141A] border-t border-[#1E293B]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-sans text-3xl font-extrabold text-[#F8FAFC] mt-2">
              Everything you need to know
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#12181E] rounded-2xl border border-[#1E293B] overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-sans font-bold text-base text-[#F8FAFC] hover:text-[#10B981] transition-colors list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-[#94A3B8] group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-6 pb-6 text-xs font-mono text-[#94A3B8] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-[#1E293B]">
        <div className="max-w-2xl mx-auto text-center px-6 space-y-6">
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            Ready to commit?
          </h2>
          <Link
            href="/signup"
            className="btn-primary text-base !py-4 !px-10 inline-flex items-center gap-2"
          >
            <span>Create Your First Goal</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
