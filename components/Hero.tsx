import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-codeSecondary/80 to-codePrimary/80 px-4 py-24">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-white text-codePrimary hover:bg-background/85 text-sm font-medium">
              La plataforma para desarrolladores
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Conecta. Comparte. Crece.
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Una comunidad donde los desarrolladores pueden compartir
              conocimientos, resolver dudas y conectar con otros profesionales.
            </p>
            <div className="flex flex-row flex-wrap items-center gap-4 mt-8">
              <Link href="/register">
                {" "}
                <Button className="bg-white text-codePrimary hover:bg-background/85 border-none rounded-full">
                  {" "}
                  Únete ahora <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/posts">
                {" "}
                <Button className="bg-codePrimary text-white hover:bg-background/85 hover:text-codePrimary border-none rounded-full">
                  Explorar posts
                </Button>
              </Link>
            </div>
          </div>
          {/* Imagen en 3D */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-codePrimary/30 to-codeSecondary/30 rounded-2xl transform group-hover:-rotate-2 transition-transform duration-300"></div>
            <div className="relative">
              <Image
                src="https://th.bing.com/th/id/R.e1a3a22b0168787b7078b4093c514afe?rik=55hOchBhJ5JnPA&pid=ImgRaw&r=0"
                alt="Developers collaboration"
                width={800}
                height={600}
                className="rounded-2xl transform perspective-1000 rotate-1 group-hover:rotate-0 transition-all duration-300 shadow-2xl border-4 border-gray-800/50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
