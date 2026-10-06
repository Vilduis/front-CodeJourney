import Link from "next/link";
import { Button } from "@/components/ui/button";

const Travel = () => {
  return (
    <section className="relative overflow-hidden bg-surface-elevated border-t border-white/6 px-4 sm:px-6 py-24">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 120%, rgba(124,58,237,0.28) 0%, transparent 60%)" }}
      />
      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-3xl font-bold sm:text-5xl text-white">Comienza tu viaje en CodeJourney hoy mismo</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Crea tu cuenta gratis y publica tu primer aprendizaje. Lo que hoy te costó entender puede ahorrarle una tarde a
            otra persona.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            className="h-11 w-full sm:w-auto bg-codeAccent text-slate-900 hover:bg-codeAccent/90 rounded-lg px-6 font-semibold shadow-lg shadow-codeAccent/20"
          >
            <Link href="/register">Crear cuenta gratis</Link>
          </Button>
          <Button
            asChild
            className="h-11 w-full sm:w-auto bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 rounded-lg px-6"
          >
            <Link href="/posts">Leer los posts primero</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Travel;
