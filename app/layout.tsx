import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cuantovalgo.cl - Calculadora salarial tech Chile",
  description: "Descubre si estás bien pagado en 30 segundos. Rango de mercado para profesionales tech en Chile y LATAM.",
  openGraph: {
    title: "Cuantovalgo.cl - ¿Estás bien pagado?",
    description: "Calculadora de valor de mercado salarial para profesionales tech en Chile/LATAM",
    url: "https://cuantovalgo.cl",
    siteName: "Cuantovalgo.cl",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
