import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/* Verifica que el request venga del admin */
function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  return token === process.env.ADMIN_SECRET;
}

/* ─── GET /api/admin/comments?status=pending ────────────────────────────── */
/* Lista todos los comentarios con filtro opcional por status
   Solo accesible con x-admin-token válido
   Usa supabaseAdmin para bypass RLS y ver todos los comentarios */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // 'pending' | 'approved' | 'rejected' | null (all)

  let query = supabaseAdmin
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && ["pending", "approved", "rejected"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }

  return NextResponse.json({ comments: data ?? [] });
}
