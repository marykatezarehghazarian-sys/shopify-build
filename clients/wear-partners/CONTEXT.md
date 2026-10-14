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
- 2026-10-14: Luxury-house redesign (references prada.com, miumiu.com; hermes.com and gucci.com blocked automated visits) on "WearPartners - 3D Motion" 167581679848, keeping the video background:
  - Fonts: Work Sans body/headings, Bodoni Moda accent; heading sizes reduced; square corners everywhere (buttons, inputs, cards, badges, variants); page width wide.
  - Header: logo centred, menu left in small spaced capitals. Logo shown as assets/wp-wordmark.png (the "WEAR PARTNERS" lettering cut from the banner) because shop name "WearPartners" has no space; no logo image is set in admin.
  - Homepage order: full-screen hero (wordmark over video, underlined "Discover the collection" link) → sections/wp-category-tiles (Women, Tops=mens-t-shirts, Jeans=women-jeans, Jackets=women-jackets) → New arrivals grid (edge-to-edge, 2px gaps) → sections/wp-editorial (Dresses, collection 'dress', "The edit / Discover").
  - assets/wp-luxe.css: spaced capitals for nav, buttons, labels, product titles; white plates under product cards; underlined text-link CTAs.
  - Note: the store's product photos show other brands' logos (Moncler, Miu Miu, Prada, Celine, D&G); flagged to the user.
- 2026-10-14: User PUBLISHED "WearPartners - 3D Motion" (167581679848), now MAIN/live. New unpublished copy "WearPartners - Neat Categories" 167584137448 with tidy-ups:
  - Category tiles rebuilt: photo = first product's image (collection images were 195px and had white bars), portrait 3:4, solid white label with name + "Shop now", 16px gaps, heading with hairlines.
  - Collection page: title was hard-coded "Women Jeans" on every collection; now {{ closest.collection.title }}, centred spaced capitals; description centred.
  - Product cards (collection, homepage, search): no gap between photo and white name plate, centred text and colour dots.
  - Store data: Belts and Hats (handle all-men) collections in the main menu have 0 products; several collections empty (Bags, Accessories, Men, Shoes…).
- 2026-10-14: User published "WearPartners - Neat Categories" (167584137448), now live. Phone menu drawer tidied on new copy "WearPartners - Neat Menu" 167584497896 (wp-luxe.css only): main links 0.82rem spaced capitals with hairline dividers, sub-links 0.74rem grey and indented, featured products as an even 2-up grid (3:4, centred names and prices, max 2) instead of a row cut off at the edge.
- 2026-10-14: Category audit (storefront products.json; app still lacks read_products / navigation scopes so nothing changed):
  - Main menu: HOME -> /collections (should be /); HATS -> /collections (the all-collections page, hence "a different picture"); the "Hats" collection (handle all-men) is empty; hat products in store: GG HAT x3, MM HAT (tag HAT).
  - Women sub-links use tag-filter URLs that require ALL tags, so all four are EMPTY: women/Tops+shirt+tshirt+tank-top (0), women-jeans/jeans+denim+pants (0), women-set/sets (collection itself empty), all-women/dress+summer+women+beach (0).
  - BELTS -> /collections/belts: 0 products.
  - Wrong products: women-jeans has "P white tank top"; mens-t-shirts ("Tops") has Dress, Dress, Skirt; women-jackets has "D&G BABY BLUE SWEATER".
  - Tags in use: women 87, Winter 27, Tops 26, Long sleeve 21, Tshirt 16, Jeans 11, Dress 8, Body 4, HAT 4, Sale 3, Skirt 1, Swimsuit 1.
- 2026-10-14: User published "WearPartners - Neat Menu" (167584497896), now live. The "all collections" page (/collections, where the menu's HATS and HOME links point) listed 20 collections incl. stock placeholder images (Accessories, Bags, Hand Bags, Hats, Short), empty and menswear ones (Men, Hoodies, Shoes, sets), 'Home page' and duplicates. On new copy "WearPartners - Clean Collections" 167585644776: sections/main-collection-list.liquid now skips empty collections (setting wp_hide_empty) and handles in wp_hidden_handles (default: frontpage, all, women-1, all-women, dresses) -> shows Dress, Sale, Tops, Women, Women - Jeans, Women Jackets. Centred 'COLLECTIONS' heading and centred spaced-capital labels. Empty collections reappear automatically once they get products. Menu links themselves still need fixing in admin (no navigation scope).
- 2026-10-14: POLICIES (from user):
  - Shipping: daily delivery in Beirut; outside Beirut 2-3 working days via Aramex.
  - Exchange: no try-on; exchange within 2 days (interpreted as of delivery) for the same item in a different size (interpretation of "same item size"); no returns/refunds.
  - Product page (templates/product.json on "Clean Collections" 167585644776): info lines changed from "Reliable shipping"/"Flexible returns" (contradicted the no-return policy) to "Daily delivery in Beirut · 2–3 working days elsewhere" / "Exchange within 2 days · No returns"; new accordion under the description with Shipping and Exchanges rows. Official Settings → Policies pages need write_legal_policies scope (not granted), so the user must paste the text in admin.
- 2026-10-14: Brand story text from user added as sections/wp-brand-story.liquid on the homepage (after New arrivals, before the Dresses editorial) on "Clean Collections" 167585644776: 'Our story' label, Bodoni headline (first sentence), 3 paragraphs, sign-off line, 'DM us to shop ✨' (cta_link empty: no Instagram/WhatsApp URL in theme settings; user to add). Text kept as written (with emojis).
- 2026-10-14: User published "Clean Collections" (167585644776), now live. New copy "WearPartners - Story Heading" 167586103528:
  - Brand story: heading "At Wear Partners" + short underline rule + opening line "We don't just choose clothes… we choose what's next 🤍" (new 'lead' setting), then the paragraphs.
  - New sections/wp-policy-band.liquid ("Shipping & exchanges", two columns with icons) placed directly above the story on the homepage.
  - Hats fix (menu still points HATS and HOME to /collections; no navigation scope): snippets/wp-link-url.liquid rewrites those two links in the desktop menu, mega menu and phone drawer: Hats -> /collections/all/hat (tag HAT: GG HAT x3, MM HAT), Home -> /. Remove once the admin menu is fixed.
  - Collection page title is now sections/wp-collection-title.liquid (replaced the text-block 'section' in collection.json): shows the collection name, or a tag title on tag pages (setting tag_titles "hat:Hats"), plus description.
- 2026-10-14: User published "Story Heading" (167586103528). Client (Julian Maryline) feedback list; theme fixes on new copy "WearPartners - Client Fixes" 167588135144:
  - Policy wording: exchanges within 2 days for "a different size or another item" (homepage band + product accordion).
  - "DM us to shop" removed from the story.
  - Phone menu: always the sub-page drawer (header-drawer.liquid: `{% if linklist.levels < 3 %}` -> `{% if false %}`), so Women opens its own page ("‹ WOMEN", Tops/Jeans/Sets/Dress) like prada.com.
  - wp-link-url now also fixes child links: Tops -> /collections/all/tops, Jeans -> /collections/all/jeans, Dress -> /collections/dress (9 dresses; old multi-tag link showed 2), Sets -> women-set collection if non-empty, else tag Sets if it exists, else /search?type=product&q=title:set (3 sets); search-header shows "SETS" for that search.
  - sections/wp-reviews.liquid added after the story; hidden until real reviews are added as blocks.
  - Store data still wrong (needs admin, no product/navigation scopes): one "P white tank top" is tagged Jeans; Sale collection has P white tank top, C dress, MM Dress with no sale price (P BLACK SET does have compare-at $150 -> $110); two products titled "Dress" tagged Tops; 3 sets have no tag/collection. Menu order wanted: New Arrivals, Women, Belts, Hats, Sale. Also wanted: remove "Sign in with Shop", add card payments.
- 2026-10-14: User published "Client Fixes" (167588135144). Client asked for Jackets, Scarves, Skirts, Leggings under Women. On new copy "WearPartners - Women Sections" 167588561128:
  - snippets/wp-extra-links.liquid adds sub-links under the menu item named in Theme settings → "WearPartners menu" (wp_extra_parent "Women"; wp_extra_links "Jackets:jacket, Skirts:skirt, Leggings:legging, Scarves:scarf"), in the phone drawer (after Women's children) and the desktop mega menu. Each goes to /search?type=product&q=title:<keyword>; search-header shows the category title from wp_search_titles; search-results shows "New pieces coming soon" (instead of all products) when such a category search has no results.
  - Results: Jackets 10, Skirts 1, Leggings 2, Scarves 0 (no scarves in store).
  - Data bug found: "P white tank top" is tagged Dress, Jeans, Sale, Skirt, Swimsuit, Tops, Tshirt, women: why it appears in many categories. Needs tag cleanup in admin.
- 2026-10-14: Tops showed 'Skirt' and two 'Dress' products (all tagged Tops in admin). main-collection.liquid now skips, on the tops tag page, products whose title contains dress/skirt/jean/legging/jacket/set, and on the jeans tag page keeps only titles containing 'jean' (drops P white tank top). Dresses already in Dress (/collections/dress), Skirt in Skirts. Pushed to "Women Sections" 167588561128. Admin tag cleanup still recommended (Dress x2 and Skirt tagged Tops; P white tank top has 7 category tags).
- 2026-10-14: Maryline's requests on "Women Sections" 167588561128: phone menu shows no product photos (.menu-drawer__featured-content hidden); category tiles and editorial got a 'product' picker (product photo) and tiles a 'link' override: Tops = cd-beige-crop-polo -> /collections/all/tops, Jeans -> /collections/all/jeans, Jackets = ysl-mastic-jacket -> jackets title search; Dresses banner = d-g-brown-dress.
- 2026-10-14 (later): On "Women Sections" 167588561128:
  - Dresses editorial banner replaced by sections/wp-carousel.liquid ("The edit"): auto-slides every 4 s, endless loop (cloned slides), swipe/drag, dots, pauses on hover/off-screen, still for reduced motion; 1/2/3 slides per view (phone/tablet/desktop). Slides: Dresses d-g-brown-dress, Jackets ysl-navy-jackey, Hats gg-hat-1, Sets d-g-classic-set, Tops cd-beige-crop-polo, Jeans chanel-jeans, Skirts skirt, Leggings d-g-black-legging, each linking to its category page.
  - Category tiles: Tops tile replaced by Hats (celine-hat photo, /collections/all/hat); Jackets tile photo = ysl-navy-jackey (the client's picture).
  - Delivery FEES (client): Beirut $5, outside Beirut $8 via Aramex. Shown in the homepage policy band, product accordion and product info line. Actual checkout rates are set in admin (Settings → Shipping and delivery); currently a single $6 rate. App has no shipping scope. Lebanon zone needs two named rates: "Beirut — daily delivery" $5 and "Outside Beirut — Aramex (2–3 working days)" $8 (customer picks at checkout).
