"use client";

import { useEffect, useState } from "react";

interface FlipCountdownProps {
  targetDate?: string | Date;
  label?: string;
}

interface TimeUnits {
  hours: string;
  minutes: string;
  seconds: string;
}

export default function FlipCountdown({
  targetDate,
  label = "NEXT MILESTONE DEADLINE",
}: FlipCountdownProps) {
  const [time, setTime] = useState<TimeUnits>({
    hours: "08",
    minutes: "45",
    seconds: "12",
  });

  useEffect(() => {
    const calculateTime = () => {
      if (!targetDate) {
        // Dynamic demo ticking countdown
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const diff = Math.max(0, endOfDay.getTime() - now.getTime());

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTime({
          hours: String(h).padStart(2, "0"),
          minutes: String(m).padStart(2, "0"),
          seconds: String(s).padStart(2, "0"),
        });
        return;
      }

      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTime({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex flex-col items-center gap-3">
      {label && (
        <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-[#F59E0B] uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
          {label}
        </span>
      )}

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Hours */}
        <FlipBlock value={time.hours} label="HOURS" />
        <span className="font-mono text-2xl sm:text-3xl font-bold text-[#F59E0B] animate-pulse pb-4">
          :
        </span>
        {/* Minutes */}
        <FlipBlock value={time.minutes} label="MINS" />
        <span className="font-mono text-2xl sm:text-3xl font-bold text-[#F59E0B] animate-pulse pb-4">
          :
        </span>
        {/* Seconds */}
        <FlipBlock value={time.seconds} label="SECS" isSeconds />
      </div>
    </div>
  );
}

function FlipBlock({
  value,
  label,
  isSeconds = false,
}: {
  value: string;
  label: string;
  isSeconds?: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      {/* 3D Digit Card Container */}
      <div className="relative group perspective-[800px]">
        <div className="w-14 h-16 sm:w-18 sm:h-20 bg-[#0E141A] border border-[#1E293B] group-hover:border-[#F59E0B]/50 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300">
          {/* Split divider line */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#1E293B]/80 z-20" />

          {/* Top highlight */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.02] pointer-events-none" />

          {/* Value Display with Neon Amber Glow */}
          <span
            className={`font-mono text-2xl sm:text-4xl font-extrabold text-[#F59E0B] tracking-tight transition-transform duration-300 ${
              isSeconds ? "scale-105" : ""
            }`}
            style={{
              textShadow: "0 0 14px rgba(245,158,11,0.7), 0 0 30px rgba(245,158,11,0.3)",
            }}
          >
            {value}
          </span>
        </div>

        {/* Mirrored Reflection below digit */}
        <div
          className="w-14 h-4 sm:w-18 sm:h-5 bg-[#0E141A]/30 border-t border-[#1E293B]/40 rounded-b-xl flex items-center justify-center opacity-30 blur-[0.5px] overflow-hidden pointer-events-none -mt-0.5"
          style={{ transform: "scaleY(-1)" }}
        >
          <span className="font-mono text-xs sm:text-sm font-extrabold text-[#F59E0B]">
            {value}
          </span>
        </div>
      </div>

      <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#94A3B8] mt-1">
        {label}
      </span>
    </div>
  );
}
