import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-surface-base">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.16) 0%, transparent 60%)" }}
      />

      <header className="relative flex items-center justify-between px-4 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="" width={36} height={36} />
          <span className="text-lg font-bold bg-linear-to-r from-codePrimary to-codeAccent bg-clip-text text-transparent">
            CodeJourney
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm text-white/70 hover:bg-white/8 hover:text-white"
        >
          <ArrowLeft size={16} aria-hidden />
          <span>
            Volver<span className="hidden sm:inline"> al inicio</span>
          </span>
        </Link>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">{children}</main>
    </div>
  );
}
