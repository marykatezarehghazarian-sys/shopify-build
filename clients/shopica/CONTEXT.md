# Shopica

Store: shopica-pty-ltd.myshopify.com

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

## Notes
- 2026-11-16: Store shopica-pty-ltd.myshopify.com (www.shopica.com.au, Australia). Furniture incl. a Bedroom collection.
- Requested: Black Friday, 30% off every bed (any bed, no minimum), free delivery on beds for Sydney metro only, running from setup until 1 Dec 11:59 pm Sydney time. Ads to target Sydney metro only (set in the ad platforms, not Shopify).
- Keys in .env (client id 16d39f…). App not installed yet: install via the OAuth link (redirect https://example.com/), then exchange the code.
- 2026-11-16: connected via authorization-code OAuth; SHOPIFY_ADMIN_TOKEN in .env (client credentials refused: "cannot be performed on this shop"). Store "Shopica Pty Ltd", AUD, Australia/Sydney, Shopify plan. Locations: 15 Vineyard Ave Smithfield NSW 2164 (main), C&A Homewares Wetherill Park, Love N Care Revesby, "Warehouse" (US, Alabama?).
- Shipping: General profile, zone Domestic (AU), rates from the Starshipit carrier service only. Free delivery for beds in Sydney metro has to be done in Starshipit (postcode rules) or via a Shopify local-delivery zone; Shopify free-shipping discounts can't target products or postcodes.
- Existing code discounts: HAPPY7, MINUS60, LASTCHANCE (+3 free-shipping codes).
- 2026-11-16 Black Friday: automatic discount "Black Friday: 30% off beds" (DiscountAutomaticNode/1811396133149):
  - Collection `beds` (manual, 25 products, 15 active), from now to 2026-12-01 23:59 Sydney.
  - Doesn't combine with other product/order discounts (so not with HAPPY7/MINUS60/LASTCHANCE); combines with shipping discounts.
  - Verified in a storefront cart: Ella Bed Queen $1,680 → $1,176.
  - Kids Bed and Bedroom Packages are NOT included.
- 2026-11-16 Black Friday display on the LIVE theme 188432941341 "Shopica Cornerstone - 2026| avada06072026" (user said "publish"):
  - Originals in `theme-live-backup/`, edited copies in `bf/`. Uploaded with themeFilesUpsert (the theme CLI wasn't used, so nothing else was touched).
  - New `snippets/bf-beds.liquid`: shows only for products in the `beds` collection, until epoch 1796129999 (1 Dec 23:59 Sydney), then hides itself. Modes:
    - badge: "30% OFF"
    - card: "Black Friday from $X"
    - product: a red box with the 30% price
  - Rendered from: product-badges.liquid (badge), product-item-price.liquid (cards), product-block-header.liquid (product page price; this theme's product page uses the header block for price), product-block-price.liquid (price block, if used).
  - header-group.json: announcement bar enabled (was disabled) with "BLACK FRIDAY: 30% off all beds. Ends 1 December" → /collections/beds. The 2nd block is disabled. Background #111111 (was #444444). Reminder set for 2 Dec 00:05 Sydney to restore it.
  - Checked live: no Liquid errors; Ella Bed page shows the badge plus "from $1,176.00"; the beds grid has badges.
  - The store already has its own orange "Flash Sale, Get 30% off on Homeware & décor" banner from another developer's code (lumen_flash in product-block-header). Not ours, left alone.
