import TopNavBar from "@/components/layout/TopNavBar";
import BottomNavBar from "@/components/layout/BottomNavBar";
import Footer from "@/components/layout/Footer";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavBar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 pb-24 md:pb-12">
        {children}
      </main>
      <BottomNavBar />
      <Footer />
    </div>
  );
}
