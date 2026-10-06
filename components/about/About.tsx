import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Crea tu cuenta",
    text: "Solo necesitas un email. Leer los posts y los comentarios no requiere cuenta.",
  },
  {
    title: "Escribe lo que estás aprendiendo",
    text: "Un post con imagen de portada y contenido en Markdown, con bloques de código resaltados. Puedes editarlo cuando entiendas algo nuevo.",
  },
  {
    title: "Conversa en los comentarios",
    text: "Otras personas preguntan, sugieren otra solución o cuentan cómo lo resolvieron. Los comentarios también admiten código.",
  },
];

const ideas = [
  {
    title: "Aprender en público",
    text: "Escribir lo que aprendes te obliga a entenderlo, y deja un registro para la próxima persona que se tope con el mismo problema.",
  },
  {
    title: "El error también se publica",
    text: "El bug que te tomó una tarde vale tanto como la solución final. Aquí no hace falta esperar a que esté perfecto.",
  },
  {
    title: "Leer es libre",
    text: "Todo el contenido es público. La cuenta solo sirve para escribir y comentar.",
  },
];

const About = () => {
  return (
    <div className="bg-surface-base">
      <section className="relative overflow-hidden px-4 sm:px-6 pt-32 pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 30% 0%, rgba(124,58,237,0.18) 0%, transparent 60%)" }}
        />
        <div className="relative mx-auto max-w-5xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-white">
              Acerca de <span className="text-codeAccent">CodeJourney</span>
            </h1>
            <p className="mt-6 text-xl leading-relaxed text-white/75">
              Un diario de aprendizaje compartido: un lugar para escribir lo que estás aprendiendo mientras lo aprendes, y
              leer cómo lo resolvieron otras personas.
            </p>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              En los tutoriales, aprender a programar parece una línea recta. En la práctica está lleno de errores, vueltas
              atrás y momentos en que por fin algo hace clic. CodeJourney existe para contar esa parte del camino.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-title" className="border-y border-white/6 bg-surface-elevated px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 id="how-title" className="text-3xl font-bold text-white">
            Cómo funciona
          </h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map(({ title, text }, index) => (
              <li key={title} className="border-t border-white/10 pt-6">
                <span aria-hidden className="text-sm font-semibold text-codeAccent">
                  Paso {index + 1}
                </span>
                <h3 className="mt-2 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 leading-relaxed text-white/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="ideas-title" className="px-4 sm:px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 id="ideas-title" className="text-3xl font-bold text-white">
            Las ideas detrás
          </h2>
          <dl className="mt-8 max-w-4xl divide-y divide-white/8 border-y border-white/8">
            {ideas.map(({ title, text }) => (
              <div key={title} className="grid gap-2 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
                <dt className="font-semibold text-white">{title}</dt>
                <dd className="leading-relaxed text-white/70">{text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-white/6 bg-surface-elevated px-4 sm:px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">¿Qué aprendiste hoy?</h2>
            <p className="mt-2 text-white/70">Puede ser tu primer post.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-lg bg-codeAccent px-6 font-semibold text-slate-900 hover:bg-codeAccent/90">
              <Link href="/register">
                Empieza tu diario <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              asChild
              className="h-11 rounded-lg border border-white/20 bg-transparent px-6 text-white hover:border-white/40 hover:bg-white/5"
            >
              <Link href="/posts">Leer los posts</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
