# Mk Atelier

Store: cawmd9-ya.myshopify.com

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

## Setup (2026-11-06)
- Site: mkatelier.club (Shopify cawmd9-ya.myshopify.com), "Mk Atelier", Beirut, USD, ships to LB only.
- Catalog (public, 12 products, 5 collections): decor sculptures: Doberman side tables $350, Versace vases (gold/chrome) $499, resin bears $199, mirror balloon dog $7,999, chrome Great Dane $799, astronaut figure $2,799, Monopoly "Gold Rush" and Scrooge McDuck sculptures $499.
- No credentials yet: env vars MK_ATELIER_SHOPIFY_CLIENT_ID / MK_ATELIER_SHOPIFY_CLIENT_SECRET (Dev Dashboard app installed on the store).
- 2026-11-06 URGENT: live theme "Mk Atelier - Dev" (custom, schema "Mk Atelier 1.0.0") breaks the cart page as soon as the cart has an item: "Liquid error (sections/main-cart line 9): cart form must be given a cart". No items or Check out button are shown. Reproduced (add to cart → /cart). Likely fix: line 9 `{% form 'cart' %}` → `{% form 'cart', cart %}`. Needs theme access (no credentials yet).
- 2026-11-06: Credentials: first app (d9bd…) had no scopes; second app works (30 scopes incl. themes), saved to .env (gitignored). Themes: MAIN "Mk Atelier - Dev" 151120478414 (custom), unpublished Horizon 151109337294.
- 2026-11-06 FIXED on live theme (owner asked "fix it"; urgent): sections/main-cart.liquid line 9 `{%- form 'cart' -%}` → `{%- form 'cart', cart -%}`. Cart page shows items, subtotal and Checkout again; tested on phone: add 2 items → /cart → Checkout opens Shopify checkout.
- Also FIXED: sections/main-search.liquid used `{% form 'search' %}` (not a valid form type) → plain `<form action="{{ routes.search_url }}" method="get" role="search">`. Search works ("bear" finds 3 bears). Backups: backup-main-cart.before-fix.liquid, backup-main-search.before-fix.liquid; fixed copies in theme-live/sections/.
- Full scan: 22 pages (home, collections, 12 products, search, cart, contact) no Liquid errors. /pages/reviews is linked on the homepage but doesn't exist (404). The cart says "Free worldwide shipping on all orders" and the top bar says "Free worldwide delivery", but the store ships to LB only.
- 2026-11-06 full check (browser crawl of 22 pages + buy path on phone and desktop): no Liquid errors, no JS errors, no broken images. Add to cart opens the drawer; mobile menu (Home, Catalog, Contact) works.
  - FIXED: drawer "Checkout" was a link to /cart (two taps to pay); now a form button with name="checkout", straight to Shopify checkout (sections/cart-drawer.liquid; backup-cart-drawer.before-fix.liquid).
  - Missing pages (404): /pages/reviews (homepage reviews section link "MK Atelier reviews 4.8 out of 5…") and /pages/authenticate-your-piece (product page "Learn more"). Ask owner: create pages or remove links.
  - No "Buy it now" button on product pages; the drawer has no quantity change or remove. "Free worldwide shipping" text vs ships to LB only.
