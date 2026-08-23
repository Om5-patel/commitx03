import Link from "next/link";
import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how CommitX helps you achieve your goals through a 4-step accountability protocol: Lock, Stake, Verify, Refund.",
};

const steps = [
  {
    number: "01",
    title: "Lock Your Goal",
    icon: "lock",
    color: "primary",
    bgColor: "bg-primary-container",
    textColor: "text-on-primary-container",
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
    icon: "savings",
    color: "tertiary",
    bgColor: "bg-tertiary-container",
    textColor: "text-on-tertiary-container",
    description:
      "Deposit a meaningful monetary stake (₹100 – ₹10,000) against your goal. This isn't a fee — it's your own money held in escrow. The real financial risk turns casual goals into serious commitments.",
    details: [
      "Secure payment via Razorpay",
      "Your money is held safely — not spent",
      "Stake is divided across your sub-tasks",
    ],
  },
  {
    number: "03",
    title: "Verify Completion",
    icon: "verified",
    color: "secondary",
    bgColor: "bg-secondary-container",
    textColor: "text-on-secondary-container",
    description:
      "Submit proof of completion through the method matched to your goal type. Our multi-layer verification system ensures honest effort is recognized and fraud is caught.",
    details: [
      "📸 Photo Proof — in-app camera with EXIF + hash checks",
      "📝 Knowledge Quiz — AI-generated MCQs on your study material",
      "📁 File Upload — AI relevance analysis of your work artifact",
    ],
  },
  {
    number: "04",
    title: "Get Refunded",
    icon: "energy_savings_leaf",
    color: "primary",
    bgColor: "bg-primary-fixed",
    textColor: "text-primary",
    description:
      "Pass verification and your full stake is refunded immediately. Miss a deadline or fail verification, and the stake is forfeited. The protocol is simple: follow through, and you lose nothing.",
    details: [
      "✅ Pass → Full stake refunded to your payment method",
      "❌ Fail → Stake forfeited (recorded as CommitX revenue)",
      "🔄 Disputed? → Manual review pathway available",
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
    a: "Yes. If you believe the verification was unfair, you can file a dispute. It will be reviewed manually by our team within 48 hours, and if resolved in your favour, your stake is refunded.",
  },
  {
    q: "How is photo proof verified?",
    a: "Photos must be taken through our in-app camera (no gallery uploads). We check the EXIF timestamp, GPS data, and run a perceptual hash comparison against your previous submissions to prevent reuse.",
  },
  {
    q: "What if the AI quiz or file check is wrong?",
    a: "Low-confidence results are automatically routed to manual review rather than auto-rejecting. For quizzes, you get one retry after 24 hours.",
  },
  {
    q: "Is my payment information safe?",
    a: "All payments are processed through Razorpay, India's leading payment gateway. We never store your card details. Stake funds are held in our Razorpay account and refunded directly to your original payment method.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Public Nav */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 lg:px-8 h-20 w-full bg-surface border-b border-surface-container-low shadow-sm">
        <Link
          href="/"
          className="font-headline text-2xl font-bold text-primary tracking-tight"
        >
          CommitX
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-on-surface-variant hover:text-primary font-label font-semibold text-sm transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-on-primary font-label font-bold text-sm px-5 py-2.5 rounded-xl transition-colors hover:bg-primary/90 shadow-sm active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20 bg-surface-bright">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="font-headline text-5xl lg:text-6xl font-bold text-on-surface mb-6 leading-tight">
            How CommitX Works
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            A four-step protocol that transforms good intentions into
            guaranteed action. No excuses, no workarounds — just results.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-surface-container-low">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-16">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`flex flex-col ${
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-12 items-center`}
            >
              <div className="flex-1 max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl ${step.bgColor} ${step.textColor} flex items-center justify-center`}
                  >
                    <span className="material-symbols-outlined filled text-2xl">
                      {step.icon}
                    </span>
                  </div>
                  <span className="font-headline text-sm text-on-surface-variant font-medium tracking-widest uppercase">
                    Step {step.number}
                  </span>
                </div>
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">
                  {step.title}
                </h2>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-6">
                  {step.description}
                </p>
                <ul className="space-y-3">
                  {step.details.map((detail, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined text-primary text-sm mt-1">
                        check_circle
                      </span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full max-w-md aspect-square rounded-3xl bg-surface shadow-organic border border-outline-variant/10 flex items-center justify-center">
                <div
                  className={`w-24 h-24 ${step.bgColor} rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center`}
                >
                  <span
                    className={`material-symbols-outlined filled ${step.textColor} text-5xl`}
                  >
                    {step.icon}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <h2 className="font-headline text-3xl font-bold text-on-surface text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-surface-container rounded-2xl border border-outline-variant/20 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-headline font-semibold text-on-surface hover:text-primary transition-colors list-none">
                  {faq.q}
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform duration-200">
                    expand_more
                  </span>
                </summary>
                <div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-2xl mx-auto text-center px-6">
          <h2 className="font-headline text-3xl font-bold text-on-surface mb-6">
            Ready to commit?
          </h2>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-lg px-10 py-4 rounded-xl shadow-organic hover:bg-primary/90 transition-all duration-200 active:scale-95"
          >
            Create Your First Goal
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
