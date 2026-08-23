"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileLinks = [
  { href: "/dashboard", label: "Home", icon: "dashboard" },
  { href: "/goals", label: "Vault", icon: "lock" },
  { href: "/goals/new", label: "Commit", icon: "add_circle", highlight: true },
  { href: "/disputes", label: "Disputes", icon: "gavel" },
  { href: "/profile", label: "Passport", icon: "badge" },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 md:hidden flex justify-center">
      <nav className="w-full max-w-md bg-[#12181E]/90 backdrop-blur-2xl border border-[#1E293B] shadow-[0_12px_40px_rgba(0,0,0,0.8)] rounded-2xl p-1.5 flex items-center justify-around">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;

          if (link.highlight) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="w-12 h-12 -mt-5 rounded-2xl bg-[#10B981] text-[#090D10] flex flex-col items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-2xl font-bold">
                  {link.icon}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-[#10B981]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-xl ${
                  isActive ? "filled" : ""
                }`}
              >
                {link.icon}
              </span>
              <span className="text-[10px] font-mono tracking-wider mt-0.5 font-semibold">
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
