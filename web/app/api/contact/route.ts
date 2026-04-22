import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, area, message, lang, captchaToken } = body;

    /* 1. Verify reCAPTCHA v3 */
    // Bypass en desarrollo para facilitar pruebas locales
    const isDev = process.env.NODE_ENV === "development";
    let captchaValid = false;
    let captchaData = null;

    if (isDev && !process.env.RECAPTCHA_SECRET_KEY) {
      console.log("reCAPTCHA bypass active in development (no secret key found)");
      captchaValid = true;
    } else {
      const recaptchaRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
        { method: "POST" }
      );
      captchaData = await recaptchaRes.json();
      captchaValid = captchaData.success && captchaData.score >= 0.5;
    }

    if (!captchaValid) {
      console.warn("reCAPTCHA validation failed:", captchaData);
      return NextResponse.json(
        { 
          error: "Captcha verification failed", 
          details: captchaData?.["error-codes"] || "Low score" 
        }, 
        { status: 400 }
      );
    }

    /* 2. Save to Supabase (Admin role to bypass RLS) */
    const { data: request, error: dbError } = await supabaseAdmin
      .from("contact_requests")
      .insert([
        {
          name,
          email,
          phone,
          area,
          message,
          lang: lang || "es",
          status: "pending"
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
    }

    /* 3. Send Notifications via Resend */
    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Deep Brain Markets <onboarding@resend.dev>";
    
    // 3.1. Email to the Owner
    await resend.emails.send({
      from: fromEmail,
      to: process.env.CONTACT_NOTIFICATION_EMAIL || "info@deepbrainmarkets.com",
      replyTo: email, // Permite que el admin responda directamente al cliente
      subject: `Nueva Solicitud de Contacto: ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #002D5D; margin-top: 0;">Nueva Solicitud de Contacto</h2>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="margin: 5px 0;"><strong>Nombre:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${phone}</p>
          <p style="margin: 5px 0;"><strong>Área de Interés:</strong> ${area.toUpperCase()}</p>
          <div style="margin-top: 20px;">
            <p style="font-weight: bold; margin-bottom: 5px;">Mensaje:</p>
            <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; border-left: 4px solid #002D5D; font-style: italic;">
              ${message.replace(/\n/g, '<br/>')}
            </div>
          </div>
          <p style="font-size: 11px; color: #94A3B8; margin-top: 30px;">Recibido desde: ${lang.toUpperCase()} | Deep Brain Markets Portal</p>
        </div>
      `,
    });

    // 3.2. Confirmation Email to the Client (Localized)
    const isEn = lang === "en";
    const clientSubject = isEn 
      ? "We have received your message - Deep Brain Markets" 
      : "Hemos recibido tu mensaje - Deep Brain Markets";
    
    const clientHtml = isEn
      ? `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #002D5D; margin-top: 0;">Hello ${name},</h2>
          <p>Thank you for contacting <strong>Deep Brain Markets</strong>.</p>
          <p>We have successfully received your inquiry regarding <strong>${area.replace(/_/g, ' ')}</strong>. One of our experts will review your request and get in touch with you shortly.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-weight: bold;">Deep Brain Markets Team</p>
            <p style="margin: 0; font-size: 13px; color: #64748B;">Strategic Dual Consultancy</p>
          </div>
        </div>
      `
      : `
        <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 12px;">
          <h2 style="color: #002D5D; margin-top: 0;">Hola ${name},</h2>
          <p>Gracias por ponerte en contacto con <strong>Deep Brain Markets</strong>.</p>
          <p>Hemos recibido correctamente tu consulta sobre el área de <strong>${area.replace(/_/g, ' ')}</strong>. Uno de nuestros expertos revisará tu mensaje y se pondrá en contacto contigo a la brevedad.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin: 0; font-weight: bold;">Equipo de Deep Brain Markets</p>
            <p style="margin: 0; font-size: 13px; color: #64748B;">Consultoría Estratégica Dual</p>
          </div>
        </div>
      `;

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: clientSubject,
      html: clientHtml,
    });

    return NextResponse.json({ success: true, id: request.id });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
