import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("x-admin-token");
  return token === process.env.ADMIN_SECRET;
}

/* ─── GET /api/admin/contact?status=pending ────────────────────────────── */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status"); // 'pending' | 'attended' | null (all)

  let query = supabaseAdmin
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && ["pending", "attended"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Failed to fetch contact requests" }, { status: 500 });
  }

  return NextResponse.json({ requests: data ?? [] });
}

/* ─── PATCH /api/admin/contact ─────────────────────────────────────────── */
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("contact_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
