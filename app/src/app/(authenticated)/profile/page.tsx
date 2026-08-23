"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ShieldAlert, Loader2 } from "lucide-react";

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
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Protocol Member";
  const email = user?.email || "user@commitx.in";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
      <div className="border-b border-[#1E293B] pb-4 sm:pb-6">
        <span className="type-label text-[#10B981]">
          ACCOUNTABILITY PASSPORT
        </span>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
          Identity & Escrow Passport
        </h1>
      </div>

      {/* Profile Card */}
      <div className="p-5 sm:p-6 bg-[#12181E] border border-[#1E293B] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-2xl bg-[#10B981] text-[#090D10] flex items-center justify-center text-2xl font-mono font-black shrink-0">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="type-heading text-lg text-white">
                {fullName}
              </h2>
              {isAdmin && (
                <span className="bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  Auditor
                </span>
              )}
            </div>
            <p className="type-body text-xs font-mono mt-0.5">{email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-destructive text-xs !py-2.5 !px-4 font-mono cursor-pointer w-full sm:w-auto text-center"
        >
          Disconnect & Sign Out
        </button>
      </div>

      {/* Admin Quick Link */}
      {isAdmin && (
        <div className="p-5 bg-[#12181E] border border-[#F59E0B]/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="type-heading text-sm text-white">
                CommitX Admin Arbitration Station
              </h3>
              <p className="type-body text-xs mt-0.5">
                Review flagged submissions, resolve disputes, and audit treasury forfeitures.
              </p>
            </div>
          </div>

          <Link href="/admin" className="verify-btn text-xs !py-2 !px-4 shrink-0 w-full sm:w-auto text-center">
            Open Terminal
          </Link>
        </div>
      )}

      {/* Performance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-[#12181E] border border-[#1E293B] rounded-2xl">
          <span className="type-label block mb-1.5">
            COMPLETED VAULTS
          </span>
          <div className="type-data text-2xl text-[#10B981]">8</div>
          <p className="type-body text-[11px] mt-1">100% verified milestones</p>
        </div>

        <div className="p-5 bg-[#12181E] border border-[#1E293B] rounded-2xl">
          <span className="type-label block mb-1.5">
            HISTORIC REFUND RATE
          </span>
          <div className="type-data text-2xl text-white">94%</div>
          <p className="type-body text-[11px] mt-1">Top tier protocol reputation</p>
        </div>

        <div className="p-5 bg-[#12181E] border border-[#1E293B] rounded-2xl">
          <span className="type-label block mb-1.5">
            CAPITAL RECOVERED
          </span>
          <div className="type-data text-2xl text-[#06B6D4]">₹3,850</div>
          <p className="type-body text-[11px] mt-1">Refunded directly to you</p>
        </div>
      </div>
    </div>
  );
}
