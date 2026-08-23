"use client";

import React, { useRef } from "react";

interface CommitmentCardProps {
  stakeAmount: number;
  goalTitle: string;
  deadline?: string;
  vaultId?: string;
  className?: string;
}

export default function CommitmentCard({
  stakeAmount = 4250,
  goalTitle = "Daily Morning Meditation & Focus",
  deadline = "07d 14h",
  vaultId = "COMMITX VAULT",
  className = "",
}: CommitmentCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !innerRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Max ±12 degrees tilt
    const tiltX = ((x - centerX) / centerX) * 12;
    const tiltY = -((y - centerY) / centerY) * 12;

    cardRef.current.style.transform = `rotateX(${tiltY.toFixed(2)}deg) rotateY(${tiltX.toFixed(2)}deg)`;
    innerRef.current.style.setProperty("--mouse-x", `${percentX.toFixed(1)}%`);
    innerRef.current.style.setProperty("--mouse-y", `${percentY.toFixed(1)}%`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !innerRef.current) return;
    cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg)`;
    innerRef.current.style.setProperty("--mouse-x", `50%`);
    innerRef.current.style.setProperty("--mouse-y", `50%`);
  };

  return (
    <div className={`commitment-card-wrapper ${className}`}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="commitment-card cursor-pointer"
      >
        <div ref={innerRef} className="commitment-card-inner">
          {/* Subtle Matte Texture */}
          <div className="commitment-card-texture" />

          {/* Top Row */}
          <div className="flex items-center justify-between z-10">
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "9px",
                letterSpacing: "0.2em",
                color: "rgba(16, 185, 129, 0.6)",
              }}
            >
              {vaultId}
            </span>

            {/* Embossed Hexagonal SVG Icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>

          {/* Middle: Amount with subtle emboss */}
          <div className="my-auto z-10">
            <div className="card-amount-emboss">
              ₹ {Number(stakeAmount).toLocaleString("en-IN")}
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                color: "rgba(255, 255, 255, 0.3)",
                letterSpacing: "0.05em",
                marginTop: "2px",
              }}
            >
              CAPITAL IN ESCROW TRUST
            </div>
          </div>

          {/* Bottom Row */}
          <div className="flex items-end justify-between gap-4 z-10">
            <div className="min-w-0 flex-1">
              <span
                className="truncate block"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "rgba(255, 255, 255, 0.5)",
                }}
              >
                {goalTitle}
              </span>
            </div>

            <div className="shrink-0 text-right">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#F59E0B",
                }}
              >
                {deadline}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
