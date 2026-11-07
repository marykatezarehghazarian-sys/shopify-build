# Lara

Store: kc30cj-dq.myshopify.com

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

## Setup (2026-10-31)
- Store: kc30cj-dq.myshopify.com. Client folder created; no credentials yet.
- Credentials go in environment secrets `LARA_STORE_SHOPIFY_CLIENT_ID` / `LARA_STORE_SHOPIFY_CLIENT_SECRET` (Dev Dashboard app installed on the store), or `npm run client -- set lara-store client-id|client-secret`.
- Pending (2026-10-31): replace the photo of the product "Kids' name plaque" with `photos/kids-name-plaque.jpg` (8 plaques: Anna, Melina, Aydan, Norah, Sarah, Liam, Chloe, Milad, plus the hanging kits). Also use it wherever the plaque photo appears under "Shop by occasion" (homepage section / collection image). Done 2026-11-07 (see below).
- 2026-11-07: Store kc30cj-dq is the brand "Elle.ay" (elleayofficial.com), Beirut, USD, ships to LB. Public products: Plexi Christmas ornament, Plaque (name plaque), $ Wallet, Lun'elle (sunglasses holder), smART (pouch). App keys from owner saved to .env (gitignored), but token exchange says app_not_installed: the app must be installed on this store.
- 2026-11-07: Working credentials = app installed by the store admin (Client ID 4c87…, 30 scopes incl. themes/products/files), saved to .env. The partner-org apps 04cc… (app_not_installed) and 0f28… (shop_not_permitted, client-owned store) don't work with client credentials.
- Live theme: "[Draft] Elle.ay – Lebanon & worldwide" 190234099956 (MAIN). Homepage sections ea-tiles: "The pieces" (pieces) and "Shop by occasion" (occasions).
- Kids' name plaque photo replaced: uploaded `photos/plaque-names-8-with-kits.jpg` as the Plaque product's first photo, removed old `plaque-names-collection.jpg` from the product (no other theme file or collection used it), and switched both homepage tiles (pieces.p4 "Kids' name plaque", occasions.o2 "Little ones") to the new photo. Backup: backup-live-index.before-plaque-photo.json. Product page still opens on the selected design's picture ("Dream big"), same as before, because each Design option has its own photo; the new photo is the product's main image (cards, sharing).
- 2026-11-07: Homepage hero text changed to "Unique pieces and keepsakes, personalized for you and the people you love." (was "Leather pieces…"; owner: not everything is leather). Other leather mentions left: they describe specific leather products (smART, Lun'elle, $ Wallet) and the "Our story" line "leather you carry every day".
