(() => {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);
  const language = pathSegments[pathSegments.length - 1] === 'en' ? 'en' : 'es';
  const EN = {
    seo_title: 'FATDAR | Gaming, virtual numbers & iOS',
    meta_description: "Browse FATDAR's Android, iOS, virtual number and gaming categories. Ask on WhatsApp about current options.",
    announcement: 'FATDAR // STEP INTO THE DARK', brand: 'FATDAR',
    nav_catalog: 'The catalog', nav_community: 'Community', nav_whatsapp_label: 'Talk to us',
    eyebrow: 'YOUR HIDEOUT AFTER MIDNIGHT', hero_title: "The other side of FATDAR.",
    hero_text: 'A different kind of catalog. Choose an option, check its price and duration, then finish the conversation on WhatsApp.',
    hero_cta: 'Explore catalog', hero_note: 'NO DETOURS. DIRECT SUPPORT.',
    marquee_text: 'OUTSIDE THE NOISE. AT YOUR PACE. NO RUNAROUND.',
    catalog_eyebrow: 'FATDAR / AFTER DARK ARCHIVE', catalog_title: 'Pick your', catalog_highlight: 'side.',
    category_android: 'Android', category_ios: 'iOS', category_diamonds: 'Diamonds', category_weapon_fragments: 'Weapon fragments', category_passes: 'Passes', category_virtual_numbers: 'Virtual numbers', category_ios_modifications: 'iOS modifications',
    search_placeholder: 'Search FATDAR', art_top: 'FATDAR / SELECTION', price_from: 'From',
    product_options_hint: 'See available options', product_description_fallback: 'Open the details to see available prices and durations.',
    product_open_label: 'View options', product_photo_cta: 'VIEW OPTIONS ↗', option_fallback: 'Option',
    section_empty_eyebrow: 'ASK US DIRECTLY', section_empty_cta: 'Ask us', section_count_empty: 'Direct support',
    count_one: 'product', count_many: 'products', catalog_meta_empty: 'Seven categories · direct support',
    steps_eyebrow: 'THE ROUTE', steps_title: 'Three steps. No detours.',
    step_1_title: 'Find your option', step_1_text: 'Browse the catalog and open a product.',
    step_2_title: 'Check the details', step_2_text: 'Price and duration, clear before you choose.',
    step_3_title: 'Make your move', step_3_text: 'Continue straight to WhatsApp and talk to FATDAR.',
    community_eyebrow: 'OPEN SIGNAL', community_title: 'See you on the other side.',
    community_text: 'Join the WhatsApp group and stay connected with FATDAR.', community_cta: 'Join the community',
    closing_eyebrow: 'WHEN YOU WANT. YOUR WAY.', closing_title: 'The other side answers.',
    closing_text: 'Direct guidance on WhatsApp, no forms, no detours.', closing_cta: 'Open WhatsApp',
    footer_message: 'Not for everyone.', footer_highlight: "And that's fine.",
    footer_group_label: 'Join the group', footer_whatsapp_label: 'WhatsApp', footer_tagline: 'FATDAR AFTER DARK', credits: 'dixz',
    detail_option_heading: 'PRICE / DURATION', detail_option_hint: 'YOUR OPTION. YOUR CALL →',
    detail_note: 'Choose an option and continue on WhatsApp.', detail_no_options: 'Message us on WhatsApp to check available options.',
    search_products: 'Search products', refresh_catalog: 'Refresh catalog',
    category_navigation: 'Catalog sections', main_navigation: 'Main navigation',
    home_link: 'FATDAR, home', language_to_en: 'View the site in English', language_to_es: 'View the site in Spanish',
    whatsapp_support: 'FATDAR support on WhatsApp', close_detail: 'Close product details',
    language_label: 'Language', credits_label: 'Credits',
    sync_ready: 'Catalog up to date', sync_error: 'Update pending', sync_loading: 'Syncing',
  };

  const clean = (value) => value == null ? '' : String(value).trim();
  const normalise = (value) => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  function translate(key, fallback, config = {}) {
    if (language === 'en') return clean(config[`${key}_en`]) || EN[key] || fallback;
    return clean(config[key]) || fallback;
  }

  function field(record, key, fallback = '') {
    if (!record) return fallback;
    if (language === 'en') return clean(record[`${key}_en`]) || clean(record[key]) || fallback;
    return clean(record[key]) || fallback;
  }

  function categoryLabel(value, englishValue, categories = [], config = {}) {
    const normalizedValues = [value, englishValue].map(normalise).filter(Boolean);
    const match = categories.find((item) => [item.fallback, item.label, ...(item.aliases || [])]
      .some((alias) => normalizedValues.includes(normalise(alias))));
    if (match) return translate(match.key, match.fallback, config);
    return language === 'en' ? clean(englishValue) || clean(value) : clean(value);
  }

  function applyStatic() {
    document.documentElement.lang = language;
    if (language !== 'en') return;
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const translation = EN[element.dataset.i18n];
      if (translation) element.textContent = translation;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      const translation = EN[element.dataset.i18nAria];
      if (translation) element.setAttribute('aria-label', translation);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const translation = EN[element.dataset.i18nTitle];
      if (translation) element.setAttribute('title', translation);
    });
  }

  window.FATDAR_I18N = { language, translate, field, categoryLabel, applyStatic, english: EN };
})();
