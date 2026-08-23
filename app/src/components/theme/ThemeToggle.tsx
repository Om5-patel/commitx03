"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-[#12181E] border border-[#1E293B] ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer ${
        isDark
          ? "bg-[#12181E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155]"
          : "bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] shadow-sm"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#F59E0B] transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#6366F1] transition-transform hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-mono font-semibold">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}
