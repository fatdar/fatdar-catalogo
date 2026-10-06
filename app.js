const FATDAR_SHEET_ID = '1TQM0CIUP1Zt9B7Bv1vr3Pdz4CDXXjQhWx8_ZBqYcTPo';
const GOOGLE_GVIZ = `https://docs.google.com/spreadsheets/d/${FATDAR_SHEET_ID}/gviz/tq`;
const DEFAULT_GROUP = 'https://chat.whatsapp.com/HGdGnYAa3q1BrjX7TWFFol?mode=gi_t';
const DEFAULT_PHONE = '573104597592';

const FIXED_CATEGORIES = [
  { id: 'android', key: 'category_android', fallback: 'Android', aliases: ['android', 'androides'], symbol: 'A' },
  { id: 'ios', key: 'category_ios', fallback: 'iOS', aliases: ['ios', 'iphone', 'apple'], symbol: '⌘' },
  { id: 'diamantes', key: 'category_diamonds', fallback: 'Diamantes', aliases: ['diamantes', 'diamante', 'diamonds', 'diamond'], symbol: '◇' },
  { id: 'fragmentos-armas', key: 'category_weapon_fragments', fallback: 'Fragmentos de armas', aliases: ['fragmentos de armas', 'fragmento de armas', 'fragmentos', 'weapon fragments', 'weapon fragment'], symbol: '⌖' },
  { id: 'pases', key: 'category_passes', fallback: 'Pases', aliases: ['pases', 'pase', 'passes', 'pass'], symbol: '↗' },
  { id: 'numeros-virtuales', key: 'category_virtual_numbers', fallback: 'Números virtuales', aliases: ['números virtuales', 'numero virtual', 'virtual numbers', 'virtual number'], symbol: '⌁' },
  { id: 'modificaciones-ios', key: 'category_ios_modifications', fallback: 'Modificaciones iOS', aliases: ['modificaciones ios', 'modificación ios', 'ios modifications', 'ios modification'], symbol: '⌘' },
];

const HEADER_MAP = Object.freeze({
  id: 'id', sku: 'id', codigo: 'id',
  product_id: 'product_id', id_producto: 'product_id', id_del_producto: 'product_id', idproducto: 'product_id',
  name: 'name', name_es: 'name', nombre: 'name', producto: 'name', producto_es: 'name',
  category: 'category', categoria: 'category', seccion: 'category',
  description: 'description', descripcion: 'description', detalle: 'description',
  image_url: 'image_url', foto_url: 'image_url', foto_url_publica: 'image_url', imagen_url: 'image_url', foto: 'image_url', imagen: 'image_url',
  active: 'active', activo: 'active', estado: 'active',
  name_en: 'name_en', nombre_en: 'name_en', producto_en: 'name_en',
  category_en: 'category_en', categoria_en: 'category_en',
  description_en: 'description_en', descripcion_en: 'description_en',
  badge: 'badge', etiqueta: 'badge', distintivo: 'badge',
  badge_en: 'badge_en', etiqueta_en: 'badge_en',
  sort_order: 'sort_order', orden: 'sort_order',
  option_name: 'option_name', opcion: 'option_name', nombre_opcion: 'option_name', plan: 'option_name',
  opcion_paquete: 'option_name', cantidad: 'quantity', cantidad_unidad: 'quantity', cantidad_en: 'quantity_en',
  option_name_en: 'option_name_en', opcion_en: 'option_name_en', nombre_opcion_en: 'option_name_en',
  price: 'price', precio: 'price', precio_cop: 'price',
  duration: 'duration', duracion: 'duration', vigencia: 'duration', tiempo_duracion: 'duration',
  duration_en: 'duration_en', duracion_en: 'duration_en',
});

const ui = {
  heroTitle: document.querySelector('#hero-title'),
  navWhatsapp: document.querySelector('#whatsapp-nav'),
  groupNav: document.querySelector('#group-nav'),
  groupFooter: document.querySelector('#footer-group'),
  whatsappFooter: document.querySelector('#footer-whatsapp'),
  closingWhatsapp: document.querySelector('#closing-whatsapp'),
  communityLink: document.querySelector('#community-link'),
  catalogTools: document.querySelector('#catalog-tools'),
  catalogMeta: document.querySelector('#catalog-meta'),
  categorySections: document.querySelector('#category-sections'),
  productCount: document.querySelector('#product-count'),
  syncState: document.querySelector('#sync-state'),
  search: document.querySelector('#search-input'),
  categories: document.querySelector('#category-row'),
  refresh: document.querySelector('#refresh-button'),
  dialog: document.querySelector('#product-dialog'),
  dialogClose: document.querySelector('#dialog-close'),
  dialogPhoto: document.querySelector('#dialog-photo'),
  dialogCategory: document.querySelector('#dialog-category'),
  dialogName: document.querySelector('#dialog-name'),
  dialogDescription: document.querySelector('#dialog-description'),
  optionList: document.querySelector('#option-list'),
};

let storeConfig = {};
let products = [];
let options = [];

function clean(value) {
  return value == null ? '' : String(value).trim();
}

function copy(key, fallback) {
  if (window.FATDAR_I18N) return window.FATDAR_I18N.translate(key, fallback, storeConfig);
  return clean(storeConfig[key]) || fallback;
}

function localizedField(record, key, fallback = '') {
  if (window.FATDAR_I18N) return window.FATDAR_I18N.field(record, key, fallback);
  return clean(record?.[key]) || fallback;
}

function displayCategory(value, englishValue = '') {
  if (window.FATDAR_I18N) return window.FATDAR_I18N.categoryLabel(value, englishValue, FIXED_CATEGORIES, storeConfig);
  return clean(value) || clean(englishValue);
}

function escapeHtml(value) {
  return clean(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function isActive(value, defaultValue = true) {
  const normalized = clean(value).toLowerCase();
  if (!normalized) return defaultValue;
  return !['false', '0', 'no', 'n', 'off', 'inactivo', 'inactiva', 'oculto', 'oculta'].includes(normalized);
}

function normaliseKey(value) {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function canonicalHeader(value, index) {
  const key = normaliseKey(value);
  return HEADER_MAP[key] || key || `col_${index + 1}`;
}

function normaliseCategory(value) {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function gvizCellValue(cell) {
  if (!cell) return '';
  return cell.v ?? cell.f ?? '';
}

function tableRows(table) {
  if (!table?.rows?.length) return [];
  const headers = (table.rows[0].c || []).map((cell, index) => canonicalHeader(gvizCellValue(cell), index));
  return table.rows.slice(1).map((row) => {
    const cells = row.c || [];
    return Object.fromEntries(headers.map((header, index) => [header, gvizCellValue(cells[index])]));
  });
}

function loadPublicTab(tab) {
  return new Promise((resolve, reject) => {
    const previousGoogle = window.google;
    let settled = false;
    const script = document.createElement('script');

    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.remove();
      if (previousGoogle === undefined) delete window.google;
      else window.google = previousGoogle;
      if (error) reject(error);
      else resolve(value);
    };

    const timer = setTimeout(() => finish(new Error('Google Sheets tardó demasiado en responder.')), 16000);
    window.google = previousGoogle || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};
    window.google.visualization.Query.setResponse = (response) => {
      if (response?.status !== 'ok' || !response.table) {
        finish(new Error('Google Sheets devolvió una respuesta no válida.'));
        return;
      }
      finish(null, tableRows(response.table));
    };

    script.async = true;
    script.src = `${GOOGLE_GVIZ}?tqx=out%3Ajson&sheet=${encodeURIComponent(tab)}&headers=1&_=${Date.now()}`;
    script.onerror = () => finish(new Error('No se pudo conectar con Google Sheets.'));
    document.head.appendChild(script);
  });
}

function safeImageUrl(value) {
  const raw = clean(value);
  if (!raw) return '';
  let candidate = raw;
  const driveMatch = raw.match(/drive\.google\.com\/file\/d\/([\w-]+)/i);
  if (driveMatch) candidate = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  try {
    const url = new URL(candidate);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function safeLink(value, fallback) {
  const raw = clean(value) || fallback;
  try {
    const url = new URL(raw);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : fallback;
  } catch {
    return fallback;
  }
}

function waHref(message = '') {
  const phone = clean(storeConfig.whatsapp_phone || DEFAULT_PHONE).replace(/\D/g, '') || DEFAULT_PHONE;
  return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

function applyConfig() {
  const language = window.FATDAR_I18N?.language || 'es';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-sheet-key]').forEach((element) => {
    const value = copy(element.dataset.sheetKey, element.dataset.default || element.textContent);
    if (!value) return;
    if (element instanceof HTMLInputElement) element.placeholder = value;
    else element.textContent = value;
  });
  window.FATDAR_I18N?.applyStatic();

  const brand = copy('brand', 'FATDAR');
  const pageTitle = copy('seo_title', language === 'en' ? 'FATDAR | Gaming, virtual numbers & iOS' : `${brand} | Android, iOS, números virtuales y más`);
  const descriptionText = copy('meta_description', language === 'en'
    ? "Browse FATDAR's Android, iOS, virtual number and gaming categories. Ask on WhatsApp about current options."
    : 'Explora las categorías FATDAR: Android, iOS, números virtuales, modificaciones iOS y gaming. Consulta opciones por WhatsApp.');
  document.title = pageTitle;
  [
    ['meta[name="description"]', descriptionText],
    ['meta[property="og:title"]', pageTitle],
    ['meta[property="og:description"]', descriptionText],
    ['meta[name="twitter:title"]', pageTitle],
    ['meta[name="twitter:description"]', descriptionText],
  ].forEach(([selector, value]) => {
    const meta = document.querySelector(selector);
    if (meta) meta.setAttribute('content', value);
  });

  const groupLink = safeLink(storeConfig.group_link, DEFAULT_GROUP);
  const contactLink = waHref();
  [ui.groupNav, ui.groupFooter, ui.communityLink].filter(Boolean).forEach((link) => { link.href = groupLink; });
  [ui.navWhatsapp, ui.whatsappFooter, ui.closingWhatsapp].filter(Boolean).forEach((link) => { link.href = contactLink; });

  const headline = copy('hero_title', language === 'en' ? 'The other side of FATDAR.' : 'La otra cara de FATDAR.');
  const words = headline.split(/\s+/);
  const highlight = words.length > 1 ? words.pop() : '';
  ui.heroTitle.replaceChildren(document.createTextNode(`${words.join(' ')}${highlight ? ' ' : ''}`));
  if (highlight) {
    const accent = document.createElement('em');
    accent.textContent = highlight;
    ui.heroTitle.append(accent);
  }
  document.querySelector('#current-year').textContent = new Date().getFullYear();
}

function formatPrice(value) {
  const raw = clean(value);
  if (!raw) return 'Consultar';
  const numeric = typeof value === 'number' ? value : Number(raw.replace(/[^\d-]/g, ''));
  if (Number.isFinite(numeric) && numeric >= 0) {
    const currency = /^[A-Z]{3}$/.test(clean(storeConfig.currency)) ? clean(storeConfig.currency) : 'COP';
    try {
      const locale = window.FATDAR_I18N?.language === 'en' ? 'en-US' : 'es-CO';
      return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(numeric);
    } catch {
      return `$${new Intl.NumberFormat(window.FATDAR_I18N?.language === 'en' ? 'en-US' : 'es-CO').format(numeric)}`;
    }
  }
  return raw;
}

function productOptions(product) {
  return options.filter((option) => clean(option.product_id) === clean(product.id) && isActive(option.active));
}

function productCategoryValues(product) {
  return [clean(product.category), clean(product.category_en)].filter(Boolean);
}

function searchableProduct(product) {
  const locale = window.FATDAR_I18N?.language === 'en' ? 'en' : 'es';
  const offerText = productOptions(product).flatMap((option) => [
    option.option_name, option.option_name_en, option.quantity, option.quantity_en,
    option.duration, option.duration_en, option.price,
  ]);
  return [product.name, product.name_en, product.category, product.category_en, product.description, product.description_en, ...offerText]
    .map(clean).join(' ').toLocaleLowerCase(locale);
}

function getCategorySections() {
  const sections = FIXED_CATEGORIES.map((definition) => ({
    ...definition,
    label: copy(definition.key, definition.fallback),
  }));
  const extraCategories = new Map();

  products.forEach((product) => {
    const raw = (window.FATDAR_I18N?.language === 'en' ? clean(product.category_en) : '') || clean(product.category) || clean(product.category_en) || 'Sin categoría';
    const matchesFixed = sections.some((section) => productCategoryValues(product).some((value) =>
      [section.label, section.fallback, ...section.aliases].some((alias) => normaliseCategory(alias) === normaliseCategory(value))));
    if (!matchesFixed) {
      const key = normaliseCategory(raw);
      if (!extraCategories.has(key)) extraCategories.set(key, raw);
    }
  });

  [...extraCategories.entries()].forEach(([key, label]) => {
    const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sin-categoria';
    sections.push({ id: `extra-${slug}`, label, fallback: label, aliases: [label], symbol: '✳' });
  });
  return sections;
}

function sectionMatches(product, section) {
  const aliases = [section.label, section.fallback, ...(section.aliases || [])].map(normaliseCategory);
  return productCategoryValues(product).some((value) => aliases.includes(normaliseCategory(value)));
}

function renderCategories(sections) {
  ui.categories.replaceChildren();
  sections.forEach((section) => {
    const link = document.createElement('a');
    link.className = 'category-chip';
    link.href = `#category-${section.id}`;
    link.textContent = section.label;
    ui.categories.append(link);
  });
}

function photoPlaceholder(className = 'photo-placeholder') {
  const container = document.createElement('span');
  container.className = className;
  const caption = document.createElement('span');
  caption.className = 'placeholder-caption';
  caption.textContent = copy('art_top', 'FATDAR / SELECCIÓN');
  const mark = document.createElement('span');
  mark.className = 'placeholder-mark';
  mark.textContent = 'F';
  container.append(caption, mark);
  return container;
}

function productCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  const imageUrl = safeImageUrl(product.image_url);
  const choices = productOptions(product);
  const firstPrice = choices.find((option) => clean(option.price) !== '')?.price;
  const priceHint = choices.length && firstPrice != null
    ? `${copy('price_from', 'Desde')} ${formatPrice(firstPrice)}`
    : copy('product_options_hint', 'Ver opciones disponibles');
  const name = localizedField(product, 'name', 'Producto');
  const description = localizedField(product, 'description', copy('product_description_fallback', 'Abre el detalle para conocer precios y duraciones disponibles.'));
  const badge = localizedField(product, 'badge');
  const category = displayCategory(product.category, product.category_en) || copy('brand', 'FATDAR');
  card.innerHTML = `
    <button class="product-photo-button" type="button">
      ${imageUrl ? `<img class="product-image" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" loading="lazy" referrerpolicy="no-referrer">` : ''}
      ${badge ? `<span class="product-badge">${escapeHtml(badge)}</span>` : ''}
    </button>
    <div class="product-info">
      <p class="product-category">${escapeHtml(category)}</p>
      <h4 class="product-title">${escapeHtml(name)}</h4>
      <p class="product-subtitle">${escapeHtml(description)}</p>
      <div class="product-card-footer"><span class="product-price-hint">${escapeHtml(priceHint)}</span><button class="product-open-link" type="button">${escapeHtml(copy('product_open_label', 'Ver opciones'))} <span aria-hidden="true">↗</span></button></div>
    </div>`;

  const photoButton = card.querySelector('.product-photo-button');
  photoButton.dataset.cta = copy('product_photo_cta', 'VER OPCIONES ↗');
  photoButton.setAttribute('aria-label', `${copy('product_photo_cta', 'Ver opciones')}: ${name}`);
  if (!imageUrl) photoButton.append(photoPlaceholder());
  photoButton.addEventListener('click', () => openProduct(product));
  card.querySelector('.product-open-link').addEventListener('click', () => openProduct(product));
  const image = card.querySelector('img');
  if (image) image.addEventListener('error', () => image.replaceWith(photoPlaceholder()), { once: true });
  return card;
}

function categoryEmpty(section, searchTerm) {
  const empty = document.createElement('div');
  empty.className = 'category-empty';
  const symbol = document.createElement('span');
  symbol.className = 'category-empty-symbol';
  symbol.setAttribute('aria-hidden', 'true');
  symbol.textContent = section.symbol || '✳';
  const copyBlock = document.createElement('div');
  copyBlock.className = 'category-empty-copy';
  const kicker = document.createElement('span');
  kicker.className = 'category-empty-kicker';
  const english = window.FATDAR_I18N?.language === 'en';
  kicker.textContent = searchTerm ? (english ? 'SEARCH' : 'BÚSQUEDA') : copy('section_empty_eyebrow', 'CONSULTA DIRECTA');
  const message = document.createElement('p');
  message.textContent = searchTerm
    ? (english ? `No matches for “${searchTerm}” in ${section.label}.` : `No encontramos “${searchTerm}” en ${section.label}.`)
    : (english ? `Ask us on WhatsApp about ${section.label} options.` : `Consulta por WhatsApp las opciones de ${section.label}.`);
  copyBlock.append(kicker, message);
  empty.append(symbol, copyBlock);

  if (!searchTerm) {
    const link = document.createElement('a');
    link.className = 'category-empty-link';
    const messageText = english
      ? `Hi FATDAR, I'd like to ask about ${section.label} options.`
      : `Hola FATDAR, quisiera consultar las opciones de ${section.label}.`;
    link.href = waHref(messageText);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = `${escapeHtml(copy('section_empty_cta', 'Consultar'))} <span aria-hidden="true">↗</span>`;
    empty.append(link);
  }
  return empty;
}

function renderCategorySection(section, index, searchTerm) {
  const block = document.createElement('section');
  block.className = 'category-block';
  block.id = `category-${section.id}`;
  block.setAttribute('aria-labelledby', `category-heading-${section.id}`);

  const heading = document.createElement('header');
  heading.className = 'category-block-heading';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'category-block-eyebrow';
  eyebrow.textContent = `${String(index + 1).padStart(2, '0')} / ${window.FATDAR_I18N?.language === 'en' ? 'FATDAR SELECTION' : 'SELECCIÓN FATDAR'}`;
  const title = document.createElement('h3');
  title.id = `category-heading-${section.id}`;
  title.textContent = section.label;
  const count = document.createElement('span');
  count.className = 'category-block-count';

  const matchingProducts = products.filter((product) => {
    if (!sectionMatches(product, section)) return false;
    const searchable = searchableProduct(product);
    return searchable.includes(searchTerm);
  });
  const quantity = matchingProducts.length;
  count.textContent = quantity
    ? `${quantity} ${quantity === 1 ? copy('count_one', 'producto') : copy('count_many', 'productos')}`
    : copy('section_count_empty', 'Atención directa');
  heading.append(eyebrow, title, count);

  const grid = document.createElement('div');
  grid.className = 'product-grid category-grid';
  grid.setAttribute('aria-label', window.FATDAR_I18N?.language === 'en' ? `Products in ${section.label}` : `Productos de ${section.label}`);
  if (quantity) grid.append(...matchingProducts.map(productCard));
  else grid.append(categoryEmpty(section, searchTerm));
  block.append(heading, grid);
  return block;
}

function renderProducts() {
  const sections = getCategorySections();
  const english = window.FATDAR_I18N?.language === 'en';
  const locale = english ? 'en' : 'es';
  const searchTerm = clean(ui.search.value).toLocaleLowerCase(locale);
  ui.catalogTools.hidden = products.length === 0;
  ui.catalogMeta.hidden = false;
  renderCategories(sections);

  const visible = products.filter((product) => {
    return searchableProduct(product).includes(searchTerm);
  });
  if (!products.length && !searchTerm) {
    ui.productCount.textContent = copy('catalog_meta_empty', 'Siete categorías · atención directa');
  } else {
    const quantity = visible.length;
    const unit = quantity === 1 ? copy('count_one', 'producto') : copy('count_many', 'productos');
    ui.productCount.textContent = searchTerm ? (english ? `${quantity} results` : `${quantity} resultados`) : `${quantity} ${unit}`;
  }
  ui.categorySections.replaceChildren(...sections.map((section, index) => renderCategorySection(section, index, searchTerm)));
}

function openProduct(product) {
  const productName = localizedField(product, 'name', 'Producto');
  ui.dialogCategory.textContent = displayCategory(product.category, product.category_en) || copy('brand', 'FATDAR');
  ui.dialogName.textContent = productName;
  ui.dialogDescription.textContent = localizedField(product, 'description', copy('product_description_fallback', 'Abre el detalle para conocer precios y duraciones disponibles.'));
  ui.dialogPhoto.replaceChildren();
  const imageUrl = safeImageUrl(product.image_url);
  if (imageUrl) {
    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = productName;
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => ui.dialogPhoto.replaceChildren(photoPlaceholder('photo-placeholder dialog-placeholder')), { once: true });
    ui.dialogPhoto.append(image);
  } else {
    ui.dialogPhoto.append(photoPlaceholder('photo-placeholder dialog-placeholder'));
  }

  ui.optionList.replaceChildren();
  const choices = productOptions(product);
  if (!choices.length) {
    const note = document.createElement('p');
    note.className = 'no-options';
    note.textContent = copy('detail_no_options', 'Para conocer las opciones disponibles, escríbenos por WhatsApp.');
    ui.optionList.append(note);
  } else {
    choices.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'option-button';
      const optionName = localizedField(option, 'option_name', copy('option_fallback', 'Opción'));
      const quantity = localizedField(option, 'quantity');
      const duration = localizedField(option, 'duration');
      const optionMeta = [
        quantity ? `${copy('quantity_label', 'Cantidad')}: ${quantity}` : '',
        duration ? `${copy('duration_label', 'Duración')}: ${duration}` : '',
      ].filter(Boolean).join(' · ');
      button.innerHTML = `<span><span class="option-name">${escapeHtml(optionName)}</span>${optionMeta ? `<span class="option-meta">${escapeHtml(optionMeta)}</span>` : ''}</span><span class="option-price">${escapeHtml(formatPrice(option.price))}</span><span class="option-arrow" aria-hidden="true">↗</span>`;
      button.addEventListener('click', () => {
        const brand = copy('brand', 'FATDAR');
        const details = [
          quantity ? `${copy('quantity_label', 'Cantidad')}: ${quantity}` : '',
          duration ? `${copy('duration_label', 'Duración')}: ${duration}` : '',
        ].filter(Boolean).join(' | ');
        const message = window.FATDAR_I18N?.language === 'en'
          ? `Hi ${brand}, I'm interested in ${productName} — ${optionName}${details ? ` | ${details}` : ''} for ${formatPrice(option.price)}.`
          : `Hola ${brand}, me interesa ${productName} — ${optionName}${details ? ` | ${details}` : ''} por ${formatPrice(option.price)}.`;
        window.location.assign(waHref(message));
      });
      ui.optionList.append(button);
    });
  }
  if (typeof ui.dialog.showModal === 'function') ui.dialog.showModal();
  else ui.dialog.setAttribute('open', '');
}

function setSyncState(kind) {
  ui.syncState.className = `sync-state${kind === 'ready' ? ' ready' : kind === 'error' ? ' error' : ''}`;
  const indicator = document.createElement('span');
  indicator.className = 'sync-spinner';
  const key = kind === 'ready' ? 'sync_ready' : kind === 'error' ? 'sync_error' : 'sync_loading';
  const fallback = kind === 'ready' ? 'Catálogo al día' : kind === 'error' ? 'Actualización pendiente' : 'Actualizando';
  ui.syncState.replaceChildren(indicator, document.createTextNode(` ${copy(key, fallback)}`));
}

function catalogFromRows(rows) {
  const activeOffers = rows.filter((row) => {
    const id = clean(row.product_id) || clean(row.id);
    return id && (clean(row.name) || clean(row.name_en)) && isActive(row.active);
  });
  const productsById = new Map();
  const offers = activeOffers.map((row, index) => {
    const productId = clean(row.product_id) || clean(row.id);
    const offer = { ...row, id: productId, product_id: productId, option_id: `${productId}-${index + 1}` };
    if (!productsById.has(productId)) {
      productsById.set(productId, offer);
    } else {
      const product = productsById.get(productId);
      ['name', 'name_en', 'category', 'category_en', 'description', 'description_en', 'image_url', 'badge', 'badge_en']
        .forEach((field) => {
          if (!clean(product[field]) && clean(offer[field])) product[field] = offer[field];
        });
    }
    return {
      ...offer,
      option_name: clean(row.option_name) || clean(row.quantity) || clean(row.duration) || copy('option_fallback', 'Opción'),
    };
  });
  return { products: [...productsById.values()], options: offers };
}

async function syncStore() {
  setSyncState('loading');
  try {
    const configRows = await loadPublicTab('Configuracion');
    storeConfig = Object.fromEntries(configRows.map((row) => [normaliseKey(row.key), clean(row.value)]));
    applyConfig();

    // Cada fila de Productos es una oferta; filas con el mismo ID se agrupan bajo una tarjeta.
    const catalogRows = await loadPublicTab('Productos');
    const catalog = catalogFromRows(catalogRows);
    products = catalog.products;
    options = catalog.options;
    renderProducts();
    setSyncState('ready');
  } catch (error) {
    console.error('[FATDAR] No se pudo actualizar el catálogo:', error);
    renderProducts();
    setSyncState('error');
  }
}

ui.search.addEventListener('input', renderProducts);
ui.refresh.addEventListener('click', syncStore);
ui.dialogClose.addEventListener('click', () => ui.dialog.close());
ui.dialog.addEventListener('click', (event) => {
  if (event.target === ui.dialog) ui.dialog.close();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && ui.dialog.open) ui.dialog.close();
});

applyConfig();
renderProducts();
setSyncState('loading');
syncStore();
window.setInterval(syncStore, 60_000);
