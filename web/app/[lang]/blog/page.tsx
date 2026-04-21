import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Calendar, Clock, Tag, ArrowRight, BookOpen } from "lucide-react";
import { getAllPosts } from "@/lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "blog" });

  return {
    title: `${t("title")} — Deep Brain Markets`,
    description:
      lang === "es"
        ? "Artículos y guías sobre comercio exterior, importaciones, e-commerce y legalidad empresarial en México."
        : "Articles and guides on foreign trade, imports, e-commerce and business law in Mexico.",
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  setRequestLocale(lang);

  const t = await getTranslations({ locale: lang, namespace: "blog" });
  const posts = getAllPosts(lang);

  const [featured, ...rest] = posts;

  return (
    <div className="w-full bg-bg min-h-screen">
      {/* ── Hero del blog ─────────────────────────────────────── */}
      <section
        className="w-full pt-10 pb-8 md:pt-14 md:pb-10 px-5 md:px-20"
        style={{
          background:
            "linear-gradient(135deg, #EBF2FA 0%, #F5F7FA 60%, #ffffff 100%)",
        }}
      >
      <div className="max-w-[1280px] mx-auto w-full">
          {/* Chip */}
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary font-title font-bold text-[12px] rounded-full uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            {t("title")}
          </span>

          <h1 className="mt-4 font-title font-bold text-[28px] md:text-[48px] text-text-primary leading-tight">
            {lang === "es"
              ? "Conocimiento al servicio de tu negocio"
              : "Knowledge at the service of your business"}
          </h1>

          <p className="mt-3 font-body text-[15px] md:text-[17px] text-text-secondary leading-relaxed max-w-[580px]">
            {lang === "es"
              ? "Guías prácticas sobre comercio exterior, importaciones, e-commerce y más."
              : "Practical guides on foreign trade, imports, e-commerce and more."}
          </p>

          {/* Separador gradiente */}
          <div
            className="mt-5 h-1 w-20 rounded-full"
            style={{
              background: "linear-gradient(90deg, #1B4B8F 0%, #27AE60 100%)",
            }}
          />
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-5 md:px-20 py-6 md:py-10">
        {posts.length === 0 ? (
          /* ── Estado vacío ──────────────────────────────────── */
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-bg-soft-blue">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-title font-bold text-[20px] text-text-primary">
              {lang === "es" ? "Próximamente" : "Coming soon"}
            </h2>
            <p className="font-body text-[14px] text-text-secondary max-w-[280px]">
              {lang === "es"
                ? "Estamos preparando contenido de valor. Vuelve pronto."
                : "We're preparing valuable content. Check back soon."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10 md:gap-14">
            {/* ── Post destacado ────────────────────────────── */}
            {featured && (
              <Link
                href={`/${lang}/blog/${featured.slug}`}
                className="group block"
              >
                <article className="relative grid md:grid-cols-[1fr_auto] gap-6 md:gap-10 p-6 md:p-8 bg-white rounded-[16px] border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  {/* Badge featured */}
                  <span className="absolute top-4 right-4 md:hidden inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white font-title font-bold text-[10px] rounded-full uppercase tracking-wider">
                    {lang === "es" ? "Destacado" : "Featured"}
                  </span>

                  <div className="flex flex-col gap-4 min-w-0">
                    {/* Tags */}
                    {featured.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {featured.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-soft-blue text-primary font-title font-semibold text-[11px] rounded-full"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h2 className="font-title font-bold text-[20px] md:text-[28px] text-text-primary leading-tight group-hover:text-primary transition-colors">
                      {featured.title}
                    </h2>

                    <p className="font-body text-[14px] md:text-[15px] text-text-secondary leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                      <span className="inline-flex items-center gap-1.5 text-[12px]">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(featured.date).toLocaleDateString(
                          lang === "es" ? "es-MX" : "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[12px]">
                        <Clock className="w-3.5 h-3.5" />
                        {featured.readingTime}
                      </span>
                    </div>

                    {/* CTA */}
                    <span className="inline-flex items-center gap-1.5 font-title font-bold text-[13px] text-primary group-hover:gap-2.5 transition-all">
                      {t("readMore")}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Decoración lateral en desktop */}
                  <div className="hidden md:flex flex-col items-center justify-center px-8 border-l border-border-soft gap-3 min-w-[140px]">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white font-title font-bold text-[10px] rounded-full uppercase tracking-wider whitespace-nowrap">
                      {lang === "es" ? "Destacado" : "Featured"}
                    </span>
                    <div
                      className="w-12 h-12 rounded-[12px] flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1B4B8F, #27AE60)" }}
                    >
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-body text-[11px] text-text-secondary text-center">
                      {featured.author}
                    </p>
                  </div>
                </article>
              </Link>
            )}

            {/* ── Grid del resto de posts ───────────────────── */}
            {rest.length > 0 && (
              <div>
                <h2 className="font-title font-bold text-[16px] md:text-[18px] text-text-secondary uppercase tracking-wider mb-5">
                  {lang === "es" ? "Más artículos" : "More articles"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/${lang}/blog/${post.slug}`}
                      className="group block"
                    >
                      <article className="h-full flex flex-col gap-3 p-5 bg-white rounded-[14px] border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200">
                        {/* Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-bg-soft-blue text-primary font-title font-semibold text-[10px] rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="font-title font-bold text-[15px] md:text-[16px] text-text-primary leading-snug group-hover:text-primary transition-colors flex-1">
                          {post.title}
                        </h3>

                        <p className="font-body text-[13px] text-text-secondary leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Meta + CTA */}
                        <div className="flex items-center justify-between pt-2 border-t border-border-soft mt-auto">
                          <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
                            <Clock className="w-3 h-3" />
                            {post.readingTime}
                          </span>
                          <span className="inline-flex items-center gap-1 font-title font-bold text-[12px] text-primary group-hover:gap-1.5 transition-all">
                            {t("readMore")}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
