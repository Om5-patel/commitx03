"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StepGoalInfo from "@/components/goals/StepGoalInfo";
import StepTasks from "@/components/goals/StepTasks";
import StepReview from "@/components/goals/StepReview";
import WizardSidebar from "@/components/goals/WizardSidebar";
import { GoalFormData, TaskFormData, CATEGORY_VERIFICATION_MAP } from "@/lib/types";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function NewGoalPage() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Goal Form State
  const [goalData, setGoalData] = useState<GoalFormData>(() => {
    const now = new Date();
    const future = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return {
      title: "",
      description: "",
      category: "study",
      total_stake: 500,
      start_date: now.toISOString().split("T")[0],
      end_date: future.toISOString().split("T")[0],
    };
  });

  // Tasks Form State
  const [tasks, setTasks] = useState<TaskFormData[]>(() => {
    const now = new Date();
    const future = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    return [
      {
        title: "Milestone 1: Fundamentals Mastery",
        description: "Complete and pass the verification check",
        verification_method: "quiz",
        stake_amount: 250,
        deadline: future.toISOString().split("T")[0],
      },
      {
        title: "Milestone 2: Practical Implementation",
        description: "Complete and pass the verification check",
        verification_method: "quiz",
        stake_amount: 250,
        deadline: future.toISOString().split("T")[0],
      },
    ];
  });

  const handleGoalChange = (updated: Partial<GoalFormData>) => {
    const nextGoal = { ...goalData, ...updated };
    setGoalData(nextGoal);

    if (updated.category) {
      const defaultMethod = CATEGORY_VERIFICATION_MAP[updated.category];
      setTasks(tasks.map((t) => ({ ...t, verification_method: defaultMethod })));
    }
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!goalData.title.trim()) {
        setErrorMsg("Please enter a title for your commitment.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!goalData.total_stake || goalData.total_stake < 100) {
        setErrorMsg("Minimum stake pledge is ₹100.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      handleSubmitGoal();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrorMsg(null);
    } else {
      router.back();
    }
  };

  const handleSubmitGoal = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Create Goal
      const goalRes = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goalData),
      });

      const goalJson = await goalRes.json();
      if (!goalRes.ok) {
        throw new Error(goalJson.error?.message || "Failed to create commitment vault");
      }

      const createdGoal = goalJson.goal;

      // 2. Create Tasks
      const tasksRes = await fetch(`/api/goals/${createdGoal.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });

      const tasksJson = await tasksRes.json();
      if (!tasksRes.ok) {
        throw new Error(tasksJson.error?.message || "Failed to save milestones");
      }

      // 3. Create Payment Order
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: createdGoal.id,
          amount: goalData.total_stake,
          currency: "INR",
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to initialize escrow deposit");
      }

      // 4. Verify & Lock
      const verifyRes = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          goal_id: createdGoal.id,
          razorpay_order_id: orderData.order_id,
          razorpay_payment_id: `pay_${Date.now()}`,
          is_mock: orderData.is_mock,
        }),
      });

      if (!verifyRes.ok) {
        const verifyJson = await verifyRes.json();
        throw new Error(verifyJson.error || "Deposit verification failed");
      }

      // Redirect to Dashboard
      router.push(`/dashboard?new_goal=${createdGoal.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to finalize commitment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Progress Header */}
      <div className="flex items-center justify-between py-4 border-b border-[#1E293B]">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#94A3B8] hover:text-[#10B981] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{step === 1 ? "DASHBOARD" : "PREVIOUS STEP"}</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[11px] font-mono tracking-widest text-[#10B981] font-bold uppercase mb-1.5">
            STEP 0{step} OF 03
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-10 rounded-full transition-all duration-300 ${
                  step >= s ? "bg-[#10B981] shadow-[0_0_8px_#10B981]" : "bg-[#1E293B]"
                }`}
              />
            ))}
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-mono text-[#94A3B8] hover:text-[#F43F5E] transition-colors"
        >
          DISCARD
        </Link>
      </div>

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-mono flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 items-start">
        <div className="flex-1 w-full max-w-3xl">
          {step === 1 && (
            <StepGoalInfo data={goalData} onChange={handleGoalChange} />
          )}

          {step === 2 && (
            <StepTasks
              goal={goalData}
              tasks={tasks}
              onGoalChange={handleGoalChange}
              onTasksChange={setTasks}
            />
          )}

          {step === 3 && (
            <StepReview
              goal={goalData}
              tasks={tasks}
              onConfirm={handleSubmitGoal}
              isLoading={loading}
            />
          )}
        </div>

        {/* Wizard Sidebar */}
        <WizardSidebar
          goal={goalData}
          tasks={tasks}
          currentStep={step}
          onNext={handleNext}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
