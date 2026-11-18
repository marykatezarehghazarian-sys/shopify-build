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
- 2026-11-18: Store ACTIVE again (Raffi picked a plan; storefront still password-protected). Ran scripts/load-catalogue.mjs --apply:
  - 56 products ACTIVE, tag catalogue, quote-only (price 0, stock 0, DENY), with custom.material/sizes/minimum_order ('On request') and SEO; 8 tagged popular.
  - 12 old sample handles reused/overwritten; the other 14 samples set to DRAFT (still in their manual collections, not visible).
  - New collection events-weddings (5 products, published). retail-clothing renamed 'Retail & Product Packaging'.
  - Catalogue menu now 9 items incl. Events & Weddings.
  - Theme (live 160203079820, pushed --allow-live): homepage categories block c9 events-weddings; .cats grid 3 columns on desktop, odd last card spans the full width on 2-column layouts; events icon/colour in pkg-icon-for / pkg-art.
  - No product images yet: placeholders until Raffi approves the illustrations or sends photos.
  - Can't verify the storefront without the store password.
- 2026-11-18: Raffi has NO photos and asked us to design them. Made illustrations for all 56 products (illustrations/make-all.mjs → illustrations/all/<handle>.png, 1200×1200, same approved style with a 'YOUR LOGO' spot and the product name). Uploaded as each product's image (scripts/upload-illustrations.mjs; alt '<name>, custom printed with your logo by PKG. Packaging Factory, Lebanon'). 56/56 READY. Sheets PKG-all-sheet-1/2.png; zip PKG-all-product-images.zip.

## Product photos (2026-11-18)
- Drawn images (56) are on the products for now; user said they look AI-made.
- Tried Wikimedia Commons stock photos; dropped them. They show other companies' products (often with brands), not PKG's, which misleads buyers and puts others' work on the site. Nothing from Commons was uploaded.
- Decision: real photos of Raffi's own samples (phone photos, we clean them up). Keep the drawings until then.
- 2026-11-18: user approved the 3D mockup style ("exactly like this"). All 56 rendered by `renders/render.mjs` (three.js, scene in `renders/scene.js` + `renders/products.js`) to `renders/out/<handle>.jpg`; overview sheets in `renders/sheets/`, zip `renders/PKG-mockups-all.zip`. Placeholder print is "YOUR LOGO" in PKG green. Uploaded 2026-11-18 with `scripts/upload-mockups.mjs` (user said "put on the site"): each of the 56 catalogue products now has only its mockup image; the old drawings were removed from the products.
- 2026-11-18 Raffi via user: product list OK (all 56 stay). Founded 1998. Showroom pin https://maps.app.goo.gl/BTPRkwacfbGusWqD9 = 33.862782, 35.55283 (OpenStreetMap: Mkalles, Metn). Machine photos: later.
  - Live theme settings: showroom_address "Mkalles, Metn, Lebanon", business_city Mkalles, map link/query, geo lat/lng (backup of the old files in backups/2026-11-18/).
  - pkg-showroom: the "Opening hours" block is hidden while the hours are empty (was a visible "Add opening hours" note).
  - About page text rewritten (removed the "[Raffi: …]" placeholder): since 1998, factory and showroom in Mkalles, in-house offset/digital printing and die-cutting, delivery Lebanon + Middle East.
  - Opening hours (user): open 24/7 → showroom_hours "Open 24 hours, 7 days a week", opening_hours_schema "Mo-Su 00:00-23:59".
  - Still open: exact street/building (optional), shop name "My Store", domain, remove password, refund/terms/contact policies, 2 machine photos.
- 2026-11-18: password REMOVED by Raffi; store name now "PKG Packaging Factory"; site is live on zzfd11-gp.myshopify.com (domain to be bought). Visitor check (desktop 1366 + mobile 390): home, catalogue, a collection, a product, about, showroom, contact: all 200, no placeholders, no overflow, no broken images, no JS errors.
  - Product SEO titles no longer end in " | PKG." (theme already appends the brand): 56 updated; load-catalogue.mjs fixed too.
  - Still open: domain (+ set as primary), refund/terms/contact policies, Google Search Console + Business Profile after the domain, 2 machine photos.
- 2026-11-18 design tweaks (user): home hero fits the first screen (checked 1366x768, 1440x900, 1920x1080, 390x844, 360x740); heading now uses the bold head font (p.display had no font rule); gap under the hero buttons fixed (`ul.clean` was overriding the facts margin → `ul.hero__facts`); hero picture hidden on phones; category cards smaller (160px desktop, ~140px phone). About page photo = digital press (pkg-digital-press.jpg). Backups in backups/2026-11-18/.
- 2026-11-18: home hero pictures = mockups (kraft bag, burger box, paper cup) instead of icon placeholders (desktop/tablet only; hidden on phones).
- 2026-11-18: showroom pin UPDATED by user to https://maps.app.goo.gl/Hb861JArmirQdy686 = 33.862125, 35.553101 (still Mkalles); map embed, Directions button and Google geo data updated and checked live.
