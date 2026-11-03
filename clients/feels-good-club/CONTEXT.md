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
