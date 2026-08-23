import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-container-low">
      {/* Minimal Header */}
      <header className="w-full flex items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="font-headline text-2xl font-bold text-primary tracking-tight"
        >
          CommitX
        </Link>
      </header>

      {/* Centered Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Organic gradient bg */}
          <div className="relative bg-surface rounded-3xl shadow-organic-lg border border-outline-variant/20 p-8 sm:p-10 overflow-hidden">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-tertiary-container/15 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
