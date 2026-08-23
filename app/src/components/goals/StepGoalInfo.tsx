"use client";

import { GoalCategory, GoalFormData, CATEGORY_LABELS } from "@/lib/types";

interface StepGoalInfoProps {
  data: GoalFormData;
  onChange: (updated: Partial<GoalFormData>) => void;
}

const categories: {
  id: GoalCategory;
  title: string;
  desc: string;
  icon: string;
  method: string;
}[] = [
  {
    id: "generic_habit",
    title: "Generic Habit",
    desc: "Daily rituals, morning routines, gym check-ins, meditation sessions.",
    icon: "psychiatry",
    method: "Photo proof (in-app camera)",
  },
  {
    id: "study",
    title: "Study & Learning",
    desc: "Reading books, course modules, research papers, exam preparation.",
    icon: "menu_book",
    method: "Knowledge quiz (AI generated)",
  },
  {
    id: "business_creative",
    title: "Business & Creative",
    desc: "Shipping features, design files, essays, client deliverables.",
    icon: "terminal",
    method: "File artifact + AI check",
  },
];

export default function StepGoalInfo({ data, onChange }: StepGoalInfoProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
          Name Your Commitment
        </h2>
        <p className="text-on-surface-variant text-base">
          What is the primary ambition you want to lock in?
        </p>
      </div>

      {/* Goal Title */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="goal-title"
          className="font-label text-sm font-bold text-on-surface-variant"
        >
          Goal Title
        </label>
        <input
          id="goal-title"
          type="text"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. Daily Morning Meditation (10 Days)"
          className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 text-xl font-headline text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="goal-desc"
          className="font-label text-sm font-bold text-on-surface-variant"
        >
          Why does this matter? (Description)
        </label>
        <textarea
          id="goal-desc"
          rows={3}
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Clarify your intention and the exact outcome you commit to achieve."
          className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-5 text-base font-body text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm resize-none"
        />
      </div>

      {/* Category Selection */}
      <div className="flex flex-col gap-4">
        <label className="font-label text-sm font-bold text-on-surface-variant">
          Select Category & Verification Engine
        </label>
        <div className="grid grid-cols-1 gap-4">
          {categories.map((cat) => {
            const isSelected = data.category === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => onChange({ category: cat.id })}
                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected
                    ? "border-primary bg-primary-fixed/20 shadow-sm"
                    : "border-outline-variant/30 bg-surface-container-lowest hover:border-outline-variant"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-2xl ${
                      isSelected ? "filled" : ""
                    }`}
                  >
                    {cat.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline font-bold text-lg text-on-surface">
                      {cat.title}
                    </h4>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant">
                      {cat.method}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                    {cat.desc}
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
