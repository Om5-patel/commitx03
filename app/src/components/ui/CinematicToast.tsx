"use client";

import React, { createContext, useContext, useState } from "react";
import confetti from "canvas-confetti";

interface ToastMessage {
  id: string;
  title: string;
  body: string;
  type: "success" | "warning" | "danger" | "info";
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showVignette, setShowVignette] = useState(false);

  const showToast = ({
    title,
    body,
    type = "info",
  }: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}`;
    const newToast: ToastMessage = { id, title, body, type };

    setToasts((prev) => [...prev, newToast]);

    if (type === "success") {
      // Emerald & Amber celebratory confetti burst
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.85, x: 0.85 },
        colors: ["#10B981", "#F59E0B", "#06B6D4", "#F8FAFC"],
      });
    } else if (type === "danger") {
      // Flash red screen vignette
      setShowVignette(true);
      setTimeout(() => setShowVignette(false), 2000);
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Screen Vignette Flash on Danger/Forfeiture */}
      {showVignette && (
        <div className="fixed inset-0 pointer-events-none z-[100] transition-opacity duration-700 shadow-[inset_0_0_90px_rgba(244,63,94,0.3)] animate-pulse" />
      )}

      {/* 3D Spring Toast Container */}
      <div className="fixed bottom-6 right-6 z-[99] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isDanger = toast.type === "danger";
          const isWarning = toast.type === "warning";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl bg-[#12181E]/95 backdrop-blur-2xl border shadow-2xl transition-all duration-300 transform-gpu translate-x-0 ${
                isSuccess
                  ? "border-[#10B981]/50 shadow-[0_10px_30px_rgba(16,185,129,0.25)]"
                  : isDanger
                  ? "border-[#F43F5E]/50 shadow-[0_10px_30px_rgba(244,63,94,0.25)]"
                  : isWarning
                  ? "border-[#F59E0B]/50 shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
                  : "border-[#1E293B] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                    isSuccess
                      ? "bg-[#10B981]/20 text-[#10B981]"
                      : isDanger
                      ? "bg-[#F43F5E]/20 text-[#F43F5E]"
                      : isWarning
                      ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                      : "bg-[#06B6D4]/20 text-[#06B6D4]"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {isSuccess
                      ? "verified"
                      : isDanger
                      ? "error"
                      : isWarning
                      ? "warning"
                      : "info"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#F8FAFC]">
                    {toast.title}
                  </h4>
                  <p className="text-xs text-[#94A3B8] mt-0.5 leading-relaxed">
                    {toast.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
