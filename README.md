# 🏆 DAVFOOR LEGEND — Tienda online

Tienda de camisetas de fútbol (actuales y retro), botilitos y gorras personalizadas.

Este repositorio contiene el **código completo del frontend** (lo que ve el cliente) más una
**función de pago para Mercado Pago**. Está pensado para que puedas subirlo a GitHub y publicarlo
tú misma, siguiendo los pasos de abajo. No necesitas saber programar para publicarlo.

---

## 📁 Qué hay en cada archivo

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Página de inicio (más vendidos, filtros por selección/club, actuales/retro) |
| `producto.html` | Detalle de una camiseta (fotos, historia, tallas, personalización) |
| `carrito.html` | Carrito, datos de envío/facturación y formas de pago |
| `admin.html` | Panel privado de inventario (solo para ustedes) |
| `assets/img/` | Logos de la marca |
| `data/productos.json` | Catálogo de ejemplo (luego lo reemplaza una base de datos) |
| `api/crear-preferencia.js` | Conexión segura con Mercado Pago |
| `.env.example` | Ejemplo de dónde van las claves (las reales NO se suben) |

---

## 👀 1. Verla en tu computador (sin publicar)

Descomprime la carpeta y haz **doble clic en `index.html`**. Se abre en tu navegador.
Desde ahí puedes navegar a las demás páginas. (Los pagos reales solo funcionan una vez publicada; ver paso 4.)

---

## 🐙 2. Subir el repositorio a GitHub

**Opción fácil (sin comandos):**
1. Entra a https://github.com y crea una cuenta (si no tienes).
2. Botón **New repository** → nombre `davfoor-legend-tienda` → **Create repository**.
3. En la página del repo vacío, haz clic en **uploading an existing file**.
4. Arrastra **todos los archivos y carpetas** de esta tienda y haz **Commit changes**. ✅

**Opción con comandos (si usas Git):**
```bash
git init
git add .
git commit -m "Primera versión de la tienda DAVFOOR LEGEND"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/davfoor-legend-tienda.git
git push -u origin main
```

---

## 🌐 3. Publicarla gratis en internet

Elige **una** de estas opciones (todas tienen plan gratis):

**Opción A — Vercel (recomendada, porque permite los pagos):**
1. Entra a https://vercel.com y regístrate con tu cuenta de GitHub.
2. **Add New → Project** → elige el repositorio `davfoor-legend-tienda` → **Deploy**.
3. En segundos te da un enlace público (ej: `davfoor-legend-tienda.vercel.app`).
4. Más adelante conectas tu dominio propio (`davfoorlegend.com`) desde **Settings → Domains**.

**Opción B — Netlify:** parecido a Vercel, también gratis y con funciones.

**Opción C — GitHub Pages:** la más simple, pero **NO** ejecuta la función de pago
(`api/`). Sirve para mostrar la tienda, no para cobrar. Úsala solo como vitrina.

> Para **cobrar de verdad** con Mercado Pago necesitas Vercel o Netlify (opciones A o B).

---

## 💳 4. Conectar Mercado Pago (cuando estés lista)

1. Entra a tu cuenta de Mercado Pago → panel de **Desarrolladores** → **Credenciales de producción**.
2. Copia tu **Access Token** (la clave **SECRETA**).
3. En Vercel: **Settings → Environment Variables** y crea:
   - `MP_ACCESS_TOKEN` = tu Access Token secreto
   - `SITE_URL` = la dirección de tu tienda (ej: `https://davfoorlegend.com`)
4. Vuelve a desplegar (**Redeploy**). Listo: el botón de pago llevará al cliente a la página
   oficial de Mercado Pago.

### 🔒 Seguridad — muy importante
- El **Access Token** es como la llave de tu caja registradora.
- **Nunca** lo escribas dentro del código ni lo subas a GitHub.
- Va **solo** en las "Environment Variables" de Vercel/Netlify (por eso `.env` está bloqueado en `.gitignore`).

---

## 🧩 5. Qué falta para que sea 100% automática

El frontend y el inventario ya funcionan visualmente. Para que los datos se **guarden de verdad**
y todo quede conectado, el siguiente paso es agregar una **base de datos** (por ejemplo Supabase,
con plan gratis) que:

- Guarde productos, fotos y stock editados desde `admin.html`.
- Guarde los pedidos.
- Muestre "Agotado" en la tienda cuando el stock llega a 0.

Y para los mensajes automáticos: WhatsApp Business API + un servicio de correo, y la conexión con
Interrapidísimo para guías y rastreo.

---

## 💰 Recordatorio de reglas del negocio
- Camisetas **actuales**: $110.000 · **retro**: $130.000 · Personalización (nombre + dorsal): +$15.000
- **Botilito**: $50.000 · con nombre personalizado: +$15.000 (diseño estándar de club/selección/jugador)
- **Gorra bordada**: $30.000 (escudo o palabra del jugador)
- **Envío**: $18.000 · **gratis** desde $300.000 (solo pago de contado)
- **Contra entrega**: anticipo de $30.000; el resto y el envío se pagan al recibir con Interrapidísimo
- **Addi**: recargo del 10% al cliente; el envío se paga al recibir con Interrapidísimo

---

Hecho con ⚽ para DAVFOOR LEGEND.
