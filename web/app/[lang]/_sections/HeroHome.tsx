import Link from "next/link";
import { useTranslations } from "next-intl";
import { Scale, ShoppingCart } from "lucide-react";

interface HeroHomeProps {
  lang: string;
}

/* Sección hero de la página principal
   Desktop: badge + H1 con gradiente + subtítulo + 2 botones CTA, centrado sobre fondo degradado
   Móvil: misma jerarquía pero apilada en columna, botón único a ancho completo */
export default function HeroHome({ lang }: HeroHomeProps) {
  const t = useTranslations("hero");

  return (
    <section
      aria-label="Introducción"
      className="relative w-full overflow-hidden bg-[#F8FAFC]"
      style={{
        /* Gradiente diagonal suave de azul claro a blanco — fiel al diseño */
        background:
          "linear-gradient(225deg, rgba(200,221,240,0.6) 0%, #F8FAFC 45%)",
      }}
    >
      {/* Contenido centrado — desktop: altura fija, móvil: padding vertical */}
      <div className="flex flex-col items-center justify-center min-h-[529px] px-5 py-16 md:py-0 max-w-[1440px] mx-auto">

        {/* Bloque de contenido — ancho máximo del diseño */}
        <div className="flex flex-col items-center gap-5 w-full max-w-[760px] text-center">

          {/* Badge "CONSULTORÍA DUAL" */}
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-[8px] bg-[#EFF6FF] border border-[#BFDBFE]">
            <span className="font-title font-bold text-[11px] text-primary tracking-[2px]">
              {t("badge")}
            </span>
          </div>

          {/* H1 — dos líneas, la segunda con gradiente azul→verde */}
          <h1 className="font-title font-bold text-[clamp(36px,5vw,56px)] text-[#111827] leading-tight">
            {t("h1_line1")}
            <br />
            {/* Texto con gradiente — técnica bg-clip-text */}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(270deg, #27AE60 0%, #005697 100%)",
              }}
            >
              {t("h1_line2")}
            </span>
          </h1>

          {/* Subtítulo descriptivo */}
          <p className="font-body text-[18px] md:text-[18px] text-[14px] text-[#64748B] leading-relaxed max-w-[640px]">
            {t("subtitle")}
          </p>

          {/* Botones CTA — lado a lado en desktop, apilados en móvil */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">

            {/* Botón principal — Servicios Legales (azul) */}
            <Link
              href={`/${lang}/servicios/legal`}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-primary text-white font-title font-bold text-[15px] rounded-[8px] hover:opacity-90 transition-opacity"
            >
              <Scale size={18} aria-hidden="true" />
              {t("btn_legal")}
            </Link>

            {/* Botón secundario — E-commerce Global (verde) */}
            <Link
              href={`/${lang}/servicios/ecommerce`}
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-commerce-green text-white font-title font-bold text-[15px] rounded-[8px] hover:opacity-90 transition-opacity"
            >
              <ShoppingCart size={18} aria-hidden="true" />
              {t("btn_ecom")}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
