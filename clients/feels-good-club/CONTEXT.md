# Feels Good Club

Store: hd8wtv-ck.myshopify.com

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

## Setup (2026-11-02)
- Site: feelsgoodclub.com (Shopify hd8wtv-ck.myshopify.com), USD, based in Meridian, Idaho. Ships to ~28 countries incl. LB.
- Catalog (5 products): Purple Teeth Whitening Toothpaste, Nose Strips, Teeth Whitening Strips (14 pcs; 1/2/3 kits), Pimple Patches (360 pcs; 1/2/3 packs), Migraine Relief Cap (1/2/3 caps).
- No credentials yet: env secrets `FEELS_GOOD_CLUB_SHOPIFY_CLIENT_ID` / `FEELS_GOOD_CLUB_SHOPIFY_CLIENT_SECRET`.
- 2026-11-02: owner says every item was set to $20. Public /products.json at that time still showed: toothpaste $12, nose strips $12, whitening strips $20 for 1/2/3 kits (compare-at 34.99/69.98/104.97), pimple patches $12/$22/$32 (compare-at 16.99/33.98/50.97), migraine cap $18 for 1/2/3 caps (compare-at 24.99/79.98/119.97).
- 2026-11-02 (later): public /products.json now shows $20.00 on all 11 variants. Compare-at prices unchanged (Pimple Patches 1 Pack compare-at $16.99 is now below its price, so it won't show as a sale).
- 2026-11-03: keys sent as "Feels Good Club" turned out to belong to Tech Global (svc4nx-e5), "app not installed" on hd8wtv-ck. Removed from here and moved to `clients/tech-global/`. Feels Good Club still has no credentials.
- 2026-11-15: DM order agent (`/dm-order` skill, `.claude/skills/dm-order/SKILL.md`): orders customers place by DM are entered as Shopify draft orders.
  - Commands: `orders:variants`, `orders:quote`, `orders:draft`, `orders:invoice`, `orders:paid`, `orders:drafts`, `orders:get` in bin/shop.js; helpers in lib/admin/orders.js.
  - The customer pays by card on Shopify's checkout link (invoiceUrl). Cash on delivery = payment due on fulfillment. `orders:paid` only once the money is received.
  - Card details are never handled. Customer data is never committed.
  - Order format checked with a price check on another store (creates nothing).
  - Still needs Feels Good Club API access: create an app in the store's Dev Dashboard with scopes `write_draft_orders`, `read_products`, `write_orders`, `read_customers`, `write_customers`, `read_shipping` (plus whatever else we manage), then save the keys with `npm run client -- set feels-good-club ...`. The store owner must install the app; if client credentials are refused, use the authorization-code OAuth flow (redirect https://example.com/).
- 2026-11-15: connected. App keys in .env; the client-credentials exchange works. Scopes: draft orders, orders, products (read), customers, shipping (read). No themes or markets scopes.
  - DM order agent tested end to end: quote → draft #D943 (Lebanon address, $60 + $4 Standard) → checkout link generated → draft deleted. No email sent, no order created.
  - Shipping (General profile):
    - Domestic = Lebanon, Standard $4
    - UAE $10
    - International (27 countries incl. US) "International" $1,700,000. Looks like a typo (an LBP amount entered as USD?), and the US quote returned no shipping rates at all. Flagged to the user; not changed.
- 2026-11-15 DM orders: all cash on delivery. The price quoted to customers INCLUDES delivery (e.g. $20 total), so shipping is $0. Customers send only the area name: address1 = area, city = area, country LB; the courier calls the customer. Use `orders:cod` (draft payment terms are blocked on this plan). First one: #1896.
