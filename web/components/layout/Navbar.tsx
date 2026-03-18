import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LangSwitcher from "./LangSwitcher";
import MobileMenu from "./MobileMenu";

interface NavbarProps {
  lang: string;
}

/* Navbar principal — server component
   Desktop: logo + links centrados + lang toggle + CTA
   Móvil: logo + hamburguesa (MobileMenu) */
export default function Navbar({ lang }: NavbarProps) {
  const t = useTranslations("nav");

  /* Lista de enlaces de navegación */
  const navItems = [
    { label: t("home"),      href: `/${lang}` },
    { label: t("about"),     href: `/${lang}/nosotros` },
    { label: t("services"),  href: `/${lang}/servicios` },
    { label: t("ecommerce"), href: `/${lang}/ecommerce` },
    { label: t("blog"),      href: `/${lang}/blog` },
    { label: t("contact"),   href: `/${lang}/contacto` },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-border">
      <div className="flex items-center justify-between h-20 px-5 md:px-20 max-w-[1440px] mx-auto">

        {/* Logo + nombre de marca */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 shrink-0"
          aria-label="Deep Brain Markets — Ir al inicio"
        >
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src="/images/logo.png"
              alt="Logo Deep Brain Markets"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-title font-bold text-[18px] text-primary leading-none hidden sm:block">
            DEEP BRAIN MARKETS
          </span>
        </Link>

        {/* Navegación desktop — oculta en móvil */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[15px] text-text-body font-normal hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acciones del lado derecho — desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <LangSwitcher />
          <Link
            href={`/${lang}/contacto`}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-title font-semibold text-sm rounded-[8px] hover:opacity-90 transition-opacity"
          >
            {t("cta")}
          </Link>
        </div>

        {/* Menú hamburguesa — solo visible en móvil */}
        <div className="flex lg:hidden items-center gap-3">
          <LangSwitcher />
          <MobileMenu items={navItems} cta={t("cta")} lang={lang} />
        </div>
      </div>
    </header>
  );
}
