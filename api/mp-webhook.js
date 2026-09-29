// DAVFOOR LEGEND — Webhook de Mercado Pago
// Cuando un pago es APROBADO, envía el correo de confirmación (tienda + cliente).
// Usa MP_ACCESS_TOKEN y SITE_URL (variables de entorno en Vercel).
export default async function handler(req, res) {
  try {
    const q = req.query || {};
    const body = req.body || {};
    // MP manda el id del pago por query (?data.id= / ?id=) o en el body (data.id / id)
    let paymentId = q['data.id'] || q.id || (body.data && body.data.id) || body.id || null;
    const topic = q.type || q.topic || body.type || body.action || '';
    // Si el aviso claramente NO es de un pago, lo ignoramos
    if (topic && !/payment/i.test(String(topic))) return res.status(200).json({ ok: true, skip: topic });
    if (!paymentId) return res.status(200).json({ ok: true, skip: 'sin id' });

    const TOKEN = process.env.MP_ACCESS_TOKEN;
    const SITE = process.env.SITE_URL || '';
    // Consultamos el pago real en Mercado Pago (fuente de verdad)
    const pr = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const pago = await pr.json();
    if (!pr.ok) return res.status(200).json({ ok: false, error: pago });

    if (pago.status === 'approved') {
      let pedido = null;
      try { const md = pago.metadata || {}; pedido = md.pedido_json ? JSON.parse(md.pedido_json) : null; } catch (e) {}
      if (pedido && SITE) {
        pedido.pago = 'pagado';
        await fetch(`${SITE}/api/enviar-correo`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pedido),
        });
      }
      // Marcar el pedido como PAGADO en el panel (Supabase). La anon key es pública (ya va en el sitio).
      try {
        const ref = pago.external_reference;
        if (ref) {
          const SB_URL = 'https://kjulotygyqxeyafjbfhf.supabase.co';
          const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdWxvdHlneXF4ZXlhZmpiZmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjMyODIsImV4cCI6MjA5OTc5OTI4Mn0.FABdIqyogePPnlAQxGQpGwXGiashLhrpp3oE8cDOzaE';
          await fetch(`${SB_URL}/rest/v1/rpc/marcar_pagado`, {
            method: 'POST',
            headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ r: ref }),
          });
        }
      } catch (e) {}
    }
    return res.status(200).json({ ok: true, status: pago.status });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
