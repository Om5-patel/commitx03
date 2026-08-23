import Link from "next/link";

const footerLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/how-it-works", label: "Protocol Whitepaper" },
  { href: "/support", label: "Support" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container border-t border-outline-variant/30 w-full py-12 px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-auto">
      {/* Copyright / Brand */}
      <div className="flex items-center gap-4">
        <span className="font-headline text-lg font-semibold text-on-surface">
          CommitX
        </span>
        <span className="text-outline-variant">|</span>
        <span className="font-body text-sm leading-relaxed text-on-surface-variant">
          © {new Date().getFullYear()} CommitX. Rooted in Accountability.
        </span>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-6 font-body text-sm leading-relaxed">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-on-surface-variant hover:text-on-surface transition-all duration-300 hover:underline decoration-primary/30 underline-offset-4"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
