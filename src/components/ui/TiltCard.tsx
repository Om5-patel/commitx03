"use client";

import React, { useRef, useState } from "react";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: "emerald" | "amber" | "rose" | "cyan" | "none";
  maxTilt?: number;
}

export default function TiltCard({
  children,
  className = "",
  glow = "none",
  maxTilt = 4,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const rotateX = -((y - centerY) / centerY) * maxTilt;

    setTilt({ x: rotateX, y: rotateY });
    setSheen({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setSheen((prev) => ({ ...prev, opacity: 0 }));
  };

  const glowClass =
    glow === "emerald"
      ? "glow-emerald"
      : glow === "amber"
      ? "glow-amber"
      : glow === "rose"
      ? "glow-rose"
      : glow === "cyan"
      ? "glow-cyan"
      : "";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl bg-[#12181E] border border-[#1E293B] transition-all duration-200 ease-out overflow-hidden ${glowClass} ${className}`}
      {...props}
    >
      {/* Specular Mouse-Following Light Sheen */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-10"
        style={{
          opacity: sheen.opacity,
          background: `radial-gradient(circle 250px at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.25), transparent 70%)`,
        }}
      />

      {/* Card Content */}
      <div className="relative z-0 h-full">{children}</div>
    </div>
  );
}
