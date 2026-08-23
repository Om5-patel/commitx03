"use client";

import { useEffect, useState } from "react";

interface CountUpNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  decimals?: number;
  className?: string;
  showWatermark?: boolean;
}

export default function CountUpNumber({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1200,
  decimals = 0,
  className = "",
  showWatermark = true,
}: CountUpNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      const easedProgress = easeOutExpo(progress);
      const current = easedProgress * value;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value, durationMs]);

  const formatted =
    prefix +
    displayValue.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix;

  return (
    <div className="relative flex items-center">
      {/* Giant Ghosted Watermark in JetBrains Mono behind number */}
      {showWatermark && (
        <span
          className="absolute -right-4 -bottom-6 font-mono text-7xl sm:text-8xl font-black text-[#F8FAFC]/[0.035] select-none pointer-events-none tracking-tighter"
          aria-hidden="true"
        >
          {Math.round(value)}
        </span>
      )}

      {/* Primary Number Display */}
      <span className={`font-mono font-extrabold tracking-tight relative z-10 ${className}`}>
        {formatted}
      </span>
    </div>
  );
}
