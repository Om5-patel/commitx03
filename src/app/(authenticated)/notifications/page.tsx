"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BellOff, CheckCircle2, Lock, Bell, ArrowRight, Loader2 } from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  related_id: string | null;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok && isMounted) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 space-y-6 sm:space-y-8">
      <div className="border-b border-[#1E293B] pb-4 sm:pb-6">
        <span className="type-label text-[#10B981]">
          AUDIT NOTIFICATIONS
        </span>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-white tracking-tight mt-0.5">
          Vault Notifications
        </h1>
        <p className="type-body text-xs mt-1">
          Real-time updates on your milestones, AI verifications, and instant refunds.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-[#12181E] border border-[#1E293B] rounded-2xl max-w-lg mx-auto">
          <div className="w-12 h-12 bg-[#12181E] border border-[#1E293B] text-white/40 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BellOff className="w-6 h-6" />
          </div>
          <h3 className="type-heading text-lg text-white mb-2">
            No New Notifications
          </h3>
          <p className="type-body text-xs leading-relaxed">
            You&apos;ll receive notifications here when you lock goals, submit proof, or trigger automated stake refunds.
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-colors cursor-pointer flex items-start gap-3 sm:gap-4 ${
                !n.read
                  ? "bg-[#12181E] border-[#10B981]/40"
                  : "bg-[#12181E]/60 border-[#1E293B] opacity-75"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  !n.read
                    ? "bg-[#10B981]/20 text-[#10B981]"
                    : "bg-[#090D10] text-white/40"
                }`}
              >
                {n.type === "result" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : n.type === "payment_confirmed" ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <Bell className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="type-heading text-xs sm:text-sm text-white">
                    {n.title}
                  </h3>
                  <span className="type-body text-[10px] font-mono shrink-0">
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="type-body text-xs mt-1 leading-relaxed">
                  {n.body}
                </p>
                {n.related_id && (
                  <Link
                    href={`/goals/${n.related_id}`}
                    className="inline-flex items-center gap-1 type-label text-[#10B981] font-bold mt-2 normal-case hover:underline"
                  >
                    <span>View Commitment Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
