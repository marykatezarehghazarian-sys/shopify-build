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
- 2026-11-16 Black Friday v2 (user):
  - "Flash Sale" → "Black Friday Sale" everywhere (same deal):
    - templates/index, collection and product .json: orange banner heading and text "Black Friday Sale - Get 30% Off* on Homeware & décor"
    - product-block-header.liquid line "Black Friday Sale: 30% Off!" (Lumen's homeware line)
  - Black top strip: "BLACK FRIDAY SALE: 30% off Bedroom and Homeware & Décor" → /collections/sales.
  - Homeware & Decor's 30% was never a discount: it's compare-at pricing (514/835 variants at exactly 30%). The smart collection `sales` = IS_PRICE_REDUCED.
  - Bedroom (154 products, 185 variants, incl. beds, bedside tables, mattresses, packages) now uses the same method: compareAtPrice = old price, price = 70% rounded to the cent. Script: bf-bedroom-prices.mjs (dry run / --apply / --restore <backup>). Backup: backup-bedroom-prices.2026-11-16T22-33.json (all had no compare-at before).
  - Automatic discount "Black Friday: 30% off beds" deactivated, so there's no double discount. Cart check: Ella Bed $1,176, no extra discount.
  - snippets/bf-beds.liquid emptied; the theme's own crossed-out price and "30% off" badge show instead.
  - Theme backups in theme-live-backup/before-bf-rename/.
  - Pending: free delivery on Bedroom except bedside tables (Starshipit; needs scope: Sydney metro / NSW / all of Australia); whether the bedroom prices go back after 1 Dec.
- 2026-11-16: decisions:
  - Free delivery on Bedroom except bedside tables = Sydney metro only.
  - Bedroom prices revert on 2 Dec.
  - Tag `bf-free-delivery` added to the 119 Bedroom products that are not bedside tables (for the Starshipit rule; the search index showed 94 right after, still catching up).
  - The free-delivery rule itself must be made in Starshipit (we have no access). Sydney metro postcodes used: 2000–2234, 2555–2574, 2740–2786.
  - Reminder trig_01DqAdUcsn3hRtEYfGBYVvjY at 2 Dec 00:05 Sydney (replaces the banner-only one): restore prices from backup, rename banners back to "Flash Sale", disable the announcement bar, remove the free-delivery rule and tag.
- 2026-11-17: Starshipit can't read Shopify product tags at checkout; checkout rules can use Item SKU and Destination Post Code - AU (semicolon list; ranges not documented). Generated starshipit-free-delivery.txt: 302 Sydney metro postcodes + 91 SKUs (76 active Bedroom products excluding bedside tables). How it behaves with mixed carts, and whether conditions are AND/OR, isn't documented, so test it.
- 2026-11-17: Starshipit rule CREATED (logged in with credentials the owner shared in chat; nothing stored, and the browser session file was deleted afterwards. Recommended the owner change that password).
  - Location: Settings → Checkout Rates → Rules tab (classic page app.starshipit.com/members/settings/checkoutrates2.aspx).
  - Rule: Destination Post Code - AU Contains <302 Sydney metro postcodes> AND Item SKU Contains <24 SKUs> → Set Checkout Rates: Allied Express: Free Shipping (Return this item only).
  - The other checkout rules (PO Box carrier rules, weight margins) are untouched.
  - Scope changed by the owner the same day to ONLY Bedroom Packages + Dressers and Mirrors (not beds or other bedroom items). SKU list in starshipit-free-delivery.txt; tag bf-free-delivery moved to those 52 products.
  - Tested on the live checkout (no orders placed):
    - suite / dresser to Sydney = Free Shipping
    - dresser to Wollongong = Road Express $230.64
    - bed to Parramatta = $203.23
    - suite + cushion to Sydney: Free Shipping offered next to paid Parcel/Express, so the whole cart can go free
    - Shopify caches carrier rates for a few minutes (the bed showed free once from cache)
  - Pre-existing issue (not ours): Hampton Black Bedside Table (59 kg) gets "Shipping not available" at every address tested.
  - On 2 Dec the Starshipit rule must be deleted: the owner can do it, or I need a fresh login.
- 2026-11-17 (later): the client reported Lunar Queen Bed to Wallacia 2745 being charged $177.98. The user confirmed scope = Beds + Kids Bed + Bedroom Packages + Dressers & Mirrors (67 SKUs, 46 active products); Starshipit rule SKU list updated (re-login, session deleted after). Tested: Lunar to Wallacia FREE ($805 total), Ella to Blacktown 2148 FREE, Lunar to Wollongong $183.96. Tag bf-free-delivery is on all 84 products in those collections.
- 2026-11-17: postcodes replaced with the owner's metro list: 1000–1935, 2000–2249, 2555–2570, 2740–2777, 2890–2897 (1,248 postcodes; saved in full). Edge tests with Ella Bed: 2777 Springwood FREE, 2570 Camden FREE, 2780 Katoomba $269.36, 2574 Picton 'Shipping not available' (no courier rate for that postcode/item; outside the free zone, not caused by the rule).
