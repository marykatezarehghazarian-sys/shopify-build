# WearPartners

Store: wearpartners-1574.myshopify.com

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

## Setup log
- 2026-10-14: Client created. Store wearpartners-1574.myshopify.com (live: wearpartners.com, shop name "WearPartners", Horizon theme). Dev Dashboard client ID/secret saved in clients/wear-partners/.env (gitignored). First token exchange: 400 "The application is not installed on this shop", so the user needs to install the app on the store. Owner name and brand brief still to collect.
- 2026-10-14: App installed; token exchange works (shop 'WearPartners', USD, primary domain wearpartners.com) but the installation has NO access scopes (accessScopes = []), so all data reads are denied. User needs to add scopes to an app version, release it, and accept the update on the store.
- 2026-10-14: Scopes partly granted: themes, customers, translations, checkouts, analytics, etc. Still MISSING: products, inventory, locations, product_listings, publications, discounts, price_rules, shipping, files, content, online_store_navigation, online_store_pages, orders, metaobjects, markets.
- Themes: live MAIN = "Horizon" 148756398312 (pulled into theme/, 376 files). Unpublished: Dawn 135644152040, "Updated copy of Dawn" 148756300008, Atelier 149570584808, Ritual 167146356968, Dawn 167146455272. Horizon rule applies: themeDuplicate the live theme, then push --only to the copy; never edit live.
- 2026-10-14: Store sells women's fashion (menu: Home, Sale, Hats, Women, Belts; 24 products in /collections/all; e.g. Beige slim fit shirt $45). Brand mark "WP".
- 2026-10-14: 3D motion layer (Part 3 of user's import+design brief) on unpublished copy "WearPartners - 3D Motion" 167581679848: assets/wp-motion.css + wp-motion.js, loaded in layout/theme.liquid. Card tilt (max 6deg, mouse only) + 6px lift + shadow; image zoom 1.06 on hover; hero parallax (>=750px, only while on screen); staggered fade-rise reveal of below-fold sections and grid items (handles load-more/filters); button hover lift + press; phone product carousel 3D swipe via scroll-driven animation (@supports). All gated by html.wp-motion, never added under prefers-reduced-motion. Horizon's own page transitions (View Transitions + product image morph) were already on and are kept. Preview: https://wearpartners-1574.myshopify.com?preview_theme_id=167581679848
- Still waiting on: source site URL, category, price rule and permission for the product import (Parts 1, 2 and 4); product/inventory/files scopes still missing from the app.
- 2026-10-14: Full-page black and white video background on "WearPartners - 3D Motion" (167581679848): user's clip (abstract glass bubbles, 10s portrait, source file saved as videos/background-original.mp4, from Klickpin) converted to grayscale, muted, 720p: assets/wp-bg-video.mp4 (H.264, 1.9 MB) + wp-bg-video.webm (VP9 fallback) + wp-bg-poster.jpg; snippets/wp-video-background.liquid rendered first in <body>. Fixed behind the page (z-index -1), body/section/footer backgrounds transparent, frosted translucent header, white veil 35%. Theme settings → "Video background": on/off, optional Files video override, veil colour and strength. Paused for reduced motion, data saver and hidden tabs. Hosted as theme assets because the app lacks write_files. The homepage hero keeps its own beige image.
- 2026-10-14: Header made fully transparent (no frosted bar). Homepage banner: WPPPPP.png (beige baked in) is hidden by CSS and replaced with assets/wp-hero-wordmark.png (lettering only, transparent, made from the original) so the video shows through; banner overlay gradient hidden. If the banner image is ever changed in the editor, the swap stops applying (matched by src*=WPPPPP).
