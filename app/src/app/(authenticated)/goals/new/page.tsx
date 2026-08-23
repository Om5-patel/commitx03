"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import StepGoalInfo from "@/components/goals/StepGoalInfo";
import StepTasks from "@/components/goals/StepTasks";
import StepReview from "@/components/goals/StepReview";
import WizardSidebar from "@/components/goals/WizardSidebar";
import { GoalFormData, TaskFormData, CATEGORY_VERIFICATION_MAP } from "@/lib/types";

export default function NewGoalPage() {
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Goal Form State
  const [goalData, setGoalData] = useState<GoalFormData>({
    title: "",
    description: "",
    category: "generic_habit",
    total_stake: 150,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  // Tasks Form State
  const [tasks, setTasks] = useState<TaskFormData[]>([
    {
      title: "Daily Proof Submission",
      description: "Submit daily verified evidence",
      verification_method: "photo",
      stake_amount: 150,
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  ]);

  const handleGoalChange = (updated: Partial<GoalFormData>) => {
    const nextGoal = { ...goalData, ...updated };
    setGoalData(nextGoal);

    // If category changed, update default verification method
    if (updated.category) {
      const defaultMethod = CATEGORY_VERIFICATION_MAP[updated.category];
      setTasks(tasks.map((t) => ({ ...t, verification_method: defaultMethod })));
    }
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!goalData.title.trim()) {
        setErrorMsg("Please provide a title for your commitment.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!goalData.total_stake || goalData.total_stake < 100) {
        setErrorMsg("Minimum stake amount is ₹100.");
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
        throw new Error(goalJson.error?.message || "Failed to create goal");
      }

      const createdGoal = goalJson.goal;

      // 2. Create Tasks for Goal
      const tasksRes = await fetch(`/api/goals/${createdGoal.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks }),
      });

      const tasksJson = await tasksRes.json();
      if (!tasksRes.ok) {
        throw new Error(tasksJson.error?.message || "Failed to save tasks");
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
        throw new Error(orderData.error || "Failed to create payment order");
      }

      // 4. Verify & Activate Goal (Seamlessly handling test/mock mode or real Razorpay)
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
        throw new Error(verifyJson.error || "Verification failed");
      }

      // Success -> Redirect to Dashboard
      router.push(`/dashboard?new_goal=${createdGoal.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong creating your commitment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Wizard Step Progress Header */}
      <div className="flex items-center justify-between py-4 border-b border-outline-variant/20 mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          <span className="font-label font-semibold text-sm">
            {step === 1 ? "Dashboard" : "Back"}
          </span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-label text-xs uppercase tracking-[0.2em] text-tertiary mb-1 font-bold">
            Step {step} of 3
          </span>
          <div className="flex gap-2">
            <div
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                step >= 1 ? "bg-primary" : "bg-surface-container-high"
              }`}
            />
            <div
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                step >= 2 ? "bg-primary" : "bg-surface-container-high"
              }`}
            />
            <div
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                step >= 3 ? "bg-primary" : "bg-surface-container-high"
              }`}
            />
          </div>
        </div>

        <Link
          href="/dashboard"
          className="font-label text-sm font-semibold text-on-surface-variant hover:text-error transition-colors"
        >
          Cancel
        </Link>
      </div>

      {/* Error alert banner */}
      {errorMsg && (
        <div className="mb-8 p-4 rounded-2xl bg-error-container text-on-error-container text-sm flex items-center gap-3">
          <span className="material-symbols-outlined text-lg shrink-0">error</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Content Canvas */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        <div className="flex-1 max-w-3xl">
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

        {/* Sticky Sidebar Preview */}
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
