"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Shield, Lock, Eye, EyeOff, Loader2, LogOut,
  CheckCircle, Mail, Clock, AlertCircle, 
  ChevronLeft, ExternalLink, Calendar, User, Phone, Tag
} from "lucide-react";

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  status: "pending" | "attended";
  lang: string;
  created_at: string;
}

type Tab = "pending" | "attended" | "all";

export default function AdminContactsPage() {
  const t = useTranslations("admin");
  const params = useParams();
  const lang = params.lang as string;

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState<"idle" | "loading" | "error">("idle");

  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  /* Detalle del mensaje */
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  function persistToken(t: string | null) {
    if (t) sessionStorage.setItem("admin_token", t);
    else sessionStorage.removeItem("admin_token");
    setToken(t);
  }

  const fetchRequests = useCallback(async (status: Tab) => {
    if (!token) return;
    setLoading(true);
    try {
      const statusParam = status === "all" ? "" : `status=${status}`;
      const res = await fetch(`/api/admin/contact?${statusParam}`, {
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      setRequests(data.requests ?? []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchRequests(activeTab);
  }, [token, activeTab, fetchRequests]);

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

  async function markAsAttended(id: string) {
    if (!token) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/contact`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id, status: "attended" }),
      });
      if (res.ok) {
        await fetchRequests(activeTab);
        if (selectedRequest?.id === id) {
          setSelectedRequest(prev => prev ? { ...prev, status: "attended" } : null);
        }
      }
    } finally {
      setActionLoading(null);
    }
  }

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
            <label className="font-title font-semibold text-[13px] text-text-primary">{t("password_label")}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginState("idle"); }}
                placeholder={t("password_placeholder")}
                required
                className="w-full pl-10 pr-10 py-2.5 bg-bg-neutral border border-border rounded-[8px] font-body text-[14px] outline-none focus:border-primary transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">
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
          <button type="submit" disabled={loginState === "loading"} className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white font-title font-bold text-[14px] rounded-[8px] disabled:opacity-50 transition-opacity">
            {loginState === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : t("login_btn")}
          </button>
        </form>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "pending",  label: t("tab_pending"),  icon: <Clock className="w-4 h-4" /> },
    { key: "attended", label: t("tab_attended"), icon: <CheckCircle className="w-4 h-4" /> },
    { key: "all",      label: t("tab_all"),      icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="px-4 md:px-20 py-6 md:py-12 max-w-[1440px] mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col gap-4 mb-6 md:mb-10">
        <Link href={`/${lang}/admin`} className="inline-flex items-center gap-1 text-text-secondary hover:text-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="font-title font-semibold text-[12px] md:text-[13px]">{t("btn_back_dashboard")}</span>
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
            <h1 className="font-title font-bold text-[18px] md:text-[28px] text-text-primary">{t("contacts_title")}</h1>
          </div>
          <button onClick={() => persistToken(null)} className="flex items-center gap-1.5 p-2 md:px-3 md:py-2 text-text-secondary rounded-[8px] hover:bg-bg-neutral transition-all">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline font-title font-semibold text-[13px]">{t("logout")}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-bg-neutral rounded-[10px] mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-[8px] font-title font-semibold text-[12px] md:text-[13px] transition-all ${
              activeTab === tab.key ? "bg-white text-primary shadow-sm" : "text-text-secondary"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center border border-dashed border-border rounded-[20px]">
          <Mail className="w-10 h-10 text-text-secondary opacity-30" />
          <p className="font-body text-[15px] text-text-secondary">{t("no_contacts")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((r) => (
            <div 
              key={r.id} 
              className={`flex flex-col bg-white border rounded-[16px] p-5 hover:shadow-md transition-all cursor-pointer ${
                r.status === 'pending' ? 'border-primary/10 bg-gradient-to-br from-white to-bg-soft-blue/5' : 'border-border'
              }`}
              onClick={() => setSelectedRequest(r)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full font-title font-bold text-[10px] uppercase tracking-wider ${
                  r.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-commerce-green/10 text-commerce-green'
                }`}>
                  {r.status === 'pending' ? t("status_pending") : t("status_attended")}
                </span>
                <span className="font-body text-[11px] text-text-secondary">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="space-y-3 mb-5">
                <div className="flex flex-col">
                  <h3 className="font-title font-bold text-[15px] text-text-primary line-clamp-1">{r.name}</h3>
                  <p className="font-body text-[12px] text-text-secondary truncate">{r.email}</p>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Tag className="w-3.5 h-3.5" />
                  <span className="font-body text-[12px] capitalize">{r.area.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between">
                <button className="flex items-center gap-1.5 font-title font-bold text-[12px] text-primary hover:underline">
                  {t("btn_view_details")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                {r.status === 'pending' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); markAsAttended(r.id); }}
                    disabled={actionLoading === r.id}
                    className="p-1.5 rounded-full bg-commerce-green/10 text-commerce-green hover:bg-commerce-green hover:text-white transition-all disabled:opacity-50"
                    title={t("btn_mark_attended")}
                  >
                    {actionLoading === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 animate-[fadeIn_0.2s_ease-out]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
          <div className="relative w-full max-w-[600px] bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-title font-bold text-[20px] md:text-[24px] text-text-primary">{t("details_title")}</h2>
                <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-bg-neutral rounded-full transition-colors"><Shield className="w-5 h-5 text-text-secondary rotate-45" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-soft-blue flex items-center justify-center text-primary"><User className="w-5 h-5" /></div>
                    <div><p className="text-[11px] text-text-secondary uppercase font-bold tracking-wider">{t("label_name")}</p><p className="text-[14px] font-title font-semibold">{selectedRequest.name}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-soft-blue flex items-center justify-center text-primary"><Mail className="w-5 h-5" /></div>
                    <div><p className="text-[11px] text-text-secondary uppercase font-bold tracking-wider">{t("label_email")}</p><p className="text-[14px] font-body">{selectedRequest.email}</p></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-soft-blue flex items-center justify-center text-primary"><Phone className="w-5 h-5" /></div>
                    <div><p className="text-[11px] text-text-secondary uppercase font-bold tracking-wider">{t("label_phone")}</p><p className="text-[14px] font-body">{selectedRequest.phone}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-bg-soft-blue flex items-center justify-center text-primary"><Tag className="w-5 h-5" /></div>
                    <div><p className="text-[11px] text-text-secondary uppercase font-bold tracking-wider">{t("label_area")}</p><p className="text-[14px] font-body capitalize">{selectedRequest.area.replace('_', ' ')}</p></div>
                  </div>
                </div>
              </div>

              <div className="bg-bg-neutral p-6 rounded-[16px] mb-6">
                <p className="text-[11px] text-text-secondary uppercase font-bold tracking-wider mb-3">Mensaje</p>
                <div className="text-[14px] text-text-body leading-relaxed whitespace-pre-line font-body">{selectedRequest.message}</div>
              </div>

              <div className="flex items-center gap-4 text-[12px] text-text-secondary">
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(selectedRequest.created_at).toLocaleString()}</div>
                <div className="flex items-center gap-1.5 capitalize"><Shield className="w-4 h-4" /> Lang: {selectedRequest.lang}</div>
              </div>
            </div>

            <div className="p-4 bg-bg-neutral/50 border-t border-border flex items-center justify-end gap-3">
              <button onClick={() => setSelectedRequest(null)} className="px-5 py-2.5 font-title font-semibold text-[14px] text-text-secondary hover:text-text-body transition-all">{t("details_close")}</button>
              {selectedRequest.status === 'pending' && (
                <button 
                  onClick={() => markAsAttended(selectedRequest.id)}
                  disabled={actionLoading === selectedRequest.id}
                  className="px-6 py-2.5 bg-commerce-green text-white font-title font-bold text-[14px] rounded-[10px] flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {actionLoading === selectedRequest.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  {t("btn_mark_attended")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
