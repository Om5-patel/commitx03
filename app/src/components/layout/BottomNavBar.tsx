"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const mobileNavLinks = [
  { href: "/dashboard", label: "Feed", icon: "grid_view", activeIcon: "grid_view" },
  { href: "/goals", label: "Goals", icon: "target", activeIcon: "target" },
  { href: "/goals/new", label: "New", icon: "add_circle", activeIcon: "add_circle" },
  { href: "/profile", label: "Profile", icon: "person", activeIcon: "person" },
];

export default function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-highest rounded-t-xl shadow-[0_-4px_20px_rgba(46,50,48,0.06)] font-label text-xs">
      {mobileNavLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/goals/new" && pathname.startsWith(link.href + "/"));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center transition-transform active:scale-90 ${
              isActive
                ? "bg-primary-container text-on-primary-container rounded-xl px-4 py-1"
                : "text-on-surface-variant hover:text-primary p-2 rounded-xl"
            }`}
          >
            <span
              className={`material-symbols-outlined mb-1 text-xl ${
                isActive ? "filled" : ""
              }`}
            >
              {isActive ? link.activeIcon : link.icon}
            </span>
            <span className={isActive ? "font-bold" : ""}>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
