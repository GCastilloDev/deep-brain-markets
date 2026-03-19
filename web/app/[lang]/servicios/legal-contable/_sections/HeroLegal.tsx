import Link from "next/link";
import { useTranslations } from "next-intl";

interface HeroLegalProps {
  lang: string;
}

/* Hero de la página Legal y Contable
   Desktop: badge + H1 (700px) + subtítulo (600px), fondo #EDF4FC con forma decorativa
   Móvil:   badge + H1 + subtítulo + botón CTA full-width */
export default function HeroLegal({ lang }: HeroLegalProps) {
  const t = useTranslations("legal_page");
  const tNav = useTranslations("nav");

  return (
    <section aria-labelledby="hero-legal-heading" className="relative w-full bg-[#EDF4FC] overflow-hidden">

      {/* Forma decorativa — visible solo en desktop, aproxima el blob del diseño */}
      <div
        className="hidden md:block absolute right-0 top-0 w-[55%] h-full opacity-50 pointer-events-none"
        aria-hidden="true"
        style={{
          background: "#BFD4EC",
          clipPath: "ellipse(70% 80% at 80% 50%)",
        }}
      />

      {/* Contenido del hero */}
      <div className="relative px-5 md:px-20 py-10 md:py-0 md:min-h-[500px] max-w-[1440px] mx-auto flex flex-col justify-center gap-5 md:gap-7">

        {/* Badge */}
        <div className="inline-flex self-start">
          <span className="font-title font-bold text-[10px] md:text-[11px] text-[#1B4B8F] bg-[#DBEAFE] border border-[#BFDBFE] rounded-[8px] px-3 md:px-4 py-1.5 tracking-wider">
            {t("badge")}
          </span>
        </div>

        {/* H1 — ancho limitado en desktop para legibilidad */}
        <h1
          id="hero-legal-heading"
          className="font-title font-bold text-[24px] md:text-[48px] text-[#133463] leading-tight md:max-w-[700px]"
        >
          {t("h1")}
        </h1>

        {/* Subtítulo */}
        <p className="font-body text-[13px] md:text-[18px] text-[#5A7499] leading-relaxed md:max-w-[600px]">
          {t("subtitle")}
        </p>

        {/* Botón CTA — solo visible en móvil */}
        <Link
          href={`/${lang}/contacto`}
          className="sm:hidden flex items-center justify-center w-full py-3.5 bg-[#1B4B8F] text-white font-title font-semibold text-[15px] rounded-[8px] hover:opacity-90 transition-opacity"
        >
          {tNav("cta")}
        </Link>

      </div>
    </section>
  );
}
