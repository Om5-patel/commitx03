"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lock,
  LayoutDashboard,
  FolderKanban,
  Gavel,
  User,
  PlusCircle,
  Bell,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/goals", label: "Commitments", Icon: FolderKanban },
  { href: "/disputes", label: "Disputes", Icon: Gavel },
  { href: "/profile", label: "Passport", Icon: User },
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
              <Lock className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="flex items-center leading-none">
              Commit<span className="text-[#10B981]">X</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 font-sans text-sm tracking-wide">
            {navLinks.map(({ href, label, Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");

              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-2 ${
                    isActive
                      ? "bg-[#12181E] text-[#10B981] border border-[#10B981]/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                      : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-3">
          <Link
            href="/goals/new"
            className="hidden sm:inline-flex btn-primary text-xs uppercase tracking-wider !py-2.5 !px-4 items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Goal</span>
          </Link>

          {/* Notifications Icon with Badge */}
          <Link
            href="/notifications"
            className="relative p-2.5 rounded-xl bg-[#12181E] border border-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#334155] transition-colors inline-flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
          </Link>

          {/* Profile Badge */}
          <Link
            href="/profile"
            className="p-2.5 rounded-xl bg-[#12181E] border border-[#1E293B] text-[#94A3B8] hover:text-[#10B981] hover:border-[#10B981]/40 transition-colors inline-flex items-center justify-center"
            title="Account Passport"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
