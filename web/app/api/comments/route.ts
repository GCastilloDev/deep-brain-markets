import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CommentInput } from "@/lib/types/comments";

/* ─── Rate Limiting ─────────────────────────────────────────────────────── */
/* Map en memoria: IP → timestamps de comentarios recientes
   Se limpia automáticamente cada 15 minutos para evitar memory leaks */
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
const RATE_LIMIT_MAX = 3; // máximo 3 comentarios por ventana

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) ?? [];
  /* Filtra timestamps fuera de la ventana */
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);
  return recent.length >= RATE_LIMIT_MAX;
}

function recordRequest(ip: string): void {
  const timestamps = rateLimitMap.get(ip) ?? [];
  timestamps.push(Date.now());
  rateLimitMap.set(ip, timestamps);
}

/* Limpieza periódica del rate limit map */
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of rateLimitMap.entries()) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (recent.length === 0) rateLimitMap.delete(ip);
    else rateLimitMap.set(ip, recent);
  }
}, RATE_LIMIT_WINDOW);

/* ─── Validación y sanitización ─────────────────────────────────────────── */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(text: string): string {
  /* Elimina tags HTML/script para prevenir XSS en la base de datos */
  return text.replace(/<[^>]*>/g, "").trim();
}

function validateInput(input: CommentInput): string | null {
  if (!input.author_name || input.author_name.length < 2 || input.author_name.length > 100) {
    return "Name must be between 2 and 100 characters";
  }
  if (!input.author_email || !EMAIL_REGEX.test(input.author_email)) {
    return "Invalid email format";
  }
  if (!input.body || input.body.length < 5 || input.body.length > 2000) {
    return "Comment must be between 5 and 2000 characters";
  }
  if (!input.post_slug) {
    return "Post slug is required";
  }
  return null;
}

/* ─── GET /api/comments?slug=xxx&lang=es ────────────────────────────────── */
/* Retorna los comentarios aprobados de un post (respeta RLS) */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const lang = searchParams.get("lang") ?? "es";

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("id, post_slug, post_lang, author_name, body, status, created_at")
    .eq("post_slug", slug)
    .eq("post_lang", lang)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}

/* ─── POST /api/comments ────────────────────────────────────────────────── */
/* Crea un comentario nuevo con status 'pending' */
export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  /* Rate limiting */
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many comments. Please try again later." },
      { status: 429 }
    );
  }

  let input: CommentInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  /* Honeypot — si el campo 'website' tiene valor, es un bot */
  if (input.website) {
    /* Responde 200 para no alertar al bot, pero no guarda nada */
    return NextResponse.json({ success: true });
  }

  /* Sanitización */
  input.author_name = sanitize(input.author_name);
  input.author_email = sanitize(input.author_email).toLowerCase();
  input.body = sanitize(input.body);
  input.post_slug = sanitize(input.post_slug);
  input.post_lang = sanitize(input.post_lang || "es");

  /* Validación */
  const validationError = validateInput(input);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  /* Insertar en Supabase (RLS fuerza status='pending') */
  const { error } = await supabase.from("comments").insert({
    post_slug: input.post_slug,
    post_lang: input.post_lang,
    author_name: input.author_name,
    author_email: input.author_email,
    body: input.body,
    status: "pending",
  });

  if (error) {
    console.error("Error inserting comment:", error);
    return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
  }

  /* Registrar request para rate limiting */
  recordRequest(ip);

  return NextResponse.json({ success: true }, { status: 201 });
}
