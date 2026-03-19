import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface FooterProps {
  lang: string;
}

/* Footer del sitio — server component
   Móvil:   logo+nombre | tagline | 2 columnas (Servicios + Empresa) | copyright
   Desktop: 4 columnas (logo+tagline, servicios, empresa, legal) */
export default function Footer({ lang }: FooterProps) {
  const t = useTranslations("footer");

  /* Columnas visibles en móvil y desktop */
  const mainColumns = [
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
        { label: t("blog"),    href: `/${lang}/blog` },
        { label: t("contact"), href: `/${lang}/contacto` },
      ],
    },
  ];

  /* Columna legal — solo visible en desktop */
  const legalLinks = [
    { label: t("privacy"), href: `/${lang}/privacidad` },
    { label: t("terms"),   href: `/${lang}/terminos` },
  ];

  return (
    <footer className="w-full bg-white border-t border-border">
      <div className="px-5 md:px-20 py-8 md:py-12 max-w-[1440px] mx-auto">

        {/* ── Layout móvil: vertical apilado ── */}
        <div className="flex flex-col gap-6 md:hidden">

          {/* Logo + nombre completo */}
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
              DEEP BRAIN MARKETS
            </span>
          </Link>

          {/* Tagline */}
          <p className="text-sm text-text-secondary leading-relaxed">
            {t("tagline")}
          </p>

          {/* 2 columnas de links lado a lado */}
          <div className="grid grid-cols-2 gap-8">
            {mainColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <h3 className="font-title font-bold text-[13px] text-text-primary">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[13px] text-text-secondary hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Layout desktop: 4 columnas en fila ── */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">

          {/* Columna 1 — Logo abreviado + tagline */}
          <div className="flex flex-col gap-3">
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

          {/* Columnas Servicios y Empresa */}
          {mainColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="font-title font-bold text-sm text-text-primary">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-text-secondary hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Columna Legal — solo desktop */}
          <div className="flex flex-col gap-3">
            <h3 className="font-title font-bold text-sm text-text-primary">
              {t("legal_col")}
            </h3>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-secondary hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Barra inferior — copyright */}
      <div className="border-t border-border px-5 md:px-20 py-5">
        <p className="text-center text-[11px] text-placeholder">
          © {new Date().getFullYear()} Deep Brain Markets. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
