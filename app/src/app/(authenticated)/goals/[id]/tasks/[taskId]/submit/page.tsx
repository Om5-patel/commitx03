"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CameraCapture from "@/components/submission/CameraCapture";
import QuizSubmission from "@/components/submission/QuizSubmission";
import FileSubmission from "@/components/submission/FileSubmission";

interface SubmitPageProps {
  params: Promise<{ id: string; taskId: string }>;
}

export default function TaskSubmitPage({ params }: SubmitPageProps) {
  const { id: goalId, taskId } = use(params);
  const router = useRouter();

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/goals/${goalId}`);
        if (res.ok) {
          const data = await res.json();
          const found = (data.goal?.tasks || []).find((t: any) => t.id === taskId);
          if (found) {
            setTask(found);
          } else {
            // Fallback mock task for testing
            setTask({
              id: taskId,
              title: "Morning Habit / Deep Work Check-in",
              description: "Complete and submit proof for today's milestone.",
              verification_method: "photo",
              stake_amount: 150,
            });
          }
        } else {
          setTask({
            id: taskId,
            title: "Morning Habit / Deep Work Check-in",
            description: "Complete and submit proof for today's milestone.",
            verification_method: "photo",
            stake_amount: 150,
          });
        }
      } catch {
        setTask({
          id: taskId,
          title: "Milestone Task",
          description: "Submit evidence for verification.",
          verification_method: "photo",
          stake_amount: 150,
        });
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [goalId, taskId]);

  const handleSuccess = () => {
    setSuccess(true);
    setTimeout(() => {
      router.push(`/goals/${goalId}`);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-surface-container-lowest p-12 rounded-[2rem] border border-outline-variant/30 shadow-organic max-w-lg mx-auto text-center flex flex-col items-center gap-6 my-12">
        <div className="w-20 h-20 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl filled">
            verified
          </span>
        </div>
        <h2 className="font-headline text-3xl font-bold text-on-surface">
          Proof Successfully Verified!
        </h2>
        <p className="text-on-surface-variant text-sm">
          Your milestone stake has been unlocked and refunded. Redirecting to your commitment details...
        </p>
      </div>
    );
  }

  const method = task?.verification_method || "photo";

  return (
    <div className="w-full flex flex-col gap-6">
      {/* If camera is used, we give it a clean full viewport container matching the mockup */}
      {method === "photo" ? (
        <div className="max-w-xl mx-auto w-full">
          <CameraCapture
            taskId={taskId}
            goalId={goalId}
            taskTitle={task.title}
            onSuccess={handleSuccess}
          />
        </div>
      ) : method === "quiz" ? (
        <div className="max-w-3xl mx-auto w-full">
          <Link
            href={`/goals/${goalId}`}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold mb-6"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Commitment
          </Link>
          <QuizSubmission
            taskId={taskId}
            goalId={goalId}
            taskTitle={task.title}
            taskDescription={task.description}
            onSuccess={handleSuccess}
          />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto w-full">
          <Link
            href={`/goals/${goalId}`}
            className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold mb-6"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Commitment
          </Link>
          <FileSubmission
            taskId={taskId}
            goalId={goalId}
            taskTitle={task.title}
            taskDescription={task.description}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
}
