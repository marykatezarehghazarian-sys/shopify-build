# My Store (Reina)

Store: zi50i6-b0.myshopify.com
Owner / contact: Reina (store owner email on file in Shopify admin)
Status (2026-10-19): new store on Trial plan, password-protected, shop name still "My Store", currency LBP, 0 products.
Theme: Horizon (live, 189251191088); Atelier also installed (unpublished). Same Horizon rules as other clients: never edit live, themeDuplicate then push.
Access: Dev Dashboard app (client ID + secret in .env), broad scopes incl. products, themes, navigation, content, shipping, discounts, orders.

## Brand
- Voice / tone:
- Colors / fonts:

## Catalog
- Product types, vendors, tagging conventions:

## Store setup
- Collections:
- Discounts:
- Shipping:

## Decisions & notes
- Slug `reina-store` is provisional until the brand name is known; rename the folder and client.json name then.
- 2026-10-19: Brand is **Reina Reichouni** (womenswear, Lebanese designer). Job: 1:1 migration of reinareichouni.com (Wix Stores) to Shopify. Audit in `migration/AUDIT.md`, scraped product data in `migration/source-products.json`, original-site screenshots in `migration/reference/`. Stage 1 (audit) awaiting approval; nothing built yet. Rule from the brief: no content changes; flag anything that can't map 1:1.
- Brand colour #642226 on white; fonts Kepler/Inter/Didot italic/Playfair Display/Avenir/Aboreto (see audit §4).
- Stage 1 (design) built on unpublished theme **"Reina Reichouni - Build" 189295591728** (duplicate of live Horizon): palette #642226/white, square buttons, self-hosted fonts (`snippets/rr-brand.liquid`, `assets/rr-*.woff2`), header (links left, RR monogram centre, text actions right, no announcement bar), custom footer `sections/rr-footer.liquid` (newsletter, 2 menus, wordmark images, credit → instagram.com/thevirtualstylistt). Menus main-menu / footer / footer-legal set with URL links; switch to resource links once collections/pages exist (stage 3). Files uploaded: rr-monogram.png, rr-wordmark-reina.png, rr-wordmark-reichouni.png.
- Decisions approved 2026-10-19: A free look-alike fonts, B sale = compare-at price, C no wishlist, D resize images to 5000px, E keep typos 1:1, F Shopify policy pages, G same slugs + redirects. Payments: cash on delivery + card. Shipping: skipped for now. Store name/currency: change in admin (not possible via API).
