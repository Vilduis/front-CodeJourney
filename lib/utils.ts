import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Author } from "@/types/comment"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAuthor(author: Author): { name: string; lastName: string } {
  if (typeof author === "string") return { name: author, lastName: "" };
  return { name: author.name, lastName: author.lastName };
}

export function getAuthorId(author: Author): string | undefined {
  return typeof author === "string" ? author : author._id;
}

export function formatDate(dateString?: string, month: "long" | "short" = "long"): string {
  if (!dateString) return "Fecha desconocida";
  return new Date(dateString).toLocaleDateString("es-ES", { day: "numeric", month, year: "numeric" });
}

export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\w-]*\n?([\s\S]*?)```/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/(\*|_)(.+?)\1/g, "$2")
    .replace(/~~(.+?)~~/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(markdown: string): number {
  const words = toPlainText(markdown).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  return { items: items.slice((current - 1) * perPage, current * perPage), page: current, totalPages };
}

export function safeRedirect(value: string | string[] | undefined, fallback = "/"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}

export function withNext(path: string, next: string): string {
  return next === "/" ? path : `${path}?next=${encodeURIComponent(next)}`;
}
