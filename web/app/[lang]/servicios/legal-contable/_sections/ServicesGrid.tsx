import { useTranslations } from "next-intl";
import { Scale, Calculator, TrendingUp } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { activeHref } from "@/lib/routes";

interface ServicesGridProps {
  lang: string;
}

/* Cuadrícula de 3 cards: Asesoría Legal, Servicios Contables, Casos de Éxito
   Desktop: 3 columnas lado a lado
   Móvil:   apiladas verticalmente
   Las filas con href son áreas completamente clickeables (min 44px, hover bg) */
export default function ServicesGrid({ lang }: ServicesGridProps) {
  const t = useTranslations("legal_page");

  /* Filas de la card Legal — href activo solo en rutas ya construidas */
  const legalRows = [
    {
      title: t("card1_svc1_title"),
      desc:  t("card1_svc1_desc"),
      href:  activeHref(lang, "/servicios/legal-contable/derecho-mercantil"),
      border: true,
    },
    {
      title: t("card1_svc2_title"),
      desc:  t("card1_svc2_desc"),
      href:  activeHref(lang, "/servicios/legal-contable/aduanas-comercio-exterior"),
      border: true,
    },
    {
      title: t("card1_svc3_title"),
      desc:  t("card1_svc3_desc"),
      href:  activeHref(lang, "/servicios/legal-contable/civil-fiscal-administrativo"),
      border: false,
    },
  ];

  /* Filas de la card Contable */
  const contableRows = [
    {
      title: t("card2_svc1_title"),
      desc:  t("card2_svc1_desc"),
      href:  activeHref(lang, "/servicios/legal-contable/contabilidad-empresarial"),
      border: true,
    },
    {
      title: t("card2_svc2_title"),
      desc:  t("card2_svc2_desc"),
      href:  activeHref(lang, "/servicios/legal-contable/declaraciones-fiscales"),
      border: true,
    },
    {
      title: t("card2_svc3_title"),
      desc:  t("card2_svc3_desc"),
      href:  activeHref(lang, "/servicios/legal-contable/auditorias"),
      border: false,
    },
  ];

  return (
    <section aria-label="Servicios" className="w-full bg-white">
      <div className="px-5 md:px-20 py-8 md:py-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">

          {/* ── Card 1: Asesoría Legal ── */}
          <div className="flex flex-col gap-4 md:gap-6 rounded-[12px] p-5 md:p-8 border border-[#EBF2FA]">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#EBF2FA] rounded-[8px] shrink-0">
                <Scale size={20} className="text-[#1B4B8F]" aria-hidden="true" />
              </div>
              <h2 className="font-title font-bold text-[17px] md:text-[20px] text-[#1B4B8F]">
                {t("card1_title")}
              </h2>
            </div>

            <ul className="flex flex-col">
              {legalRows.map((row) => (
                <li key={row.title} className={row.border ? "border-b border-[#EBF2FA]" : ""}>
                  <AppLink
                    href={row.href}
                    className={`flex flex-col gap-1.5 py-3 md:py-4 px-2 min-h-[44px] rounded-[8px] transition-colors
                      ${row.href ? "hover:bg-[#EBF2FA] cursor-pointer" : "cursor-default"}`}
                  >
                    <span className={`font-title font-semibold text-[13px] md:text-[14px] transition-colors
                      ${row.href ? "text-[#0D2847] group-hover:text-[#1B4B8F]" : "text-[#0D2847]"}`}>
                      {row.title}
                    </span>
                    <span className="font-body text-[12px] md:text-[13px] text-[#5A7499] leading-relaxed">
                      {row.desc}
                    </span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card 2: Servicios Contables ── */}
          <div className="flex flex-col gap-4 md:gap-6 rounded-[12px] p-5 md:p-8 border border-[#EBF2FA]">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#EBF2FA] rounded-[8px] shrink-0">
                <Calculator size={20} className="text-[#1B4B8F]" aria-hidden="true" />
              </div>
              <h2 className="font-title font-bold text-[17px] md:text-[20px] text-[#1B4B8F]">
                {t("card2_title")}
              </h2>
            </div>

            <ul className="flex flex-col">
              {contableRows.map((row) => (
                <li key={row.title} className={row.border ? "border-b border-[#EBF2FA]" : ""}>
                  <AppLink
                    href={row.href}
                    className={`flex flex-col gap-1.5 py-3 md:py-4 px-2 min-h-[44px] rounded-[8px] transition-colors
                      ${row.href ? "hover:bg-[#EBF2FA] cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="font-title font-semibold text-[13px] md:text-[14px] text-[#0D2847]">
                      {row.title}
                    </span>
                    <span className="font-body text-[12px] md:text-[13px] text-[#5A7499] leading-relaxed">
                      {row.desc}
                    </span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card 3: Casos de Éxito ── */}
          <div className="flex flex-col gap-4 md:gap-6 rounded-[12px] p-5 md:p-8 bg-[#F8F9FA]">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#E8F0F8] rounded-[8px] shrink-0">
                <TrendingUp size={20} className="text-[#1B4B8F]" aria-hidden="true" />
              </div>
              <h2 className="font-title font-bold text-[17px] md:text-[20px] text-[#0D2847]">
                {t("card3_title")}
              </h2>
            </div>

            <blockquote className="flex flex-col gap-2 md:gap-3 bg-white rounded-[8px] p-4 md:p-5 border border-[#E5E7EB]">
              <p className="font-body text-[13px] md:text-[14px] text-[#2C3E50] leading-relaxed">
                {t("card3_quote")}
              </p>
              <cite className="font-body not-italic text-[12px] md:text-[13px] text-[#5A7499] font-semibold">
                {t("card3_author")}
              </cite>
            </blockquote>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center gap-1 bg-white rounded-[8px] py-3 md:py-4">
                <span className="font-title font-bold text-[24px] md:text-[28px] text-[#1B4B8F]">
                  {t("card3_stat1_num")}
                </span>
                <span className="font-body text-[12px] md:text-[13px] text-[#5A7499]">
                  {t("card3_stat1_label")}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 bg-white rounded-[8px] py-3 md:py-4">
                <span className="font-title font-bold text-[24px] md:text-[28px] text-[#1B4B8F]">
                  {t("card3_stat2_num")}
                </span>
                <span className="font-body text-[12px] md:text-[13px] text-[#5A7499]">
                  {t("card3_stat2_label")}
                </span>
              </div>
            </div>

            <AppLink
              href={activeHref(lang, "/contacto")}
              className={`flex items-center justify-center w-full py-3 bg-[#1B4B8F] text-white font-title font-semibold text-[14px] md:text-[15px] rounded-[8px] transition-opacity ${
                activeHref(lang, "/contacto") ? "hover:opacity-90" : "opacity-50 cursor-default"
              }`}
            >
              {t("card3_cta")}
            </AppLink>
          </div>

        </div>
      </div>
    </section>
  );
}
