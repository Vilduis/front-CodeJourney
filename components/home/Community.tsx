import Link from "next/link";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  "Comentarios en cada post para preguntar, aportar o debatir",
  "Bloques de código con resaltado, en los posts y en los comentarios",
  "Gratis y abierto: cualquiera puede leer, solo necesitas una cuenta para publicar",
];

const Community = () => {
  return (
    <section className="bg-surface-base px-4 sm:px-6 py-24">
      <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-white">Escribir a medio camino también cuenta</h2>
          <p className="text-lg leading-relaxed max-w-lg text-white/70">
            En otros sitios se publica el resultado pulido. Aquí se valora el proceso: el bug que te tomó una tarde,
            el concepto que por fin entendiste o el proyecto que todavía no terminas.
          </p>
          <Button asChild className="h-11 bg-codePrimary text-white hover:bg-codePrimary/80 rounded-lg px-6 font-semibold">
            <Link href="/register">
              Empieza tu diario <ArrowRight size={18} />
            </Link>
          </Button>
        </div>

        <ul className="divide-y divide-white/8 border-y border-white/8">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-4 py-6 text-lg text-white/85">
              <BadgeCheck size={24} aria-hidden className="mt-0.5 shrink-0 text-codeAccent" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Community;
