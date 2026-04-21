/* Rutas activas del sitio — agregar una ruta aquí cuando la página esté construida
   Las rutas no listadas se renderizan como texto sin enlace (no dan 404) */

export const ACTIVE_ROUTES = new Set([
  "/",                                                   /* Página principal */
  "/blog",                                               /* Blog                         */
  "/servicios/legal-contable",                           /* Área Legal y Contable */
  "/servicios/legal-contable/aduanas-comercio-exterior", /* Aduanas y Comercio Exterior */
  "/servicios/legal-contable/derecho-mercantil",         /* Derecho Mercantil y Corporativo */
]);

/* Retorna el href solo si la ruta está activa, undefined en caso contrario */
export function activeHref(lang: string, path: string): string | undefined {
  const fullPath = path === "/" ? `/${lang}` : `/${lang}${path}`;
  /* Comprueba si la ruta raíz o la ruta con idioma está activa */
  const isActive = ACTIVE_ROUTES.has(path) || ACTIVE_ROUTES.has(fullPath);
  return isActive ? fullPath : undefined;
}
