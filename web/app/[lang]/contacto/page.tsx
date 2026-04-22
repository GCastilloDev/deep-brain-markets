import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ContactForm from "@/components/layout/ContactForm";

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "contact" });

  return {
    title: `${t("title")} | Deep Brain Markets`,
    description: t("subtitle"),
    alternates: {
      canonical: `/${lang}/contacto`,
      languages: {
        es: "/es/contacto",
        en: "/en/contacto",
      },
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);

  return (
    <main className="w-full min-h-screen bg-bg-neutral/30">
      {/* Hero / Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-bg-soft-blue/40 to-transparent pointer-events-none" />

      <div className="relative px-5 py-16 md:py-24 max-w-[850px] mx-auto">
        <ContactForm lang={lang} />

        {/* Footer Info / Trust Badges if needed later */}
        <div className="mt-12 text-center">
          <p className="font-body text-[13px] text-text-secondary opacity-60">
            © {new Date().getFullYear()} Deep Brain Markets. 
            All requests are processed securely and handled by our expert team.
          </p>
        </div>
      </div>
    </main>
  );
}
