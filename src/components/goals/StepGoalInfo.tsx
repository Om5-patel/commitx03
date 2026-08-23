"use client";

import { GoalCategory, GoalFormData } from "@/lib/types";
import { BookOpen, Dumbbell, Terminal } from "lucide-react";

interface StepGoalInfoProps {
  data: GoalFormData;
  onChange: (updated: Partial<GoalFormData>) => void;
}

const categories: {
  id: GoalCategory;
  title: string;
  desc: string;
  Icon: typeof BookOpen;
  method: string;
  accentColor: string;
}[] = [
  {
    id: "study",
    title: "Deep Study & Skill Sprint",
    desc: "Read books, master complex technical topics, prep for exams or certifications.",
    Icon: BookOpen,
    method: "AI Dynamic Quiz (OpenRouter Free)",
    accentColor: "#06B6D4",
  },
  {
    id: "generic_habit",
    title: "Habit, Fitness & Routine",
    desc: "Daily morning focus, workout sessions, gym check-ins, meditation streak.",
    Icon: Dumbbell,
    method: "GPS Viewfinder Photo Proof",
    accentColor: "#10B981",
  },
  {
    id: "business_creative",
    title: "Code, Product & Deliverables",
    desc: "Shipping feature code, GitHub commits, design prototypes, client deliverables.",
    Icon: Terminal,
    method: "Artifact Link / File AI Inspector",
    accentColor: "#F59E0B",
  },
];

export default function StepGoalInfo({ data, onChange }: StepGoalInfoProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
          STEP 01 // OBJECTIVE
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Define Your Commitment Vault
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1">
          What milestone are you committing your financial capital to achieve?
        </p>
      </div>

      {/* Goal Title */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="goal-title"
          className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase"
        >
          Commitment Title
        </label>
        <input
          id="goal-title"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Master System Design & Microservices (14 Days)"
          className="w-full bg-[#12181E] border border-[#1E293B] rounded-xl p-4 text-base sm:text-lg font-bold text-[#F8FAFC] focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] outline-none transition-all shadow-inner placeholder:text-[#475569]"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="goal-desc"
          className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase"
        >
          Scope & Success Criteria (Optional)
        </label>
        <textarea
          id="goal-desc"
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Clarify what genuine completion looks like so the verification engine can accurately evaluate."
          className="w-full bg-[#12181E] border border-[#1E293B] rounded-xl p-4 text-sm text-[#F8FAFC] focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] outline-none transition-all shadow-inner resize-none placeholder:text-[#475569]"
        />
      </div>

      {/* Category Selection */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase">
          Category & Verification Engine
        </label>
        <div className="grid grid-cols-1 gap-4">
          {categories.map(({ id, title, desc, Icon, method }) => {
            const isSelected = data.category === id;

            return (
              <div
                key={id}
                onClick={() => onChange({ category: id })}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? "border-[#10B981] bg-[#12181E] shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                    : "border-[#1E293B] bg-[#0E141A] hover:border-[#334155]"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                    isSelected
                      ? "bg-[#10B981] text-[#090D10] shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                      : "bg-[#12181E] text-[#94A3B8] border border-[#1E293B]"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-sans font-bold text-base text-[#F8FAFC]">
                      {title}
                    </h4>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#090D10] text-[#10B981] border border-[#10B981]/30 w-max">
                      {method}
                    </span>
                  </div>
                  <p className="text-[#94A3B8] text-xs mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
