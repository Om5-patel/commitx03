"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CameraCapture from "@/components/submission/CameraCapture";
import QuizSubmission from "@/components/submission/QuizSubmission";
import FileSubmission from "@/components/submission/FileSubmission";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

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
            setTask({
              id: taskId,
              title: "System Design & Distributed Services Check-in",
              description: "Complete and submit verified evidence for today's milestone.",
              verification_method: "quiz",
              stake_amount: 200,
            });
          }
        } else {
          setTask({
            id: taskId,
            title: "Morning Habit / Focus Sprint Check-in",
            description: "Complete and submit verified evidence for today's milestone.",
            verification_method: "photo",
            stake_amount: 150,
          });
        }
      } catch {
        setTask({
          id: taskId,
          title: "Milestone Task Verification",
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
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-[#12181E] border border-[#10B981]/50 max-w-lg mx-auto text-center flex flex-col items-center gap-4 my-16 px-4">
        <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full flex items-center justify-center border border-[#10B981]/40">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="type-heading text-2xl text-white">
          Milestone Verified!
        </h2>
        <p className="type-body text-xs font-mono leading-relaxed">
          Your ₹{task?.stake_amount || 150} stake has been unlocked and credited back to your account. Returning to vault...
        </p>
      </div>
    );
  }

  const method = task?.verification_method || "photo";

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 space-y-5">
      <Link
        href={`/goals/${goalId}`}
        className="inline-flex items-center gap-1.5 type-label text-[#94A3B8] hover:text-[#10B981] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO COMMITMENT VAULT</span>
      </Link>

      {method === "photo" ? (
        <CameraCapture
          taskId={taskId}
          goalId={goalId}
          taskTitle={task.title}
          onSuccess={handleSuccess}
        />
      ) : method === "quiz" ? (
        <QuizSubmission
          taskId={taskId}
          goalId={goalId}
          taskTitle={task.title}
          onSuccess={handleSuccess}
        />
      ) : (
        <FileSubmission
          taskId={taskId}
          goalId={goalId}
          taskTitle={task.title}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}
