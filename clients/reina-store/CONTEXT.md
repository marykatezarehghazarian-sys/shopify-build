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
- 2026-10-19 **Direction change:** user sent reference sites (tove-studio.com, khaite.com, toteme.com, theconceptofficial.com) and asked for a lookalike of those. Content (products, text) stays from the original; layout/design follows the references. Liked on The Concept: bag icon and "choose size → straight to checkout".
- Built on 189295591728: `sections/rr-hero.liquid` (full-screen video `assets/rr-hero.mp4/.webm`, video can't go in Files on the Trial plan), `rr-rail.liquid` (Khaite-style italic heading + sliding row or grid), `rr-editorial.liquid` (1–3 editorial photos, Toteme style), `snippets/rr-card.liquid`, quick buy `snippets/rr-quick-bag.liquid` + `assets/rr-quick-bag.js` (also injected into Horizon cards via `blocks/_product-card.liquid`). Header: icons (search/account/bag), transparent over the hero on home. Homepage: hero → Collections rail → 2 editorial (Summer Drop / Formation Summer '26) → Summer Drop grid (front-page) → full-width editorial → footer.
- Stage 2 data done: 22 products (productSet, vendor ReinaReichouni, 82 images at 3333×5000, sale = compare-at), ACTIVE + published (user approved, store still password-protected). Collections all-products / formation-summer-26 / front-page, manual order = Wix order. Storefront password in .env (STOREFRONT_PASSWORD).
- Checkout currently says "This store isn't set up to receive orders yet": needs a paid plan + payment methods (COD manual + card provider).
- 2026-10-19: Pages (aboutus rr-about, contactus rr-contact, privacy-policy rr-legal), policies (refund/terms/shipping via shopPolicyUpdate; privacy is on Shopify automatic management so it lives at /pages/privacy-policy), 32 redirects, products-import.csv, LAUNCH-CHECKLIST.md. **Theme 189295591728 published as MAIN** (user approved). Store still password-protected.
- 2026-10-19: Whole site black with a 3D starfield (`snippets/rr-stars.liquid`, canvas behind every page, reduced-motion = still stars). Palette now background #000 / text ivory #F3ECE6; logos/wordmark recoloured to ivory with a CSS filter; header is dark glass (no transparent header on home). Burgundy kept as `--rr-burgundy`.
- 2026-10-19: Easy checkout: product page has no quantity box, "Buy it now" (straight to checkout) above "Add to bag", "Pay by card or cash on delivery" note; cart renamed "Bag", drawer auto-opens with Checkout; discount-code box and cart note removed from the bag (codes still work at checkout). Card quick-buy goes straight to checkout. Checkout-page settings (contact by phone, guest checkout, hide company/address 2, etc.) must be set by the user in Settings → Checkout.
- 2026-10-19: Agency-brief pass done: motion layer (rr-motion + Lenis asset), rr-story, rr-lookbook, product accordions, rr-sticky-buy, FAQ (/pages/faq, rr-faq), /pages/shipping-returns, custom 404, SEO on all products/collections/pages, footer menu + FAQ + Shipping & Returns. Theme **"Reina Reichouni - v2" 189306732848 is MAIN**. PLAN.md + HANDOVER.md in client folder.
- 2026-10-20: Background back to **white** at owner request: palette #fff / #642226, tokens --rr-bg/--rr-on-ink/--rr-surface in rr-brand, logos burgundy (no filter), starfield no longer rendered (snippets/rr-stars.liquid kept; re-add `{%- render 'rr-stars' -%}` after <body> in layout/theme.liquid to bring it back).
- 2026-10-20: Homepage "Collections" rail glides continuously from page load (rr-rail `autoplay`, `speed` = 90 px/s, seamless loop via cloned items, pauses on hover/touch/focus/off-screen, off for reduced motion).
- 2026-10-20: Lookbook strip glides continuously too (rr-lookbook `autoplay`, `speed` 90 px/s, same behaviour as the Collections rail).
- 2026-10-20 client fixes (WhatsApp from Reina): business phone/WhatsApp **+961 71 444 242** (wa.me/96171444242), email **reinareichounirtw@gmail.com** (footer contact line, contact page, all policies). International orders/payments → contact by WhatsApp/email; **International shipping zone deleted** (Lebanon only). Returns: store credit only, **7 days**. Shipping: Lebanon zone rates "Inside Beirut (2–5 business days)" $5 and "Outside Beirut (3–6 business days)" $8 (customer picks; Lebanon has no province field); old $4 / free-over-$45 rates removed. Welcome offer: code **WELCOME10** 10% off, once per customer, only on smart collection `full-price` (IS_PRICE_REDUCED not set; hidden), shown after newsletter sign-up + FAQ. Payments now: **cash on delivery or Whish Money transfer to 71444242** (pay note, FAQ). Shop contact email in Settings is still reinareichouniii@gmail.com (admin only).
- Open flag: Terms say "Payment must be successfully completed before an order is processed or shipped" (conflicts with COD); not changed, ask client.
- 2026-10-20: Basic plan active. Test checkout (no order placed): still store currency LBP (product $56 shows L£56; USD shipping converted to L£), shows an old "قياسي" L£359,831.96 (≈$4) rate even though the API delivery profile only has Inside/Outside Beirut $5/$8, and "This store can't accept payments right now" (no payment method active). Checkout header shows "My Store". Re-test after owner sets USD + COD/Whish manual methods + store name.
- 2026-10-20 re-check after owner "done": COD + Whish Money Transfer now active at checkout. Still: currency LBP, shop name "My Store", contact email old, phone optional. Store/billing address and the only location are now **7847 Oakman Blvd, Dearborn, Michigan, US** (changed by owner; not touched). Shipping: Admin API profile has only Inside/Outside Beirut $5/$8 (re-saved), but Storefront cart + checkout still return only "قياسي" ≈$4 (L£359,831.96) — rate source not visible via API; owner to check Settings → Shipping and delivery. Storefront token "rr-qa" created for testing.
