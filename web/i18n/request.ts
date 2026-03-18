import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

// Se ejecuta en cada request del servidor para cargar las traducciones del idioma activo
export default getRequestConfig(async ({ requestLocale }) => {
  // Obtiene el idioma de la URL (ej: /es/... → 'es', /en/... → 'en')
  let locale = await requestLocale;

  // Si el idioma no es válido o no viene en la URL, usa el idioma por defecto
  if (!locale || !routing.locales.includes(locale as "es" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Carga el archivo de traducciones correspondiente (messages/es.json o messages/en.json)
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
