import Link from "next/link";
import { PenLine, MessageSquare, UserRound, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const characteristics = [
  {
    icon: PenLine,
    title: "Publica lo que aprendes",
    description:
      "Escribe en Markdown, con bloques de código y una imagen de portada. No tiene que estar perfecto: cuenta el proceso, no solo el resultado.",
    cta: "Escribir un post",
    href: "/posts/createpost",
  },
  {
    icon: MessageSquare,
    title: "Comenta y debate",
    description:
      "Responde dudas con código, sugiere otra forma de resolverlo o cuenta cómo lo hiciste tú. Tus comentarios también admiten Markdown.",
    cta: "Leer los posts",
    href: "/posts",
  },
  {
    icon: UserRound,
    title: "Tu cuenta, tu espacio",
    description:
      "Regístrate gratis con tu email. Todos tus posts quedan reunidos en un solo lugar para editarlos cuando aprendas algo nuevo.",
    cta: "Crear cuenta",
    href: "/register",
  },
];

const Characteristics = () => {
  return (
    <section className="bg-surface-elevated px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <h2 className="text-4xl font-bold text-white">Lo que puedes hacer en CodeJourney</h2>
          <p className="text-white/70 leading-relaxed">Escribir, comentar y volver a lo que aprendiste.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characteristics.map(({ icon: Icon, title, description, cta, href }) => (
            <div
              key={title}
              className="flex flex-col bg-surface-card border border-white/8 p-8 rounded-lg shadow-lg hover:shadow-xl hover:border-codePrimary/30 motion-safe:hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-codeAccent/10 border border-codeAccent/30 text-codeAccent">
                <Icon size={24} aria-hidden />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="flex-1 text-white/70 leading-relaxed">{description}</p>
              <Button
                asChild
                className="mt-6 h-11 self-start bg-codePrimary text-white hover:bg-codePrimary/80 rounded-lg font-semibold"
              >
                <Link href={href}>
                  {cta} <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Characteristics;
