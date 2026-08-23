"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            phone: phone || undefined,
          },
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for a secure link to activate your CommitX account.",
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
            person_add
          </span>
        </div>
        <h1 className="font-sans text-2xl font-extrabold text-[#F8FAFC]">
          Join CommitX Protocol
        </h1>
        <p className="text-xs font-mono text-[#94A3B8] mt-1">
          Lock in your intention with high-stakes accountability
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] mb-2"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ada Lovelace"
            className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-4 py-3 text-sm font-mono text-[#F8FAFC] placeholder:text-[#475569] focus:border-[#10B981] outline-none transition-colors"
          />
        </div>

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

        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-mono font-bold uppercase tracking-wider text-[#94A3B8] mb-2"
          >
            Phone <span className="text-[#64748B] lowercase">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
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
              INITIALIZING ACCOUNT...
            </>
          ) : (
            <>
              CREATE ACCOUNT
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-xs text-[#94A3B8] mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#10B981] font-bold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}
