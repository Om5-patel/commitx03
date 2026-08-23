"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
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
          text: "Check your email for a magic link to log in.",
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
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined filled text-on-primary-container text-2xl">
            login
          </span>
        </div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
          Welcome back
        </h1>
        <p className="text-on-surface-variant text-sm">
          Sign in to continue your journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="block font-label text-sm font-semibold text-on-surface-variant mb-2"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface font-body placeholder:text-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-xl text-sm font-body ${
              message.type === "success"
                ? "bg-primary-fixed text-on-primary-fixed"
                : "bg-error-container text-on-error-container"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-headline font-semibold text-lg py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
              Sending link...
            </>
          ) : (
            <>
              Send Magic Link
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-on-surface-variant mt-6">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
