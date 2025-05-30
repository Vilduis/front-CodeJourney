"use client";

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
      <Card className="bg-gradient-to-t from-codePrimary/50 to-codeSecondary/50 text-white overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Encabezado */}
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-balance text-gray-300 ">
                  Inicia sesión en tu cuenta
                </p>
              </div>

              {/* Mostrar error general del formulario */}
              {form.formState.errors.root && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">
                  {form.formState.errors.root.message}
                </div>
              )}

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="mateo@ejemplo.com"
                  // Importante: conectar el input con react-hook-form
                  {...form.register("email")}
                  className={cn(
                    form.formState.errors.email && "border-red-500"
                  )}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  className={cn(
                    form.formState.errors.password && "border-red-500"
                  )}
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Botón de login */}
              <Button
                type="submit"
                className="w-full bg-codePrimary hover:bg-codePrimary/70"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Iniciando sesión..."
                  : "Iniciar sesión"}
              </Button>

              {/* Link de registro */}
              <div className="text-center text-sm">
                No tienes una cuenta?{" "}
                <Link href="/register" className="underline underline-offset-4">
                  Registrate
                </Link>
              </div>
            </div>
          </form>

          {/* Imagen lateral en pantallas grandes */}
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://www.integrasources.com/media/files/Linux_MainImage.jpg.webp"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer con términos y condiciones */}
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-codePrimary">
        Al iniciar sesión, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
        y <a href="#">Política de Privacidad</a>.
      </div>
    </div>
  );
}
