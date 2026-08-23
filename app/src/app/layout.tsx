import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackgroundMesh from "@/components/ui/BackgroundMesh";
import { ToastProvider } from "@/components/ui/CinematicToast";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "CommitX — High-Stakes Accountability Protocol",
    template: "%s | CommitX",
  },
  description:
    "Commit to your goals with real stakes. AI-verified proof, dynamic escrow vaults, and automated refunds upon verified completion.",
  keywords: [
    "commitment",
    "accountability",
    "financial stakes",
    "goals vault",
    "habit protocol",
    "AI verification",
  ],
  openGraph: {
    title: "CommitX — High-Stakes Accountability Protocol",
    description:
      "Lock in your intention with financial stakes. Verified milestones trigger instant refunds.",
    siteName: "CommitX",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} dark h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#090D10] text-[#F8FAFC] font-sans antialiased relative">
        <ToastProvider>
          <BackgroundMesh />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
