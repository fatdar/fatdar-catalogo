# FATDAR — tienda bilingüe, SEO y hoja autogestionable

## Enfoque de implementación

La vista pública conserva las páginas ES/EN, el catálogo oscuro y la sincronización pública en modo lector. Para la administración diaria, la única pestaña visible será **Productos**. Cada fila representa una oferta concreta: producto, categoría, descripción, foto, opción/paquete, cantidad, precio COP, duración y estado, todo junto para no tener que saltar entre pestañas.

El mismo `ID del producto` agrupa las distintas opciones de un producto. Si un artículo tiene tres paquetes o duraciones, se repiten el ID y los datos descriptivos en tres filas; se cambia la opción, cantidad, precio o tiempo. La tienda agrupa esas filas bajo una sola tarjeta y presenta cada fila como una opción elegible en el modal. Los productos se agregan una sola vez al mismo tab; los precios no se administran aparte.

Las columnas principales llevan encabezados en español, notas de ayuda, menú de categoría, selector `Sí/No`, fila de encabezado congelada y formato de precio COP. Las columnas de traducción EN quedan ocultas al extremo derecho. Las pestañas `Precios` y `Configuracion` quedan ocultas, no borradas, por compatibilidad y preservación de todos sus datos/configuración. No se harán filas ficticias.

Categorías permitidas: Android, iOS, Diamantes, Fragmentos de armas, Pases, Números virtuales y Modificaciones iOS. No se incorporan doxxing ni spam.

Cada ruta ES/EN mantiene contenido semántico y SEO por idioma. Sin un dominio público configurado, no se inventan `canonical`, `og:url` ni `hreflang` absolutos; sitemap/indexación efectiva se resuelven al publicar.

## Dirección de diseño conservada

- **Movimiento:** fanzine de anime oscuro y cartel de fantasía infernal noventera; sin copiar personajes o marcas existentes.
- **Principios:** negrura legible, contraste dramático, gestos de tinta y catálogo funcional; atmósfera infernal sin gore ni clichés hacker.
- **Color:** carbón/obsidiana, carmesí, hueso y contraluz de humo; el rojo es el color firma.
- **Composición:** portada asimétrica, ticker lento, catálogo por secciones, proceso de compra, comunidad y footer; móvil accesible.
- **Motivos:** sello FATDAR con cuernos estilizados, aro editorial quebrado y marcas de impresión discretas.
- **Interacción/animación:** transiciones breves, marquee con `prefers-reduced-motion`, selector de idioma y navegación móvil claros.
- **Tipografía:** Barlow Condensed para titulares; DM Sans para lectura/controles; DM Mono para etiquetas.
- **Esencia y voz:** catálogo nocturno, directo y expresivo; “Mira la opción. Elige.” / “See the option. Make your move.”
- **Wordmark:** FATDAR en altas condensadas con F y cuernos abstractos en un sello irregular.

## Estructura del proyecto

- `index.html`, `en/index.html`: páginas ES/EN y contenido inicial rastreable.
- `styles.css`: diseño compartido, responsive y accesible.
- `app.js`: lectura de Productos, normalización de encabezados, agrupación por ID, opciones, precio/cantidad/duración y WhatsApp.
- `i18n.js`: traducciones y traducciones opcionales de Sheets.
- `manus-routes.json`: rutas `/` y `/en/`.
- `fatdar-mark.svg`, `fatdar-hero.webp`, `fatdar-og.jpg`, `app.config.ts`: identidad y metadata.
- `README.md`: paso a paso de una sola pestaña visible.

`Precios` y `Configuracion` permanecen ocultos y preservados. `Productos` seguirá vacío hasta que el cliente/propietario ingrese su inventario real.
