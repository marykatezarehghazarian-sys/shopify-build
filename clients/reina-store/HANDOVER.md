# Reina Reichouni: handover

Store: https://zi50i6-b0.myshopify.com (password: see `.env` / owner) · Live theme: **Reina Reichouni - v2** (189306732848)

## 1. What was built
**Look and feel:** black site with a slow 3D starfield, ivory type (Cormorant Garamond + Inter), RR monogram and
REINA REICHOUNI wordmark, editorial layout after Tove / Khaite / Toteme / The Concept.

**Motion:** first-visit preloader (≈1.4 s, never again on that device), Lenis smooth scroll (desktop), page
transitions, staggered text and card reveals, image unmasking, hero and editorial parallax, magnetic buttons,
custom cursor (mouse only), hero headline rise, hover zoom and second photo on product cards. All
transform/opacity; everything turns off for "reduce motion".

**Pages:**
- Home: video hero → Collections rail → Summer Drop / Formation Summer '26 editorial → brand story → Summer Drop
  grid → Lookbook strip → editorial photo → newsletter footer
- Collection pages (filters, sort, pagination, empty state), search with live results
- Product page: gallery (zoom, swipe), size buttons with sold-out sizes crossed out, Buy it now (straight to
  checkout), Add to bag, Details / Shipping / Returns accordions, related products, sticky Buy bar on phones
- Bag drawer (opens on add) + cart page; quick buy on every card (bag icon → size → checkout)
- About, Contact (working form), FAQ, Shipping & Returns, Privacy, Refund / Terms / Shipping policies, custom 404
- 22 products, 82 photos, 3 collections, 32 redirects from the old Wix URLs, SEO titles/descriptions on every
  product, collection and page

**Tested:** full journey (home → collection → product → add to bag → bag → checkout, quick buy, sticky bar,
sold-out product, FAQ, 404, search, return visit without preloader) on desktop 1440, tablet 820, phone 390:
no JavaScript errors. `theme check`: only 2 warnings inside Horizon's own files (newer Shopify filter).

## 2. Run and deploy
The site runs on Shopify; there is nothing to host on Vercel.
- Edit locally: `npm run theme -- pull --client reina-store` / edit `clients/reina-store/theme/` /
  `npm run theme -- push --client reina-store --theme <id>` (push to a copy, check the preview, then publish).
- Live preview of a copy: `https://zi50i6-b0.myshopify.com/?preview_theme_id=<id>`
- Or edit visually in **Online Store → Themes → Customize** (every RR section has settings).

## 3. Environment variables
Only for the command-line tools, in `clients/reina-store/.env` (gitignored):
`SHOPIFY_CLIENT_ID`, `SHOPIFY_CLIENT_SECRET` (Dev Dashboard app), `SHOPIFY_API_VERSION`, `STOREFRONT_PASSWORD`.
The storefront itself needs none. Analytics: install **Google & YouTube** (GA4) and **Facebook & Instagram**
(Meta Pixel) apps; they send view, add_to_cart, begin_checkout and purchase events automatically.

## 4. Where to edit things
| What | Where |
|---|---|
| Products, prices, sale prices, stock, photos | Admin → Products (sale = "Compare-at price") |
| Collections and their order | Admin → Products → Collections |
| Shipping rates / free-shipping threshold | Admin → Settings → Shipping and delivery |
| Payments (cash on delivery, card) | Admin → Settings → Payments |
| Checkout fields | Admin → Settings → Checkout |
| Homepage text, photos, sections | Themes → Customize → Home page |
| FAQ questions | Themes → Customize → Pages → FAQ |
| About / Privacy / Shipping & Returns text | Admin → Online Store → Pages |
| Policies | Admin → Settings → Policies |
| Menus | Admin → Online Store → Navigation |
| Colours, fonts, motion | `theme/snippets/rr-brand.liquid` (tokens), `rr-stars.liquid`, `rr-motion.liquid`, `assets/rr-motion.js` |

## 5. Decisions to review
- Stayed on Shopify instead of a custom Next.js build (see PLAN.md).
- No testimonials: none exist yet; add a reviews app when they do.
- No free-shipping progress bar until shipping rates are set.
- No quantity box on the product page (easy checkout); quantity can be changed in the bag.
- Size/colour filters need the free Search & Discovery app (Admin) to switch on.
- Lighthouse can't run while the store is password-protected; run PageSpeed Insights right after launch.
- Privacy policy lives at /pages/privacy-policy because Shopify auto-manages /policies/privacy-policy.
