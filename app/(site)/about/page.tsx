import type { Metadata } from "next";
import About from "@/components/about/About";

export const metadata: Metadata = {
  title: "Acerca de",
  description: "Qué es CodeJourney, cómo funciona y las ideas detrás del proyecto.",
};

export default function AboutPage() {
  return <About />;
}
