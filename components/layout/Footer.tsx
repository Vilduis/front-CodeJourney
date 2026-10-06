import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    title: "Explorar",
    links: [
      { href: "/", label: "Inicio" },
      { href: "/posts", label: "Posts" },
      { href: "/about", label: "Acerca de" },
    ],
  },
  {
    title: "Tu diario",
    links: [
      { href: "/posts/createpost", label: "Escribir un post" },
      { href: "/register", label: "Crear cuenta" },
      { href: "/login", label: "Iniciar sesión" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-white/6 bg-surface-elevated px-4 sm:px-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo.png" alt="" width={36} height={36} />
              <span className="text-lg font-bold bg-linear-to-r from-codePrimary to-codeAccent bg-clip-text text-transparent">
                CodeJourney
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Un diario de aprendizaje compartido para desarrolladores. Escribe lo que aprendes, mientras lo aprendes.
            </p>
          </div>

          {columns.map(({ title, links }) => (
            <nav key={title} aria-label={title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/60">{title}</h2>
              <ul className="mt-4 space-y-1">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="inline-block py-1.5 text-sm text-white/75 transition-colors hover:text-codeAccent">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-white/6 py-6 text-sm text-white/60">
          <p>© {new Date().getFullYear()} CodeJourney</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
