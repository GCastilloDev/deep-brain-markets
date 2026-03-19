/* Número de WhatsApp de Deep Brain Markets (con código de país) */
const WHATSAPP_NUMBER = "525533163066";

/* Genera un link de WhatsApp con mensaje pre-cargado */
export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
