import { Badge } from "./ui/badge";
import { Code, MessageSquare, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const characteristics = [
  {
    icon: Code,
    title: "Comparte código",
    description:
      "Publica snippets, soluciones y proyectos para recibir feedback de la comunidad. Aprende de otros desarrolladores y mejora tus habilidades.",
    details: "Ver ejemplos",
  },
  {
    icon: MessageSquare,
    title: "Aprende y enseña",
    description:
      "Resuelve dudas, comparte conocimientos y crece junto a la comunidad. Ayuda a otros y recibe ayuda cuando la necesites.",
    details: "Ver discusiones",
  },
  {
    icon: Users,
    title: "Conecta con otros",
    description:
      "Encuentra compañeros de trabajo, colabora en proyectos y forma alianzas que te ayuden a crecer profesionalmente.",
    details: "Ver compañeros",
  },
];

const Characteristics = () => {
  return (
    <section className="bg-surface-elevated px-4 py-24">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <Badge className="bg-codeAccent/10 text-codeAccent border border-codeAccent/30 hover:bg-codeAccent/20">
            Características
          </Badge>
          <h2 className="text-4xl font-bold text-white">
            Todo lo que necesitas para crecer como desarrollador
          </h2>
          <p className="text-white/60 mt-4 leading-relaxed">
            Una plataforma creada por y para desarrolladores
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characteristics.map((characteristic) => (
            <div
              key={characteristic.title}
              className="bg-surface-card border border-white/[0.08] border-t-2 border-t-codePrimary/50 backdrop-blur-sm p-8 rounded-lg shadow-lg hover:shadow-xl hover:border-codePrimary/30 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-codeAccent/10 border border-codeAccent/30 text-codeAccent">
                <characteristic.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {characteristic.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {characteristic.description}
              </p>
              <Link href="/posts">
                <Button className="bg-codePrimary text-white hover:bg-codePrimary/80 border-none rounded-lg mt-4 font-semibold">
                  {characteristic.details} <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Characteristics;
