"use client";

import React from "react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
      <Card className="bg-surface-card/60 border border-white/[0.08] text-white overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Imagen lateral en pantallas grandes */}
          <div className="relative hidden bg-surface-base md:block">
            <Image
              src="https://www.integrasources.com/media/files/Linux_MainImage.jpg.webp"
              alt="Register"
              fill
              className="object-cover brightness-[0.7]"
              unoptimized
            />
          </div>

          {/* Formulario */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <h1 className="text-2xl font-bold">Crear una cuenta</h1>
              <p className="text-white/60">Registrate para empezar tu viaje</p>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Nombre y Apellido en fila */}
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-sm font-medium">Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30" />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80 text-sm font-medium">Apellido</FormLabel>
                        <FormControl>
                          <Input placeholder="Perez" {...field} className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30" />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="nombre@ejemplo.com" {...field} className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 text-sm font-medium">Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80 text-sm font-medium">Confirmar contraseña</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="bg-white/[0.06] border-white/[0.12] text-white placeholder:text-white/30 focus:border-codePrimary focus:ring-1 focus:ring-codePrimary/30"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                {/* Botón de envío */}
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-codePrimary hover:bg-codePrimary/80 rounded-lg">
                  {form.formState.isSubmitting ? "Registrando..." : "Registrarme"}
                </Button>
              </form>
            </Form>
            <Separator className="my-4 bg-white/[0.06]" />
            <div className="text-center text-sm text-white/60">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-white underline underline-offset-4 hover:text-codeAccent transition-colors">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
