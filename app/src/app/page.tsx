import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Public Navigation ── */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-6 lg:px-8 h-20 w-full bg-surface border-b border-surface-container-low shadow-sm">
        <div className="font-headline text-2xl font-bold text-primary tracking-tight">
          CommitX
        </div>
        <div className="hidden md:flex items-center gap-8 font-body text-sm tracking-wide">
          <Link
            href="/how-it-works"
            className="text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            How It Works
          </Link>
          <Link
            href="#cycle"
            className="text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            The Protocol
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-on-surface-variant hover:text-primary transition-colors duration-200 font-label font-semibold text-sm"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-on-primary hover:bg-primary/90 font-label font-bold text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-sm active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative w-full overflow-hidden bg-surface-bright pb-24 pt-16 lg:pt-32">
        <div className="absolute inset-0 bg-organic-gradient pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Typography & CTA */}
          <div className="flex flex-col gap-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface px-4 py-2 rounded-full w-max text-sm font-label font-semibold border border-outline-variant/30">
              <span className="material-symbols-outlined filled text-primary text-lg">
                psychiatry
              </span>
              CommitX — Rooted Accountability
            </div>

            <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-bold text-on-surface leading-[1.1] tracking-tight">
              Commit to your{" "}
              <span className="text-primary">growth</span> with real
              stakes.
            </h1>

            <p className="font-body text-lg sm:text-xl text-on-surface-variant leading-relaxed">
              A calm, grounded approach to achieving your goals. Lock in your
              intentions, stake a meaningful pledge, and let the organic
              pressure of the protocol guide you to success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/signup"
                className="bg-primary text-on-primary font-bold text-lg px-8 py-4 rounded-xl shadow-organic hover:bg-primary/90 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                Begin Your Journey
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link
                href="/how-it-works"
                className="bg-transparent text-primary border border-outline-variant font-bold text-lg px-8 py-4 rounded-xl hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Explore the Protocol
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-[3rem] lg:rounded-bl-[6rem] lg:rounded-tr-[6rem] overflow-hidden shadow-organic-lg bg-surface-container border border-outline-variant/20 flex items-center justify-center">
            {/* Abstract organic visualization */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/40 via-surface to-tertiary-container/30" />
            <div className="absolute top-16 right-16 w-48 h-48 bg-primary/10 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-xl" />
            <div className="absolute bottom-20 left-12 w-36 h-36 bg-tertiary-container/30 rounded-[60%_40%_30%_70%/50%_40%_60%_50%] blur-lg" />
            <div className="relative z-10 flex flex-col items-center gap-6 text-center p-12">
              <div className="w-24 h-24 bg-primary/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center">
                <span className="material-symbols-outlined filled text-primary text-5xl">
                  psychiatry
                </span>
              </div>
              <p className="font-headline text-2xl font-semibold text-on-surface/70 max-w-xs">
                Where intention meets accountability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — Bento Grid ── */}
      <section
        id="cycle"
        className="py-24 bg-surface-container-low w-full border-y border-outline-variant/20"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-headline text-4xl font-bold text-on-surface mb-6">
              The Cycle of Growth
            </h2>
            <p className="font-body text-lg text-on-surface-variant leading-relaxed">
              A natural, four-step protocol designed to anchor your ambitions
              in reality. Warmly demanding, gracefully rewarding.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">
            {/* Step 1: Lock (Span 4) */}
            <div className="md:col-span-4 bg-surface rounded-3xl p-8 flex flex-col justify-between shadow-organic border border-outline-variant/10 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 text-primary">
                <span className="material-symbols-outlined text-8xl">lock</span>
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined filled text-2xl">
                    lock
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  1. Lock
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Define your objective with clarity. Anchor your intention
                  into the protocol.
                </p>
              </div>
            </div>

            {/* Step 2: Stake (Span 8) */}
            <div className="md:col-span-8 bg-surface rounded-3xl p-8 flex flex-col sm:flex-row gap-8 items-center justify-between shadow-organic border border-outline-variant/10 group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex-1 max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined filled text-2xl">
                    monetization_on
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  2. Stake
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Pledge a meaningful asset. A real stake ensures your
                  commitment is deeply rooted, replacing casual promises with
                  undeniable accountability.
                </p>
              </div>
              <div className="flex-1 w-full h-full min-h-[160px] rounded-2xl bg-surface-container overflow-hidden relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-tertiary-container/20 to-surface-container" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined filled text-tertiary text-4xl">
                    savings
                  </span>
                  <span className="font-headline text-3xl font-bold text-on-surface">
                    ₹100 — ₹10K
                  </span>
                  <span className="text-sm text-on-surface-variant">
                    Your range of commitment
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3: Verify (Span 8) */}
            <div className="md:col-span-8 bg-surface rounded-3xl p-8 flex flex-col sm:flex-row-reverse gap-8 items-center justify-between shadow-organic border border-outline-variant/10 group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex-1 max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined filled text-2xl">
                    verified
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  3. Verify
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Submit your progress via photo, quiz, or file upload. Honest
                  effort is recognized, validated, and recorded transparently.
                </p>
              </div>
              <div className="flex-1 w-full h-full min-h-[160px] rounded-2xl bg-surface-container overflow-hidden relative flex items-center justify-center">
                {/* Glassmorphism verification card */}
                <div className="absolute inset-4 bg-surface-bright/80 backdrop-blur-sm rounded-xl border border-white/40 flex items-center justify-center p-6 shadow-sm">
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined filled">
                        check_circle
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-3/4 bg-surface-variant rounded-full" />
                      <div className="h-2 w-1/2 bg-surface-variant rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Refund (Span 4) */}
            <div className="md:col-span-4 bg-surface rounded-3xl p-8 flex flex-col justify-between shadow-organic border border-outline-variant/10 group hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary-container/30 to-transparent pointer-events-none" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-surface-variant text-on-surface-variant flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined filled text-2xl">
                    energy_savings_leaf
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">
                  4. Refund
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Reap the harvest. Your stake is returned entirely upon
                  success, leaving you with the true reward: your own growth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Stats ── */}
      <section className="py-20 bg-surface w-full">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <span className="font-headline text-4xl font-bold text-primary">
                94%
              </span>
              <span className="text-on-surface-variant text-sm">
                Average Success Rate
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-headline text-4xl font-bold text-tertiary">
                ₹4.2L+
              </span>
              <span className="text-on-surface-variant text-sm">
                Stakes Held in Trust
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-headline text-4xl font-bold text-secondary">
                1,200+
              </span>
              <span className="text-on-surface-variant text-sm">
                Goals Committed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 bg-surface-container-low w-full border-t border-outline-variant/20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center gap-8">
          <div className="w-16 h-16 bg-primary-container rounded-[40%_60%_70%_30%/40%_50%_60%_50%] flex items-center justify-center">
            <span className="material-symbols-outlined filled text-primary text-3xl">
              eco
            </span>
          </div>
          <h2 className="font-headline text-4xl font-bold text-on-surface">
            Ready to grow?
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl">
            Join CommitX and transform your intentions into reality. Your
            first commitment is just a click away.
          </p>
          <Link
            href="/signup"
            className="bg-primary text-on-primary font-bold text-lg px-10 py-4 rounded-xl shadow-organic hover:bg-primary/90 transition-all duration-200 active:scale-95 flex items-center gap-2"
          >
            Start Your First Goal
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
