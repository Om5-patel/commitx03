import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-surface-container-low flex flex-col md:flex-row">
      {/* ── Admin Sidebar ── */}
      <aside className="w-full md:w-64 bg-surface border-r border-outline-variant/30 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div>
            <Link
              href="/admin"
              className="font-headline text-2xl font-bold text-primary tracking-tight"
            >
              CommitX <span className="text-xs text-tertiary bg-tertiary-fixed px-2 py-0.5 rounded-md uppercase">Admin</span>
            </Link>
            <p className="text-[11px] text-on-surface-variant mt-1">
              Admin: {user.email}
            </p>
          </div>

          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-primary">
                dashboard
              </span>
              Overview
            </Link>

            <Link
              href="/admin/review"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-tertiary">
                rate_review
              </span>
              Review Queue
            </Link>

            <Link
              href="/admin/disputes"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-error">
                gavel
              </span>
              Disputes
            </Link>

            <Link
              href="/admin/revenue"
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-semibold text-sm text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-lg text-primary">
                payments
              </span>
              Revenue Log
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-outline-variant/20">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Return to User Dashboard
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
