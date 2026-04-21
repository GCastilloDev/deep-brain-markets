import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

/* Lee y parsea un post MDX por slug e idioma */
export function getPost(slug: string, lang: string): BlogPost | null {
  const filePath = path.join(CONTENT_DIR, lang, `${slug}.md`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    readingTime: stats.text,
    content,
  };
}

/* Lista todos los posts de un idioma, ordenados por fecha descendente */
export function getAllPosts(lang: string): BlogPostMeta[] {
  const dir = path.join(CONTENT_DIR, lang);

  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const post = getPost(slug, lang);
    if (!post) return null;
    /* Retorna solo los metadatos (sin el contenido completo) */
    const { content: _, ...meta } = post;
    return meta;
  }).filter(Boolean) as BlogPostMeta[];

  /* Ordena por fecha, más reciente primero */
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/* Lista todos los slugs disponibles (para generateStaticParams) */
export function getAllSlugs(lang: string): string[] {
  const dir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
