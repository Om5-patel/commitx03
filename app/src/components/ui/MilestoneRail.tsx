"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export interface MilestoneStep {
  id: string;
  title: string;
  stake_amount: number;
  status: "verified_pass" | "pending" | "verified_fail" | "locked";
  deadline?: string;
}

interface MilestoneRailProps {
  tasks: MilestoneStep[];
  goalId: string;
  className?: string;
}

export default function MilestoneRail({
  tasks = [],
  goalId,
  className = "",
}: MilestoneRailProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  const completedCount = tasks.filter((t) => t.status === "verified_pass").length;
  const totalCount = tasks.length;
  const progressPct = totalCount > 1 ? (completedCount / (totalCount - 1)) * 100 : completedCount === 1 ? 100 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(Math.min(Math.max(progressPct, 0), 100));
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPct]);

  if (tasks.length === 0) return null;

  return (
    <div className={`w-full py-6 px-4 ${className}`}>
      {/* Physical Rail Track */}
      <div className="milestone-rail-track">
        {/* Animated Completed Spring Fill */}
        <div
          className="milestone-rail-fill"
          style={{ width: `${animatedWidth}%` }}
        />

        {/* Straddling Nodes */}
        {tasks.map((task, index) => {
          const isPassed = task.status === "verified_pass";
          const isCurrent = task.status === "pending";
          const isFailed = task.status === "verified_fail";

          // Calculate horizontal offset
          const leftPercent =
            totalCount > 1 ? (index / (totalCount - 1)) * 100 : 50;

          return (
            <div
              key={task.id || index}
              className="milestone-node-container absolute -top-2 -translate-x-1/2"
              style={{ left: `${leftPercent}%` }}
            >
              {/* Minimal Top Tooltip */}
              <div className="milestone-tooltip">
                <div className="font-semibold text-xs text-[#F8FAFC]">
                  {task.title}
                </div>
                <div className="text-[11px] font-mono text-[#10B981] mt-0.5">
                  ₹{task.stake_amount} • {isPassed ? "Refunded" : isCurrent ? "Active Milestone" : isFailed ? "Forfeited" : "Locked"}
                </div>
              </div>

              {/* Physical Rivet Node */}
              <Link
                href={isCurrent ? `/goals/${goalId}/tasks/${task.id}/submit` : "#"}
                className={`block w-5 h-5 rounded-full transition-transform active:scale-90 ${
                  isPassed
                    ? "bg-[#10B981] border-2 border-[#090D10] cursor-pointer"
                    : isCurrent
                    ? "bg-[#090D10] border-2 border-[#F59E0B] shadow-[0_0_0_4px_rgba(245,158,11,0.15)] milestone-node-current cursor-pointer"
                    : isFailed
                    ? "bg-[#F43F5E] border-2 border-[#090D10] cursor-default"
                    : "bg-[#1E293B] border-2 border-[#1E293B] opacity-50 cursor-default"
                }`}
                aria-label={`Milestone ${index + 1}: ${task.title}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
