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
- Colours / fonts (proposed until the logo arrives): ink #121212, kraft #C9A27A, paper #F3EEE6, accent signal red #E5432D. Headings: Archivo (bold, condensed feel). Body: Inter.

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
