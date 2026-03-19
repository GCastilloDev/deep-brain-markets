import Link from "next/link";

interface AppLinkProps {
  href?: string;
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

/* Componente de enlace inteligente:
   - Si tiene href → renderiza <Link> navegable
   - Si no tiene href → renderiza <span> no clickeable (ruta aún no construida) */
export default function AppLink({ href, children, className, "aria-label": ariaLabel }: AppLinkProps) {
  if (href) {
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  /* Sin href — visualmente igual pero sin navegación */
  return (
    <span className={className} aria-label={ariaLabel}>
      {children}
    </span>
  );
}
