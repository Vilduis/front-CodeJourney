import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-surface-elevated border-t border-white/[0.06] text-white py-10 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/logo.png" alt="logo" width={36} height={36} />
              <span className="text-lg font-bold bg-gradient-to-r from-codePrimary to-codeAccent bg-clip-text text-transparent">CodeJourney</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              La comunidad para desarrolladores que quieren crecer.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-2">
            <span className="text-sm font-semibold text-white/50 uppercase tracking-wider">Plataforma</span>
            <ul className="space-y-1">
              <li><Link href="/posts" className="text-sm text-white/40 hover:text-white transition-colors">Posts</Link></li>
              <li><Link href="/register" className="text-sm text-white/40 hover:text-white transition-colors">Registrarse</Link></li>
              <li><Link href="/login" className="text-sm text-white/40 hover:text-white transition-colors">Iniciar sesión</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <span className="text-sm font-semibold text-white/50 uppercase tracking-wider">Legal</span>
            <ul className="space-y-1">
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Términos de uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 text-center">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} CodeJourney. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
