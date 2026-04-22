import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { Toaster } from "sonner";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeJourney",
  description: "Your coding journey platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-black min-h-screen w-full flex flex-col`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-1 bg-surface-base">
            {children}
            <Toaster />
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
