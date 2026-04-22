import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight, Terminal, GitBranch } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-surface-base px-4 py-24">
      <style>{`
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(6, 182, 212, 0); }
        }
        .badge-glow { animation: badge-pulse 2.5s ease-in-out infinite; }
      `}</style>

      {/* Radial gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 65%)`,
        }}
      />
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #7c3aed 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="container mx-auto max-w-7xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left column */}
          <div className="space-y-6">
            <Badge className="badge-glow bg-codeAccent/10 text-codeAccent border border-codeAccent/40 hover:bg-codeAccent/20 text-sm font-medium px-4 py-1 rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-codeAccent mr-2 animate-pulse" />
              La plataforma para desarrolladores
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Conecta.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-codeAccent">
                Comparte.
              </span>{" "}
              Crece.
            </h1>

            <p className="text-xl text-white/60 leading-relaxed">
              Una comunidad donde los desarrolladores pueden compartir
              conocimientos, resolver dudas y conectar con otros profesionales.
            </p>

            <div className="flex flex-row flex-wrap items-center gap-4 mt-8">
              <Link href="/register">
                <Button className="bg-codeAccent text-slate-900 hover:bg-codeAccent/90 border-none rounded-lg px-6 font-semibold shadow-lg shadow-codeAccent/20">
                  Únete ahora <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/posts">
                <Button className="bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/40 rounded-lg px-6 font-semibold">
                  Explorar posts
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-8 border-t border-white/[0.08]">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">1,200+</span>
                <span className="text-sm text-white/60">Desarrolladores</span>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">500+</span>
                <span className="text-sm text-white/60">Posts publicados</span>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">100+</span>
                <span className="text-sm text-white/60">Tecnologías</span>
              </div>
            </div>
          </div>

          {/* Right column — code window */}
          <div className="relative">
            {/* Subtle glow behind terminal */}
            <div className="absolute inset-0 bg-gradient-to-br from-codePrimary/10 to-codeAccent/5 rounded-3xl blur-2xl pointer-events-none" />

            {/* Terminal window */}
            <div className="relative z-10 bg-surface-elevated/90 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-md hover:border-codePrimary/30 transition-colors duration-300">

              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-surface-card/80 border-b border-white/[0.08]">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-3 flex items-center gap-2 bg-gray-900/60 rounded-md px-3 py-1">
                  <Terminal size={12} className="text-gray-200" />
                  <span className="text-xs text-gray-200 font-mono">comunidad.ts</span>
                </div>
              </div>

              {/* Code body */}
              <div className="p-5 font-mono text-sm leading-relaxed select-none bg-surface-base/60">
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">1</span>
                  <span>
                    <span className="text-purple-400">interface</span>
                    <span className="text-white"> Developer </span>
                    <span className="text-yellow-300">{"{"}</span>
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">2</span>
                  <span className="pl-6">
                    <span className="text-blue-300">nombre</span>
                    <span className="text-white">: </span>
                    <span className="text-green-300">string</span>
                    <span className="text-white">;</span>
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">3</span>
                  <span className="pl-6">
                    <span className="text-blue-300">tecnologias</span>
                    <span className="text-white">: </span>
                    <span className="text-green-300">string</span>
                    <span className="text-white">[];</span>
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">4</span>
                  <span className="pl-6">
                    <span className="text-blue-300">nivel</span>
                    <span className="text-white">: </span>
                    <span className="text-orange-300">&quot;junior&quot;</span>
                    <span className="text-white"> | </span>
                    <span className="text-orange-300">&quot;mid&quot;</span>
                    <span className="text-white"> | </span>
                    <span className="text-orange-300">&quot;senior&quot;</span>
                    <span className="text-white">;</span>
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">5</span>
                  <span className="text-yellow-300">{"}"}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">6</span>
                  <span>&nbsp;</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">7</span>
                  <span>
                    <span className="text-purple-400">const</span>
                    <span className="text-yellow-200"> unirseAComunidad </span>
                    <span className="text-white">= (</span>
                    <span className="text-orange-200">dev</span>
                    <span className="text-white">: </span>
                    <span className="text-green-300">Developer</span>
                    <span className="text-white">) </span>
                    <span className="text-purple-400">=&gt;</span>
                    <span className="text-white"> {"{"}</span>
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">8</span>
                  <span className="pl-6 text-gray-500">{"// compartir, aprender, crecer"}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">9</span>
                  <span className="pl-6">
                    <span className="text-blue-300">return</span>
                    <span className="text-white"> </span>
                    <span className="text-orange-300">&quot;bienvenido a CodeJourney&quot;</span>
                    <span className="text-white">;</span>
                  </span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-8 text-right mr-4">10</span>
                  <span>
                    <span className="text-yellow-300">{"}"}</span>
                    <span className="text-gray-200">;</span>
                  </span>
                </div>
                <div className="flex mt-1">
                  <span className="text-gray-600 w-8 text-right mr-4">11</span>
                  <span className="inline-block w-2 h-5 bg-codeAccent/80 animate-pulse" />
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-codePrimary/10 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <GitBranch size={12} className="text-gray-200" />
                  <span className="text-xs text-gray-200 font-mono">main</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">TypeScript</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
