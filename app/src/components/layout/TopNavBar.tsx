"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/goals", label: "Commitments", icon: "lock" },
  { href: "/disputes", label: "Disputes", icon: "gavel" },
  { href: "/profile", label: "Passport", icon: "badge" },
];

export default function TopNavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090D10]/80 backdrop-blur-2xl border-b border-[#1E293B] shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand with Emerald Pulse */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2.5 font-sans text-2xl font-black tracking-tight text-[#F8FAFC]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center text-[#090D10] font-black shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined font-bold text-xl">
                lock_clock
              </span>
            </div>
            <span>
              Commit<span className="text-[#10B981]">X</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 font-sans text-sm tracking-wide">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#12181E] text-[#10B981] border border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/goals/new"
            className="hidden sm:inline-flex btn-primary text-xs uppercase tracking-wider !py-2.5 !px-4"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            New Goal
          </Link>

          {/* Notifications Icon with Badge */}
          <Link
            href="/notifications"
            className="relative p-2.5 rounded-xl bg-[#12181E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
          </Link>

          {/* Profile Badge */}
          <Link
            href="/profile"
            className="p-2.5 rounded-xl bg-[#12181E] border border-[#1E293B] text-[#94A3B8] hover:text-[#10B981] hover:border-[#10B981]/40 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">account_circle</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
