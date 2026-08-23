import type { Metadata } from "next";
import { Literata, Nunito_Sans } from "next/font/google";
import "./globals.css";

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CommitX — Rooted Accountability",
    template: "%s | CommitX",
  },
  description:
    "Commit to your growth with real stakes. Set a goal, lock in your intention, stake a meaningful pledge, and let the organic pressure of the protocol guide you to success.",
  keywords: [
    "commitment",
    "accountability",
    "goals",
    "stakes",
    "habit tracking",
    "personal growth",
  ],
  openGraph: {
    title: "CommitX — Rooted Accountability",
    description:
      "Commit to your growth with real stakes. A calm, grounded approach to achieving your goals.",
    siteName: "CommitX",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${literata.variable} ${nunitoSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background font-body antialiased selection:bg-primary-container selection:text-on-primary-container">
        {children}
      </body>
    </html>
  );
}
