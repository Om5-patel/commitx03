import Link from "next/link";
import BackgroundMesh from "@/components/ui/BackgroundMesh";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#090D10] text-[#F8FAFC] relative overflow-hidden">
      <BackgroundMesh />

      {/* Minimal Navbar */}
      <header className="w-full flex items-center justify-between px-6 py-6 z-10">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-sans text-2xl font-black tracking-tight text-[#F8FAFC]"
        >
          <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-[#090D10] font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <span className="material-symbols-outlined font-bold text-lg">lock_clock</span>
          </div>
          <span>Commit<span className="text-[#10B981]">X</span></span>
        </Link>
      </header>

      {/* Centered Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 z-10">
        <div className="w-full max-w-md">
          <div className="relative bg-[#12181E]/90 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#1E293B] p-8 sm:p-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
