import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Conecta next-intl con Next.js usando nuestra config de i18n
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    // Compilador de MDX en Rust — más rápido para procesar los posts del blog
    mdxRs: true,
  },
};

export default withNextIntl(nextConfig);
