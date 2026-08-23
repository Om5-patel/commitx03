import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BackgroundMesh from "@/components/ui/BackgroundMesh";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin, email")
    .eq("id", user.id)
    .single();

  const isAdmin =
    profile?.is_admin ||
    user.email?.toLowerCase() === (process.env.ADMIN_EMAIL || "parthgholap18@gmail.com").toLowerCase();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#090D10] text-[#F8FAFC] flex flex-col md:flex-row relative">
      <BackgroundMesh />

      {/* ── Admin Sidebar ── */}
      <aside className="w-full md:w-64 bg-[#090D10]/90 backdrop-blur-2xl border-r border-[#1E293B] p-6 flex flex-col justify-between shrink-0 z-20">
        <div className="space-y-8">
          <div>
            <Link
              href="/admin"
              className="flex items-center gap-2.5 font-sans text-xl font-black tracking-tight"
            >
              <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-[#090D10] font-black">
                <span className="material-symbols-outlined text-lg font-bold">terminal</span>
              </div>
              <span>
                Commit<span className="text-[#10B981]">X</span>
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-2 py-0.5 rounded-full uppercase">
                Admin
              </span>
            </Link>
            <p className="text-[10px] font-mono text-[#64748B] mt-2 truncate">
              {user.email}
            </p>
          </div>

          <nav className="space-y-1.5 font-mono text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#F8FAFC] hover:bg-white/[0.04] transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-[#10B981]">
                dashboard
              </span>
              Terminal Overview
            </Link>

            <Link
              href="/admin/review"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04] transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-[#F59E0B]">
                rate_review
              </span>
              Review Queue
            </Link>

            <Link
              href="/admin/disputes"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04] transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-[#06B6D4]">
                gavel
              </span>
              Arbitration
            </Link>

            <Link
              href="/admin/revenue"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04] transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-[#10B981]">
                payments
              </span>
              Escrow Ledger
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#1E293B]">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-mono font-bold text-[#94A3B8] hover:text-[#10B981] transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            User Dashboard
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl z-10">
        {children}
      </main>
    </div>
  );
}
