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
