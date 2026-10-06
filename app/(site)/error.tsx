"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto max-w-md px-4 pt-36 pb-24 text-center">
      <h1 className="text-2xl font-bold text-white">No pudimos cargar esta página</h1>
      <p className="mt-2 text-white/70">Puede que el servidor no esté respondiendo. Inténtalo de nuevo en unos segundos.</p>
      <div className="mt-6 flex flex-col-reverse justify-center gap-2 sm:flex-row">
        <Button asChild variant="ghost" className="h-11 rounded-lg text-white/70 hover:bg-white/10 hover:text-white">
          <Link href="/">Ir al inicio</Link>
        </Button>
        <Button onClick={retry} className="h-11 rounded-lg bg-codePrimary px-5 font-semibold hover:bg-codePrimary/80">
          Reintentar
        </Button>
      </div>
    </div>
  );
}
