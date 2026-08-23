"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
      <div className="flex items-center justify-center p-20">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  const fullName = user?.user_metadata?.full_name || "Account Member";
  const email = user?.email || "user@commitx.in";

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl text-on-surface mb-2">
          Your Profile
        </h1>
        <p className="text-on-surface-variant text-base">
          Manage your personal account, staked capital history, and settings.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 border border-outline-variant/30 shadow-organic flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-primary-container text-on-primary-container flex items-center justify-center text-3xl font-headline font-bold shadow-sm">
            {fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-headline text-2xl font-bold text-on-surface">
                {fullName}
              </h2>
              {isAdmin && (
                <span className="bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-on-surface-variant text-sm mt-1">{email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-error hover:bg-error-container/30 border border-error/30 font-bold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>

      {/* Admin Panel Quick Link if Admin */}
      {isAdmin && (
        <div className="bg-secondary-container rounded-3xl p-6 border border-tertiary/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl filled">
                admin_panel_settings
              </span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-on-secondary-container">
                CommitX Admin Portal
              </h3>
              <p className="text-on-secondary-container/80 text-xs">
                Review flagged submissions, resolve disputes, and audit treasury forfeitures.
              </p>
            </div>
          </div>

          <Link
            href="/admin"
            className="bg-primary text-on-primary font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-primary/90 transition-all"
          >
            Open Admin
          </Link>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
            Completed Goals
          </span>
          <span className="font-headline text-3xl font-bold text-primary">
            8
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
            Refund Rate
          </span>
          <span className="font-headline text-3xl font-bold text-tertiary">
            94%
          </span>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30">
          <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
            Total Stake Recovered
          </span>
          <span className="font-headline text-3xl font-bold text-on-surface">
            ₹3,850
          </span>
        </div>
      </div>
    </div>
  );
}
