# 🏆 DAVFOOR LEGEND — Tienda online

Tienda de camisetas de fútbol (actuales y retro), botilitos y gorras personalizadas.
Diseño **responsive**: se ve bien en celular y en computador (PC).

## 📁 Archivos
| Archivo | Para qué |
|---|---|
| `index.html` | Inicio (más vendidos, filtros, accesorios) |
| `producto.html` | Detalle de camiseta (tallas, personalización) |
| `carrito.html` | Carrito, envío/facturación y pagos |
| `admin.html` | Panel privado de inventario |
| `assets/img/` | Logos |
| `data/productos.json` | Catálogo de ejemplo |
| `api/crear-preferencia.js` | Conexión con Mercado Pago |

## 🌐 Publicar (resumen)
1. Sube todos los archivos a un repositorio de **GitHub**.
2. En **Vercel**, importa el repositorio y dale **Deploy**. Te da un enlace público.
3. Conecta tu dominio (`davfoorlegend.com`) desde **Settings → Domains**.

> Para cobrar con Mercado Pago usa **Vercel o Netlify** (no GitHub Pages).

## 💳 Conectar Mercado Pago
En Vercel → Settings → Environment Variables, crea:
- `MP_ACCESS_TOKEN` = tu Access Token **secreto** (nunca lo subas al código)
- `SITE_URL` = la dirección de tu tienda

## 🔄 Actualizar la página
Cuando cambies un archivo, súbelo de nuevo a GitHub (reemplaza el anterior) y Vercel vuelve a publicar solo.

## 💰 Reglas del negocio
- Actuales: $110.000 · Retro: $130.000 · Personalización (nombre + dorsal): +$15.000
- Botilito: $50.000 (+ nombre $15.000) · Gorra bordada: $30.000
- Envío: $18.000 · gratis desde $300.000 (pago de contado)
- Contra entrega: anticipo $30.000; resto y envío al recibir con Interrapidísimo
- Addi: recargo del 10%; envío al recibir con Interrapidísimo

Hecho con ⚽ para DAVFOOR LEGEND.
