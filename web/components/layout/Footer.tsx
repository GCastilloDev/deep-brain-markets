import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface FooterProps {
  lang: string;
}

/* Footer del sitio — server component
   Desktop: 4 columnas (logo+tagline, servicios, empresa, legal)
   Móvil: columna única con grid 2x2 para los links */
export default function Footer({ lang }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  /* Columnas de enlaces del footer */
  const columns = [
    {
      title: t("services"),
      links: [
        { label: t("legal_svc"),      href: `/${lang}/servicios/legal` },
        { label: t("accounting_svc"), href: `/${lang}/servicios/contabilidad` },
        { label: t("ecommerce_svc"),  href: `/${lang}/servicios/ecommerce` },
      ],
    },
    {
      title: t("company"),
      links: [
        { label: t("about"),   href: `/${lang}/nosotros` },
        { label: t("careers"), href: `/${lang}/carreras` },
        { label: t("blog"),    href: `/${lang}/blog` },
        { label: t("contact"), href: `/${lang}/contacto` },
      ],
    },
    {
      title: t("legal_col"),
      links: [
        { label: t("privacy"), href: `/${lang}/privacidad` },
        { label: t("terms"),   href: `/${lang}/terminos` },
      ],
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-border">

      {/* Contenido principal del footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:px-20 py-12 max-w-[1440px] mx-auto">

        {/* Columna 1 — Logo y tagline */}
        <div className="flex flex-col gap-3 md:col-span-1">
          <Link
            href={`/${lang}`}
            className="flex items-center gap-2"
            aria-label="Deep Brain Markets — Inicio"
          >
            <div className="relative w-7 h-7 shrink-0">
              <Image
                src="/images/deep-brain-markets-logo.png"
                alt="Logo Deep Brain Markets"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-title font-bold text-[13px] text-primary">
              DEEP BRAIN
            </span>
          </Link>
          <p className="text-sm text-text-secondary leading-relaxed">
            {t("tagline")}
          </p>
        </div>

        {/* Columnas 2, 3 y 4 — Links de navegación */}
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="font-title font-bold text-sm text-text-primary">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Barra inferior — copyright */}
      <div className="border-t border-border px-5 md:px-20 py-5">
        <p className="text-center text-label text-placeholder">
          © {new Date().getFullYear()} Deep Brain Markets. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
