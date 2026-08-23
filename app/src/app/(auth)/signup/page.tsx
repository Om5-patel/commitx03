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
      // Sign up with Supabase Auth (OTP via email)
      const { data, error } = await supabase.auth.signInWithOtp({
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
          text: "Check your email for a confirmation link to complete your registration.",
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
        <div className="w-14 h-14 bg-tertiary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined filled text-on-tertiary-container text-2xl">
            person_add
          </span>
        </div>
        <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
          Create your account
        </h1>
        <p className="text-on-surface-variant text-sm">
          Start your accountability journey today
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="block font-label text-sm font-semibold text-on-surface-variant mb-2"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-xl px-4 py-3 text-on-surface font-body placeholder:text-outline-variant focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
          />
        </div>

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

        <div>
          <label
            htmlFor="phone"
            className="block font-label text-sm font-semibold text-on-surface-variant mb-2"
          >
            Phone{" "}
            <span className="text-outline-variant font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
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
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <span className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* Terms */}
      <p className="text-center text-xs text-on-surface-variant mt-4 leading-relaxed">
        By signing up, you agree to our{" "}
        <Link
          href="/terms"
          className="text-primary hover:underline underline-offset-2"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="text-primary hover:underline underline-offset-2"
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Footer */}
      <p className="text-center text-sm text-on-surface-variant mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline underline-offset-4"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
