import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#090D10] border-t border-[#1E293B] mt-auto py-12 px-6 lg:px-8 text-xs font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#10B981] flex items-center justify-center text-[#090D10] font-black">
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="font-sans font-bold text-sm text-[#F8FAFC]">
              Commit<span className="text-[#10B981]">X</span> Protocol
            </span>
          </div>
          <span className="hidden sm:inline text-[#64748B]">•</span>
          <span className="text-[#94A3B8]">
            High-Stakes Accountability Vault with Automated Instant Refunds.
          </span>
        </div>

        {/* Live Network & Latency Indicator */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-[#12181E] border border-[#1E293B] px-3.5 py-1.5 rounded-full font-mono text-[11px] text-[#94A3B8]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>VAULT ENGINE: ONLINE</span>
          </div>

          <div className="flex items-center gap-4 text-[#94A3B8]">
            <Link
              href="/how-it-works"
              className="hover:text-[#10B981] transition-colors"
            >
              Protocol Specs
            </Link>
            <Link
              href="/disputes"
              className="hover:text-[#10B981] transition-colors"
            >
              Arbitration
            </Link>
            <span className="text-[#64748B]">
              © {new Date().getFullYear()} CommitX
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
