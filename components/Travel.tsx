import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import Link from "next/link";

const Travel = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-cyan-950 px-6 py-24">
      {/* Subtle dot grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="container mx-auto max-w-5xl relative">
        <div className="text-center space-y-6 mb-12">
          <Badge className="bg-white/10 text-white border border-white/20 hover:bg-white/15">
            ¿Listo para empezar?
          </Badge>
          <h2 className="text-3xl font-bold sm:text-5xl text-white">
            Comienza tu viaje en CodeJourney hoy mismo
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Únete a miles de desarrolladores que ya están compartiendo conocimientos, resolviendo problemas y creciendo profesionalmente en nuestra plataforma.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button className="w-full sm:w-auto bg-codeAccent text-slate-900 hover:bg-codeAccent/90 border-none rounded-lg text-center font-semibold shadow-lg shadow-codeAccent/20">
              Crear cuenta gratis
            </Button>
          </Link>
          <Link href="/posts">
            <Button className="w-full sm:w-auto bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/40 rounded-lg text-center">
              Explorar primero
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Travel;
