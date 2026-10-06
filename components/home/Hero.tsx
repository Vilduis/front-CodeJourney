import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditorWindow, { CodeLine, SYNTAX as S } from "@/components/shared/EditorWindow";

const codeLines: CodeLine[] = [
  { tokens: [["interface", S.keyword], [" Aprendizaje ", S.plain], ["{", S.brace]] },
  { indent: true, tokens: [["tema", S.name], [": ", S.plain], ["string", S.type], [";", S.plain]] },
  { indent: true, tokens: [["error", S.name], [": ", S.plain], ["string", S.type], [";", S.plain]] },
  { indent: true, tokens: [["solucion", S.name], [": ", S.plain], ["string", S.type], [";", S.plain]] },
  { tokens: [["}", S.brace]] },
  { tokens: [] },
  { tokens: [["const", S.keyword], [" hoyAprendi", S.fn], [": ", S.plain], ["Aprendizaje", S.type], [" = ", S.plain], ["{", S.brace]] },
  { indent: true, tokens: [["tema", S.name], [": ", S.plain], ['"useEffect y sus dependencias"', S.string], [",", S.plain]] },
  { indent: true, tokens: [["error", S.name], [": ", S.plain], ['"un loop infinito de renders"', S.string], [",", S.plain]] },
  { indent: true, tokens: [["solucion", S.name], [": ", S.plain], ['"mover la petición dentro del efecto"', S.string], [",", S.plain]] },
  { tokens: [["};", S.brace]] },
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-surface-base px-4 sm:px-6 pt-32 pb-24">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #7c3aed 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container mx-auto max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="min-w-0 space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Aprende <span className="text-codeAccent">en público.</span>
            </h1>

            <p className="max-w-xl text-xl text-white/70 leading-relaxed">
              Documenta tu camino como desarrollador: lo que estás aprendiendo, en qué te equivocaste y cómo
              lo resolviste. Otras personas que también están aprendiendo lo leen, comentan y aprenden contigo.
            </p>

            <div className="flex flex-row flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                className="h-11 bg-codeAccent text-slate-900 hover:bg-codeAccent/90 rounded-lg px-6 font-semibold shadow-lg shadow-codeAccent/20"
              >
                <Link href="/register">
                  Empieza tu diario <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/40 rounded-lg px-6 font-semibold"
              >
                <Link href="/posts">Leer los posts</Link>
              </Button>
            </div>
          </div>

          <div className="relative min-w-0">
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-br from-codePrimary/10 to-codeAccent/5 rounded-3xl blur-2xl pointer-events-none"
            />
            <EditorWindow filename="hoy-aprendi.ts" language="TypeScript" lines={codeLines} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
