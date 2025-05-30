import React from "react";
import { Code, Users, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const About = () => {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black/95 px-4 sm:px-6 lg:px-12 py-24">
      <div className="container mx-auto max-w-7xl">
        {/* Encabezado */}
        <div className="text-center mb-12 sm:mb-16 px-4">
          <Badge className="bg-codePrimary/20 text-codePrimary hover:bg-codePrimary/30 border-none px-3 py-1 text-sm sm:text-base mb-4">
            Nuestra Historia
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 flex flex-wrap items-center justify-center gap-2">
            <Code className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-codePrimary" />
            Acerca de <span className="text-codePrimary">CodeJourney</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            Un espacio donde desarrolladores de todos los niveles pueden
            aprender, compartir y crecer profesionalmente. Publica tus posts,
            comenta y enriquece la comunidad con tus experiencias.
          </p>
        </div>

        {/* Sección de Misión y Visión */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 px-4">
          <div className="bg-gradient-to-t from-codePrimary/50 to-codeSecondary/50 p-6 sm:p-8 rounded-xl shadow-lg hover:scale-[1.03] transition-all duration-300">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white mb-4">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-codeSecondary" />
              Nuestra Misión
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              Inspirar y empoderar a desarrolladores creando un entorno
              colaborativo donde el aprendizaje y la innovación técnica sean la
              base del crecimiento.
            </p>
          </div>
          <div className="bg-gradient-to-t from-codePrimary/50 to-codeSecondary/50 p-6 sm:p-8 rounded-xl shadow-lg hover:scale-[1.03] transition-all duration-300">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white mb-4">
              <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 text-codeSecondary" />
              Nuestra Visión
            </h2>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
              Ser la comunidad líder de desarrolladores, donde cada aporte
              transforma la manera en que compartimos conocimientos y
              colaboramos en proyectos innovadores.
            </p>
          </div>
        </div>

        {/* Llamado a la acción */}
        <div className="text-center px-4">
          <Badge className="bg-codeSecondary/20 text-codeSecondary hover:bg-codeSecondary/30 border-none px-3 py-1 text-sm sm:text-base mb-4">
            Únete a la comunidad
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 flex flex-wrap items-center justify-center gap-2">
            <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-codePrimary" />
            Conéctate con otros desarrolladores
          </h2>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-6">
            Comparte conocimientos, explora contenido técnico y forma parte de
            una comunidad en constante crecimiento.
          </p>
          <div className="flex justify-center">
            <Link href="/register">
              <Button className="bg-white text-codePrimary hover:bg-gray-100 hover:shadow-lg transition-all duration-200 rounded-full px-5 py-2.5 sm:px-6 sm:py-3 flex items-center gap-2 font-semibold">
                Regístrate Ahora <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
