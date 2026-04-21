import { useTranslations } from "next-intl";
import { MessageSquare } from "lucide-react";
import type { Comment } from "@/lib/types/comments";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

interface CommentSectionProps {
  comments: Comment[];
  postSlug: string;
  postLang: string;
}

/* Sección completa de comentarios para un blog post
   Contiene: título con contador + lista de comentarios + formulario */
export default function CommentSection({ comments, postSlug, postLang }: CommentSectionProps) {
  const t = useTranslations("blog");

  const count = comments.length;
  const countText = count === 0
    ? t("comments_zero")
    : count === 1
      ? `1 ${t("comments_singular")}`
      : `${count} ${t("comments_plural")}`;

  return (
    <section
      aria-label={t("comments_title")}
      className="flex flex-col gap-6 pt-8 md:pt-10"
    >
      {/* Separador gradiente — consistente con ExpertiseSection */}
      <div className="flex flex-col gap-3">
        <div
          className="h-1 w-16 rounded-full"
          style={{ background: "linear-gradient(90deg, #005697 0%, #27AE60 100%)" }}
          aria-hidden="true"
        />
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="font-title font-bold text-[20px] md:text-[24px] text-text-primary">
            {t("comments_title")}
          </h2>
          <span className="font-body text-[14px] text-text-secondary">
            ({countText})
          </span>
        </div>
      </div>

      {/* Lista de comentarios aprobados */}
      <CommentList comments={comments} lang={postLang} />

      {/* Formulario para enviar un comentario nuevo */}
      <CommentForm postSlug={postSlug} postLang={postLang} />
    </section>
  );
}
