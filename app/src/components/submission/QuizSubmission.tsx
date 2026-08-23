"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import TiltCard from "@/components/ui/TiltCard";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface QuizSubmissionProps {
  taskId: string;
  goalId: string;
  taskTitle: string;
  onSuccess: () => void;
}

export default function QuizSubmission({
  taskId,
  goalId,
  taskTitle,
  onSuccess,
}: QuizSubmissionProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number; passed: boolean } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch or generate quiz
  useEffect(() => {
    async function loadQuiz() {
      try {
        const res = await fetch(`/api/verify/quiz?taskId=${taskId}&taskTitle=${encodeURIComponent(taskTitle)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          } else {
            // High quality fallback questions
            setQuestions([
              {
                id: "q1",
                question: `In the context of ${taskTitle}, what is the primary architectural requirement for zero data loss?`,
                options: ["Synchronous WAL logging", "Memory-only caching", "Single-threaded async event loops", "Periodic hourly backups"],
                correct_answer: "Synchronous WAL logging",
              },
              {
                id: "q2",
                question: "Which invariant guarantees eventual consistency in distributed masterless replication?",
                options: ["Quorum Read (R + W > N)", "Static Round-Robin routing", "Single point of coordination", "Optimistic time-travel locks"],
                correct_answer: "Quorum Read (R + W > N)",
              },
              {
                id: "q3",
                question: "How does CommitX escrow guarantee automated refund execution?",
                options: ["Cryptographic verification triggers instant unlock", "Manual 3-day approval queue", "Token combustion", "Third-party escrow fees"],
                correct_answer: "Cryptographic verification triggers instant unlock",
              },
            ]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadQuiz();
  }, [taskId, taskTitle]);

  const handleSelect = (opt: string) => {
    setSelectedOption(opt);
  };

  const handleNext = () => {
    if (!selectedOption) return;
    const currentQ = questions[currentIndex];
    const newAnswers = { ...answers, [currentQ.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finalizeQuiz(newAnswers);
    }
  };

  const finalizeQuiz = async (finalAnswers: Record<string, string>) => {
    setSubmitting(true);
    setQuizFinished(true);

    try {
      const res = await fetch("/api/verify/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          goalId,
          answers: finalAnswers,
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to score quiz");
      }

      setScore({
        correct: data.correct,
        total: data.total,
        passed: data.passed,
      });

      if (data.passed) {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#10B981", "#06B6D4", "#F59E0B"],
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-4">
        <span className="material-symbols-outlined animate-spin text-4xl text-[#06B6D4]">
          progress_activity
        </span>
        <p className="text-xs font-mono text-[#94A3B8]">
          AI ENGINE (OpenRouter Free): Generating knowledge check questions...
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <TiltCard glow="cyan" className="max-w-2xl mx-auto p-6 sm:p-10 bg-[#12181E] border border-[#1E293B]">
      {!quizFinished ? (
        <div className="space-y-8">
          {/* Header & Step Meter */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono mb-2">
              <span className="text-[#06B6D4] font-bold">
                QUESTION 0{currentIndex + 1} OF 0{questions.length}
              </span>
              <span className="text-[#94A3B8]">PASS THRESHOLD: 66%</span>
            </div>
            <div className="h-1.5 w-full bg-[#090D10] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#06B6D4] transition-all duration-300 shadow-[0_0_10px_#06B6D4]"
                style={{
                  width: `${((currentIndex + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="p-6 rounded-2xl bg-[#090D10] border border-[#1E293B]">
            <h3 className="font-sans text-lg sm:text-xl font-bold text-[#F8FAFC] leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full p-4 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-[#06B6D4]/15 border-[#06B6D4] text-[#F8FAFC] shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                      : "bg-[#090D10] border-[#1E293B] text-[#94A3B8] hover:border-[#334155] hover:text-[#F8FAFC]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                        isSelected
                          ? "bg-[#06B6D4] text-[#090D10]"
                          : "bg-[#12181E] text-[#64748B]"
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[#06B6D4] text-lg">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-[#F43F5E] text-xs font-mono">
              {errorMsg}
            </div>
          )}

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!selectedOption}
            className="btn-primary w-full !py-4 text-sm font-mono tracking-wider disabled:opacity-40"
          >
            {currentIndex + 1 === questions.length ? "SUBMIT QUIZ FOR EVALUATION" : "NEXT QUESTION"}
          </button>
        </div>
      ) : (
        /* Result Score Screen */
        <div className="text-center py-6 space-y-6">
          {submitting ? (
            <div className="flex flex-col items-center gap-4">
              <span className="material-symbols-outlined animate-spin text-4xl text-[#06B6D4]">
                progress_activity
              </span>
              <p className="text-xs font-mono text-[#94A3B8]">
                AI SCORING ENGINE: Validating answers...
              </p>
            </div>
          ) : score?.passed ? (
            <div className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto border border-[#10B981]/40 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <span className="material-symbols-outlined text-4xl font-bold">
                  verified
                </span>
              </div>

              <div>
                <h3 className="font-sans text-3xl font-black text-[#F8FAFC]">
                  Verification Passed!
                </h3>
                <p className="text-sm font-mono text-[#10B981] mt-1 font-bold">
                  Score: {score.correct} / {score.total} Correct (100% Refund Unlocked)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#94A3B8]">
                Your escrow stake for this milestone has been credited back to your account balance.
              </div>

              <button
                type="button"
                onClick={onSuccess}
                className="btn-primary w-full !py-3.5"
              >
                Return to Dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#F43F5E]/20 text-[#F43F5E] flex items-center justify-center mx-auto border border-[#F43F5E]/40">
                <span className="material-symbols-outlined text-4xl font-bold">
                  cancel
                </span>
              </div>

              <div>
                <h3 className="font-sans text-2xl font-bold text-[#F8FAFC]">
                  Verification Incomplete
                </h3>
                <p className="text-sm font-mono text-[#F43F5E] mt-1 font-bold">
                  Score: {score?.correct || 0} / {score?.total || 0} (Minimum 66% required)
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setQuizFinished(false);
                    setCurrentIndex(0);
                    setAnswers({});
                  }}
                  className="btn-glass flex-1 !py-3 text-xs font-mono"
                >
                  Retry Quiz
                </button>
                <button
                  type="button"
                  onClick={onSuccess}
                  className="btn-destructive flex-1 !py-3 text-xs font-mono"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </TiltCard>
  );
}
