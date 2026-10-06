"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerUser, isEmailRegistered } from "@/services/userService";
import { getErrorMessage } from "@/lib/api";
import { cn, withNext } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import AuthShell from "@/components/auth/AuthShell";
import { CodeLine, SYNTAX as S } from "@/components/shared/EditorWindow";

const formSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    email: z.email("Escribe un email válido, por ejemplo nombre@ejemplo.com"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

const fields: {
  name: keyof RegisterFormValues;
  label: string;
  type?: string;
  placeholder: string;
  autoComplete: string;
  half?: boolean;
}[] = [
  { name: "name", label: "Nombre", placeholder: "Ana", autoComplete: "given-name", half: true },
  { name: "lastName", label: "Apellido", placeholder: "Pérez", autoComplete: "family-name", half: true },
  { name: "email", label: "Email", type: "email", placeholder: "nombre@ejemplo.com", autoComplete: "email" },
  { name: "password", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Repite la contraseña", type: "password", placeholder: "••••••••", autoComplete: "new-password" },
];

const asideLines: CodeLine[] = [
  { tokens: [["## Día 1", S.heading]] },
  { tokens: [["Hoy empiezo mi diario en CodeJourney.", S.plain]] },
  { tokens: [] },
  { tokens: [["- ", S.marker], ["[x]", S.type], [" Crear mi cuenta", S.plain]] },
  { tokens: [["- ", S.marker], ["[ ]", S.comment], [" Publicar mi primer post", S.plain]] },
  { tokens: [["- ", S.marker], ["[ ]", S.comment], [" Comentar el post de alguien más", S.plain]] },
];

export default function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { loginUser } = useAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", lastName: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit({ name, lastName, email, password }: RegisterFormValues) {
    try {
      if (await isEmailRegistered(email)) {
        form.setError("email", { message: "Este email ya está registrado. Prueba iniciar sesión." });
        return;
      }

      await registerUser({ name, lastName, email, password });
    } catch (error) {
      toast.error(getErrorMessage(error, "No pudimos crear tu cuenta. Inténtalo de nuevo."));
      return;
    }

    if (await loginUser(email, password)) {
      router.push(withNext("/login", redirectTo));
      return;
    }
    toast.success("Cuenta creada. ¡Bienvenido a CodeJourney!");
  }

  return (
    <AuthShell
      title="Empieza tu diario"
      subtitle="Crea tu cuenta gratis. Solo necesitas un email."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link href={withNext("/login", redirectTo)} className="font-medium text-white underline underline-offset-4 hover:text-codeAccent">
            Inicia sesión
          </Link>
        </>
      }
      aside={{
        filename: "dia-1.md",
        language: "Markdown",
        lines: asideLines,
        caption: "Tu primer post puede ser sobre cualquier cosa que estés aprendiendo hoy. No tiene que estar perfecto.",
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-x-3 gap-y-4" noValidate>
          {fields.map(({ name, label, type, placeholder, autoComplete, half }) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className={cn(half ? "col-span-2 sm:col-span-1" : "col-span-2")}>
                  <FormLabel className="text-sm font-medium text-white/80">{label}</FormLabel>
                  <FormControl>
                    <Input type={type} placeholder={placeholder} autoComplete={autoComplete} className="h-11" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          ))}

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="col-span-2 mt-1 h-11 w-full rounded-lg bg-codePrimary font-semibold hover:bg-codePrimary/80"
          >
            {form.formState.isSubmitting ? "Creando tu cuenta..." : "Crear cuenta"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
