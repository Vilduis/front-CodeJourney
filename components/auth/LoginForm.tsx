"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { cn, withNext } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import AuthShell from "@/components/auth/AuthShell";
import { CodeLine, SYNTAX as S } from "@/components/shared/EditorWindow";

const formSchema = z.object({
  email: z.email("Escribe un email válido"),
  password: z.string().min(8, "La contraseña tiene al menos 8 caracteres"),
});

type LoginFormValues = z.infer<typeof formSchema>;

const asideLines: CodeLine[] = [
  { tokens: [["// sigue donde lo dejaste", S.comment]] },
  { tokens: [["const", S.keyword], [" diario ", S.plain], ["= ", S.plain], ["await", S.keyword], [" abrirDiario", S.fn], ["(yo);", S.plain]] },
  { tokens: [] },
  { tokens: [["diario", S.plain], [".", S.plain], ["posts", S.name], [";", S.plain], ["       // todo lo que escribiste", S.comment]] },
  { tokens: [["diario", S.plain], [".", S.plain], ["comentarios", S.name], [";", S.plain], [" // lo que te respondieron", S.comment]] },
  { tokens: [["diario", S.plain], [".", S.plain], ["siguiente", S.name], [" = ", S.plain], ['"lo que aprendas hoy"', S.string], [";", S.plain]] },
];

const fieldError = "text-sm text-red-400";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const { loginUser } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit({ email, password }: LoginFormValues) {
    const error = await loginUser(email, password);
    if (error) {
      form.setError("root", { message: error });
      return;
    }
    toast.success("Sesión iniciada");
  }

  const formErrors = form.formState.errors;

  return (
    <AuthShell
      title="Hola de nuevo"
      subtitle="Inicia sesión para seguir escribiendo tu diario."
      footer={
        <>
          ¿Todavía no tienes cuenta?{" "}
          <Link href={withNext("/register", redirectTo)} className="font-medium text-white underline underline-offset-4 hover:text-codeAccent">
            Regístrate gratis
          </Link>
        </>
      }
      aside={{
        filename: "sesion.ts",
        language: "TypeScript",
        lines: asideLines,
        caption: "Tus posts y los comentarios que recibiste te esperan donde los dejaste.",
      }}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
        {formErrors.root && (
          <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {formErrors.root.message}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-white/80">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nombre@ejemplo.com"
            autoComplete="email"
            {...form.register("email")}
            aria-invalid={!!formErrors.email}
            aria-describedby={formErrors.email ? "email-error" : undefined}
            className={cn("h-11", formErrors.email && "border-red-500/50")}
          />
          {formErrors.email && <p id="email-error" className={fieldError}>{formErrors.email.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password" className="text-sm font-medium text-white/80">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...form.register("password")}
            aria-invalid={!!formErrors.password}
            aria-describedby={formErrors.password ? "password-error" : undefined}
            className={cn("h-11", formErrors.password && "border-red-500/50")}
          />
          {formErrors.password && <p id="password-error" className={fieldError}>{formErrors.password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-1 h-11 w-full rounded-lg bg-codePrimary font-semibold hover:bg-codePrimary/80"
        >
          {form.formState.isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>
    </AuthShell>
  );
}
