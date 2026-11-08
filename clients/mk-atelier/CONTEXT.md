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
- 2026-11-06 (owner: "remove the links and add buy it now"), live theme:
  - Reviews strip (homepage) no longer links anywhere: section renders a <div> when its link is blank; index.json reviews.link emptied. Product "Learn more" link to /pages/authenticate-your-piece removed (sentence kept).
  - "Buy it now" ({{ form | payment_button }}) under Add to cart in main-product, white outline style (.mk-buy-now). Tested phone + desktop: goes to Shopify checkout; Add to cart still works.
  - Also fixed: product option box "Title / Default Title" hidden for single-variant products; quantity number was white on white (now black on white); "You May Also Like" (featured-collection, no collection set) showed placeholder pictures; now falls back to all products and skips the current one (placeholders only in the theme editor); carousel "previous" button showed an X icon, now ←. Homepage New Drops / Best Sellers unchanged (6 cards each).
  - Note: reviews strip says "4.8 out of 5, based on 300 reviews" and product pages show 4.8 stars by default (product.metafields.reviews.rating default '4.8'); there is no reviews app or page. Raised with owner.
- 2026-11-07: Owner asked to add all Zarian & Co. (bknm06-v0, owner's own US store) products to Mk Atelier. Copied all 52 from Zarian's public catalog with productSet as DRAFT: same handle, title, description, type (4 untyped → "Sculpture"), tags, options/variants, prices and compare-at prices (Silver Doberman 75/100 cm), all photos (84) by URL; vendor set to "Mk Atelier"; inventory not tracked, policy DENY (same as Mk's own products). Verified: 52/52 drafts, photos READY, prices match. Mk Atelier now has 12 active + 52 draft products. Not published yet; Mk collections (new-drops, resin-sculpture, fiber-glass, ceramic-art) are manual and don't include them. Zarian types: Abstract Form 12, Bust & Figure 10, Vessel 8, Animal Form 8, Wall Sculpture 6, Pedestal 4, untyped 4.
- 2026-11-07: Owner said "publish all": the 52 imported products set ACTIVE and published to Online Store, Point of Sale and Facebook & Instagram (same channels as Mk's own products). Live: 64 products on mkatelier.club; product pages checked (no errors, Add to cart + Buy it now).
- Fixed main-product.liquid: options were shown as static labels with a hidden first-variant id, so multi-size products (Silver Doberman 75/100 cm) couldn't be chosen. Now multi-variant products get a <select name="id"> listing "size · price" (sold-out options disabled); single-variant products unchanged. Tested: choosing 100 cm adds the $900 variant. Backup: backup-main-product.before-variant-select.liquid.
- Open: collections for the new pieces (Abstract, Figures, Vessels, Animals, Wall Sculpture, Pedestals) and delivery for large or heavy pieces (owner to decide).
- 2026-11-07 (owner: "put them on collection sections"): 6 smart collections (TAG equals the Zarian subject tag), published to all 3 channels, with a description and an image from one of their products: abstract-forms "Abstract Forms" (12), busts-figures "Figures & Busts" (11), animal-forms "Animal Forms" (10), vessels-objects "Vessels & Objects" (8), wall-sculpture "Wall Sculpture" (7), pedestals-plinths "Pedestals & Plinths" (4). New pieces with the same subject:* tag join automatically. Product types fixed for the 4 untyped imports.
  - Homepage "Explore Our Artworks" (collection-list) got 6 tiles after the original 4 (backup-live-index.before-new-collections.json).
  - main-menu: new "Collections" item after Catalog, with the 6 new + Pop Art, Resin Sculpture, Fiber Glass, Ceramic Art. Checked on phone menu and desktop; collection pages show their products, no errors.
- 2026-11-07 (owner: "extremely easy to see everything, instead of searching"): rebuilt sections/main-collection.liquid (backup-main-collection.before-browse.liquid). Every collection page and /collections/all ("All pieces") now has: a row of category buttons ("All" + the children of the main menu's "Collections" item, with piece counts; current one highlighted; scrolls sideways on phones), a Filter panel built from collection.filters (price range and availability are what's enabled), sort, 48 pieces per page with "Page x of y", and an empty-state message with "Clear filters". Tested phone + desktop: category button → collection, price ≤ $500 shows 12, no errors. More filters (type, material) need the Search & Discovery app.
- 2026-11-07: Removed the homepage 'New Drops' product grid (featured-1, right under the trust bar), owner request. Homepage order now: hero, collections, trust, promo, featured-2 (Best Sellers), story, reviews. Backup: backup-live-index.before-remove-new-drops.json.
- 2026-11-08 (owner: "make the site the same as atelierhome-art.com"): followed that site's layout and style with Mk Atelier's own name, photos and text (not their brand, images, copy or press logos). Built on unpublished copy "Mk Atelier - Gallery style" 151607640270. Files in theme-gallery/:
  - assets/mk-style.css (loaded after base.css): white and black palette, Instrument Sans (Google Fonts), sentence-case headings, square buttons; header logo left, menu centre, icons right (phone: menu left, logo centre), transparent over the homepage hero then white on scroll (script in layout); centred full-screen hero; centred product cards with uniform square photos; collection carousel with arrows; dark promo band; grey trust row; #111 footer; light versions of the chips, filter, size select, Buy it now and quantity built earlier. Starfield canvas hidden.
  - layout/theme.liquid (fonts, mk-style.css, body class template-*, header scroll script); sections/mk-tabbed-products.liquid (new: heading, collection tabs, 4-across grid, button follows the active tab); sections/collection-list.liquid (carousel); sections/trust-badges.liquid (grey band wrapper); config/settings_data.json (colours white/black/#E6E6E6/#C8102E; footer columns); templates/index.json (hero → reviews → tabbed → collections → promo → story → trust; Best Sellers disabled; hero single "Explore the collection" button; tabs: Pop Art, Abstract Forms, Figures & Busts, Animal Forms, Resin Sculpture, Vessels & Objects).
  - New menus footer-explore and footer-client-services (footer columns Explore / Client services).
  - Tested desktop + phone: homepage, tabs (button follows the active tab), collection page, product page (size select + Buy it now), cart drawer; no Liquid or JS errors.
  - PUBLISHED 2026-11-08 with owner OK: "Mk Atelier - Gallery style" 151607640270 is MAIN. Previous live "Mk Atelier - Dev" 151120478414 (black and starfield) kept as rollback. Open: "Free worldwide delivery" wording (ships to LB only) and the reviews bar claim (4.8/5, 300 reviews).
