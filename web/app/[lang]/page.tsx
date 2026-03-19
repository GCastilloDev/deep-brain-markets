import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroHome from "./_sections/HeroHome";
import ExpertiseSection from "./_sections/ExpertiseSection";
import PartnersStrip from "./_sections/PartnersStrip";

/* Genera el metadata SEO dinámicamente según el idioma */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "home" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      /* Indica a Google las versiones de cada idioma para SEO */
      canonical: `/${lang}`,
      languages: {
        es: "/es",
        en: "/en",
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <>
      {/* Sección hero — primera sección visible al cargar */}
      <HeroHome lang={lang} />
      {/* Sección de expertise — 2 cards con servicios principales */}
      <ExpertiseSection lang={lang} />
      {/* Franja de aliados estratégicos */}
      <PartnersStrip />
    </>
  );
}
