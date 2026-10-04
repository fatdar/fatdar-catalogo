# FATDAR Store

Tienda estática premium con estética anime dark/underground, catálogo conectado a Google Sheets y páginas ES/EN (`/` y `/en/`). La hoja es editable por el propietario y se consume en modo de solo lectura por la tienda.

**[Abrir la hoja editable de FATDAR](https://docs.google.com/spreadsheets/d/1TQM0CIUP1Zt9B7Bv1vr3Pdz4CDXXjQhWx8_ZBqYcTPo/edit)**

## Cargar el catálogo

En `Productos`, agrega una fila por artículo. Selecciona en `category` una de estas categorías: `Android`, `iOS`, `Diamantes`, `Fragmentos de armas`, `Pases`, `Números virtuales` o `Modificaciones iOS`. La tienda las agrupa automáticamente, sin importar mayúsculas o acentos.

Completa `id`, `name`, `category`, `description`, `image_url`, `badge`, `sort_order` y `active`. Las columnas `name_en`, `category_en`, `description_en` y `badge_en` son traducciones opcionales. Usa una URL HTTPS pública para la foto; en Google Drive, comparte el archivo con acceso de lectura.

En `Opciones`, agrega una fila por alternativa: `product_id` debe coincidir con el `id` del producto; `option_name`, `price`, `duration` y `active` completan la oferta. `option_name_en` y `duration_en` son traducciones opcionales. El precio se interpreta en la moneda de `Configuracion` (COP por defecto). Al abrir la foto, el cliente verá alternativas, precio y duración; al elegir, irá a WhatsApp con el mensaje precargado.

No cargué productos, fotos, precios ni duraciones inventados; `Productos` y `Opciones` quedan listas para recibir los datos reales.

## Textos y traducciones

`Configuracion` utiliza `key` / `value`. Las etiquetas de categoría están en español y tienen valores `_en`. Para otros textos, agrega una clave con sufijo `_en`, por ejemplo `hero_title_en`, `meta_description_en` o `community_text_en`. Si falta una traducción de interfaz, se usa el diccionario inglés incluido.

## SEO y publicación

Las rutas `/` y `/en/` incluyen contenido inicial semántico, metadatos de título/descripción/keywords, Open Graph, Twitter Cards e información estructurada. `manus-routes.json` declara ambas páginas y el paquete incluye `fatdar-og.jpg` (1200 × 675) y `fatdar-hero.webp`.

No se inventan `canonical`, `og:url` ni `hreflang` absolutos mientras no haya dominio público real. El sitemap e indexación efectiva se resuelven al publicar con un dominio propio; el Preview es para revisión.
