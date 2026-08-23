"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lock,
  LayoutDashboard,
  FolderKanban,
  Gavel,
  User,
  Plus,
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
    <header className="sticky top-0 z-50 w-full bg-[#090D10]/90 backdrop-blur-md border-b border-[#1E293B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-sans text-lg font-bold tracking-tight text-white"
          >
            <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-[#090D10] font-bold">
              <Lock className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="flex items-center leading-none">
              Commit<span className="text-[#10B981]">X</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, Icon }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");

              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-2 ${
                    isActive
                      ? "bg-[#12181E] text-[#10B981] border border-[#1E293B]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Trigger */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/goals/new"
            className="hidden sm:inline-flex btn-glass text-xs font-mono !py-1.5 !px-3 items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#10B981]" />
            <span>New Goal</span>
          </Link>

          {/* Notifications Icon with Badge */}
          <Link
            href="/notifications"
            className="relative p-2 rounded-lg bg-[#12181E] border border-[#1E293B] text-white/50 hover:text-white transition-colors inline-flex items-center justify-center"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          </Link>

          {/* Profile Badge */}
          <Link
            href="/profile"
            className="p-2 rounded-lg bg-[#12181E] border border-[#1E293B] text-white/50 hover:text-[#10B981] transition-colors inline-flex items-center justify-center"
            title="Account Passport"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
