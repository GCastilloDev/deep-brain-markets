import { useTranslations } from "next-intl";
import { Scale, Globe, Landmark, Building2, FileText, Truck, Store, TrendingUp } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { activeHref } from "@/lib/routes";

interface ExpertiseSectionProps {
  lang: string;
}

/* Sección de áreas de expertise de la página principal
   Desktop: título centrado + divisor gradiente + 2 cards lado a lado
   Móvil: título izquierda + 2 cards apiladas */
export default function ExpertiseSection({ lang }: ExpertiseSectionProps) {
  const t = useTranslations("expertise");

  /* Servicios de la card Legal */
  const legalServices = [
    { icon: <Landmark size={20} aria-hidden="true" />, title: t("card1_svc1_title"), desc: t("card1_svc1_desc") },
    { icon: <Building2 size={20} aria-hidden="true" />, title: t("card1_svc2_title"), desc: t("card1_svc2_desc") },
    { icon: <FileText size={20} aria-hidden="true" />, title: t("card1_svc3_title"), desc: t("card1_svc3_desc") },
  ];

  /* Servicios de la card Comercio/Ecommerce */
  const ecomServices = [
    { icon: <Truck size={20} aria-hidden="true" />, title: t("card2_svc1_title"), desc: t("card2_svc1_desc") },
    { icon: <Store size={20} aria-hidden="true" />, title: t("card2_svc2_title"), desc: t("card2_svc2_desc") },
    { icon: <TrendingUp size={20} aria-hidden="true" />, title: t("card2_svc3_title"), desc: t("card2_svc3_desc") },
  ];

  return (
    <section aria-labelledby="expertise-heading" className="w-full bg-white">
      <div className="px-5 py-10 md:p-20 max-w-[1440px] mx-auto flex flex-col gap-10 md:gap-12">

        {/* Encabezado de sección */}
        <div className="flex flex-col items-start md:items-center gap-3">
          <h2
            id="expertise-heading"
            className="font-title font-bold text-[22px] md:text-[32px] text-legal-dark md:text-[#111827]"
          >
            {t("title")}
          </h2>
          {/* Divisor gradiente — solo visible en desktop */}
          <div
            className="hidden md:block h-1 w-16 rounded-full"
            style={{ background: "linear-gradient(90deg, #005697 0%, #27AE60 100%)" }}
            aria-hidden="true"
          />
        </div>

        {/* Fila de cards — apiladas en móvil, lado a lado en desktop */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">

          {/* ── Card 1: Legal y Contable ── */}
          <div className="flex-1 flex flex-col gap-4 md:gap-5 bg-[#F8FAFC] rounded-[8px] p-5 md:p-8 border-t-4 border-[#005697]">

            {/* Ícono — alineado a la derecha */}
            <div className="flex justify-end">
              <div className="flex items-center justify-center w-12 h-12 bg-[#005697] rounded-[8px] text-white shrink-0">
                <Scale size={24} aria-hidden="true" />
              </div>
            </div>

            {/* Título y descripción */}
            <div className="flex flex-col gap-2">
              <h3 className="font-title font-bold text-[18px] md:text-[22px] text-[#111827]">
                {t("card1_title")}
              </h3>
              <p className="font-body text-[13px] md:text-[15px] text-[#64748B] leading-relaxed">
                {t("card1_desc")}
              </p>
            </div>

            {/* Lista de servicios */}
            <ul className="flex flex-col gap-3 md:gap-4">
              {legalServices.map((svc) => (
                <li key={svc.title} className="flex items-start gap-3">
                  <span className="text-[#005697] mt-0.5 shrink-0">{svc.icon}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-title font-bold text-[14px] md:text-[15px] text-[#1F2937]">
                      {svc.title}
                    </span>
                    <span className="font-body text-[12px] md:text-[13px] text-[#6B7280]">
                      {svc.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Enlace "Ver todos" — separado por borde superior */}
            <div className="pt-5 border-t border-border mt-auto">
              <AppLink
                href={activeHref(lang, "/servicios/legal-contable")}
                className={`font-title font-bold text-[13px] text-[#005697] transition-opacity ${
                  activeHref(lang, "/servicios/legal-contable") ? "hover:opacity-70" : "opacity-50 cursor-default"
                }`}
              >
                {t("card1_link")}
              </AppLink>
            </div>
          </div>

          {/* ── Card 2: Comercio Exterior y Ecommerce ── */}
          <div className="flex-1 flex flex-col gap-4 md:gap-5 bg-[#F8FAFC] rounded-[8px] p-5 md:p-8 border-t-4 border-commerce-green">

            {/* Ícono — alineado a la derecha */}
            <div className="flex justify-end">
              <div className="flex items-center justify-center w-12 h-12 bg-commerce-green rounded-[8px] text-white shrink-0">
                <Globe size={24} aria-hidden="true" />
              </div>
            </div>

            {/* Título y descripción */}
            <div className="flex flex-col gap-2">
              <h3 className="font-title font-bold text-[18px] md:text-[22px] text-[#111827]">
                {t("card2_title")}
              </h3>
              <p className="font-body text-[13px] md:text-[15px] text-[#64748B] leading-relaxed">
                {t("card2_desc")}
              </p>
            </div>

            {/* Lista de servicios */}
            <ul className="flex flex-col gap-3 md:gap-4">
              {ecomServices.map((svc) => (
                <li key={svc.title} className="flex items-start gap-3">
                  <span className="text-commerce-green mt-0.5 shrink-0">{svc.icon}</span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-title font-bold text-[14px] md:text-[15px] text-[#1F2937]">
                      {svc.title}
                    </span>
                    <span className="font-body text-[12px] md:text-[13px] text-[#6B7280]">
                      {svc.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Enlace "Ver servicios" — separado por borde superior */}
            <div className="pt-5 border-t border-border mt-auto">
              <AppLink
                href={activeHref(lang, "/servicios/ecommerce")}
                className={`font-title font-bold text-[13px] text-commerce-green transition-opacity ${
                  activeHref(lang, "/servicios/ecommerce") ? "hover:opacity-70" : "opacity-50 cursor-default"
                }`}
              >
                {t("card2_link")}
              </AppLink>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
