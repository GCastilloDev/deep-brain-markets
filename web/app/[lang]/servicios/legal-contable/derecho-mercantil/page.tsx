import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Building2, Gavel, Handshake, ShieldCheck, Globe, CircleCheck, ArrowRight } from "lucide-react";
import { whatsappHref } from "@/lib/whatsapp";

/* Pre-renderiza para cada idioma en build time (SSG) */
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
  const t = await getTranslations({ locale: lang, namespace: "mercantil_page" });

  return {
    title: t("meta_title"),
    description: t("meta_description"),
    alternates: {
      canonical: `/${lang}/servicios/legal-contable/derecho-mercantil`,
      languages: {
        es: "/es/servicios/legal-contable/derecho-mercantil",
        en: "/en/servicios/legal-contable/derecho-mercantil",
      },
    },
  };
}

/* Datos estructurados JSON-LD para el servicio */
function JsonLd({ lang }: { lang: string }) {
  const baseUrl = "https://deepbrainmarkets.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: lang === "es" ? "Derecho Mercantil y Corporativo" : "Corporate & Commercial Law",
    provider: {
      "@type": "Organization",
      name: "Deep Brain Markets",
      url: baseUrl,
    },
    areaServed: "MX",
    serviceType: lang === "es"
      ? ["Constitución de Empresas", "Gobierno Corporativo", "Compliance", "Contratos Comerciales"]
      : ["Company Formation", "Corporate Governance", "Compliance", "Commercial Contracts"],
    url: `${baseUrl}/${lang}/servicios/legal-contable/derecho-mercantil`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function DerechoMercantilPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  /* Habilita SSG para este idioma */
  setRequestLocale(lang);

  const t = await getTranslations({ locale: lang, namespace: "mercantil_page" });
  const tNav = await getTranslations({ locale: lang, namespace: "nav" });

  /* Servicios principales de la columna izquierda */
  const services = [
    { icon: <Building2 size={24} aria-hidden="true" />, title: t("card1_title"), desc: t("card1_desc") },
    { icon: <Gavel size={24} aria-hidden="true" />, title: t("card2_title"), desc: t("card2_desc") },
    { icon: <Handshake size={24} aria-hidden="true" />, title: t("card3_title"), desc: t("card3_desc") },
  ];

  /* Beneficios del sidebar */
  const benefits = [
    { icon: <ShieldCheck size={14} aria-hidden="true" />, title: t("benefit1_title"), desc: t("benefit1_desc") },
    { icon: <Globe size={14} aria-hidden="true" />, title: t("benefit2_title"), desc: t("benefit2_desc") },
    { icon: <CircleCheck size={14} aria-hidden="true" />, title: t("benefit3_title"), desc: t("benefit3_desc") },
  ];

  return (
    <>
      <JsonLd lang={lang} />

      {/* ── Header ── */}
      <header className="relative w-full bg-white border-b border-[#E5E7EB] overflow-hidden">

        {/* Ícono decorativo de fondo — solo desktop */}
        <div
          className="hidden md:block absolute right-10 top-5 text-[#1B4B8F] opacity-[0.05] pointer-events-none"
          aria-hidden="true"
        >
          <Building2 size={380} strokeWidth={0.5} />
        </div>

        <div className="relative px-5 md:px-20 pt-8 pb-10 md:pt-16 md:pb-16 max-w-[1440px] mx-auto flex flex-col gap-4 md:gap-5">

          {/* Breadcrumb */}
          <nav aria-label="Ruta de navegación">
            <ol className="flex items-center flex-wrap gap-1.5 text-[13px] text-[#9CA3AF]">
              <li>
                <Link href={`/${lang}`} className="hover:text-[#1B4B8F] transition-colors">
                  {t("breadcrumb_home")}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li>
                <Link href={`/${lang}/servicios/legal-contable`} className="hover:text-[#1B4B8F] transition-colors">
                  {t("breadcrumb_legal")}
                </Link>
              </li>
              <li aria-hidden="true">›</li>
              <li className="font-semibold text-[#1B4B8F]">{t("breadcrumb_current")}</li>
            </ol>
          </nav>

          {/* H1 */}
          <h1 className="font-title font-bold text-[24px] md:text-[42px] text-[#0D2847] leading-tight md:max-w-[600px]">
            {t("h1")}
          </h1>

          {/* Subtítulo */}
          <p className="font-body text-[14px] md:text-[17px] text-[#5A7499] leading-relaxed md:max-w-[560px]">
            {t("subtitle")}
          </p>

          {/* CTA móvil */}
          <a
            href={whatsappHref(tNav("cta_msg"))}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:hidden flex items-center justify-center w-full py-3.5 bg-[#1B4B8F] text-white font-title font-semibold text-[15px] rounded-[8px] hover:opacity-90 transition-opacity"
          >
            {tNav("cta")}
          </a>
        </div>
      </header>

      {/* ── Contenido principal ── */}
      <main className="w-full bg-[#F8FAFC]">
        <div className="px-5 md:px-20 py-10 md:py-16 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8 md:gap-10">

          {/* Columna izquierda — servicios */}
          <div className="flex-1 flex flex-col gap-5 md:gap-6">

            {/* Etiqueta de sección */}
            <span className="font-title font-bold text-[11px] text-[#1B4B8F] tracking-wider uppercase">
              {t("solutions_label")}
            </span>

            {/* Cards de servicios */}
            <ul className="flex flex-col gap-4 md:gap-6">
              {services.map((svc) => (
                <li key={svc.title}>
                  <article className="flex gap-4 md:gap-5 bg-white rounded-[12px] p-5 md:p-6 border border-[#E5E7EB]">
                    <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#EBF2FA] rounded-[8px] shrink-0 text-[#1B4B8F]">
                      {svc.icon}
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="font-title font-bold text-[15px] md:text-[17px] text-[#0D2847]">
                        {svc.title}
                      </h3>
                      <p className="font-body text-[13px] md:text-[14px] text-[#5A7499] leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna derecha — beneficios (sidebar) */}
          <aside className="md:w-[340px] shrink-0">
            <div className="flex flex-col gap-5 bg-[#EBF2FA] rounded-[12px] p-5 md:p-7">

              <h2 className="font-title font-bold text-[17px] md:text-[18px] text-[#0D2847]">
                {t("benefits_title")}
              </h2>

              {/* Lista de beneficios */}
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-3">
                  <div className="flex items-center justify-center w-7 h-7 bg-[#1B4B8F] rounded-full shrink-0 mt-0.5 text-white">
                    {b.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-title font-bold text-[11px] md:text-[12px] text-[#0D2847] tracking-wide">
                      {b.title}
                    </span>
                    <span className="font-body text-[12px] md:text-[13px] text-[#5A7499] leading-relaxed">
                      {b.desc}
                    </span>
                  </div>
                </div>
              ))}

              {/* Cita */}
              <blockquote className="bg-white rounded-[8px] p-4">
                <p className="font-body italic text-[12px] md:text-[13px] text-[#5A7499] leading-relaxed">
                  {t("quote")}
                </p>
              </blockquote>
            </div>
          </aside>

        </div>
      </main>

      {/* ── Sección CTA ── */}
      <section aria-label="Llamada a la acción" className="w-full bg-white border-t border-[#E5E7EB]">
        <div className="px-5 md:px-20 py-12 md:py-20 max-w-[1440px] mx-auto flex flex-col items-center gap-5 md:gap-6 text-center">
          <h2 className="font-title font-bold text-[22px] md:text-[36px] text-[#0D2847] leading-tight md:max-w-[760px]">
            {t("cta_h2")}
          </h2>
          <p className="font-body text-[14px] md:text-[17px] text-[#5A7499] leading-relaxed md:max-w-[620px]">
            {t("cta_sub")}
          </p>
          <a
            href={whatsappHref(t("cta_specialist_msg"))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1B4B8F] text-white font-title font-semibold text-[15px] rounded-[8px] hover:opacity-90 transition-opacity"
          >
            {t("cta_btn")}
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  );
}
