"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { 
  Shield, Lock, Eye, EyeOff, Loader2, 
  MessageSquare, LayoutDashboard, ArrowRight,
  AlertCircle, LogOut
} from "lucide-react";
import { useParams } from "next/navigation";

export default function AdminHubPage() {
  const t = useTranslations("admin");
  const params = useParams();
  const lang = params.lang as string;

  /* Auth State */
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<"idle" | "loading" | "error">("idle");

  /* Restore token on mount */
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  function persistToken(t: string | null) {
    if (t) sessionStorage.setItem("admin_token", t);
    else sessionStorage.removeItem("admin_token");
    setToken(t);
  }

  /* Login Handler */
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

  /* ── login screen ─────────────────────────────────────────── */
  if (!token) {
    return (
      <div className="min-h-[70vh] grid place-items-center px-5 py-20">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[400px] flex flex-col gap-5 bg-white p-6 md:p-8 rounded-[16px] border border-border shadow-sm animate-[fadeIn_0.3s_ease-out]"
        >
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-bg-soft-blue text-primary">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="font-title font-bold text-[22px] text-text-primary text-center w-full">
              {t("login_title")}
            </h1>
            <p className="font-body text-[14px] text-text-secondary text-center w-full">
              {t("login_subtitle")}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <label htmlFor="admin-password" className="font-title font-semibold text-[13px] text-text-primary">
              {t("password_label")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginState("idle"); }}
                placeholder={t("password_placeholder")}
                required
                className="w-full pl-10 pr-10 py-3 bg-bg-neutral border border-border rounded-[10px] font-body text-[15px] text-text-body placeholder:text-placeholder outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-body transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {loginState === "error" && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-[10px]">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="font-body text-[13px] text-red-600">{t("login_error")}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loginState === "loading"}
            className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-primary text-white font-title font-bold text-[15px] rounded-[10px] shadow-sm hover:translate-y-[-1px] active:translate-y-[0] transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {loginState === "loading"
              ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("logging_in")}</>
              : t("login_btn")}
          </button>
        </form>
      </div>
    );
  }

  /* ── dashboard hub ────────────────────────────────────────── */
  return (
    <div className="px-5 md:px-20 py-10 md:py-16 max-w-[1200px] mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <h1 className="font-title font-bold text-[24px] md:text-[32px] text-text-primary">
            {t("dashboard_title")}
          </h1>
        </div>
        <button
          onClick={() => persistToken(null)}
          className="flex items-center gap-2 px-4 py-2 text-text-secondary font-title font-semibold text-[13px] rounded-[8px] hover:bg-bg-neutral transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">{t("logout")}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card: Moderación de Comentarios */}
        <Link 
          href={`/${lang}/admin/comments`}
          className="group flex flex-col p-6 bg-white border border-border rounded-[16px] hover:border-primary/30 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-[12px] bg-bg-soft-blue text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <MessageSquare className="w-6 h-6" />
            </div>
            <ArrowRight className="w-5 h-5 text-text-secondary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </div>
          <h2 className="font-title font-bold text-[18px] text-text-primary mb-2 group-hover:text-primary transition-colors">
            {t("nav_moderation")}
          </h2>
          <p className="font-body text-[14px] text-text-secondary leading-relaxed flex-1">
            {t("nav_moderation_desc")}
          </p>
          <div className="mt-5 flex items-center gap-1.5 font-title font-bold text-[13px] text-primary">
            {t("btn_access")}
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </Link>

        {/* Proximamente / otros módulos pueden ir aquí */}
        <div className="flex flex-col p-6 bg-bg-neutral/50 border border-dashed border-border rounded-[16px] opacity-60">
          <div className="w-12 h-12 rounded-[12px] bg-white border border-border flex items-center justify-center text-text-secondary mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-title font-bold text-[18px] text-text-primary mb-2 italic">
            {t("status_soon")}
          </h2>
          <p className="font-body text-[14px] text-text-secondary leading-relaxed">
            {t("soon_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
