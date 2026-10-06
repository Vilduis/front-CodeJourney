import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "CodeJourney · Aprende en público",
    template: "%s · CodeJourney",
  },
  description:
    "Un diario de aprendizaje compartido para desarrolladores: publica lo que aprendes con Markdown y código, y comenta los posts de otros.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen w-full flex flex-col bg-surface-base`}>
        <AuthProvider>
          {children}
          <Toaster theme="dark" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
