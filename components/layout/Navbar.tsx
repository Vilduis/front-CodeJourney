"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, UserPlus, Menu, X, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import ProfileDialog from "@/components/auth/ProfileDialog";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/posts", label: "Posts" },
  { href: "/about", label: "Acerca de" },
];

const guestLinks = [
  { href: "/register", label: "Crear cuenta", icon: UserPlus },
  { href: "/login", label: "Iniciar sesión", icon: LogIn },
];

const drawerItem = "flex h-11 w-full items-center gap-2 rounded-lg px-3 text-white hover:bg-white/8 hover:text-codeAccent";

const Logo = () => (
  <Link href="/" className="flex items-center space-x-3">
    <Image src="/logo.png" alt="" width={40} height={40} />
    <span className="text-xl font-bold bg-linear-to-r from-codePrimary to-codeAccent bg-clip-text text-transparent">
      CodeJourney
    </span>
  </Link>
);

const UserAvatar = ({ initial }: { initial: string }) => (
  <Avatar className="ring-2 ring-codePrimary/40">
    <AvatarFallback className="bg-linear-to-br from-codePrimary to-codeAccent text-white font-bold">{initial}</AvatarFallback>
  </Avatar>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logoutUser, isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    if (await logoutUser()) router.replace("/login");
  };

  const openProfile = () => {
    setIsOpen(false);
    setIsProfileOpen(true);
  };

  const fullName = `${user?.name ?? ""} ${user?.lastName ?? ""}`.trim() || "Usuario";
  const email = user?.email ?? "";
  const initial = fullName.charAt(0).toUpperCase();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href) && pathname !== "/posts/createpost";

  return (
    <>
      <nav aria-label="Principal" className="fixed z-50 w-full border-b border-white/6 bg-surface-base/85 px-4 text-white backdrop-blur-md sm:px-6">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8">
          <Logo />

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "inline-flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors",
                  isActive(href) ? "bg-white/8 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {!isInitialized ? (
              <div className="h-9 w-9 rounded-full bg-white/15 motion-safe:animate-pulse" />
            ) : isAuthenticated ? (
              <>
                <Button asChild className="h-9 rounded-lg bg-codePrimary px-4 font-semibold hover:bg-codePrimary/80">
                  <Link href="/posts/createpost">
                    <PenLine size={16} aria-hidden />
                    Escribir
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="Abrir menú de usuario"
                      className="rounded-full transition-shadow hover:ring-2 hover:ring-codeAccent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-codeAccent"
                    >
                      <UserAvatar initial={initial} />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>Perfil</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/posts/createpost">Mis posts</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>Cerrar sesión</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  Iniciar sesión
                </Link>
                <Button asChild className="h-9 rounded-lg bg-codeAccent px-4 font-semibold text-slate-900 hover:bg-codeAccent/90">
                  <Link href="/register">Crear cuenta</Link>
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="ml-auto h-11 w-11 hover:bg-white/8 hover:text-white md:hidden"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </nav>

      {isOpen && <div aria-hidden className="fixed inset-0 bg-black/50 z-60 md:hidden" onClick={() => setIsOpen(false)} />}

      <div
        id="mobile-menu"
        inert={!isOpen}
        className={cn(
          "fixed top-0 right-0 h-full w-72 bg-surface-base border-l border-white/8 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out z-70 md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-5 flex flex-col gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar menú"
            className="self-end h-11 w-11 text-white hover:bg-white/8 hover:text-white"
          >
            <X size={24} />
          </Button>

          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={drawerItem}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}

          <div aria-hidden className="my-3 h-px bg-white/10" />

          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 px-3 pb-2">
                <UserAvatar initial={initial} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{fullName}</p>
                  <p className="truncate text-xs text-white/65">{email}</p>
                </div>
              </div>
              <button type="button" className={drawerItem} onClick={openProfile}>
                Perfil
              </button>
              <Link href="/posts/createpost" className={drawerItem} onClick={() => setIsOpen(false)}>
                Mis posts
              </Link>
              <button type="button" className={drawerItem} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            guestLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className={drawerItem} onClick={() => setIsOpen(false)}>
                <Icon size={18} aria-hidden />
                {label}
              </Link>
            ))
          )}
        </div>
      </div>

      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  );
};

export default Navbar;
