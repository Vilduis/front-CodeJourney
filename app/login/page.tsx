"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoginForm } from "@/components/auth/Login";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace("/");
    }
  }, [status, user, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-t-codePrimary border-b-transparent border-l-transparent border-r-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function LoginPage() {
  return (
    <div className="bg-surface-base flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <PublicRoute>
          <LoginForm />
        </PublicRoute>
      </div>
    </div>
  );
}
