import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
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
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 h-16 sm:h-20 w-full bg-[#090D10]/80 backdrop-blur-2xl border-b border-[#1E293B]">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans text-lg sm:text-2xl font-bold tracking-tight text-white"
        >
          <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-[#090D10] font-black">
            <Lock className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="flex items-center leading-none">
            Commit<span className="text-[#10B981]">X</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="type-heading text-xs hover:text-white px-2.5 py-1.5 transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="verify-btn !py-2 !px-4 sm:!py-2.5 sm:!px-5 text-xs font-mono"
          >
            Launch App
          </Link>
        </div>
      </header>

      {/* Header */}
      <section className="py-16 sm:py-20 bg-[#0E141A] border-b border-[#1E293B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3 sm:space-y-4">
          <span className="type-label text-[#10B981]">
            PROTOCOL ARCHITECTURE
          </span>
          <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
            How CommitX Works
          </h1>
          <p className="type-body text-xs sm:text-base leading-relaxed max-w-2xl mx-auto">
            A four-step financial protocol that transforms good intentions into
            guaranteed execution. Zero excuses, zero fees on success.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="p-6 sm:p-8 bg-[#12181E] border border-[#1E293B] rounded-2xl"
          >
            <div
              className={`flex flex-col ${
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-6 sm:gap-8 items-center`}
            >
              <div className="flex-1 max-w-xl space-y-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl ${step.bgAccent} ${step.borderAccent} border ${step.accent} flex items-center justify-center`}
                  >
                    <step.Icon className="w-5 h-5" />
                  </div>
                  <span className="type-label font-mono">
                    STEP {step.number}
                  </span>
                </div>

                <h2 className="type-heading text-lg sm:text-2xl text-white">
                  {step.title}
                </h2>
                <p className="type-body text-xs sm:text-sm leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2 pt-2">
                  {step.details.map((detail, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-xs font-mono text-white/90"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex-1 w-full max-w-xs aspect-video sm:aspect-square rounded-2xl bg-[#090D10] border border-[#1E293B] flex items-center justify-center p-6">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 ${step.bgAccent} border ${step.borderAccent} rounded-2xl flex items-center justify-center`}
                >
                  <step.Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${step.accent}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-[#0E141A] border-t border-[#1E293B]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="type-label text-[#10B981]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mt-1">
              Everything you need to know
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-[#12181E] rounded-xl border border-[#1E293B] overflow-hidden"
              >
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer type-heading text-xs sm:text-sm text-white hover:text-[#10B981] transition-colors list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-white/40 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 type-body text-xs leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[#1E293B]">
        <div className="max-w-xl mx-auto text-center px-4 space-y-4">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white">
            Ready to commit?
          </h2>
          <Link
            href="/signup"
            className="verify-btn text-xs sm:text-sm !py-3 !px-8 inline-flex items-center gap-2"
          >
            <span>Create Your First Goal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
