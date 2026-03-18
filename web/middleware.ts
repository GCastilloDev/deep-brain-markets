import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Las rutas de API no necesitan i18n
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Si el usuario entra a la raíz "/" detectamos su idioma por geolocalización
  // Vercel agrega automáticamente el header x-vercel-ip-country en producción
  if (pathname === "/") {
    const country = request.headers.get("x-vercel-ip-country") ?? "MX";

    // Si está fuera de México y países hispanohablantes, redirige a inglés
    const spanishCountries = [
      "MX", "ES", "AR", "CO", "CL", "PE", "VE", "EC",
      "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI",
      "CR", "PA", "UY", "GQ",
    ];

    const locale = spanishCountries.includes(country) ? "es" : "en";
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Para el resto de rutas, next-intl maneja el routing de idiomas
  return intlMiddleware(request);
}

export const config = {
  // Aplica el middleware a todas las rutas excepto archivos estáticos
  matcher: ["/((?!_next|.*\\..*).*)"],
};
