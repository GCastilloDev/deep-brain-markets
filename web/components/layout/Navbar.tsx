import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { activeHref } from "@/lib/routes";
import { whatsappHref } from "@/lib/whatsapp";
import AppLink from "@/components/ui/AppLink";
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

  /* Lista de enlaces — href undefined si la ruta aún no está construida */
  const navItems = [
    { label: t("home"),      href: activeHref(lang, "/") },
    { label: t("about"),     href: activeHref(lang, "/nosotros") },
    { label: t("services"),  href: activeHref(lang, "/servicios") },
    { label: t("ecommerce"), href: activeHref(lang, "/ecommerce") },
    { label: t("blog"),      href: activeHref(lang, "/blog") },
    { label: t("contact"),   href: activeHref(lang, "/contacto") },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-border">
      <div className="flex items-center justify-between h-20 px-5 md:px-20 max-w-[1440px] mx-auto">

        {/* Logo + nombre de marca — siempre apunta al inicio */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-3 shrink-0"
          aria-label="Deep Brain Markets — Ir al inicio"
        >
          <div className="relative w-9 h-9 shrink-0">
            <Image
              src="/images/deep-brain-markets-logo.png"
              alt="Logo Deep Brain Markets"
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* Nombre completo — 12px en móvil, 18px en desktop */}
          <span className="font-title font-bold text-[12px] sm:text-[18px] text-primary leading-none">
            DEEP BRAIN MARKETS
          </span>
        </Link>

        {/* Navegación desktop — oculta en móvil */}
        <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <AppLink
                  href={item.href}
                  className={`text-[15px] font-normal transition-colors ${
                    item.href
                      ? "text-text-body hover:text-primary cursor-pointer"
                      : "text-text-body opacity-70 cursor-default"
                  }`}
                >
                  {item.label}
                </AppLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Acciones del lado derecho — desktop */}
        <div className="hidden lg:flex items-center gap-4">
          <LangSwitcher />
          <a
            href={whatsappHref(t("cta_msg"))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-white font-title font-semibold text-sm rounded-[8px] hover:opacity-90 transition-opacity"
          >
            {t("cta")}
          </a>
        </div>

        {/* Menú hamburguesa — solo visible en móvil */}
        <div className="flex lg:hidden items-center gap-3">
          <LangSwitcher />
          <MobileMenu items={navItems} cta={t("cta")} ctaHref={whatsappHref(t("cta_msg"))} lang={lang} />
        </div>
      </div>
    </header>
  );
}
