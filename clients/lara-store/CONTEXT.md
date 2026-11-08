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
- 2026-11-08: Owner approved the recoloured smART photos, now live. smart-black.jpg is at position 2, right after the 4-colour photo (which stays the product's main image), and is linked to the Black variant. smart-dark-green-new.jpg replaced the old soft dark-green photo in the same position and is linked to Dark green. The old dark-green media was deleted.
- 2026-11-08: The owner REJECTED the recoloured smART photos: the real black and dark-green bags differ (the touch pad and other details), so a recolour misrepresents them. Rolled back: Black uses the 4-colour photo again, and Dark green uses the original photo (re-uploaded from the saved copy, `photos/smart/smart-dark-green-original.jpg`, same position). Generated files deleted. **Don't recolour or generate product photos for Elle.ay. The owner will take new photos of the black and dark-green bags.**
- Owner, same message: Lun'elle still shows all 18 designs (waiting for the list to keep). Santa & snowman and Your photo ornament pictures are "still not right"; asked what exactly. "The wallet sound" is still open: the $ Wallet product has no video, so I asked what she means.
- 2026-11-08: Lun'elle stock comes from the owner's InStock app export (03 Nov 2026). Tracking is now on for all 18 variants, at location RuDamas Tower. In stock: Fruit Faces 2, Celestial 3, Chili 2, Faces 2, Maze 2, Palm & Tigers 1, Squiggle 5, Pop Art 2, Evil Eye 2, Serpent 4, Hot Sauce 1, Safari 1 (27 in total). Set to 0, so sold out and can't be bought: Japanese Waves, Jungle, Palm & Tigers Red, Confetti, Retro Cubes, Ginkgo Blue. Asked whether to delete those 6 or leave them as sold out. Stock now goes down with each order. Note: inventorySetQuantities on 2026-07 requires the `@idempotent(key:…)` directive.
- 2026-11-08: Owner chose to delete the 6 sold-out Lun'elle designs (Japanese Waves, Jungle, Palm & Tigers Red, Confetti, Retro Cubes, Ginkgo Blue), along with their photos. Copies of the photos and variant data (title, SKU, price) are in `photos/lunelle-removed/`. Lun'elle now has 12 designs and 14 photos.
- 2026-11-08: Christmas ornament gallery, owner's phone video: you could swipe through all 7 design photos, which she found confusing, and on her iPhone a stray "1. 1 … 7. 7" list appeared under the gallery (not reproducible in Chromium). She wants only the chosen design's photo. Changes:
  - The product is tagged `gallery-per-variant`.
  - snippets/product-media-gallery-content.liquid: on tagged products, other variants' photos are always hidden (same as the theme's hide_variants setting, but per product). When a design + material combination doesn't exist (e.g. Santa & snowman + Silver mirror), the chosen design's photo is shown instead of every photo.
  - Checked on mobile: each ornament design shows one photo, so there's no swiping and no slideshow controls. Lun'elle is unchanged (Fruit Faces 3, others 1). smART and Plaque aren't tagged, so they're unchanged.
  - Backup: backup-product-media-gallery-content.before-hide-variants.liquid.
- 2026-11-08: Owner OK'd auto-switching the material. blocks/variant-picker.liquid (live theme) now includes, for products with 2+ options (only the ornament today), a variant list as JSON plus a capture-phase change listener. When the clicked value makes a combination that doesn't exist, it checks the best existing variant's other options (available first, then most current choices kept) before Horizon fetches. Tested on mobile:
  - Santa & snowman → White
  - Your photo → Transparent
  - Classic → Silver mirror
  - Gold mirror stays on Baby's first Christmas
  - The cart variant and the photo are right each time, with no JS errors.
  - Backup: backup-blocks-variant-picker.before-auto-material.liquid.
- 2026-11-08: Plaque "Preview:" confusion. The owner typed a name and the design didn't change: the old "Preview:" only echoed the text under the box.
  - Built a live preview in blocks/ea-personalise.liquid (local: theme-live/blocks/ea-personalise.liquid). A canvas draws the chosen design's photo with the typed name (uppercase, Arial) over a white box covering "NAME".
  - Boxes were measured per design (fractions of the photo; Lebanon and Stay magical set by hand). It only shows for photos named plaque-design-<handle>, so other products keep the text preview.
  - Caption: "Live preview. We send you the final virtual design on WhatsApp to approve before we make it."
  - Simulated on the real page in a test browser (mobile): 4 designs OK, no JS errors. Screenshots in review/plaque-live-preview.jpg.
  - Owner OK'd it, and it's LIVE (blocks/ea-personalise.liquid on theme 190234099956). The design map is emitted as Object.fromEntries([[name,url],…]), because Liquid rejects `{{ '}' }}`.
  - Checked on the live site (mobile): hidden until you type; 'Reema' shows on the plaque; switching to Safari redraws it and keeps the name. Wallet and ornament are unchanged (no canvas, text preview as before). No JS errors.
  - Backup of the live block: backup-blocks-ea-personalise.before-live-preview.liquid.
- 2026-11-08: The owner sent REAL photos of the black and dark-green smART bags. The originals are saved as photos/smart/owner-smart-black-on-black.jpg and owner-smart-dark-green-checker.jpg; the green one has the transparency checkerboard baked in.
  - Each bag was cut out of its background with a flood fill from the edges: green over light neutral pixels; black over pure-black pixels at threshold ≤1. The black outline was then smoothed by opening, blurring and re-thresholding.
  - Placed on the same soft white (≈254→248) as the other smART photos: 1500×2000 portrait, bag 1020 px wide, base at y=1620, soft contact shadow. Files: photos/smart/smart-black.jpg and smart-dark-green-new.jpg.
  - Live: smart-black.jpg is at position 2 after the 4-colour photo and linked to Black. smart-dark-green-new.jpg replaced the old dark-green photo in the same position and is linked to Dark green; the old media was deleted. No recolouring: these are the owner's real photos.
- 2026-11-08: The owner sent a sharper dark-green photo with a transparent background (photos/smart/owner-smart-dark-green-v2.webp). It was placed on the same white canvas as the others (photos/smart/smart-dark-green-v2.jpg) and replaced the dark-green media in the same position, linked to Dark green. The owner also has a better portrait black photo on a checkerboard; asked for it to be resent as a file. The current black photo (from the black-background source) is still live.
- 2026-11-08: The black smART photo was replaced with the owner's better portrait photo (photos/smart/owner-smart-black-v2.webp, checkerboard baked in). It was cut out with a light-neutral flood fill and placed on the same white canvas (height 1180, base y=1620): photos/smart/smart-black-v2.jpg. It's in the same position (2) and linked to Black. The older black-on-black version was removed.
