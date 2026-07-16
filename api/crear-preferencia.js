// DAVFOOR LEGEND — Crear preferencia de pago (Mercado Pago Checkout Pro)
// La clave secreta va en la variable de entorno MP_ACCESS_TOKEN (en Vercel), nunca aquí.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  try {
    const { items = [], payer = {}, metodo = 'contado' } = req.body || {};
    const preferencia = {
      items: items.map(i => ({ title: String(i.title).slice(0,250), quantity: Number(i.quantity)||1, unit_price: Number(i.unit_price), currency_id: 'COP' })),
      payer: { name: payer.nombre, email: payer.correo, phone: payer.celular ? { number: String(payer.celular) } : undefined },
      metadata: { metodo },
      back_urls: { success: `${process.env.SITE_URL||''}/gracias.html`, failure: `${process.env.SITE_URL||''}/carrito.html`, pending: `${process.env.SITE_URL||''}/gracias.html` },
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
