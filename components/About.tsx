import React from "react";
import { Code, Users, MessageSquare, ArrowRight, Rocket, Heart, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const values = [
  {
    icon: Rocket,
    title: "Innovación",
    description: "Impulsamos el aprendizaje con las últimas tecnologías y tendencias del sector.",
  },
  {
    icon: Heart,
    title: "Comunidad",
    description: "Cada desarrollador importa. Fomentamos un ambiente inclusivo y de apoyo mutuo.",
  },
  {
    icon: Globe,
    title: "Accesibilidad",
    description: "El conocimiento debe ser libre. Nuestra plataforma es abierta para todos.",
  },
];

const About = () => {
  return (
    <section className="relative overflow-hidden bg-surface-base px-4 sm:px-6 lg:px-12 py-24">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #8e2de2 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-codePrimary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-codeSecondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl relative">

        {/* Header */}
        <div className="text-center mb-16 px-4">
          <Badge className="bg-codePrimary/20 text-codePrimary border border-codePrimary/40 hover:bg-codePrimary/30 px-4 py-1 text-sm mb-4">
            Nuestra Historia
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Acerca de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-codePrimary">
              CodeJourney
            </span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Un espacio donde desarrolladores de todos los niveles pueden aprender,
            compartir y crecer profesionalmente. Publica tus posts, comenta y
            enriquece la comunidad con tus experiencias.
          </p>
        </div>

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 px-4">
          <div className="bg-gray-900/60 border border-white/10 p-8 rounded-xl shadow-lg hover:border-codePrimary/40 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-codePrimary/20 text-codePrimary">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Nuestra Misión</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Inspirar y empoderar a desarrolladores creando un entorno colaborativo
              donde el aprendizaje y la innovación técnica sean la base del crecimiento.
            </p>
          </div>
          <div className="bg-gray-900/60 border border-white/10 p-8 rounded-xl shadow-lg hover:border-codePrimary/40 hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-codePrimary/20 text-codePrimary">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Nuestra Visión</h2>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Ser la comunidad líder de desarrolladores, donde cada aporte transforma
              la manera en que compartimos conocimientos y colaboramos en proyectos innovadores.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="mb-16 px-4">
          <div className="text-center mb-10">
            <Badge className="bg-codePrimary/20 text-codePrimary border border-codePrimary/40 hover:bg-codePrimary/30 px-4 py-1 text-sm mb-3">
              Nuestros valores
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Lo que nos define</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gray-900/40 border border-white/10 p-6 rounded-xl hover:border-codePrimary/40 hover:bg-gray-900/60 transition-all duration-300 text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-codePrimary/15 text-codePrimary">
                  <value.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-codeSecondary/30 to-codePrimary/30 border border-white/10 rounded-2xl p-10 text-center px-4">
          <Badge className="bg-white/10 text-white border border-white/20 hover:bg-white/15 px-4 py-1 text-sm mb-4">
            Únete a la comunidad
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Conéctate con otros desarrolladores
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto mb-8">
            Comparte conocimientos, explora contenido técnico y forma parte de
            una comunidad en constante crecimiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button className="bg-white text-codePrimary hover:bg-white/90 rounded-full px-6 font-semibold shadow-lg shadow-codePrimary/20">
                Regístrate ahora <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/posts">
              <Button className="bg-transparent text-white border border-white/60 hover:bg-white/10 hover:border-white rounded-full px-6 backdrop-blur-sm">
                Explorar posts
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
