"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  items: NavItem[];
  cta: string;
  lang: string;
}

/* Componente cliente — menú hamburguesa para navegación móvil */
export default function MobileMenu({ items, cta, lang }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  /* Cierra el menú al cambiar de ruta */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* Bloquea el scroll del body cuando el menú está abierto */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Botón hamburguesa — visible solo en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        className="flex flex-col justify-center gap-[5px] p-2 min-w-[44px] min-h-[44px]"
      >
        {/* Las tres líneas del ícono hamburguesa, animadas al abrir */}
        <span className={`block h-0.5 w-6 bg-legal-dark transition-transform duration-200 ${isOpen ? "translate-y-[7px] rotate-45" : ""}`} />
        <span className={`block h-0.5 w-6 bg-legal-dark transition-opacity duration-200 ${isOpen ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-6 bg-legal-dark transition-transform duration-200 ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
      </button>

      {/* Overlay oscuro detrás del menú */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Panel del menú móvil */}
      <nav
        id="mobile-menu"
        aria-label="Menú móvil"
        className={`fixed top-[60px] left-0 right-0 bg-white z-50 border-b border-border shadow-lg transition-transform duration-300 ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        <ul className="flex flex-col p-5 gap-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block py-3 px-2 text-base font-medium border-b border-border-soft transition-colors ${
                    isActive ? "text-primary font-semibold" : "text-text-body hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Botón CTA dentro del menú móvil */}
        <div className="p-5 pt-2">
          <Link
            href={`/${lang}/contacto`}
            className="flex items-center justify-center w-full h-12 bg-primary text-white font-semibold text-base rounded-[8px] transition-opacity hover:opacity-90"
          >
            {cta}
          </Link>
        </div>
      </nav>
    </>
  );
}
