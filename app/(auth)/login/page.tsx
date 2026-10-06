import type { Metadata } from "next";
import GuestOnly from "@/components/auth/GuestOnly";
import { safeRedirect } from "@/lib/utils";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

interface PageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const redirectTo = safeRedirect((await searchParams).next);

  return (
    <div className="w-full flex justify-center py-6">
      <div className="w-full max-w-md md:max-w-5xl">
        <GuestOnly redirectTo={redirectTo}>
          <LoginForm redirectTo={redirectTo} />
        </GuestOnly>
      </div>
    </div>
  );
}
