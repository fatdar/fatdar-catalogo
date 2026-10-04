# FATDAR — guía rápida del catálogo

**[Abrir el Google Sheet de FATDAR](https://docs.google.com/spreadsheets/d/1TQM0CIUP1Zt9B7Bv1vr3Pdz4CDXXjQhWx8_ZBqYcTPo/edit)**

## Todo se llena en Productos

Solo verás la pestaña **Productos**. Las pestañas `Precios` y `Configuracion` están ocultas y preservadas; no necesitas abrirlas.

**Cada fila es una oferta completa** y la tienda toma de esa fila el producto, su imagen, la cantidad, el precio y la duración. Completa los campos que tienen encabezado; al seleccionar el encabezado verás una nota con qué poner. `Categoría` y `Activo` tienen menús desplegables; los filtros de la primera fila ayudan a buscar ofertas.

| Columna | Qué poner |
|---|---|
| **ID del producto** | Un código corto. Repite exactamente el mismo ID para todas las variantes del mismo producto; usa otro ID para otro producto. |
| **Categoría** | Elige Android, iOS, Diamantes, Fragmentos de armas, Pases, Números virtuales o Modificaciones iOS. |
| **Producto** | Nombre que verá el comprador. |
| **Descripción** | Una explicación corta de la oferta. |
| **Foto URL** | Enlace público de la imagen; más abajo se explica cómo obtenerlo con Google Drive. |
| **Opción / Paquete** | Nombre de esta alternativa, por ejemplo “Paquete básico” o “30 días”. |
| **Cantidad / unidad** | Qué recibe y cuánto, por ejemplo “100 diamantes” o “1 número virtual”. |
| **Precio (COP)** | Solo el número, sin `$` ni puntos de miles. |
| **Tiempo / duración** | Plazo de la oferta, por ejemplo “30 días”, “Permanente” o “No aplica”. |
| **Activo** | `Sí` para mostrar esa fila; `No` para ocultarla sin borrar la información. |

Las columnas de traducción al inglés están ocultas a la derecha; son opcionales.

## Varias opciones para el mismo producto

Agrega **una fila por cada paquete/precio/duración**. Repite el mismo ID, categoría, nombre, descripción y foto; cambia **Opción / Paquete**, **Cantidad / unidad**, **Precio (COP)** o **Tiempo / duración**. La web juntará esas filas en una tarjeta y cada alternativa aparecerá como una opción separada.

Para ocultar una oferta, elige `No` en **Activo**. Para quitarla definitivamente, elimina su fila. No borres el ID de las otras opciones del mismo producto.

## Cómo obtener el enlace de la foto

1. Sube la imagen a Google Drive.
2. En Drive, abre **Compartir** y cambia **Acceso general** a **Cualquier persona con el enlace — Lector**.
3. Copia el enlace del archivo y pégalo en **Foto URL**. También se acepta un enlace directo público a una imagen `.jpg` o `.png`.
4. Prueba abrir el enlace en una ventana privada: si la imagen se ve sin iniciar sesión, la tienda también podrá cargarla.

La tienda puede leer la hoja, pero **no se da permiso público de edición**. Para administrar el catálogo, edita la hoja con la cuenta autorizada. No agregué productos, fotos, cantidades, precios ni duraciones ficticios.
