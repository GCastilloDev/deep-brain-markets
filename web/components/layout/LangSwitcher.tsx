"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

/* Componente cliente — toggle de idioma ES / EN en el navbar */
export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  /* Cambia el idioma reemplazando el prefijo de idioma en la URL actual */
  const toggleLang = () => {
    const nextLocale = locale === "es" ? "en" : "es";
    /* Reemplaza /es/... o /en/... por el nuevo idioma */
    const newPath = pathname.replace(`/${locale}`, `/${nextLocale}`);
    router.push(newPath);
  };

  return (
    <button
      onClick={toggleLang}
      aria-label={`Cambiar idioma a ${locale === "es" ? "inglés" : "español"}`}
      className="flex items-center gap-1 text-sm font-semibold text-text-primary hover:text-primary transition-colors cursor-pointer"
    >
      {/* Idioma inactivo — opacidad aumentada para contraste */}
      <span className={locale === "es" ? "opacity-100" : "opacity-70"}>ES</span>
      <span className="opacity-60">/</span>
      <span className={locale === "en" ? "opacity-100" : "opacity-70"}>EN</span>
    </button>
  );
}
