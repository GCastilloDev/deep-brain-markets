import { NextRequest, NextResponse } from "next/server";

/* ─── POST /api/admin/auth ──────────────────────────────────────────────── */
/* Verifica el password del admin contra ADMIN_SECRET env var
   Retorna el token para usar en las API calls de moderación */
export async function POST(request: NextRequest) {
  let body: { password: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  if (body.password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  /* Retorna el secret como token — el admin lo usa en el header x-admin-token
     Es seguro porque ADMIN_SECRET solo vive en el servidor */
  return NextResponse.json({ token: process.env.ADMIN_SECRET });
}
