import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HeroLegal from "./_sections/HeroLegal";
import ServicesGrid from "./_sections/ServicesGrid";

/* Pre-renderiza la página para cada idioma en build time (SSG) */
export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

/* Genera el metadata SEO dinámicamente según el idioma */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "legal_page" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: {
      canonical: `/${lang}/servicios/legal-contable`,
      languages: {
        es: "/es/servicios/legal-contable",
        en: "/en/servicios/legal-contable",
      },
    },
  };
}

/* Datos estructurados JSON-LD para el servicio legal y contable */
function JsonLd({ lang }: { lang: string }) {
  const baseUrl = "https://deepbrainmarkets.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: lang === "es"
      ? "Asesoría Legal y Contable"
      : "Legal & Accounting Advisory",
    provider: {
      "@type": "Organization",
      name: "Deep Brain Markets",
      url: baseUrl,
    },
    areaServed: "MX",
    serviceType: lang === "es"
      ? ["Derecho Mercantil", "Aduanas", "Contabilidad Empresarial", "Declaraciones Fiscales"]
      : ["Corporate Law", "Customs", "Business Accounting", "Tax Returns"],
    url: `${baseUrl}/${lang}/servicios/legal-contable`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function LegalContablePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  /* Habilita SSG para este idioma */
  setRequestLocale(lang);

  return (
    <>
      <JsonLd lang={lang} />
      {/* Sección hero con badge, H1 y subtítulo */}
      <HeroLegal lang={lang} />
      {/* Grid de 3 cards: legal, contable y casos de éxito */}
      <ServicesGrid lang={lang} />
    </>
  );
}
