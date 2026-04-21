"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { MessageSquarePlus, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface CommentFormProps {
  postSlug: string;
  postLang: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

/* Formulario público para enviar un comentario
   Incluye honeypot anti-bot, validación client-side y estados animados */
export default function CommentForm({ postSlug, postLang }: CommentFormProps) {
  const t = useTranslations("blog");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      post_slug: postSlug,
      post_lang: postLang,
      author_name: formData.get("author_name") as string,
      author_email: formData.get("author_email") as string,
      body: formData.get("body") as string,
      /* Honeypot — campo oculto */
      website: formData.get("website") as string,
    };

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        setState("error");
        setErrorMsg(t("rate_limit"));
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setState("error");
        setErrorMsg(data.error || t("error_msg"));
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
      setErrorMsg(t("error_msg"));
    }
  }

  /* Estado de éxito — animación de confirmación */
  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 px-5 bg-bg-neutral rounded-[12px] border border-border animate-[fadeIn_0.4s_ease-out]">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-commerce-green/10">
          <CheckCircle className="w-7 h-7 text-commerce-green" />
        </div>
        <h4 className="font-title font-bold text-[16px] md:text-[18px] text-text-primary">
          {t("success_title")}
        </h4>
        <p className="font-body text-[13px] md:text-[14px] text-text-secondary text-center w-full max-w-md">
          {t("success_msg")}
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-2 font-title font-bold text-[13px] text-primary hover:opacity-70 transition-opacity"
        >
          {t("write_another")}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-5 md:p-6 bg-white rounded-[12px] border border-border"
    >
      {/* Encabezado */}
      <div className="flex items-center gap-2 pb-3 border-b border-border-soft">
        <MessageSquarePlus className="w-5 h-5 text-primary" />
        <h3 className="font-title font-bold text-[16px] md:text-[18px] text-text-primary">
          {t("leave_comment")}
        </h3>
      </div>

      {/* Honeypot — invisible para humanos, bots lo llenan */}
      <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Nombre y Email — 1 col mobile, 2 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="comment-name" className="font-title font-semibold text-[13px] text-text-primary">
            {t("name_label")}
          </label>
          <input
            type="text"
            id="comment-name"
            name="author_name"
            required
            minLength={2}
            maxLength={100}
            placeholder={t("name_placeholder")}
            className="w-full px-3.5 py-2.5 bg-bg-neutral border border-border rounded-[8px] font-body text-[14px] text-text-body placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="comment-email" className="font-title font-semibold text-[13px] text-text-primary">
            {t("email_label")}
            <span className="font-body font-normal text-[11px] text-text-secondary ml-1.5">
              ({t("email_hint")})
            </span>
          </label>
          <input
            type="email"
            id="comment-email"
            name="author_email"
            required
            placeholder={t("email_placeholder")}
            className="w-full px-3.5 py-2.5 bg-bg-neutral border border-border rounded-[8px] font-body text-[14px] text-text-body placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
          />
        </div>
      </div>

      {/* Cuerpo del comentario */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="comment-body" className="font-title font-semibold text-[13px] text-text-primary">
          {t("comment_label")}
        </label>
        <textarea
          id="comment-body"
          name="body"
          required
          minLength={5}
          maxLength={2000}
          rows={4}
          placeholder={t("comment_placeholder")}
          className="w-full px-3.5 py-2.5 bg-bg-neutral border border-border rounded-[8px] font-body text-[14px] text-text-body placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors resize-y min-h-[100px]"
        />
      </div>

      {/* Error */}
      {state === "error" && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-[8px] animate-[fadeIn_0.3s_ease-out]">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="font-body text-[13px] text-red-600">{errorMsg}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-title font-bold text-[14px] rounded-[8px] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
