import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-sm text-codeAccent">404</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Esta página no existe</h1>
      <p className="mt-2 max-w-md text-white/70">Revisa la dirección o vuelve al inicio para seguir tu camino.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-codePrimary px-5 font-semibold text-white hover:bg-codePrimary/80"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
