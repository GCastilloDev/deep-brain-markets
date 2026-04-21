"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Shield, Lock, Eye, EyeOff, Loader2, LogOut,
  CheckCircle, XCircle, Trash2, MessageSquare,
  Clock, AlertCircle, Reply, ShieldCheck, Pencil, X,
  ChevronLeft
} from "lucide-react";
import type { Comment, CommentStatus } from "@/lib/types/comments";

type Tab = "pending" | "approved" | "rejected";

/* ─── Modal de confirmación — fuera del padre para evitar re-mount ────────── */
interface ConfirmModalProps {
  message: string;
  labelTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  labelConfirm: string;
  labelCancel: string;
}

function ConfirmModal({ message, labelTitle, onConfirm, onCancel, labelConfirm, labelCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      {/* Panel — ancho fijo para que no colapse */}
      <div className="relative w-[320px] md:w-[380px] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Zona superior con ícono */}
        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="font-title font-bold text-[16px] text-text-primary text-center">
            {labelTitle}
          </h3>
          <p className="font-body text-[13px] text-text-secondary text-center leading-relaxed">
            {message}
          </p>
        </div>
        {/* Botones separados por línea */}
        <div className="border-t border-border flex">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 font-title font-semibold text-[14px] text-text-secondary hover:bg-bg-neutral transition-colors border-r border-border"
          >
            {labelCancel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 font-title font-bold text-[14px] text-red-500 hover:bg-red-50 transition-colors"
          >
            {labelConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ReplyPanel — componente FUERA del padre para evitar re-mount ────────
   Si estuviera dentro, cada keystroke re-crea la función y React desmonta
   el textarea perdiendo el foco. Al estar afuera, React lo reutiliza. */
interface ReplyPanelProps {
  comment: Comment;
  replyingId: string | null;
  replyText: string;
  replySaving: boolean;
  onStart: (comment: Comment) => void;
  onCancel: () => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeText: (text: string) => void;
  tReply: (key: string) => string;
}

function ReplyPanel({
  comment,
  replyingId,
  replyText,
  replySaving,
  onStart,
  onCancel,
  onSave,
  onDelete,
  onChangeText,
  tReply,
}: ReplyPanelProps) {
  const isEditing = replyingId === comment.id;

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 mt-2 p-3 bg-bg-soft-blue border border-primary/20 rounded-[8px]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span className="font-title font-semibold text-[12px] text-primary">Deep Brain Markets</span>
        </div>
        <textarea
          autoFocus
          value={replyText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder={tReply("reply_placeholder")}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-border rounded-[6px] font-body text-[13px] text-text-body placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
        />
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={replySaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-title font-semibold text-[12px] text-text-secondary hover:text-text-body rounded-[6px] hover:bg-bg-neutral transition-colors disabled:opacity-50"
          >
            <X className="w-3.5 h-3.5" />
            {tReply("reply_cancel")}
          </button>
          <button
            onClick={() => onSave(comment.id)}
            disabled={replySaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white font-title font-semibold text-[12px] rounded-[6px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {replySaving
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {tReply("reply_saving")}</>
              : <><CheckCircle className="w-3.5 h-3.5" /> {tReply("reply_save")}</>}
          </button>
        </div>
      </div>
    );
  }

  if (comment.admin_reply) {
    return (
      <div className="flex flex-col gap-1.5 mt-2 p-3 bg-bg-soft-blue border border-primary/20 rounded-[8px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span className="font-title font-semibold text-[12px] text-primary">Deep Brain Markets</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onStart(comment)}
              className="p-1 rounded-[4px] text-text-secondary hover:text-primary hover:bg-bg-neutral transition-colors"
              title={tReply("reply_label")}
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-1 rounded-[4px] text-text-secondary hover:text-red-500 hover:bg-red-50 transition-colors"
              title={tReply("reply_delete")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="font-body text-[13px] text-text-body leading-relaxed whitespace-pre-line">
          {comment.admin_reply}
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={() => onStart(comment)}
      className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1.5 font-title font-semibold text-[12px] text-text-secondary hover:text-primary hover:bg-bg-soft-blue border border-dashed border-border hover:border-primary rounded-[6px] transition-all"
    >
      <Reply className="w-3.5 h-3.5" />
      {tReply("reply_label")}
    </button>
  );
}

/* ─── Panel principal de moderación ──────────────────────────────────────── */
export default function AdminCommentsPage() {
  const t = useTranslations("admin");
  const params = useParams();
  const lang = params.lang as string;

  /* Token persistido en sessionStorage — sobrevive cambios de idioma y
     recargas de página, pero se limpia al cerrar la pestaña             */
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  function persistToken(t: string | null) {
    if (t) sessionStorage.setItem("admin_token", t);
    else sessionStorage.removeItem("admin_token");
    setToken(t);
  }

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<"idle" | "loading" | "error">("idle");

  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySaving, setReplySaving] = useState(false);

  /* Estado del modal de confirmación de eliminación */
  const [confirmId, setConfirmId] = useState<string | null>(null);

  /* ── Login ──────────────────────────────────────────────────── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginState("loading");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setLoginState("error"); return; }
      const data = await res.json();
      persistToken(data.token);
      setLoginState("idle");
    } catch {
      setLoginState("error");
    }
  }

  /* ── Fetch comments ─────────────────────────────────────────── */
  const fetchComments = useCallback(async (status: Tab) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comments?status=${status}`, {
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchComments(activeTab);
  }, [token, activeTab, fetchComments]);

  /* ── Status actions ─────────────────────────────────────────── */
  async function updateStatus(id: string, status: CommentStatus) {
    if (!token) return;
    setActionLoading(id);
    try {
      await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ status }),
      });
      await fetchComments(activeTab);
    } finally {
      setActionLoading(null);
    }
  }

  async function deleteComment(id: string) {
    if (!token) return;
    /* Abre el modal en lugar del confirm() nativo */
    setConfirmId(id);
  }

  async function confirmDelete() {
    if (!token || !confirmId) return;
    setConfirmId(null);
    setActionLoading(confirmId);
    try {
      await fetch(`/api/comments/${confirmId}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      await fetchComments(activeTab);
    } finally {
      setActionLoading(null);
    }
  }

  /* ── Reply actions ──────────────────────────────────────────── */
  function startReply(comment: Comment) {
    setReplyingId(comment.id);
    setReplyText(comment.admin_reply ?? "");
  }

  function cancelReply() {
    setReplyingId(null);
    setReplyText("");
  }

  async function saveReply(id: string) {
    if (!token) return;
    setReplySaving(true);
    try {
      await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ admin_reply: replyText.trim() || null }),
      });
      setReplyingId(null);
      setReplyText("");
      await fetchComments(activeTab);
    } finally {
      setReplySaving(false);
    }
  }

  async function deleteReply(id: string) {
    if (!token) return;
    setReplySaving(true);
    try {
      await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ admin_reply: null }),
      });
      setReplyingId(null);
      await fetchComments(activeTab);
    } finally {
      setReplySaving(false);
    }
  }

  /* Props comunes para ReplyPanel */
  const replyPanelProps = {
    replyingId,
    replyText,
    replySaving,
    onStart: startReply,
    onCancel: cancelReply,
    onSave: saveReply,
    onDelete: deleteReply,
    onChangeText: setReplyText,
    tReply: t,
  };

  /* ── Pantalla de login ──────────────────────────────────────── */
  if (!token) {
    return (
      <div className="min-h-[60vh] grid place-items-center px-5 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[400px] flex flex-col gap-5 bg-white p-6 md:p-8 rounded-[12px] border border-border shadow-sm"
        >
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-bg-soft-blue">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-title font-bold text-[20px] text-text-primary text-center w-full">
              {t("login_title")}
            </h1>
            <p className="font-body text-[13px] text-text-secondary text-center w-full">
              {t("login_subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="admin-password" className="font-title font-semibold text-[13px] text-text-primary">
              {t("password_label")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginState("idle"); }}
                placeholder={t("password_placeholder")}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-bg-neutral border border-border rounded-[8px] font-body text-[14px] text-text-body placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-body transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {loginState === "error" && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-[8px]">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="font-body text-[13px] text-red-600">{t("login_error")}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loginState === "loading"}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white font-title font-bold text-[14px] rounded-[8px] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loginState === "loading"
              ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("logging_in")}</>
              : t("login_btn")}
          </button>
        </form>
      </div>
    );
  }

  /* ── Panel principal ────────────────────────────────────────── */
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "pending",  label: t("tab_pending"),  icon: <Clock className="w-4 h-4" /> },
    { key: "approved", label: t("tab_approved"), icon: <CheckCircle className="w-4 h-4" /> },
    { key: "rejected", label: t("tab_rejected"), icon: <XCircle className="w-4 h-4" /> },
  ];

  return (
    <>
    <div className="px-4 md:px-20 py-6 md:py-12 max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-4 mb-6 md:mb-10">
        {/* Top Row: Back link */}
        <div className="flex items-center justify-between">
          <Link 
            href={`/${lang}/admin`}
            className="inline-flex items-center gap-1 text-text-secondary hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-title font-semibold text-[12px] md:text-[13px]">{t("btn_back_dashboard")}</span>
          </Link>
        </div>

        {/* Bottom Row: Title & Logout */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
            <h1 className="font-title font-bold text-[18px] md:text-[28px] text-text-primary leading-tight">
              {t("comments_title")}
            </h1>
          </div>
          
          <button
            onClick={() => { persistToken(null); setPassword(""); }}
            className="flex items-center gap-1.5 p-2 md:px-3 md:py-2 text-text-secondary rounded-[8px] hover:bg-bg-neutral hover:text-primary transition-all shrink-0"
            title={t("logout")}
            aria-label={t("logout")}
          >
            <LogOut className="w-4 h-4 md:w-4 md:h-4" />
            <span className="hidden md:inline font-title font-semibold text-[13px]">{t("logout")}</span>
          </button>
        </div>
      </div>

      {/* Tabs — siempre con etiqueta */}
      <div className="flex gap-1 p-1 bg-bg-neutral rounded-[10px] mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setReplyingId(null); }}
            className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 px-2 rounded-[8px] font-title font-semibold text-[12px] md:text-[13px] transition-all ${
              activeTab === tab.key
                ? "bg-white text-primary shadow-sm"
                : "text-text-secondary hover:text-text-body"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && comments.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <MessageSquare className="w-8 h-8 text-text-secondary opacity-40" />
          <p className="font-body text-[14px] text-text-secondary">{t("no_comments")}</p>
        </div>
      )}

      {/* ── Desktop: cards ───────────────────────────────────────── */}
      {!loading && comments.length > 0 && (
        <>
          <div className="hidden md:flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c.id} className="bg-white border border-border rounded-[12px] overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-4 items-start">
                  {/* Autor */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white font-title font-bold text-[14px] shrink-0">
                      {c.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <span className="font-title font-bold text-[14px] text-text-primary truncate">{c.author_name}</span>
                      <span className="font-body text-[12px] text-text-secondary truncate">{c.author_email}</span>
                      <span className="font-body text-[11px] text-primary mt-0.5">{c.post_slug}</span>
                    </div>
                  </div>

                  {/* Comentario + Reply */}
                  <div className="flex flex-col min-w-0">
                    <p className="font-body text-[13px] text-text-body leading-relaxed line-clamp-3 whitespace-pre-line">
                      {c.body}
                    </p>
                    <ReplyPanel comment={c} {...replyPanelProps} />
                  </div>

                  {/* Fecha + acciones */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span className="font-body text-[12px] text-text-secondary whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-1">
                      {actionLoading === c.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <>
                          {activeTab !== "approved" && (
                            <button onClick={() => updateStatus(c.id, "approved")}
                              className="p-1.5 rounded-[6px] text-commerce-green hover:bg-commerce-green/10 transition-colors" title={t("btn_approve")}>
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {activeTab !== "rejected" && (
                            <button onClick={() => updateStatus(c.id, "rejected")}
                              className="p-1.5 rounded-[6px] text-amber-500 hover:bg-amber-50 transition-colors" title={t("btn_reject")}>
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {activeTab !== "pending" && (
                            <button onClick={() => updateStatus(c.id, "pending")}
                              className="p-1.5 rounded-[6px] text-primary hover:bg-bg-soft-blue transition-colors" title={t("btn_pending")}>
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => deleteComment(c.id)}
                            className="p-1.5 rounded-[6px] text-red-400 hover:bg-red-50 transition-colors" title={t("btn_delete")}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Mobile: cards rediseñadas ───────────────────────────── */}
          <div className="flex flex-col gap-3 md:hidden">
            {comments.map((c) => (
              <div key={c.id} className="flex flex-col bg-white rounded-[14px] border border-border overflow-hidden shadow-sm">

                {/* ① Info del autor — fila compacta */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-title font-bold text-[15px] shrink-0">
                    {c.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-title font-bold text-[14px] text-text-primary truncate">{c.author_name}</span>
                    <span className="font-body text-[11px] text-text-secondary truncate">{c.author_email}</span>
                  </div>
                  {/* Fecha arriba a la derecha */}
                  <span className="font-body text-[11px] text-text-secondary whitespace-nowrap shrink-0">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* ② Post chip */}
                <div className="px-4 pb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-bg-soft-blue text-primary font-title font-semibold text-[11px] rounded-full">
                    📄 {c.post_slug}
                  </span>
                </div>

                {/* ③ Cuerpo del comentario */}
                <div className="px-4 pb-3">
                  <p className="font-body text-[13px] text-text-body leading-relaxed whitespace-pre-line">
                    {c.body}
                  </p>
                </div>

                {/* ④ Reply panel */}
                <div className="px-4 pb-3">
                  <ReplyPanel comment={c} {...replyPanelProps} />
                </div>

                {/* ⑤ Barra de acciones — full width, touch-friendly */}
                <div className="border-t border-border-soft">
                  {actionLoading === c.id ? (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="flex">
                      {activeTab !== "approved" && (
                        <button
                          onClick={() => updateStatus(c.id, "approved")}
                          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-commerce-green hover:bg-commerce-green/8 transition-colors border-r border-border-soft"
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-title font-semibold text-[10px]">{t("btn_approve")}</span>
                        </button>
                      )}
                      {activeTab !== "rejected" && (
                        <button
                          onClick={() => updateStatus(c.id, "rejected")}
                          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-amber-500 hover:bg-amber-50 transition-colors border-r border-border-soft"
                        >
                          <XCircle className="w-5 h-5" />
                          <span className="font-title font-semibold text-[10px]">{t("btn_reject")}</span>
                        </button>
                      )}
                      {activeTab !== "pending" && (
                        <button
                          onClick={() => updateStatus(c.id, "pending")}
                          className="flex-1 flex flex-col items-center gap-0.5 py-3 text-primary hover:bg-bg-soft-blue transition-colors border-r border-border-soft"
                        >
                          <Clock className="w-5 h-5" />
                          <span className="font-title font-semibold text-[10px]">{t("btn_pending")}</span>
                        </button>
                      )}
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="flex-1 flex flex-col items-center gap-0.5 py-3 text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        <span className="font-title font-semibold text-[10px]">{t("btn_delete")}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </>
      )}
    </div>

    {/* Modal de confirmación de eliminación */}
    {confirmId && (
      <ConfirmModal
        labelTitle={t("confirm_title")}
        message={t("confirm_delete")}
        labelConfirm={t("btn_delete")}
        labelCancel={t("reply_cancel")}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    )}
    </>
  );
}
