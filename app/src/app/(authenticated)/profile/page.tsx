"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TiltCard from "@/components/ui/TiltCard";
import CountUpNumber from "@/components/ui/CountUpNumber";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setUser(authUser);
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", authUser.id)
            .single();

          if (profile) {
            setIsAdmin(profile.is_admin || false);
          } else if (authUser.email?.toLowerCase() === "parthgholap18@gmail.com") {
            setIsAdmin(true);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#10B981]">
          progress_activity
        </span>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Protocol Member";
  const email = user?.email || "user@commitx.in";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#1E293B] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
          ACCOUNTABILITY PASSPORT
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Identity & Escrow Passport
        </h1>
      </div>

      {/* Profile Card */}
      <TiltCard glow="emerald" className="p-8 bg-[#12181E] border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-18 h-18 rounded-2xl bg-[#10B981] text-[#090D10] flex items-center justify-center text-3xl font-mono font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-sans text-2xl font-extrabold text-[#F8FAFC]">
                {fullName}
              </h2>
              {isAdmin && (
                <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
                  Auditor Admin
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-[#94A3B8] mt-1">{email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-destructive text-xs !py-2.5 !px-5 font-mono cursor-pointer"
        >
          Disconnect & Sign Out
        </button>
      </TiltCard>

      {/* Admin Quick Link */}
      {isAdmin && (
        <TiltCard glow="amber" className="p-6 bg-[#12181E] border border-[#F59E0B]/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            </div>
            <div>
              <h3 className="font-sans text-base font-bold text-[#F8FAFC]">
                CommitX Admin Arbitration Station
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Review flagged submissions, resolve disputes, and audit treasury forfeitures.
              </p>
            </div>
          </div>

          <Link href="/admin" className="btn-primary text-xs !py-2.5 !px-4 shrink-0">
            Open Terminal
          </Link>
        </TiltCard>
      )}

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TiltCard className="p-6 bg-[#12181E] border border-[#1E293B]">
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase block mb-2">
            COMPLETED VAULTS
          </span>
          <CountUpNumber value={8} className="text-3xl text-[#10B981]" />
          <p className="text-xs font-mono text-[#64748B] mt-1">100% verified milestones</p>
        </TiltCard>

        <TiltCard className="p-6 bg-[#12181E] border border-[#1E293B]">
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase block mb-2">
            HISTORIC REFUND RATE
          </span>
          <CountUpNumber value={94} suffix="%" className="text-3xl text-[#F8FAFC]" />
          <p className="text-xs font-mono text-[#64748B] mt-1">Top tier protocol reputation</p>
        </TiltCard>

        <TiltCard className="p-6 bg-[#12181E] border border-[#1E293B]">
          <span className="text-[11px] font-mono font-bold text-[#94A3B8] uppercase block mb-2">
            CAPITAL RECOVERED
          </span>
          <CountUpNumber value={3850} prefix="₹" className="text-3xl text-[#06B6D4]" />
          <p className="text-xs font-mono text-[#64748B] mt-1">Refunded directly to you</p>
        </TiltCard>
      </div>
    </div>
  );
}
