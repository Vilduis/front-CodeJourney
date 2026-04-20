"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser, validateEmail } from "@/services/userService";
import { toast } from "sonner";

// Esquema de validación con Zod
const formSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    lastName: z
      .string()
      .min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Por favor ingrese un email válido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
    confirmPassword: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof formSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  // Configuramos React Hook Form con Zod
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
  
    },
  });

  // Lógica de envío del formulario
  async function onSubmit(values: RegisterFormValues) {
    try {
      // Primero, validamos si el email está disponible
      const isEmailAvailable = await validateEmail(values.email);
      if (!isEmailAvailable) {
        toast.error("El email ya está registrado, por favor ingrese otro email");
        return;
      }

      // Si el email está disponible, construimos el payload sin el confirmPassword
      const payload = {
        name: values.name,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      const result = await registerUser(payload);
      if (result) {
        toast.success("Usuario registrado exitosamente!");
        router.push("/login");
      } else {
        toast.error("Error al registrar usuario");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error al registrar usuario");
      } else {
        toast.error("Error desconocido al registrar usuario");
      }
      console.error("Error registering user:", error);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-gradient-to-t from-codePrimary/50 to-codeSecondary/50 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
          <CardDescription className="text-gray-300">
            Registrate para empezar tu viaje
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Formulario con Zod + React Hook Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nombre */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Apellido */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl>
                      <Input placeholder="Perez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="nombre@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Botón de envío */}
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-codePrimary hover:bg-codePrimary/70">
                {form.formState.isSubmitting ? "Registrando..." : "Registrarme"}
              </Button>
            </form>
          </Form>
          {/* Separador y enlace para iniciar sesión */}
          <Separator className="my-4" />
          <div className="text-center text-sm">
            Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline underline-offset-4">
              Iniciar sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
