"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";

interface GuestOnlyProps {
  children: React.ReactNode;
  redirectTo: string;
}

const GuestOnly = ({ children, redirectTo }: GuestOnlyProps) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated) router.replace(redirectTo);
  }, [isInitialized, isAuthenticated, redirectTo, router]);

  if (!isInitialized || isAuthenticated) return <Spinner className="min-h-[50vh]" />;

  return <>{children}</>;
};

export default GuestOnly;
