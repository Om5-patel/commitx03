"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

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
  taskDescription,
  onSuccess,
}: FileSubmissionProps) {
  const [tab, setTab] = useState<"file" | "url">("url");
  const [urlInput, setUrlInput] = useState<string>("");
  const [notesInput, setNotesInput] = useState<string>("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<{
    score: number;
    explanation: string;
    status: "auto_approved" | "manual_review" | "auto_rejected";
  } | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const content =
        tab === "url"
          ? `Artifact URL: ${urlInput}\nNotes: ${notesInput}`
          : `Uploaded File: ${selectedFileName}\nNotes: ${notesInput}`;

      const res = await fetch("/api/verify/file-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          goalId,
          taskTitle,
          taskDescription,
          submittedContent: content,
        }),
      });

      const data = await res.json();
      if (res.ok && data.evaluation) {
        setResult(data.evaluation);

        if (data.evaluation.status === "auto_approved") {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#4a7c59", "#78a886", "#c4a66a"],
          });
          setTimeout(() => {
            onSuccess();
          }, 2500);
        }
      }
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    const isApproved = result.status === "auto_approved";
    const isReview = result.status === "manual_review";

    return (
      <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] border border-outline-variant/30 shadow-organic max-w-xl mx-auto text-center flex flex-col items-center gap-6">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner ${
            isApproved
              ? "bg-primary-container text-on-primary-container"
              : isReview
              ? "bg-tertiary-container text-on-tertiary-container"
              : "bg-error-container text-on-error-container"
          }`}
        >
          <span className="material-symbols-outlined text-4xl filled">
            {isApproved
              ? "verified"
              : isReview
              ? "hourglass_top"
              : "error"}
          </span>
        </div>

        <div>
          <h2 className="font-headline text-3xl font-bold text-on-surface">
            {isApproved
              ? "Artifact Verified!"
              : isReview
              ? "Sent to Manual Review"
              : "Relevance Below Standard"}
          </h2>
          <p className="text-on-surface-variant text-sm mt-2">
            AI Relevance Score:{" "}
            <strong className="text-on-surface text-base">
              {(result.score * 100).toFixed(0)}%
            </strong>
          </p>
        </div>

        <div className="bg-surface-container p-5 rounded-2xl text-xs text-left w-full border border-outline-variant/30 leading-relaxed">
          <p className="font-semibold text-on-surface mb-1">AI Evaluator Feedback:</p>
          <p className="text-on-surface-variant">{result.explanation}</p>
        </div>

        {isReview && (
          <p className="text-xs text-on-surface-variant">
            Our team will review your deliverable within 24–48 hours. Your stake remains safely in escrow.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest p-8 md:p-12 rounded-[2rem] border border-outline-variant/30 shadow-organic max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-fixed/40 px-3.5 py-1 rounded-full">
          Business / Creative Verification
        </span>
        <h2 className="font-headline text-3xl font-bold text-on-surface mt-3">
          {taskTitle}
        </h2>
        <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">
          Submit your work artifact or live link for AI evaluation against your committed criteria.
        </p>
      </div>

      {/* Tabs: URL vs File */}
      <div className="flex bg-surface-container p-1 rounded-xl border border-outline-variant/20">
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex-1 py-2.5 rounded-lg font-headline font-semibold text-xs transition-all cursor-pointer ${
            tab === "url"
              ? "bg-surface text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Deliverable URL / Commit
        </button>
        <button
          type="button"
          onClick={() => setTab("file")}
          className={`flex-1 py-2.5 rounded-lg font-headline font-semibold text-xs transition-all cursor-pointer ${
            tab === "file"
              ? "bg-surface text-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Upload Document / Asset
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === "url" ? (
          <div>
            <label
              htmlFor="url-input"
              className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Public Artifact Link (GitHub, Figma, Google Docs, etc.)
            </label>
            <input
              id="url-input"
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://github.com/org/repo/commit/..."
              className="w-full bg-surface border border-outline-variant/40 rounded-xl p-4 text-sm text-on-surface font-body outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        ) : (
          <div>
            <label className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
              Attach File (PDF, DOCX, ZIP, PNG)
            </label>
            <div className="border-2 border-dashed border-outline-variant/40 rounded-2xl p-8 text-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileSelect}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="material-symbols-outlined text-4xl text-primary mb-2">
                cloud_upload
              </span>
              <p className="text-sm font-semibold text-on-surface">
                {selectedFileName || "Click to browse or drag & drop files here"}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Max 25 MB • Encrypted in Supabase Vault
              </p>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="notes-input"
            className="block font-label text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2"
          >
            Summary & Notes for Evaluator
          </label>
          <textarea
            id="notes-input"
            rows={3}
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Explain what was accomplished and how it satisfies the requirement."
            className="w-full bg-surface border border-outline-variant/40 rounded-xl p-4 text-sm text-on-surface font-body outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={submitting || (tab === "url" ? !urlInput : !selectedFileName)}
          className="w-full bg-primary hover:bg-primary/90 text-on-primary font-headline font-bold text-lg py-4 rounded-xl shadow-organic transition-all active:scale-[0.98] cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-xl">
                progress_activity
              </span>
              Analyzing Artifact with Gemini AI...
            </>
          ) : (
            <>
              Submit for AI Verification
              <span className="material-symbols-outlined text-xl">
                verified
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
