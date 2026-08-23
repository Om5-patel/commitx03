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
  const handleTotalStakeChange = (val: number) => {
    onGoalChange({ total_stake: val });
    if (tasks.length > 0) {
      const perTaskStake = Math.round(val / tasks.length);
      const updated = tasks.map((t) => ({ ...t, stake_amount: perTaskStake }));
      onTasksChange(updated);
    }
  };

  const handleDateChange = (val: string) => {
    onGoalChange({ end_date: val });
    if (tasks.length > 0) {
      const updated = tasks.map((t) => ({ ...t, deadline: val }));
      onTasksChange(updated);
    }
  };

  const handleVerificationChange = (method: VerificationMethod) => {
    const updated = tasks.map((t) => ({ ...t, verification_method: method }));
    onTasksChange(updated);
  };

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

  const handleRemoveTask = (index: number) => {
    if (tasks.length <= 1) return;
    const newTasks = tasks.filter((_, i) => i !== index);
    const redistributed = newTasks.map((t) => ({
      ...t,
      stake_amount: Math.round(goal.total_stake / newTasks.length),
    }));
    onTasksChange(redistributed);
  };

  const handleTaskUpdate = (index: number, updated: Partial<TaskFormData>) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], ...updated };
    onTasksChange(newTasks);
  };

  const activeMethod = tasks[0]?.verification_method || "photo";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-[#10B981] uppercase">
          STEP 02 // CONFIGURATION
        </span>
        <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Escrow Stake & Milestones
        </h2>
        <p className="text-sm text-[#94A3B8] mt-1">
          Configure financial stakes, target deadlines, and proof breakdown.
        </p>
      </div>

      {/* ── Section 1: Financial Stake Pledge ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">payments</span>
          </div>
          <div>
            <h3 className="font-sans text-lg font-bold text-[#F8FAFC]">Financial Stake Pledge</h3>
            <p className="text-xs text-[#94A3B8]">Capital placed at risk in automated escrow (Min ₹100, Max ₹10,000).</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#12181E] border border-[#1E293B] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#94A3B8] uppercase">Pledge Amount:</span>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-bold text-[#10B981]">₹</span>
              <input
                type="number"
                min={100}
                max={10000}
                step={50}
                value={goal.total_stake || ""}
                onChange={(e) => handleTotalStakeChange(Number(e.target.value))}
                placeholder="500"
                className="w-32 bg-transparent text-3xl font-black text-[#F8FAFC] outline-none border-b border-[#1E293B] focus:border-[#10B981] font-mono text-right"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {[150, 300, 500, 1000, 2500].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleTotalStakeChange(amt)}
                className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                  goal.total_stake === amt
                    ? "bg-[#10B981] text-[#090D10] border-[#10B981]"
                    : "bg-[#090D10] border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Final Target Deadline ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">event</span>
          </div>
          <div>
            <h3 className="font-sans text-lg font-bold text-[#F8FAFC]">Final Target Date</h3>
            <p className="text-xs text-[#94A3B8]">The deadline by which all milestones must be satisfied.</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#12181E] border border-[#1E293B]">
          <input
            type="date"
            value={goal.end_date}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full bg-transparent text-base font-mono font-bold text-[#F8FAFC] outline-none cursor-pointer"
          />
        </div>
      </section>

      {/* ── Section 3: Verification Mode ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#06B6D4]/15 text-[#06B6D4] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-xl">verified</span>
          </div>
          <div>
            <h3 className="font-sans text-lg font-bold text-[#F8FAFC]">Proof Verification Mode</h3>
            <p className="text-xs text-[#94A3B8]">How milestones are evaluated for automated refunds.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: "photo", label: "Camera Proof", desc: "GPS & time-stamped camera", icon: "photo_camera" },
            { id: "quiz", label: "AI Study Quiz", desc: "5 dynamic MCQs (≥80% Pass)", icon: "quiz" },
            { id: "file_ai", label: "Deliverable AI", desc: "Code, commit, or doc review", icon: "upload_file" },
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => handleVerificationChange(m.id as any)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeMethod === m.id
                  ? "bg-[#10B981]/15 border-[#10B981] text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                  : "bg-[#12181E] border-[#1E293B] text-[#94A3B8] hover:border-[#334155]"
              }`}
            >
              <span className="material-symbols-outlined text-2xl mb-1">{m.icon}</span>
              <h4 className="font-sans font-bold text-sm text-[#F8FAFC]">{m.label}</h4>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Milestone Sub-tasks ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">alt_route</span>
            </div>
            <div>
              <h3 className="font-sans text-lg font-bold text-[#F8FAFC]">
                Milestone Steps ({tasks.length})
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Stake auto-distributed: ₹{Math.round(goal.total_stake / tasks.length)} / milestone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddTask}
            className="btn-glass text-xs !py-2 !px-3 font-mono"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Step
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#12181E] border border-[#1E293B] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-6 h-6 rounded-full bg-[#090D10] border border-[#1E293B] text-[11px] font-mono font-bold text-[#10B981] flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => handleTaskUpdate(idx, { title: e.target.value })}
                  placeholder={`Milestone Step ${idx + 1}`}
                  className="w-full bg-transparent text-sm font-bold text-[#F8FAFC] outline-none border-b border-transparent focus:border-[#10B981] px-1 py-0.5"
                />
              </div>

              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#10B981] font-bold">₹{task.stake_amount}</span>
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(idx)}
                    className="text-[#F43F5E] hover:bg-[#F43F5E]/15 p-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
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
