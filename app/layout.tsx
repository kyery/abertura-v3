import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Abertura — Ingressos",
  description: "Compre seu ingresso para Abertura de forma simples e segura.",
  manifest: "/manifest.json",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1"
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
