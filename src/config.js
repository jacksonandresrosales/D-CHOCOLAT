// Número de WhatsApp que recibe los pedidos y sugerencias (formato internacional, sin "+").
// Cámbialo por el número real de la tienda antes de publicar.
export const WHATSAPP = '593999999999'

export const ENVIO = 3 // costo de envío a domicilio en USD
export const ENVIO_GRATIS = 25 // desde este subtotal el envío a domicilio no se cobra

export const waLink = (texto) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`

export const usd = (n) => `$${n.toFixed(2)}`
