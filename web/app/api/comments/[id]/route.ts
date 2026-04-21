import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import type { CommentStatus } from "@/lib/types/comments";

/* Verifica que el request venga del admin */
function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  return token === process.env.ADMIN_SECRET;
}

/* ─── PATCH /api/comments/[id] ──────────────────────────────────────────── */
/* Cambia el status de un comentario (approve/reject) y/o guarda admin_reply
   Solo accesible con x-admin-token válido
   Dispara revalidatePath para regenerar la página del blog (ISR) */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: CommentStatus; admin_reply?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  /* Validar status si viene en el body */
  if (body.status && !["approved", "rejected", "pending"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  /* Primero obtenemos el comentario para saber el slug y lang (necesario para revalidar) */
  const { data: comment, error: fetchError } = await supabaseAdmin
    .from("comments")
    .select("post_slug, post_lang")
    .eq("id", id)
    .single();

  if (fetchError || !comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  /* Construir el objeto de actualización solo con los campos enviados */
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status !== undefined) updates.status = body.status;
  if (body.admin_reply !== undefined) updates.admin_reply = body.admin_reply || null;

  const { error } = await supabaseAdmin
    .from("comments")
    .update(updates)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }

  /* Regenerar la página del blog post (ISR on-demand) */
  revalidatePath(`/es/blog/${comment.post_slug}`);
  revalidatePath(`/en/blog/${comment.post_slug}`);

  return NextResponse.json({ success: true });
}

/* ─── DELETE /api/comments/[id] ─────────────────────────────────────────── */
/* Elimina un comentario permanentemente
   Solo accesible con x-admin-token válido */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  /* Obtener slug antes de eliminar (para revalidar) */
  const { data: comment, error: fetchError } = await supabaseAdmin
    .from("comments")
    .select("post_slug, post_lang")
    .eq("id", id)
    .single();

  if (fetchError || !comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const { error } = await supabaseAdmin
    .from("comments")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }

  /* Regenerar la página del blog post */
  revalidatePath(`/es/blog/${comment.post_slug}`);
  revalidatePath(`/en/blog/${comment.post_slug}`);

  return NextResponse.json({ success: true });
}
