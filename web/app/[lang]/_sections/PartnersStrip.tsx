import { useTranslations } from "next-intl";

/* Franja de aliados estratégicos — placeholders hasta tener logos reales
   Desktop: label centrado + 4 cajas alineadas horizontalmente con gap 32
   Móvil:   label centrado + 4 cajas de ancho igual con gap 16 */
export default function PartnersStrip() {
  const t = useTranslations("partners");

  /* Array de 4 placeholders — cuando haya logos reales se reemplaza con <Image> */
  const partners = [1, 2, 3, 4];

  return (
    <section aria-label={t("label")} className="w-full bg-[#F1F5F9]">
      <div className="px-5 md:px-20 py-12 max-w-[1440px] mx-auto flex flex-col items-center gap-4 md:gap-6">

        {/* Etiqueta superior */}
        <p className="font-title font-semibold text-[11px] text-[#9CA3AF] tracking-[3px] text-center uppercase">
          {t("label")}
        </p>

        {/* Fila de logos / placeholders */}
        <div className="flex items-center justify-center gap-4 md:gap-8 w-full">
          {partners.map((i) => (
            <div
              key={i}
              className="flex-1 md:flex-none md:w-24 h-8 bg-[#D1D5DB] rounded-[6px] opacity-50"
              aria-hidden="true"
            />
          ))}
        </div>

      </div>
    </section>
  );
}
