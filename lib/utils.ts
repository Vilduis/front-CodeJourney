import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type AuthorField = string | { _id?: string; name: string; lastName: string };

export function getAuthor(author: AuthorField): { name: string; lastName: string } {
  if (typeof author === "string") return { name: author, lastName: "" };
  return { name: author.name, lastName: author.lastName };
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "Fecha desconocida";
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
