"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/goals", label: "Commitments" },
  { href: "/profile", label: "Profile" },
];

export default function TopNavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 lg:px-8 h-20 w-full bg-surface border-b border-surface-container-low shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="font-headline text-2xl font-bold text-primary tracking-tight hover:opacity-90 transition-opacity"
        >
          CommitX
        </Link>

        {/* Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 h-full font-body text-sm tracking-wide">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary pb-1"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-4">
        <Link
          href="/goals/new"
          className="hidden md:block bg-primary text-on-primary hover:bg-primary/90 font-label font-bold text-sm px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-sm active:scale-95"
        >
          Start Goal
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="text-on-surface-variant hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">notifications</span>
          </Link>
          <Link
            href="/profile"
            className="text-on-surface-variant hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
