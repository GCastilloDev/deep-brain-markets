import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Deep Brain Markets",
    default: "Deep Brain Markets",
  },
  description: "Servicios legales, contables, importaciones y asesoría ecommerce",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Si el idioma en la URL no es válido, muestra 404
  if (!routing.locales.includes(lang as "es" | "en")) {
    notFound();
  }

  // Carga las traducciones del idioma activo para los componentes cliente
  const messages = await getMessages();

  return (
    <html lang={lang} className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Provee las traducciones a todos los componentes cliente de la app */}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// Genera las rutas estáticas para cada idioma en build time
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}
