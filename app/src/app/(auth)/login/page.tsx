"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email inbox for a secure magic login link.",
        });
      }
    } catch {
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-[#10B981]/15 text-[#10B981] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#10B981]/30">
          <span className="material-symbols-outlined text-2xl font-bold">
            lock_open
          </span>
        </div>
        <h1 className="font-sans text-2xl font-extrabold text-[#F8FAFC]">
          Welcome Back
        </h1>
        <p className="text-xs font-mono text-[#94A3B8] mt-1">
          Access your active commitment vaults
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-4 py-3 text-sm font-mono text-[#F8FAFC] placeholder:text-[#475569] focus:border-[#10B981] outline-none transition-colors"
          />
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs font-mono ${
              message.type === "success"
                ? "bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]"
                : "bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-[#F43F5E]"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full !py-3.5 text-xs font-mono tracking-wider disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-base">
                progress_activity
              </span>
              TRANSMITTING MAGIC LINK...
            </>
          ) : (
            <>
              SEND SECURE MAGIC LINK
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#94A3B8] mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#10B981] font-bold hover:underline"
        >
          Create Account
        </Link>
      </p>
    </>
  );
}
