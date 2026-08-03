// DAVFOOR LEGEND — Mantiene despierta la base de datos (Supabase)
// Lo llama un cron de Vercel una vez al día. La anon key es pública (segura aquí).
export default async function handler(req, res) {
  const U = 'https://kjulotygyqxeyafjbfhf.supabase.co';
  const K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdWxvdHlneXF4ZXlhZmpiZmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjMyODIsImV4cCI6MjA5OTc5OTI4Mn0.FABdIqyogePPnlAQxGQpGwXGiashLhrpp3oE8cDOzaE';
  try {
    const r = await fetch(`${U}/rest/v1/pedidos?select=id&limit=1`, {
      headers: { apikey: K, Authorization: `Bearer ${K}` }
    });
    return res.status(200).json({ ok: true, supabase: r.status, at: new Date().toISOString() });
  } catch (e) {
    return res.status(200).json({ ok: false, error: e.message });
  }
}
