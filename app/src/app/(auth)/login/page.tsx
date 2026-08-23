"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LockOpen, ArrowRight, Loader2, Eye, EyeOff, KeyRound, Mail } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<"password" | "magic_link">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setMessage({
            type: "error",
            text: "Email not yet verified. Please check your inbox for the one-time activation link sent during signup.",
          });
        } else {
          setMessage({ type: "error", text: error.message });
        }
      } else if (data.session) {
        // Ensure user profile exists in public.users table
        if (data.user) {
          const isAdmin =
            data.user.email?.toLowerCase() ===
            (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "parthgholap18@gmail.com").toLowerCase();

          await supabase.from("users").upsert({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || "User",
            phone: data.user.user_metadata?.phone || null,
            is_admin: isAdmin,
          });
        }

        router.push("/dashboard");
      }
    } catch {
      setMessage({
        type: "error",
        text: "An error occurred during authentication. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "One-time magic link dispatched to your email.",
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
          <LockOpen className="w-5 h-5 stroke-[2.5]" />
        </div>
        <h1 className="font-sans text-xl font-bold text-white">
          Welcome Back
        </h1>
        <p className="type-body text-xs mt-1">
          Access your active commitment vaults
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex bg-[#090D10] p-1 rounded-xl border border-[#1E293B] mb-5">
        <button
          type="button"
          onClick={() => {
            setMode("password");
            setMessage(null);
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === "password"
              ? "bg-[#12181E] text-white border border-[#1E293B]"
              : "text-white/40 hover:text-white"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Password</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("magic_link");
            setMessage(null);
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            mode === "magic_link"
              ? "bg-[#12181E] text-white border border-[#1E293B]"
              : "text-white/40 hover:text-white"
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Magic Link</span>
        </button>
      </div>

      {mode === "password" ? (
        <form onSubmit={handlePasswordLogin} className="space-y-3.5">
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
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="type-label"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setMode("magic_link")}
                className="type-body text-[10px] text-[#10B981] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
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
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-mono ${
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
            className="verify-btn w-full !py-3 text-xs font-mono tracking-wider disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>SIGN IN WITH PASSWORD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLinkLogin} className="space-y-3.5">
          <div>
            <label
              htmlFor="magic-email"
              className="type-label block mb-1.5"
            >
              Email Address
            </label>
            <input
              id="magic-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#090D10] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#10B981] outline-none transition-colors"
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs font-mono ${
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
            className="verify-btn w-full !py-3 text-xs font-mono tracking-wider disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>SENDING MAGIC LINK...</span>
              </>
            ) : (
              <>
                <span>SEND MAGIC LOGIN LINK</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      <p className="text-center type-body text-xs mt-5">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-[#10B981] font-semibold hover:underline"
        >
          Create Account & Set Password
        </Link>
      </p>
    </>
  );
}
