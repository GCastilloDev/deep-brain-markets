/* Tipado para la tabla 'comments' en Supabase */

export type CommentStatus = "pending" | "approved" | "rejected";

export interface Comment {
  id: string;
  post_slug: string;
  post_lang: string;
  author_name: string;
  author_email: string;
  body: string;
  status: CommentStatus;
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

/* Payload que envía el formulario público */
export interface CommentInput {
  post_slug: string;
  post_lang: string;
  author_name: string;
  author_email: string;
  body: string;
  /* Campo honeypot — si tiene valor, es un bot */
  website?: string;
}
