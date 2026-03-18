import { defineRouting } from "next-intl/routing";

// Define los idiomas disponibles y el idioma por defecto del sitio
export const routing = defineRouting({
  locales: ["es", "en"],

  // Español es el idioma por defecto (usuarios en México)
  defaultLocale: "es",

  // Siempre incluye el prefijo de idioma en la URL (/es/..., /en/...)
  localePrefix: "always",
});
