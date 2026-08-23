"use client";

import { GoalFormData, TaskFormData, VerificationMethod } from "@/lib/types";

interface StepTasksProps {
  goal: GoalFormData;
  tasks: TaskFormData[];
  onGoalChange: (updated: Partial<GoalFormData>) => void;
  onTasksChange: (tasks: TaskFormData[]) => void;
}

export default function StepTasks({
  goal,
  tasks,
  onGoalChange,
  onTasksChange,
}: StepTasksProps) {
  // Update overall stake
  const handleTotalStakeChange = (val: number) => {
    onGoalChange({ total_stake: val });
    // Distribute equally across tasks
    if (tasks.length > 0) {
      const perTaskStake = Math.round(val / tasks.length);
      const updated = tasks.map((t) => ({ ...t, stake_amount: perTaskStake }));
      onTasksChange(updated);
    }
  };

  // Update target date
  const handleDateChange = (val: string) => {
    onGoalChange({ end_date: val });
    if (tasks.length > 0) {
      const updated = tasks.map((t) => ({ ...t, deadline: val }));
      onTasksChange(updated);
    }
  };

  // Update verification method for all tasks
  const handleVerificationChange = (method: VerificationMethod) => {
    const updated = tasks.map((t) => ({ ...t, verification_method: method }));
    onTasksChange(updated);
  };

  // Add sub-task milestone
  const handleAddTask = () => {
    const newTask: TaskFormData = {
      title: `Milestone ${tasks.length + 1}`,
      description: "",
      verification_method: tasks[0]?.verification_method || "photo",
      stake_amount: Math.round(goal.total_stake / (tasks.length + 1)),
      deadline: goal.end_date,
    };
    const newTasks = [...tasks, newTask];
    const redistributed = newTasks.map((t) => ({
      ...t,
      stake_amount: Math.round(goal.total_stake / newTasks.length),
    }));
    onTasksChange(redistributed);
  };

  // Remove task milestone
  const handleRemoveTask = (index: number) => {
    if (tasks.length <= 1) return;
    const newTasks = tasks.filter((_, i) => i !== index);
    const redistributed = newTasks.map((t) => ({
      ...t,
      stake_amount: Math.round(goal.total_stake / newTasks.length),
    }));
    onTasksChange(redistributed);
  };

  // Update specific task
  const handleTaskUpdate = (index: number, updated: Partial<TaskFormData>) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], ...updated };
    onTasksChange(newTasks);
  };

  const activeMethod = tasks[0]?.verification_method || "photo";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">
          Configure Your Commitment
        </h2>
        <p className="text-on-surface-variant text-base">
          Set the deadline and meaningful stake to anchor your intentions.
        </p>
      </div>

      {/* ── Section 1: The Deadline ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined icon-fill text-xl">
              calendar_today
            </span>
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              The Deadline
            </h3>
            <p className="text-on-surface-variant text-sm">
              When will this objective be completed?
            </p>
          </div>
        </div>

        <div className="group relative bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40 hover:border-outline focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
          <label
            htmlFor="deadline-input"
            className="block font-label text-sm font-bold text-on-surface-variant mb-2"
          >
            Target Date
          </label>
          <input
            id="deadline-input"
            type="date"
            value={goal.end_date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full bg-transparent border-none p-0 text-2xl font-headline text-on-surface focus:ring-0 outline-none cursor-pointer"
          />
        </div>
      </section>

      <hr className="border-outline-variant/20" />

      {/* ── Section 2: The Stake ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
            <span className="material-symbols-outlined icon-fill text-xl">
              savings
            </span>
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              The Stake
            </h3>
            <p className="text-on-surface-variant text-sm">
              What pledge are you willing to put at risk to guarantee your focus?
            </p>
          </div>
        </div>

        <div className="group relative bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/40 hover:border-outline focus-within:border-tertiary focus-within:ring-2 focus-within:ring-tertiary/20 transition-all shadow-sm">
          <label
            htmlFor="stake-input"
            className="block font-label text-sm font-bold text-on-surface-variant mb-2"
          >
            Amount at Risk (INR) — Min ₹100, Max ₹10,000
          </label>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-headline text-tertiary font-medium">
              ₹
            </span>
            <input
              id="stake-input"
              type="number"
              min={100}
              max={10000}
              step={50}
              value={goal.total_stake || ""}
              onChange={(e) => handleTotalStakeChange(Number(e.target.value))}
              placeholder="150"
              className="w-full bg-transparent border-none p-0 text-4xl font-headline font-bold text-on-surface focus:ring-0 outline-none placeholder:text-outline-variant"
            />
          </div>
        </div>
      </section>

      <hr className="border-outline-variant/20" />

      {/* ── Section 3: Verification Method ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined icon-fill text-xl">
              verified
            </span>
          </div>
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              Verification Method
            </h3>
            <p className="text-on-surface-variant text-sm">
              How will you prove to the network that this task is complete?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {/* Photo */}
          <div
            onClick={() => handleVerificationChange("photo")}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              activeMethod === "photo"
                ? "border-primary bg-primary-fixed/20 shadow-sm"
                : "border-transparent bg-surface-container hover:bg-surface-container-high"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                activeMethod === "photo"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined icon-fill">
                photo_camera
              </span>
            </div>
            <span className="font-headline font-bold text-on-surface text-lg">
              Photo
            </span>
            <span className="text-center font-body text-xs text-on-surface-variant leading-relaxed">
              In-app photographic evidence with fraud checks.
            </span>
          </div>

          {/* Quiz */}
          <div
            onClick={() => handleVerificationChange("quiz")}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              activeMethod === "quiz"
                ? "border-primary bg-primary-fixed/20 shadow-sm"
                : "border-transparent bg-surface-container hover:bg-surface-container-high"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                activeMethod === "quiz"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined icon-fill">quiz</span>
            </div>
            <span className="font-headline font-bold text-on-surface text-lg">
              Quiz
            </span>
            <span className="text-center font-body text-xs text-on-surface-variant leading-relaxed">
              Pass an AI-generated knowledge check (≥60%).
            </span>
          </div>

          {/* File */}
          <div
            onClick={() => handleVerificationChange("file_ai")}
            className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
              activeMethod === "file_ai"
                ? "border-primary bg-primary-fixed/20 shadow-sm"
                : "border-transparent bg-surface-container hover:bg-surface-container-high"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                activeMethod === "file_ai"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined icon-fill">
                upload_file
              </span>
            </div>
            <span className="font-headline font-bold text-on-surface text-lg">
              File Artifact
            </span>
            <span className="text-center font-body text-xs text-on-surface-variant leading-relaxed">
              Submit document, commit link, or design file for AI verification.
            </span>
          </div>
        </div>
      </section>

      <hr className="border-outline-variant/20" />

      {/* ── Section 4: Milestones Breakdown ── */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              Milestone Breakdown
            </h3>
            <p className="text-on-surface-variant text-sm">
              Break your goal into {tasks.length} verifiable sub-task
              {tasks.length > 1 ? "s" : ""}.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddTask}
            className="flex items-center gap-1.5 text-primary hover:bg-primary-fixed/30 font-semibold px-4 py-2 rounded-xl transition-colors text-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Add Milestone
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-7 h-7 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) =>
                    handleTaskUpdate(idx, { title: e.target.value })
                  }
                  placeholder={`Milestone #${idx + 1}`}
                  className="bg-transparent border-b border-outline-variant/30 focus:border-primary px-2 py-1 text-on-surface font-semibold outline-none flex-1"
                />
              </div>

              <div className="flex items-center gap-4 text-sm justify-between md:justify-end">
                <span className="text-on-surface-variant">
                  Stake:{" "}
                  <strong className="text-primary">
                    ₹{task.stake_amount}
                  </strong>
                </span>

                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    className="text-error hover:bg-error-container/30 p-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Remove milestone"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
