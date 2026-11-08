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
- 2026-11-07 owner feedback:
  - smART unboxing video had no sound: the file has audio, but snippets/video.liquid always rendered muted (Shopify's video_tag adds muted="muted" with autoplay) and product-media passed disable_controls: true. Now product-gallery videos (not background autoplay ones) render without muted and with controls (product-media disable_controls: false; video.liquid strips muted when video_autoplay is false, keeping autoplay so media.js plays on tap). Tested phone + desktop: tap → plays, muted false, controls on. Backups: backup-snippets-video.before-sound.liquid, backup-snippets-product-media.before-sound.liquid.
  - smART Black variant shows the 4-colour group photo (no black-only photo exists; a crop includes the grey pouch behind). Dark green photo is soft or upscaled (77 KB for 1500×2000). Waiting for owner photos.
  - Lun'elle (18 designs, inventory not tracked): owner says about half are no longer available; waiting for the list of designs to keep.
- 2026-11-07: Lun'elle front = Faces (owner: 'the orangy one', option 1 of the review sheet): Faces photo (lunelle-04-faces.jpg) moved to first product image, Faces variant moved to position 1 (page opens on it), homepage 'The pieces' tile p2 and the disabled 'lunelle' split section now use lunelle-04-faces.jpg instead of lunelle-lifestyle-fruit-faces-on-bag.jpg. Fruit Faces kept as a design option. Backup: backup-live-index.before-lunelle-faces.json.
- 2026-11-07: Plaque front photo = plaque on a stroller ('REEMA', owner photo, photos/plaque-on-stroller-reema.jpg): first product image (cards and sharing) and homepage tiles pieces.p4 + occasions.o2. The 8-names photo stays as the product's second photo. The product page still opens on the selected design's picture. Backup: backup-live-index.before-stroller.json.
- 2026-11-07: Plexi ornament design photos (baby's first Christmas, gift & candy cane, reindeer & snowman, santa & snowman, your photo) were on flat grey #606060 with a thin green vertical line (4 of 5). Remade on white (grey and green turned white, soft drop shadow; santa and your-photo cut-outs filled light grey so the text stays readable): photos/ornaments/*-white.jpg. Swapped on the product in the same positions and re-linked to the same variants; old grey media deleted.
- FOUND: visitors outside Lebanon (US/FR/AE checked) see every product as "UNAVAILABLE" (button disabled, all options crossed out). Lebanon is fine. Market "International" (AE, EU, GB, US, Gulf…) is active, but products aren't sellable there and shipping is LB-only, while the top bar says "Delivery across Lebanon & worldwide". Raised with owner; not changed.
- 2026-11-08: Lun'elle back to Fruit Faces as the front (owner): media order fruit-faces, lifestyle-on-bag, back, then the designs (Faces back at position 6); Fruit Faces variant first again; homepage tile pieces.p2 and the disabled lunelle section back to lunelle-lifestyle-fruit-faces-on-bag.jpg.
- Lun'elle gallery per design: product tagged `gallery-per-variant`; snippets/product-media-gallery-content.liquid now hides, on tagged products, extra (unlinked) photos whose file name contains another design's handle (longest match, so "fruit-faces" beats "faces"). Result: Fruit Faces shows its 3 photos; every other design shows only its own photo (checked Japanese Waves, Faces, Chili by URL and by clicking). Untagged products unchanged. Backup: backup-product-media-gallery-content.before-per-variant.liquid.
- Ornament: owner says Santa & snowman and Your photo pictures are "not correct" (the other 3 white versions are good); asked what's wrong.
- 2026-11-08: Owner asked to 'generate' the missing smART photos (black alone; sharper dark green). No image generator available, so I recoloured the Etoupe photo: leather mask (warm pixels, cleaned, main body only, plus top-seam highlights), luminance-preserving recolour to black (54,53,56) and dark green (53,60,55, sampled from the old dark-green photo), lock and zip neutralised. Saved photos/smart/smart-black.jpg and smart-dark-green-new.jpg (1500×2000). Sent to owner for approval; not uploaded yet.

- 2026-11-08: Christmas ornament: Santa & snowman (white ornament) and Your photo (white drawings) became unreadable on a white background, so they were briefly reverted to grey. The owner wants white for all, so they were remade: white background outside the ornament, the ornament's own grey areas kept (Santa: grey cut-outs plus an outline and shadow; Your photo: grey disc with white drawings). Files are `photos/ornaments/*-white.jpg`, still linked to their variants. **All 5 designs are on white.** The owner also sent a "your image" wreath mockup on black, which is not on the store yet.
