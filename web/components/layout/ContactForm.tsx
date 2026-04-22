"use client";

import { useState, FormEvent, useEffect } from "react";
import { useTranslations } from "next-intl";
import { 
  User, Mail, Phone, MessageSquare, 
  Send, CheckCircle, AlertCircle, Loader2,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

interface ContactFormProps {
  lang: string;
}

type FormState = "idle" | "submitting" | "success" | "error" | "captcha_error";

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ContactForm({ lang }: ContactFormProps) {
  const t = useTranslations("contact");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  /* ReCAPTCHA Badge logic — v3 invisible */
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return;

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge) badge.remove();
      document.body.removeChild(script);
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    try {
      /* 1. Get Recaptcha Token */
      let captchaToken = "";
      const isDev = process.env.NODE_ENV === "development";

      try {
        if (window.grecaptcha && siteKey) {
          captchaToken = await window.grecaptcha.execute(siteKey, { action: "contact_submit" });
        }
      } catch (err) {
        console.warn("reCAPTCHA execution failed in frontend:", err);
      }

      // Bypass en desarrollo: permitir token vacío si estamos en local
      if (!captchaToken && !isDev) {
        setState("captcha_error");
        return;
      }

      if (!captchaToken && isDev) {
        console.log("Proceeding without captcha token (Development Bypass)");
        captchaToken = "dev-bypass-token";
      }

      /* 2. Prepare Payload */
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        area: formData.get("area"),
        message: formData.get("message"),
        lang: lang,
        captchaToken
      };

      /* 3. Send to API */
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = t("error_msg");
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch (e) {
          console.error("Non-JSON error response from server:", e);
        }
        
        setState("error");
        setErrorMsg(errorMessage);
        return;
      }

      setState("success");
      form.reset();
    } catch (err) {
      console.error("Submission error:", err);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-6 py-16 px-6 bg-white rounded-[24px] border border-border shadow-sm animate-[fadeIn_0.5s_ease-out]">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-commerce-green/10 text-commerce-green">
          <CheckCircle className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="font-title font-bold text-[24px] md:text-[28px] text-text-primary">
            {t("success_title")}
          </h2>
          <p className="font-body text-[15px] md:text-[16px] text-text-secondary max-w-[400px] leading-relaxed mx-auto">
            {t("success_msg")}
          </p>
        </div>
        <Link 
          href={`/${lang}`}
          className="mt-4 font-title font-bold text-[14px] text-primary hover:underline transition-all"
        >
          {t("back_home")}
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 md:gap-8 p-6 md:p-10 bg-white rounded-[24px] border border-border shadow-sm"
    >
      <div className="space-y-2 mb-2">
        <h2 className="font-title font-bold text-[22px] md:text-[26px] text-text-primary">
          {t("title")}
        </h2>
        <p className="font-body text-[14px] md:text-[15px] text-text-secondary leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-title font-semibold text-[13px] text-text-primary">
            {t("name_label")}
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder={t("name_placeholder")}
              className="w-full pl-11 pr-4 py-3 bg-bg-neutral border border-border rounded-[12px] font-body text-[15px] text-text-body placeholder:text-placeholder focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-title font-semibold text-[13px] text-text-primary">
            {t("email_label")}
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder={t("email_placeholder")}
              className="w-full pl-11 pr-4 py-3 bg-bg-neutral border border-border rounded-[12px] font-body text-[15px] text-text-body placeholder:text-placeholder focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="font-title font-semibold text-[13px] text-text-primary">
            {t("phone_label")}
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder={t("phone_placeholder")}
              className="w-full pl-11 pr-4 py-3 bg-bg-neutral border border-border rounded-[12px] font-body text-[15px] text-text-body placeholder:text-placeholder focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all"
            />
          </div>
        </div>

        {/* Área (Select) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="area" className="font-title font-semibold text-[13px] text-text-primary">
            {t("area_label")}
          </label>
          <div className="relative">
            <select
              id="area"
              name="area"
              required
              defaultValue=""
              className="w-full pl-4 pr-10 py-3 bg-bg-neutral border border-border rounded-[12px] font-body text-[15px] text-text-body appearance-none focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>{t("area_placeholder")}</option>
              <option value="legal">{t("area_legal")}</option>
              <option value="accounting">{t("area_accounting")}</option>
              <option value="international_trade">{t("area_international")}</option>
              <option value="ecommerce">{t("area_ecommerce")}</option>
              <option value="other">{t("area_other")}</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Mensaje */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="font-title font-semibold text-[13px] text-text-primary">
          {t("message_label")}
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-text-secondary" />
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder={t("message_placeholder")}
            className="w-full pl-11 pr-4 py-4 bg-bg-neutral border border-border rounded-[12px] font-body text-[15px] text-text-body placeholder:text-placeholder focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none min-h-[120px]"
          />
        </div>
      </div>

      {/* Errores */}
      {(state === "error" || state === "captcha_error") && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-[12px] animate-[fadeIn_0.3s_ease-out]">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="font-body text-[14px] text-red-600 font-medium">
            {state === "captcha_error" ? t("error_captcha") : errorMsg}
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-10 py-4 bg-primary text-white font-title font-bold text-[15px] rounded-[14px] shadow-sm hover:translate-y-[-2px] active:translate-y-[0] hover:shadow-lg transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {t("submit")}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
