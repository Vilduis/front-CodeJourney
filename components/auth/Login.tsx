"use client";

import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth"; // Hook de autenticación
import { toast } from "sonner";

// Definimos el esquema Zod para email y password
const formSchema = z.object({
  email: z.string().email({ message: "Por favor ingrese un email válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { loginUser, error: authError } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const success = await loginUser(values.email, values.password);

      if (success) {
        router.push("/");
      } else {
        // Si loginUser retorna false, significa que hubo un error que ya fue manejado
        // por el contexto de autenticación (mostrado en toast)
        form.setError("root", {
          type: "manual",
          message: authError || "Error al iniciar sesión",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      form.setError("root", {
        type: "manual",
        message: "Error al conectar con el servidor",
      });
      toast.error("Error al conectar con el servidor");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-surface-card/60 border border-white/[0.08] text-white overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Encabezado */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-balance text-white/60">
                  Inicia sesión en tu cuenta
                </p>
              </div>

              {/* Mostrar error general del formulario */}
              {form.formState.errors.root && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white/80 text-sm font-medium">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mateo@ejemplo.com"
                  {...form.register("email")}
                  className={cn(
                    "bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30",
                    form.formState.errors.email && "border-red-500/50",
                  )}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white/80 text-sm font-medium">Contraseña</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm text-white/40 hover:text-white transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className={cn(
                    "bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30",
                    form.formState.errors.password && "border-red-500/50",
                  )}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Botón de login */}
              <Button
                type="submit"
                className="w-full bg-codePrimary hover:bg-codePrimary/80 rounded-lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Iniciando sesión..."
                  : "Iniciar sesión"}
              </Button>

              {/* Link de registro */}
              <div className="text-center text-sm text-white/60">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-white underline underline-offset-4 hover:text-codeAccent transition-colors">
                  Registrate
                </Link>
              </div>
            </div>
          </form>

          {/* Imagen lateral en pantallas grandes */}
          <div className="relative hidden bg-surface-base md:block">
            <Image
              src="https://www.integrasources.com/media/files/Linux_MainImage.jpg.webp"
              alt="Image"
              fill
              className="object-cover brightness-[0.7]"
              unoptimized
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer con términos y condiciones */}
      <div className="text-balance text-center text-xs text-white/30 [&_a]:text-white/60 [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-codeAccent">
        Al iniciar sesión, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
        y <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
}
