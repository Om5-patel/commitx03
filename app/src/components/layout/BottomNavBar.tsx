"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Lock,
  PlusCircle,
  Gavel,
  User,
} from "lucide-react";

const mobileLinks = [
  { href: "/dashboard", label: "Home", Icon: LayoutDashboard },
  { href: "/goals", label: "Vault", Icon: Lock },
  { href: "/goals/new", label: "Commit", Icon: PlusCircle, highlight: true },
  { href: "/disputes", label: "Disputes", Icon: Gavel },
  { href: "/profile", label: "Passport", Icon: User },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 md:hidden flex justify-center">
      <nav className="w-full max-w-md bg-[#12181E]/90 backdrop-blur-2xl border border-[#1E293B] shadow-[0_12px_40px_rgba(0,0,0,0.8)] rounded-2xl p-1.5 flex items-center justify-around">
        {mobileLinks.map(({ href, label, Icon, highlight }) => {
          const isActive = pathname === href;

          if (highlight) {
            return (
              <Link
                key={href}
                href={href}
                className="w-12 h-12 -mt-5 rounded-2xl bg-[#10B981] text-[#090D10] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-transform"
              >
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-[#10B981]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-mono tracking-wider mt-1 font-semibold">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
