import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* ─── Validación de variables de entorno ──────────────────────────────────── */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY son requeridos.\n" +
    "   Abre .env.local y agrega tus keys de Supabase."
  );
}

/* ─── Cliente público (anon key) ──────────────────────────────────────────── */
/* Se usa en el frontend y server components para:
   - Leer comentarios aprobados (respeta RLS)
   - Insertar comentarios nuevos como 'pending' (respeta RLS) */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

/* ─── Cliente admin (service role key) ────────────────────────────────────── */
/* Se usa SOLO en API routes del servidor para:
   - Leer todos los comentarios (bypass RLS)
   - Aprobar/rechazar/eliminar comentarios
   ⚠️ NUNCA importar este cliente en componentes del frontend */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseServiceKey || "placeholder-key"
);
