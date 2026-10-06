import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 pt-36 pb-24 text-center">
      <h1 className="text-2xl font-bold text-white">Este post no existe</h1>
      <p className="mt-2 text-white/70">Puede que lo hayan eliminado o que el enlace esté mal escrito.</p>
      <Link
        href="/posts"
        className="mt-6 inline-flex h-11 items-center rounded-lg bg-codePrimary px-5 font-semibold text-white hover:bg-codePrimary/80"
      >
        Ver todos los posts
      </Link>
    </div>
  );
}
