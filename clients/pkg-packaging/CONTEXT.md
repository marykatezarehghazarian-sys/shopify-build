# PKG. Packaging Factory

Store: zzfd11-gp.myshopify.com (connected 2026-11-13; shop name still "My Store", currency LBP, theme Horizon, 0 products, location "Shop location" LB). Owner email on the store: rafi@printw-ps.com. Access: Dev Dashboard app, Client ID c41c50… + secret in .env (gitignored); client-credentials exchange works, with full scopes incl. themes and products.
Owner / contact: Raffi · WhatsApp/phone 03 4000 54 (= +961 3 400 054) · rafi@printw-ps.com · Instagram @pkg.packagingfactory

## Brief (owner form, 2026-11-13)
- Sells: printing & packaging, custom / made-to-order. Customers: restaurants, bakeries, coffee shops, schools, clothing stores, corporate offices.
- 20–100 products. No product spreadsheet yet. Owner has good photos (not sent yet). Owner has a logo (not sent yet).
- Site goals: show the catalogue and get WhatsApp inquiries. No online checkout needed at first.
- Payment: cash on delivery, Whish / OMT. Delivery: all over Lebanon and the Middle East.
- Look: modern, bold, "as per example but more professional" (the example wasn't shared). No brand colours given.
- Pages: Home, About us, Showroom / location, Contact. Language: English.

## Brand
- Voice / tone: confident, practical, B2B-friendly.
- Logo received 2026-11-13 (PDF, vector): square stacked "PKG PACKAGING" in white on green #52BE36, with a dark green #21642F "FACTORY" tag. PNG in `brand-logo-square.png`; uploaded to Shopify Files as pkg-logo.png and set as the theme logo (height 64px).
- Colours / fonts: ink #121212, kraft #C9A27A, paper #F3EEE6, accent dark green #21642F (from the logo; replaced the proposed red, which clashed). The bright logo green #52BE36 isn't used behind white text: the contrast is too low. Headings: Archivo (bold, condensed feel). Body: Inter.

## Catalog
- Categories (proposed): Food & takeaway, Bakery & pastry, Coffee & drinks, Bags, Labels & stickers, Retail & clothing, Corporate print, School print.
- No prices on the site: every product has "Ask for a quote on WhatsApp" with a pre-filled message naming the product.

## Build plan
1. Static prototype in `prototype/` (served locally for review), using placeholder visuals until the owner's photos and logo arrive.
2. After approval, port it to a Shopify theme in `theme/` (from starter-theme), with products and collections created through the Admin API, and connect the store.

## Decisions & notes
- 2026-11-13: Raffi's reference sites: jarjouraprinting.com and lebclean.vip. Used only for layout and style direction (cream background, one red accent, bold headlines, category cards with WhatsApp quote buttons, how-it-works, FAQ, showroom, final CTA). No text, photos or claims were copied.
- Prototype built in `prototype/` (static HTML/CSS/JS; serve with `python3 -m http.server 8080` in that folder):
  - Pages: index, catalogue (category chips + search), product (?p=id), about, showroom, contact. The contact form opens WhatsApp with the request pre-filled.
  - Data lives in assets/app.js: SITE (WhatsApp 9613400054, email, Instagram, showroom), 8 CATEGORIES and 26 sample PRODUCTS (material, sizes).
  - Placeholder art (category icons on coloured boards, labelled "Photo coming") until the owner's photos and logo arrive. The text logo is "PKG." with a red dot.
  - Placeholders the owner must fill (yellow [..] marks): about text, showroom address and hours, map.
  - No invented stats, testimonials or years in business. Minimum order is "On request".
  - Tested on desktop and mobile: no horizontal overflow, all WhatsApp links OK, no JS errors.
- 2026-11-13 Shopify build (store zzfd11-gp, password-protected):
  - Theme "PKG Packaging" (id 160203079820), UNPUBLISHED. The live theme is still Horizon. Source in `theme/`, built from the prototype design.
    - Layout plus sections: pkg-hero, pkg-ticker, pkg-categories (collection blocks), pkg-industries, pkg-featured (products tagged `popular`), pkg-steps, pkg-why, pkg-faq, pkg-paybar, pkg-band, pkg-page-hero, pkg-text-image, pkg-showroom, pkg-contact, main-collection (category chips from the `catalogue` menu + live search), main-product (specs from custom.* metafields + WhatsApp quote with the product name), main-list-collections.
    - Theme settings: logo, colours, WhatsApp/email/Instagram, showroom (address, hours, map link, map query), payment/delivery lines.
    - Products without photos show a coloured placeholder with the category icon. Inline-richtext settings can't contain <br>.
    - Upload with `npm run theme -- push --client pkg-packaging --theme 160203079820`. `npm install` is needed first in a fresh container.
  - Store content via scripts/setup-store.mjs (idempotent):
    - product metafield definitions custom.material / sizes / printing / minimum_order (pinned)
    - 8 collections, published: food-takeaway, bakery-pastry, coffee-drinks, paper-bags, labels-stickers, retail-clothing, corporate-print, school-print
    - 26 sample products, DRAFT, tagged `sample` (+`popular` on 8): price 0, inventory tracked at 0 with DENY, so they can't be bought; published to Online Store
    - pages about / showroom / contact (template suffixes)
    - menus main-menu, catalogue, company
  - TODO: owner's logo, photos and real product list (replace the `sample` products); showroom address/hours/map in Theme settings; about text; shop name is still "My Store" (admin: Settings → General); currency LBP. Activate the products and publish the theme only after the owner OKs it.
- 2026-11-13: Raffi's feedback PDF: remove the emoji icons from the industries cards. The industries section now uses his 8 industries and wording (Restaurants, Bakeries, Coffee shops, Clothing stores, Schools & universities, Events & weddings, Corporate offices, Product brands) with a short accent bar, no icons (section setting `show_icons`, off). Text is left-aligned (his screenshots had justified text with big gaps).
- 2026-11-13: machine photos (offset presses, Bobst die-cutter) were sent as chat images and are not usable yet. Asked for the files and to confirm they're his own machines, not photos from the internet.
- 2026-11-13: user said "publish all": theme PKG Packaging (160203079820) published as the live theme (Horizon 160202391692 kept unpublished as a backup), and the 26 sample products set ACTIVE (still price 0, stock 0 DENY, so they can't be bought). Store is still password-protected.
- 2026-11-13: "Our factory" section (pkg-factory, after industries on Home): machine photo blocks with captions; only blocks with a photo show. First photo: digital press (photos/factory/digital-press.jpg, Shopify file pkg-digital-press.jpg). Waiting on the offset press and Bobst die-cutter photos as files. Raffi confirmed the machines are his.
- 2026-11-13: FAQ restyled after Raffi's example (lebclean.vip FAQ; layout only, not their text): heading on top, large title "Questions, answered.", thin divider lines, red→accent chevrons, all questions closed by default.
- The theme is now LIVE, so `theme push` needs `--allow-live` (otherwise the CLI asks for confirmation and fails non-interactively).
- 2026-11-15 SEO (Raffi wants strong Google presence):
  - Theme: `snippets/seo-meta.liquid` (rendered in layout/theme.liquid) outputs:
    - title (brand appended only if the title is ≤45 chars) and meta description, with fallbacks
    - Open Graph / Twitter tags
    - optional favicon and Google Search Console verification meta
    - JSON-LD: LocalBusiness+Organization on every page (address/city/geo/hours/map/Instagram/Facebook from theme settings); WebSite on home; Product; BreadcrumbList on product/collection/page
  - FAQ section outputs FAQPage JSON-LD.
  - Home hero: the keyword eyebrow "Custom printing & packaging factory in Lebanon" is now the H1; the big slogan is a <p>.
  - Product images: only the first is eager, with responsive widths.
  - New theme settings:
    - "SEO & Google" group: home title/description, fallback description, share image, Search Console code
    - Business name, favicon, Facebook link
    - Showroom city, hours for Google, latitude/longitude
  - Content: `scripts/seo-content.mjs --apply` sets the 8 collections' SEO title/description, a short `custom.intro` metafield (shown under the H1) and a longer description (shown below the product grid with a WhatsApp button), plus SEO title/description for the about/showroom/contact pages. Claims are kept to what's confirmed (own factory: offset, digital, die-cutting; delivery Lebanon + Middle East). No invented years, stats or finishes.
  - Not verified in the browser yet: the storefront is password-protected and we don't have the password.
  - Owner side: remove the password (Google can't index a password-protected store), connect a domain, verify in Google Search Console and submit /sitemap.xml, create a Google Business Profile (biggest win for "printing Lebanon" searches), shop name in Settings → General, real products with descriptive text and photo alt text, link the site from Instagram.
- 2026-11-17: Raffi asked us to 'design and do everything'. We wrote a draft catalogue: 56 products in 9 categories (the 8 existing + new 'Events & Weddings'; 'Retail & Clothing' renamed in the draft to 'Retail & Product Packaging'). Source catalogue-draft.py → catalogue-draft.csv (min order 'On request'); review PDF PKG-product-list-draft.pdf (catalogue-pdf.py). Waiting for Raffi to: remove what he doesn't make, allow us to use his Instagram @pkg.packagingfactory photos, and send the showroom address, map pin and hours. No product photos will be made up.
- 2026-11-17: Raffi said YES to using his Instagram (@pkg.packagingfactory) photos on the site. The rest (showroom details / list review) will come later. Fetching Instagram automatically was blocked here, so the photos need to be saved from Instagram and sent as files.
- 2026-11-17: the store is now 'Store unavailable' (HTTP 402 Payment Required on both the Admin API and the storefront): the trial ended or no plan was picked. Nothing could be loaded. Waiting for Raffi to pick a Shopify plan (Settings → Plan). Catalogue loader ready: scripts/load-catalogue.mjs (dry run; --apply creates/updates 56 quote-only products, creates the events-weddings collection, renames retail-clothing to 'Retail & Product Packaging', drafts the old samples).
- 2026-11-17: no real photos yet (Instagram fetch blocked) and no fake 'photos'. Made a sample set of 10 branded ILLUSTRATIONS (not photos) with a 'YOUR LOGO' spot, one per main category, for Raffi to approve the style: pizza box, burger box, cake box, paper cup, kraft bag, logo stickers, mailer box, business cards, notebook, invitation. Source illustrations/make.mjs (SVG → 1200px PNG); preview PKG-illustrations-preview.png; zip PKG-illustrations.zip. If approved, extend to all 56 products and use them until his real photos arrive.
