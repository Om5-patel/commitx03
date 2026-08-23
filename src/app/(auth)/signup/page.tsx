"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
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
      } else if (data.session) {
        // Auto-confirmed: ensure user record exists and redirect immediately
        if (data.user) {
          const isAdmin =
            data.user.email?.toLowerCase() ===
            (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "parthgholap18@gmail.com").toLowerCase();

          await supabase.from("users").upsert({
            id: data.user.id,
            email: data.user.email,
            phone: phone || null,
            full_name: fullName || "User",
            is_admin: isAdmin,
          });
        }
        router.push("/dashboard");
      } else {
        // One-time verification required
        setMessage({
          type: "success",
          text: "Account created! We've sent a one-time verification link to your email. Click it once to activate your account — for all future logins, simply use your password.",
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
      <div className="text-center mb-6">
        <div className="w-10 h-10 bg-[#10B981]/15 text-[#10B981] rounded-xl flex items-center justify-center mx-auto mb-3 border border-[#10B981]/30">
          <UserPlus className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h1 className="font-sans text-xl font-bold text-white">
          Create CommitX Account
        </h1>
        <p className="type-body text-xs mt-1">
          Set up your credentials for instant password login
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-3.5">
        <div>
          <label
            htmlFor="fullName"
            className="type-label block mb-1.5"
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
            className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#10B981] outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="type-label block mb-1.5"
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
            className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#10B981] outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="type-label block mb-1.5"
          >
            Phone <span className="text-white/30 lowercase">(optional)</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#10B981] outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="type-label block mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#10B981] outline-none transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <span className="type-body text-[10px] block mt-1">
            Minimum 6 characters. Used for all future logins.
          </span>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl text-xs font-mono flex items-start gap-2 ${
              message.type === "success"
                ? "bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981]"
                : "bg-[#F43F5E]/15 border border-[#F43F5E]/30 text-[#F43F5E]"
            }`}
          >
            {message.type === "success" && (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{message.text}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="verify-btn w-full !py-3 text-xs font-mono tracking-wider disabled:opacity-50 mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>CREATING ACCOUNT...</span>
            </>
          ) : (
            <>
              <span>CREATE ACCOUNT</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center type-body text-xs mt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#10B981] font-semibold hover:underline"
        >
          Sign In with Password
        </Link>
      </p>
    </>
  );
}
