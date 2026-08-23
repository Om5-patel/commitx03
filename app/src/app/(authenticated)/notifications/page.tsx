"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TiltCard from "@/components/ui/TiltCard";

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
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-[#1E293B] pb-6">
        <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
          AUDIT NOTIFICATIONS
        </span>
        <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Vault Notifications
        </h1>
        <p className="text-sm text-[#94A3B8] mt-1">
          Real-time updates on your milestones, AI verifications, and instant refunds.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-24">
          <span className="material-symbols-outlined animate-spin text-4xl text-[#10B981]">
            progress_activity
          </span>
        </div>
      ) : notifications.length === 0 ? (
        <TiltCard className="p-12 text-center bg-[#12181E] border border-[#1E293B] max-w-lg mx-auto">
          <div className="w-16 h-16 bg-[#12181E] border border-[#1E293B] text-[#94A3B8] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">
              notifications_off
            </span>
          </div>
          <h3 className="font-sans text-xl font-bold text-[#F8FAFC] mb-2">
            No New Notifications
          </h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            You&apos;ll receive notifications here when you lock goals, submit proof, or trigger automated stake refunds.
          </p>
        </TiltCard>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? "bg-[#12181E] border-[#10B981]/50 shadow-[0_0_20px_rgba(16,185,129,0.12)]"
                  : "bg-[#0E141A] border-[#1E293B] opacity-75"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  !n.read
                    ? "bg-[#10B981]/20 text-[#10B981]"
                    : "bg-[#12181E] text-[#94A3B8]"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {n.type === "result"
                    ? "verified"
                    : n.type === "payment_confirmed"
                    ? "lock"
                    : "notifications"}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans font-bold text-sm text-[#F8FAFC]">
                    {n.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#64748B] shrink-0">
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  {n.body}
                </p>
                {n.related_id && (
                  <Link
                    href={`/goals/${n.related_id}`}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[#10B981] font-bold mt-2 hover:underline"
                  >
                    View Commitment Details
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
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
