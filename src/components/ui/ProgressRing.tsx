"use client";

import { useEffect, useState } from "react";

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: "emerald" | "amber" | "rose" | "cyan";
  animate?: boolean;
}

export default function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color = "emerald",
  animate = true,
}: ProgressRingProps) {
  const [currentProgress, setCurrentProgress] = useState(() =>
    animate ? 0 : Math.min(100, Math.max(0, progress))
  );

  useEffect(() => {
    if (!animate) return;
    const timer = setTimeout(() => {
      setCurrentProgress(Math.min(100, Math.max(0, progress)));
    }, 100);
    return () => clearTimeout(timer);
  }, [progress, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;

  const colorHex =
    color === "emerald"
      ? "#10B981"
      : color === "amber"
      ? "#F59E0B"
      : color === "rose"
      ? "#F43F5E"
      : "#06B6D4";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E293B"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Animated Progress Stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorHex}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
            filter: `drop-shadow(0 0 6px ${colorHex})`,
          }}
        />
      </svg>

      {/* Center Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        <span
          className="font-mono text-lg sm:text-xl font-bold tracking-tight text-[#F8FAFC]"
          style={{ textShadow: `0 0 10px ${colorHex}50` }}
        >
          {label !== undefined ? label : `${Math.round(currentProgress)}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-wider">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
