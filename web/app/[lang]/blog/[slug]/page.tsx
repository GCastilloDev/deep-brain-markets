import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import { getPost, getAllSlugs } from "@/lib/blog";
import { supabase } from "@/lib/supabase";
import CommentSection from "@/components/blog/CommentSection";
import type { Comment } from "@/lib/types/comments";

/* ─── La página queda estática hasta que se llame revalidatePath ───────── */
export const revalidate = false;

/* Genera las rutas estáticas para cada post en cada idioma */
export function generateStaticParams() {
  const esSlugs = getAllSlugs("es").map((slug) => ({ lang: "es", slug }));
  const enSlugs = getAllSlugs("en").map((slug) => ({ lang: "en", slug }));
  return [...esSlugs, ...enSlugs];
}

/* Genera el metadata SEO dinámicamente */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPost(slug, lang);

  if (!post) return { title: "Post not found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: { es: `/es/blog/${slug}`, en: `/en/blog/${slug}` },
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  setRequestLocale(lang);

  const post = getPost(slug, lang);
  if (!post) notFound();

  const t = await getTranslations({ locale: lang, namespace: "blog" });

  /* Fetch comentarios aprobados (respeta RLS) */
  const { data: commentsData } = await supabase
    .from("comments")
    .select("id, post_slug, post_lang, author_name, body, status, admin_reply, created_at")
    .eq("post_slug", slug)
    .eq("post_lang", lang)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  const comments = (commentsData ?? []) as Comment[];
  const baseUrl = "https://deep-brain-markets.vercel.app";

  /* JSON-LD Schema */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${baseUrl}/${lang}/blog/${slug}/#article`,
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "image": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        },
        "publisher": {
          "@type": "Organization",
          "name": "Deep Brain Markets",
          "logo": {
            "@type": "ImageObject",
            "url": `${baseUrl}/logo.png`
          }
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": lang === "es" ? "Inicio" : "Home",
            "item": `${baseUrl}/${lang}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${baseUrl}/${lang}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `${baseUrl}/${lang}/blog/${slug}`
          }
        ]
      }
    ]
  };

  /* Formatea la fecha según el idioma */
  const formattedDate = new Date(post.date).toLocaleDateString(
    lang === "es" ? "es-MX" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <article className="w-full bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="px-5 md:px-20 py-8 md:py-12 max-w-[800px] mx-auto">
        {/* Breadcrumb / Back */}
        <Link
          href={`/${lang}/blog`}
          className="inline-flex items-center gap-1.5 font-title font-semibold text-[13px] text-primary hover:opacity-70 transition-opacity mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("title")}
        </Link>

        {/* Header del post */}
        <header className="flex flex-col gap-4 pb-6 border-b border-border mb-8">
          <h1 className="font-title font-bold text-[24px] md:text-[36px] text-text-primary leading-tight">
            {post.title}
          </h1>

          {/* Meta: autor, fecha, tiempo de lectura */}
          <div className="flex flex-wrap items-center gap-4 text-text-secondary">
            <span className="inline-flex items-center gap-1.5 text-[13px]">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px]">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[13px]">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-bg-soft-blue text-primary font-title font-semibold text-[11px] rounded-[6px]"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Contenido del post — prosa estilizada */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-title prose-headings:text-text-primary prose-headings:font-bold
            prose-h2:text-[20px] prose-h2:md:text-[24px] prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-[18px] prose-h3:md:text-[20px]
            prose-p:font-body prose-p:text-text-body prose-p:text-[15px] prose-p:md:text-[16px] prose-p:leading-relaxed
            prose-li:font-body prose-li:text-text-body prose-li:text-[15px] prose-li:md:text-[16px]
            prose-strong:text-text-primary
            prose-a:text-primary prose-a:no-underline prose-a:hover:opacity-70
            prose-blockquote:border-l-primary prose-blockquote:bg-bg-soft-blue prose-blockquote:rounded-r-[8px] prose-blockquote:py-3 prose-blockquote:px-4 prose-blockquote:not-italic
            prose-code:text-primary prose-code:bg-bg-soft-blue prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-[4px] prose-code:text-[14px]"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
        />

        {/* ────── Sección de comentarios ────── */}
        <CommentSection
          comments={comments}
          postSlug={slug}
          postLang={lang}
        />
      </div>
    </article>
  );
}

/* ─── Markdown a HTML simple ──────────────────────────────────────────────
   Convierte markdown básico a HTML sin dependencia pesada.
   Para producción, podrías usar remark/rehype si necesitas más features. */
function markdownToHtml(md: string): string {
  let html = md
    /* Headers */
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    /* Bold + italic */
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    /* Blockquotes */
    .replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>")
    /* Unordered lists */
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    /* Links */
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    /* Paragraphs — wraps non-tagged lines */
    .replace(/^(?!<[hlubo]|<li|<blockquote)(.+)$/gm, "<p>$1</p>");

  /* Wrap consecutive <li> in <ul> */
  html = html.replace(
    /(<li>[\s\S]*?<\/li>)/g,
    (match) => {
      if (!match.startsWith("<ul>")) return `<ul>${match}</ul>`;
      return match;
    }
  );

  /* Clean up multiple consecutive <ul> wrappers */
  html = html.replace(/<\/ul>\s*<ul>/g, "");

  return html;
}
