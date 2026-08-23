"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
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
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl text-on-surface mb-2">
          Notifications
        </h1>
        <p className="text-on-surface-variant text-base">
          Real-time updates on your milestones, verifications, and refunds.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-20">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center border border-outline-variant/30 shadow-sm">
          <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">
              notifications_off
            </span>
          </div>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-1">
            No notifications yet
          </h3>
          <p className="text-on-surface-variant text-sm">
            You&apos;ll receive updates when you lock goals, submit proof, or earn refunds.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && markAsRead(n.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.read
                  ? "bg-surface-container-lowest border-primary/40 shadow-sm"
                  : "bg-surface-container-low border-outline-variant/20 opacity-85"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  !n.read
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container text-on-surface-variant"
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

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    {n.title}
                  </h3>
                  <span className="text-[11px] text-on-surface-variant shrink-0">
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-on-surface-variant text-xs mt-1 leading-relaxed">
                  {n.body}
                </p>
                {n.related_id && (
                  <Link
                    href={`/goals/${n.related_id}`}
                    className="inline-flex items-center gap-1 text-primary text-xs font-bold mt-3 hover:underline"
                  >
                    View Details
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
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
