import { useTranslations } from "next-intl";
import { Scale, ShoppingCart } from "lucide-react";
import AppLink from "@/components/ui/AppLink";
import { activeHref } from "@/lib/routes";

interface HeroHomeProps {
  lang: string;
}

/* Sección hero de la página principal
   Desktop: badge + H1 con gradiente + subtítulo + 2 botones lado a lado (ícono + texto)
   Móvil: badge + H1 gradiente + subtítulo + botón "Agendar Cita" full-width
          + fila secundaria de 2 botones con ícono arriba y texto abajo */
export default function HeroHome({ lang }: HeroHomeProps) {
  const t = useTranslations("hero");
  const tNav = useTranslations("nav");

  /* Hrefs — undefined si la ruta aún no está construida */
  const legalHref    = activeHref(lang, "/servicios/legal-contable");
  const ecomHref     = activeHref(lang, "/servicios/ecommerce");
  const contactoHref = activeHref(lang, "/contacto");

  return (
    <section
      aria-label="Introducción"
      className="relative w-full overflow-hidden"
      style={{
        /* Desktop: gradiente diagonal suave azul→blanco
           Móvil: fondo azul muy claro (#EDF4FC) según el diseño */
        background: "linear-gradient(225deg, rgba(200,221,240,0.6) 0%, #F8FAFC 45%)",
      }}
    >
      {/* Fondo móvil — sobreescribe el gradiente en pantallas pequeñas */}
      <div className="absolute inset-0 bg-[#EDF4FC] sm:hidden" aria-hidden="true" />

      {/* Contenido — centrado vertical y horizontal */}
      <div className="relative flex flex-col items-center justify-center min-h-[529px] px-5 py-12 sm:py-0 max-w-[1440px] mx-auto">

        <div className="flex flex-col items-center gap-5 w-full max-w-[760px] text-center">

          {/* Badge — fondo #DBEAFE en móvil, #EFF6FF en desktop */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-[8px] bg-[#DBEAFE] sm:bg-[#EFF6FF] border border-[#BFDBFE]">
            <span className="font-title font-bold text-[11px] text-[#005697] tracking-[2px]">
              {t("badge")}
            </span>
          </div>

          {/* H1 — primera línea sólida, segunda con gradiente azul→verde */}
          <h1 className="font-title font-bold text-[clamp(30px,5vw,56px)] text-[#111827] leading-tight">
            {t("h1_line1")}
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(270deg, #27AE60 0%, #005697 100%)" }}
            >
              {t("h1_line2")}
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="font-body text-[14px] sm:text-[18px] text-[#64748B] leading-relaxed max-w-[640px]">
            {t("subtitle")}
          </p>

          {/* ── CTA Desktop — dos botones lado a lado (ícono + texto horizontal) ── */}
          <div className="hidden sm:flex items-center gap-4">
            <AppLink
              href={legalHref}
              className={`flex items-center justify-center gap-2 px-7 py-3.5 bg-[#005697] text-white font-title font-bold text-[15px] rounded-[8px] transition-opacity ${legalHref ? "hover:opacity-90" : "opacity-50 cursor-default"}`}
            >
              <Scale size={18} aria-hidden="true" />
              {t("btn_legal")}
            </AppLink>
            <AppLink
              href={ecomHref}
              className={`flex items-center justify-center gap-2 px-7 py-3.5 bg-commerce-green text-white font-title font-bold text-[15px] rounded-[8px] transition-opacity ${ecomHref ? "hover:opacity-90" : "opacity-50 cursor-default"}`}
            >
              <ShoppingCart size={18} aria-hidden="true" />
              {t("btn_ecom")}
            </AppLink>
          </div>

          {/* ── CTA Móvil — botón principal + fila de 2 botones secundarios ── */}
          <div className="flex sm:hidden flex-col items-center gap-3 w-full">

            {/* Botón principal "Agendar Cita" — ancho completo */}
            <AppLink
              href={contactoHref}
              className={`flex items-center justify-center w-full py-3.5 px-7 bg-primary text-white font-title font-bold text-[15px] rounded-[8px] transition-opacity ${contactoHref ? "hover:opacity-90" : "opacity-50 cursor-default"}`}
            >
              {tNav("cta")}
            </AppLink>

            {/* Botones secundarios — ícono arriba, texto abajo, lado a lado */}
            <div className="flex gap-2 w-full">
              <AppLink
                href={legalHref}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 px-3 bg-[#005697] text-white font-title font-bold text-[13px] rounded-[6px] transition-opacity ${legalHref ? "hover:opacity-90" : "opacity-50 cursor-default"}`}
              >
                <Scale size={18} aria-hidden="true" />
                {t("btn_legal")}
              </AppLink>
              <AppLink
                href={ecomHref}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 px-3 bg-commerce-green text-white font-title font-bold text-[13px] rounded-[6px] transition-opacity ${ecomHref ? "hover:opacity-90" : "opacity-50 cursor-default"}`}
              >
                <ShoppingCart size={18} aria-hidden="true" />
                {t("btn_ecom")}
              </AppLink>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
