import { useTranslations } from "next-intl";
import { MessageCircle, ShieldCheck } from "lucide-react";
import type { Comment } from "@/lib/types/comments";

interface CommentListProps {
  comments: Comment[];
  lang: string;
}

/* Formatea una fecha a tiempo relativo (hace Xm, hace Xh, hace Xd) */
function relativeTime(dateStr: string, lang: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (minutes < 1) return lang === "es" ? "Justo ahora" : "Just now";
  if (minutes < 60) return lang === "es" ? `hace ${minutes}m` : `${minutes}m ago`;
  if (hours < 24) return lang === "es" ? `hace ${hours}h` : `${hours}h ago`;
  if (days < 30) return lang === "es" ? `hace ${days}d` : `${days}d ago`;
  if (lang === "es") return `hace ${months} ${months === 1 ? "mes" : "meses"}`;
  return `${months} ${months === 1 ? "month" : "months"} ago`;
}

/* Genera un color determinístico basado en el nombre del autor */
function avatarColor(name: string): string {
  const colors = [
    "#1B4B8F", "#27AE60", "#8B5CF6", "#EC4899",
    "#F59E0B", "#10B981", "#3B82F6", "#EF4444",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/* Lista de comentarios aprobados — server component */
export default function CommentList({ comments, lang }: CommentListProps) {
  const t = useTranslations("blog");

  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-bg-soft-blue">
          <MessageCircle className="w-6 h-6 text-text-secondary" />
        </div>
        <p className="font-body text-[14px] text-text-secondary">
          {t("no_comments")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => {
        const initial = comment.author_name.charAt(0).toUpperCase();
        const bgColor = avatarColor(comment.author_name);

        return (
          <div key={comment.id} className="flex flex-col gap-0">
            {/* ── Comentario del usuario ── */}
            <article className="flex gap-3 p-4 bg-bg-neutral rounded-t-[12px] border border-border transition-colors hover:border-border-soft">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-white font-title font-bold text-[14px]"
                style={{ backgroundColor: bgColor }}
                aria-hidden="true"
              >
                {initial}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-title font-bold text-[14px] text-text-primary">
                    {comment.author_name}
                  </span>
                  <span className="font-body text-[12px] text-text-secondary">
                    {relativeTime(comment.created_at, lang)}
                  </span>
                </div>
                <p className="font-body text-[14px] text-text-body leading-relaxed whitespace-pre-line break-words">
                  {comment.body}
                </p>
              </div>
            </article>

            {/* ── Respuesta del admin (si existe) ── */}
            {comment.admin_reply && (
              <div className="flex gap-3 p-4 bg-bg-soft-blue border border-t-0 border-primary/20 rounded-b-[12px]">
                {/* Ícono de Deep Brain */}
                <div className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 bg-primary text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-title font-bold text-[13px] text-primary">
                    {t("admin_reply_label")}
                  </span>
                  <p className="font-body text-[14px] text-text-body leading-relaxed whitespace-pre-line break-words">
                    {comment.admin_reply}
                  </p>
                </div>
              </div>
            )}

            {/* Borde inferior redondeado cuando NO hay respuesta */}
            {!comment.admin_reply && (
              <div className="h-0 border-b border-x border-border rounded-b-[12px]" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}
