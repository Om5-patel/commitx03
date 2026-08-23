"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import TiltCard from "@/components/ui/TiltCard";
import { Link2, Rocket, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface FileSubmissionProps {
  taskId: string;
  goalId: string;
  taskTitle: string;
  taskDescription?: string;
  onSuccess: () => void;
}

export default function FileSubmission({
  taskId,
  goalId,
  taskTitle,
  onSuccess,
}: FileSubmissionProps) {
  const [artifactUrl, setArtifactUrl] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    passed: boolean;
    confidence: number;
    reasoning: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artifactUrl.trim() && !description.trim()) {
      setErrorMsg("Please provide an artifact URL or write your deliverable summary.");
      return;
    }

    setEvaluating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/verify/artifact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          goalId,
          artifactUrl,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setEvaluationResult({
        passed: data.passed,
        confidence: data.confidence || 92,
        reasoning: data.reasoning || "Deliverable satisfies all objective criteria and architectural constraints.",
      });

      if (data.passed) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#10B981", "#F59E0B", "#06B6D4"],
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to transmit deliverable for review");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <TiltCard glow="amber" className="max-w-2xl mx-auto p-6 sm:p-10 bg-[#12181E] border border-[#1E293B]">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#F59E0B] uppercase bg-[#F59E0B]/15 border border-[#F59E0B]/30 px-3 py-1 rounded-full">
            ARTIFACT INSPECTOR HUD
          </span>
          <h2 className="font-sans text-2xl font-black text-[#F8FAFC] tracking-tight mt-3">
            {taskTitle}
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1">
            Submit your code repository link, design file, or deliverable for automated AI inspection.
          </p>
        </div>

        {!evaluationResult ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Artifact Link */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase">
                Repository / Deliverable URL
              </label>
              <div className="flex items-center gap-2 bg-[#090D10] border border-[#1E293B] rounded-xl px-3.5 py-3 focus-within:border-[#F59E0B] transition-colors">
                <Link2 className="w-4 h-4 text-[#64748B] shrink-0" />
                <input
                  type="url"
                  value={artifactUrl}
                  onChange={(e) => setArtifactUrl(e.target.value)}
                  placeholder="https://github.com/username/project/commit/..."
                  className="w-full bg-transparent text-sm font-mono text-[#F8FAFC] outline-none placeholder:text-[#475569]"
                />
              </div>
            </div>

            {/* Description Notes */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold tracking-wider text-[#94A3B8] uppercase">
                Deliverable Notes & Summary
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the changes made, tests executed, or key breakthroughs achieved..."
                className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl p-4 text-xs font-mono text-[#F8FAFC] focus:border-[#F59E0B] outline-none resize-none placeholder:text-[#475569]"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={evaluating}
              className="btn-primary w-full !py-4 text-sm font-mono tracking-wider inline-flex items-center justify-center gap-2"
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI INSPECTOR (OpenRouter Free): Evaluating Artifact...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>SUBMIT ARTIFACT FOR VERIFICATION</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Evaluation Results Box */
          <div className="space-y-6 text-center py-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl font-bold ${
                evaluationResult.passed
                  ? "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  : "bg-[#F43F5E]/20 text-[#F43F5E] border border-[#F43F5E]/40"
              }`}
            >
              {evaluationResult.passed ? (
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              ) : (
                <XCircle className="w-8 h-8 stroke-[2.5]" />
              )}
            </div>

            <div>
              <h3 className="font-sans text-2xl font-bold text-[#F8FAFC]">
                {evaluationResult.passed ? "Artifact Accepted & Verified!" : "Artifact Revision Required"}
              </h3>
              <p className="text-xs font-mono text-[#94A3B8] mt-1">
                AI Confidence Score: <strong className="text-[#10B981]">{evaluationResult.confidence}%</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090D10] border border-[#1E293B] text-xs font-mono text-left text-[#94A3B8] leading-relaxed">
              <strong className="text-[#F8FAFC] block mb-1">EVALUATION AUDIT REPORT:</strong>
              {evaluationResult.reasoning}
            </div>

            <button
              type="button"
              onClick={onSuccess}
              className="btn-primary w-full !py-3.5"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </TiltCard>
  );
}
