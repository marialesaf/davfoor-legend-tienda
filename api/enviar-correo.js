// DAVFOOR LEGEND — Envía correos con Resend al hacerse un pedido
// Variables de entorno en Vercel (Settings -> Environment Variables):
//   RESEND_API_KEY  = tu API key de Resend (secreta)
//   FROM_EMAIL      = "DAVFOOR LEGEND <pedidos@davfoorlegend.com>"  (dominio verificado en Resend)
//   ADMIN_EMAIL     = correo donde quieres recibir los pedidos (tu Gmail del negocio)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const KEY   = process.env.RESEND_API_KEY;
  const FROM  = process.env.FROM_EMAIL || 'DAVFOOR LEGEND <onboarding@resend.dev>';
  const ADMIN = process.env.ADMIN_EMAIL;
  if (!KEY) return res.status(200).json({ ok: false, skipped: 'Falta RESEND_API_KEY' });

  const fmt = n => '$' + Number(n || 0).toLocaleString('es-CO');
  const esc = s => String(s || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  try {
    const p = req.body || {};
    const filas = (p.items || []).map(i =>
      `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee">${(i.cant||1)}× ${esc(i.team||i.nombre||'Producto')}${i.talla?' · Talla '+esc(i.talla):''}</td>
        <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">${fmt(i.precio)}</td>
      </tr>`).join('');

    const resumen = `
      <table style="width:100%;border-collapse:collapse;font-size:14px;color:#111">${filas}
        <tr><td style="padding:10px 0;font-weight:800">Total</td>
            <td style="padding:10px 0;text-align:right;font-weight:800;color:#159a3f">${fmt(p.total)}</td></tr>
      </table>`;

    const bloque = (titulo, cuerpo) => `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:14px;overflow:hidden">
        <div style="background:#0a0a0a;color:#3fe167;padding:16px 20px;font-weight:900;font-size:16px;letter-spacing:.5px">DAVFOOR LEGEND ⚽</div>
        <div style="padding:20px">${titulo}${cuerpo}</div>
        <div style="padding:14px 20px;color:#888;font-size:12px;border-top:1px solid #eee">DAVFOOR LEGEND · Camisetas de fútbol</div>
      </div>`;

    // Correo para la TIENDA (admin)
    const adminBody = `
      <p style="font-size:14px;color:#333">Datos del cliente:</p>
      <p style="font-size:14px;color:#111;line-height:1.7">
        <b>Nombre:</b> ${esc(p.cliente)}<br>
        <b>Cédula:</b> ${esc(p.cedula)}<br>
        <b>Celular:</b> ${esc(p.celular)}<br>
        <b>Correo:</b> ${esc(p.correo)}<br>
        <b>Dirección:</b> ${esc(p.direccion)}<br>
        <b>Ciudad:</b> ${esc(p.ciudad)}${p.departamento?', '+esc(p.departamento):''}<br>
        <b>Método de pago:</b> ${esc(p.metodo)}${p.notas?('<br><b>Notas:</b> '+esc(p.notas)):''}
      </p>
      <h3 style="font-size:14px;margin:16px 0 6px">Pedido</h3>${resumen}`;
    const adminHtml = bloque(`<h2 style="font-size:18px;margin:0 0 10px">🆕 Nuevo pedido</h2>`, adminBody);

    // Correo para el CLIENTE (confirmación)
    const nombreCli = (p.cliente || '').split(' ')[0] || '';
    const clienteBody = `
      <p style="font-size:14px;color:#333">¡Gracias por tu compra! Recibimos tu pedido y ya lo estamos gestionando. Te avisaremos por WhatsApp y correo cuando cambie de estado.</p>
      <h3 style="font-size:14px;margin:16px 0 6px">Resumen de tu pedido</h3>${resumen}
      <p style="font-size:13px;color:#555;margin-top:14px">Envío a: ${esc(p.direccion)}, ${esc(p.ciudad)}. Entrega estimada de 3 a 4 días hábiles.</p>`;
    const clienteHtml = bloque(`<h2 style="font-size:18px;margin:0 0 10px">¡Hola ${esc(nombreCli)}! Tu pedido está confirmado ✅</h2>`, clienteBody);

    const enviar = (to, subject, html) => fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [to], subject, html })
    });

    const out = {};
    if (ADMIN)   { const r = await enviar(ADMIN, `🆕 Nuevo pedido — ${p.cliente || 'Cliente'} (${fmt(p.total)})`, adminHtml); out.admin = r.status; }
    if (p.correo){ const r = await enviar(p.correo, 'Confirmación de tu pedido — DAVFOOR LEGEND', clienteHtml); out.cliente = r.status; }

    return res.status(200).json({ ok: true, out });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
