// DAVFOOR LEGEND — Crear preferencia de pago (Mercado Pago Checkout Pro)
// La clave secreta va en la variable de entorno MP_ACCESS_TOKEN (en Vercel), nunca aquí.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const { items = [], payer = {}, metodo = 'contado', ref = '', pedido = null } = req.body || {};
    const SITE = process.env.SITE_URL || '';
    const preferencia = {
      items: items.map(i => ({ title: String(i.title).slice(0,250), quantity: Number(i.quantity)||1, unit_price: Number(i.unit_price), currency_id: 'COP' })),
      payer: { name: payer.nombre, email: payer.correo, phone: payer.celular ? { number: String(payer.celular) } : undefined },
      // Guardamos el pedido completo aquí para poder enviar el correo cuando el pago sea aprobado (webhook).
      metadata: { metodo, ref, pedido_json: pedido ? JSON.stringify(pedido) : '' },
      external_reference: ref || undefined,
      // Mercado Pago avisará a esta URL cuando cambie el estado del pago.
      notification_url: SITE ? `${SITE}/api/mp-webhook` : undefined,
      back_urls: { success: `${SITE}/gracias.html`, failure: `${SITE}/carrito.html`, pending: `${SITE}/gracias.html` },
      auto_return: 'approved',
    };
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method:'POST', headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${process.env.MP_ACCESS_TOKEN}` }, body: JSON.stringify(preferencia),
    });
    const data = await r.json();
    if(!r.ok) return res.status(r.status).json({ error:data });
    return res.status(200).json({ id:data.id, init_point:data.init_point });
  } catch(e){ return res.status(500).json({ error:e.message }); }
}
