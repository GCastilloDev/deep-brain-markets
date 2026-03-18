import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "../globals.css";

/* Fuente para títulos y headings */
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

/* Fuente para cuerpo de texto */
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Deep Brain Markets",
    default: "Deep Brain Markets",
  },
  description: "Servicios legales, contables, importaciones y asesoría ecommerce para negocios globales.",
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  /* Si el idioma no es válido, muestra 404 */
  if (!routing.locales.includes(lang as "es" | "en")) {
    notFound();
  }

  /* Carga las traducciones del idioma activo */
  const messages = await getMessages();

  return (
    <html
      lang={lang}
      className={`${montserrat.variable} ${openSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text-body">
        <NextIntlClientProvider messages={messages}>
          {/* Navbar sticky en la parte superior */}
          <Navbar lang={lang} />

          {/* Contenido principal de cada página */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer al final de todas las páginas */}
          <Footer lang={lang} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

/* Genera las rutas estáticas para cada idioma */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }));
}
