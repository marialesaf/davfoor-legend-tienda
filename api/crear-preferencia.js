// ============================================================
//  DAVFOOR LEGEND — Crear preferencia de pago (Mercado Pago)
//  Función "serverless" (se ejecuta en Vercel/Netlify).
//
//  IMPORTANTE (seguridad):
//  - Tu clave SECRETA (Access Token) NO va escrita aquí.
//  - Se guarda como "variable de entorno" llamada MP_ACCESS_TOKEN
//    en el panel de Vercel/Netlify. Nunca la subas a GitHub.
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    const { items = [], payer = {}, metodo = 'contado' } = req.body || {};

    // Construye la preferencia con los productos del carrito
    const preferencia = {
      items: items.map(i => ({
        title: String(i.title).slice(0, 250),
        quantity: Number(i.quantity) || 1,
        unit_price: Number(i.unit_price),
        currency_id: 'COP',
      })),
      payer: {
        name: payer.nombre,
        email: payer.correo,
        phone: payer.celular ? { number: String(payer.celular) } : undefined,
      },
      metadata: { metodo },
      back_urls: {
        success: `${process.env.SITE_URL || ''}/gracias.html`,
        failure: `${process.env.SITE_URL || ''}/carrito.html`,
        pending: `${process.env.SITE_URL || ''}/gracias.html`,
      },
      auto_return: 'approved',
    };

    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preferencia),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data });

    // init_point = la URL oficial de Mercado Pago a donde se redirige al cliente
    return res.status(200).json({ id: data.id, init_point: data.init_point });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
