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
    <div className="fixed bottom-3 inset-x-3 z-50 md:hidden flex justify-center pointer-events-none">
      <nav className="pointer-events-auto w-full max-w-sm bg-[#12181E]/95 dark:bg-[#12181E]/95 light:bg-white/95 backdrop-blur-md border border-[#1E293B] light:border-[#E2E8F0] shadow-2xl rounded-2xl p-1 flex items-center justify-around">
        {mobileLinks.map(({ href, label, Icon, highlight }) => {
          const isActive = pathname === href;

          if (highlight) {
            return (
              <Link
                key={href}
                href={href}
                className="w-11 h-11 -mt-4 rounded-xl bg-[#10B981] text-[#090D10] flex items-center justify-center shadow-[0_4px_16px_rgba(16,185,129,0.4)] active:scale-90 transition-transform"
                aria-label="Commit New Goal"
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive
                  ? "text-[#10B981] font-bold"
                  : "text-white/40 dark:text-white/40 light:text-[#64748B] hover:text-white dark:hover:text-white light:hover:text-[#0F172A]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] font-mono tracking-wider mt-0.5">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
