"use client";

import Link from "next/link";

export interface MilestoneNode {
  id: string;
  title: string;
  deadline?: string;
  stake_amount: number;
  status: "verified_pass" | "pending" | "verified_fail" | "disputed" | "locked";
  verification_method: "photo" | "quiz" | "file_ai";
  goalId?: string;
}

interface MilestoneRoadmapProps {
  tasks: MilestoneNode[];
  goalId: string;
}

export default function MilestoneRoadmap({ tasks, goalId }: MilestoneRoadmapProps) {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto py-8 px-2 scrollbar-thin">
      <div className="min-w-[650px] flex items-center justify-between relative">
        {/* Animated Marching Ants Connector Track behind nodes */}
        <div className="absolute top-1/2 left-8 right-8 h-[2px] marching-ants-line -translate-y-1/2 z-0 opacity-40" />

        {tasks.map((task, idx) => {
          const isPassed = task.status === "verified_pass";
          const isPending = task.status === "pending";
          const isFailed = task.status === "verified_fail";
          const isDisputed = task.status === "disputed";

          return (
            <div key={task.id || idx} className="relative z-10 flex flex-col items-center group">
              {/* 3D Extruded Node Chip */}
              <Link
                href={isPending ? `/goals/${goalId}/tasks/${task.id}/submit` : `#`}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform-gpu ${
                  isPassed
                    ? "bg-[#10B981] text-[#090D10] shadow-[0_8px_0_#065f46,0_12px_25px_rgba(16,185,129,0.4)] hover:-translate-y-1"
                    : isPending
                    ? "bg-[#12181E] text-[#F59E0B] border-2 border-[#F59E0B] shadow-[0_8px_0_#0E141A,0_0_20px_rgba(245,158,11,0.4)] animate-pulse hover:-translate-y-1"
                    : isFailed
                    ? "bg-[#F43F5E] text-[#FFFFFF] shadow-[0_8px_0_#881337,0_12px_25px_rgba(244,63,94,0.4)]"
                    : isDisputed
                    ? "bg-[#06B6D4] text-[#090D10] shadow-[0_8px_0_#155e75,0_12px_25px_rgba(6,182,212,0.4)]"
                    : "bg-[#12181E] text-[#64748B] border border-[#1E293B] opacity-50 shadow-[0_8px_0_#0E141A]"
                }`}
              >
                <span className="material-symbols-outlined text-2xl font-bold">
                  {isPassed
                    ? "check_circle"
                    : isPending
                    ? "hourglass_top"
                    : isFailed
                    ? "cancel"
                    : isDisputed
                    ? "gavel"
                    : "lock"}
                </span>

                {/* Node Index Badge */}
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#0E141A] border border-[#1E293B] text-[10px] font-mono font-bold text-[#F8FAFC] flex items-center justify-center">
                  {idx + 1}
                </span>
              </Link>

              {/* Node Details Tooltip Card */}
              <div className="mt-4 text-center max-w-[120px] flex flex-col items-center">
                <span className="text-xs font-bold text-[#F8FAFC] truncate w-full">
                  {task.title}
                </span>
                <span className="text-[11px] font-mono text-[#10B981] font-bold mt-0.5">
                  ₹{task.stake_amount}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full border ${
                    isPassed
                      ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30"
                      : isPending
                      ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30 animate-pulse"
                      : isFailed
                      ? "bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/30"
                      : "bg-[#1E293B] text-[#94A3B8] border-transparent"
                  }`}
                >
                  {isPassed ? "Refunded" : isPending ? "Action Req" : isFailed ? "Forfeited" : "Locked"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
