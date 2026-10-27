# Mallo Gallery

Store: zcjd1f-ge.myshopify.com (live domain: https://mallogallery.com)
Owner / contact: Joe Mallo · joemallo84@gmail.com · Phone/WhatsApp 03 195 171 (Lebanon, +961 3 195 171 → https://wa.me/9613195171)

## Business
- Brand name as written by client: "GALLERY Mallo". Store name confirmed: "Mallo Gallery".
- Furniture: showroom stock + custom-made from their own factory. Also interior decoration design & execution services.
- Based in Lebanon (phone, Whish/OMT payments). Primary market: Lebanon. Currency: USD (store currency change pending in admin).
- Expected catalog size: 100–500 products. No spreadsheet yet. Has good photos and a logo (not yet received).

## Website goals
1. Sell online
2. Show the catalogue
3. WhatsApp inquiries (floating button + "Ask on WhatsApp" on product pages)
4. Bring showroom visits (showroom page with map/hours)

## Payments (manual, set in admin: Settings → Payments → Manual payment methods)
- Cash on delivery
- Whish Money
- OMT

## Delivery
- All over Lebanon. Existing setup: Domestic (LB) zone with two Arabic-named rates "قياسي" ($4 and $0); an International zone (26 countries, 1,700,000 LBP) that should be removed (pending Joe's OK). Fees / free threshold / made-to-order lead time still to confirm.

## Catalog structure
Smart collections driven by product tags (tag a product → it appears in the collection):

| Collection | Tag |
|---|---|
| Living Room & Sofas | living-room |
| Bedroom | bedroom |
| Dining | dining |
| Office | office |
| Outdoor | outdoor |
| Decor & Accessories | decor |
| Custom & Made to Order | made-to-order |

## Design
- Look: modern. Palette: sand / beige. No brand colours supplied.
- Reference site: "Wood and gas" (client's words; confirm exact URL).
- Language: English only.
- Theme: customise Horizon (live theme) as an unpublished copy; publish only with approval.

## Pages
Home, Shop, Collections, About us, Showroom / location, Contact, Custom orders.

## Reference sites (reviewed 2026-10-02)
- mkatelier.club (custom theme): announcement bar → big hero "Own What Others Admire" → category tiles → trust row (shipping/warranty/support) → New Drops grid → promo → Best Sellers → brand story → reviews.
- nostalgiafridge.com (Horizon, Lebanon): "Free delivery anywhere in Lebanon. Pay cash when it arrives." bar → product-led hero with price "From $295 cash on delivery" → feature sections → gallery → trust (COD / free delivery 2–3 days / Order on WhatsApp).
- linksbeirut.com (Glozin, Lebanon, USD): top bar (free delivery Lebanon) → slideshow → shop by category → featured collections → "Why choose us" → newsletter; mobile bottom nav, WhatsApp.
- 964dials.com: dark luxury, hero "Exceptional watches, timeless service" → featured → shop by brand → story "Dubai, since 2018" → services (inspect/buy-sell/handover) → "What we stand behind" → Instagram.
- silvaura.org: shop by category grid with images → shop by collection → material/quality trust points; WhatsApp button.
- velouriafashion.com (Dawn; .club doesn't exist): "Free shipping on orders $75+" bar → sale hero "Up to 40% off" → Best Sellers with compare-at prices + star ratings → Shop by Category → customer photo reviews.
Common pattern to build for Mallo: announcement bar (free/flat delivery across Lebanon · cash on delivery) → full-width lifestyle hero + CTA → shop by room (7 image tiles) → trust row (factory-made, delivery all Lebanon, COD/Whish/OMT, WhatsApp) → New arrivals grid → custom-order band → showroom in Zahle band → about/story → Instagram/reviews → footer.

## Store snapshot (2026-10-02)
- Auth: Dev Dashboard app, client credentials grant (tokens auto-refresh every 24h). Full write scopes.
- Plan: Basic. Name "My Store", currency LBP (both need changing in admin; no API for either).
- Location: "Shop location" (gid://shopify/Location/89964511317)
- Live theme: Horizon (gid://shopify/OnlineStoreTheme/161145880661)

## Open questions for Joe
- Delivery fees (keep $4 flat? free over a threshold?)
- Showroom exact address in Zahle, opening hours, Google Maps link
- Product photos (logo received 2026-10-02)
- Reference site URL for "Wood and gas"

## Decisions & notes
- 2026-10-02: Created 7 tag-based collections (published) and draft pages: About Us (/pages/about), Visit Our Showroom (/pages/showroom), Custom Orders (/pages/custom-orders), all unpublished with [PLACEHOLDERS] to fill. Existing Contact page left as-is.
- 2026-10-02: Theme work happens on "Mallo Gallery - Sand Preview" (gid://shopify/OnlineStoreTheme/161202470997), a themeDuplicate of live Horizon. Changes so far: black palette per Joe (#000000 bg, #EDE3D4 sand text, #BFB3A2, #2E2A25), earlier sand version replaced, Jost headings, 2px button radius, floating WhatsApp button (Theme settings > WhatsApp).
  Preview: https://zcjd1f-ge.myshopify.com?preview_theme_id=161202470997
- "Mallo Gallery - Draft" (161202438229) is a broken upload; delete it in Online Store > Themes.
- Main menu not yet updated (it's shared with the live theme); do it when the new theme goes live.
- 2026-10-02: Homepage built on Sand Preview: announcement bar → hero ("Furniture made for the way you live") → Shop by room (mallo-rooms, 7 collections) → trust row (mallo-trust) → New arrivals (product-list, all) → Custom orders band → Zahle showroom band → Our story band (mallo-band). Custom sections are editable in the theme editor; images are placeholders until Joe's photos arrive. Storefront is password-protected, so render checks need the admin preview.
- 2026-10-02: Logo received ("Gallery Mallo · Discover A world Beyond..."). Transparent versions in assets-src/ (white, sand, black; watermark removed). White version uploaded to Shopify Files as mallo-gallery-logo-white.png and set as the theme logo (height 64px desktop / 44px mobile).
- 2026-10-02: Per request, large logo now leads the homepage (mallo-logo-hero section, black bg, headline + Shop now / Custom orders). Original Horizon hero kept but disabled.
- 2026-10-02: Starry background (snippets/mallo-stars.liquid; Theme settings > Starry background: on/off, density 160, shooting star). Go-live (publish pages/menu/theme) was blocked by the permission classifier; Joe/user to publish from admin.
- 2026-10-03: User published "Sand Preview" (161202470997), now MAIN/live. Per request switched to white: palette #FFFFFF bg / #1A1714 text / #5E5449 / #E6DFD3, black logo (Files: mallo-gallery-logo-black.png), trust row #F5F0E8, gold stars with multiply blend. Pushing to the live theme was blocked by the permission classifier, so the white version is on new unpublished theme "Mallo Gallery - White" (161227571285): https://zcjd1f-ge.myshopify.com?preview_theme_id=161227571285. Publish it from admin to go live.
- 2026-10-03: Full descriptions written for the 5 bedroom drafts (story + highlights + 'Made for you' block). Source kept in bedroom-descriptions.mjs; reuse the same structure for new products.
- 2026-10-03: All 14 bedroom beds set Active (by user) and published to Online Store (by me). Live at https://mallogallery.com/collections/bedroom. No prices yet (store still LBP).
- 2026-10-03: User published "Mallo Gallery - White" (161227571285), now live. Hero10 (React/shadcn component from 21st.dev) ported to native Liquid as sections/mallo-hero-fan.liquid (serif title + highlighted line, description, 2 CTAs, social proof, 3-image fan, subtle reveal animation, mobile layout: fan / swipe carousel / stacked). Added under the logo hero on unpublished copy "Mallo Gallery - Hero Fan" (161237631061): https://zcjd1f-ge.myshopify.com?preview_theme_id=161237631061. Images intentionally empty: waiting for Joe to choose 3 photos.
- 2026-10-03: Hero fan images set (Files: mallo-hero-left/centre/right.jpg; links → bedroom collection, living-room collection, Monarch Velvet Bed) on Hero Fan copy 161237631061.
- 2026-10-03: On Hero Fan copy: big logo hero disabled (kept, can be re-enabled), mallo_hero_fan now first section under header.
- 2026-10-03: GravityStars (React, 21st.dev) ported to vanilla JS (assets/mallo-gravity-stars.js) as the hero fan background: dark stars (#1A1714, slate/bronze tint) on white, linked lines, drift + twinkle, no pointer interaction, pauses offscreen, static with reduced motion, 60% stars on phones. Settings under 'Star background' in the hero section. Pushed to Hero Fan copy.
- 2026-10-03: AnimatedGradient (React/WebGL2, 21st.dev) ported to vanilla JS (assets/mallo-animated-gradient.js) as hero fan background under the stars: white #FFFFFF / #F3EBDF / #E6D7C0 soft waves, speed 10 (original 30), pauses offscreen, static with reduced motion, CSS gradient fallback without WebGL2. Settings under 'Animated gradient background'. Pushed to Hero Fan copy.
- 2026-10-03: Per request, all stars off on Hero Fan copy (hero black stars: section setting stars_enabled=false; site-wide gold stars: Theme settings stars_enabled=false). Hero background is only the beige animated gradient.
- 2026-10-03: Wave background moved from hero to whole site (snippets/mallo-page-gradient.liquid, fixed full-screen, multiply blend, Theme settings > Wave background). Darker beige: #FFFFFF / #ECE0CC / #DAC6A6, speed 10. Hero-only gradient disabled. On Hero Fan copy.
- 2026-10-03: Wave background moved to the very back (z-index -1, no blend); body/main/section backgrounds made transparent so waves show through; header (white) and trust row (cream) keep solid backgrounds; photos no longer tinted.
- 2026-10-03: User published Hero Fan (161237631061), now live. Lifestyle film (20s, armchair, Files: mallo-lifestyle-film.mp4, gid://shopify/Video/31542940205141) added as sections/mallo-video.liquid after the trust row: rounded 16:9 (4:5 on phones), autoplay muted loop inline, sound toggle, pauses off-screen, text overlay 'Made to be lived in / Comfort you can see, craft you can feel' + 'Explore the collection'. On new unpublished copy 'Mallo Gallery - Video' (161242972245): https://zcjd1f-ge.myshopify.com?preview_theme_id=161242972245
- 2026-10-03: User published Video theme (161242972245), now live. New unpublished copy 'Mallo Gallery - Contact' (161243267157): contact page gets sections/mallo-contact-buttons.liquid (Get directions → https://maps.app.goo.gl/2vvXi4t4AXVPGq2E9, Chat on WhatsApp → +9613195171); homepage order swapped per request: video first (hero spot), 3-photo fan after the trust row. Showroom Google Maps: https://maps.app.goo.gl/2vvXi4t4AXVPGq2E9
- 2026-10-04: User published Contact theme (161243267157), now live. Price on request built (Theme settings > Price on request, on by default): snippets/price.liquid shows 'Upon Request' everywhere; blocks/buy-buttons.liquid replaced by green 'Ask for price on WhatsApp' (pre-filled with product name + link) + note; quick-add, dynamic checkout and sticky add-to-cart hidden (snippets/mallo-price-on-request.liquid). On unpublished copy 'Mallo Gallery - Price on Request' (161265352789): https://zcjd1f-ge.myshopify.com?preview_theme_id=161265352789
- 2026-10-05: Bedroom sub-collections (smart, by tag, published): Master Bedroom (master-bedroom: Serene Bouclé, Monarch Velvet, Cashmere Curve, Eclipse Grand, Alabaster Soft, Crestwood Modern, Orion Floating), Guest Bedroom (guest-bedroom: Cushion Edge, Hush Cloud, Linen Nest, Zenith Sleek, Timber Loft, Terra Walnut, Plush Drift), Kids Bedroom (kids-bedroom: empty, needs photos). All descriptions + Bedroom description end with full-bedroom WhatsApp quotation line. New template collection.bedroom.json (room tiles + 'Get a full bedroom quotation' WhatsApp button + grid) assigned to Bedroom (templateSuffix bedroom); template pushed to 'Price on Request' copy 161265352789 only — live theme falls back to default until that copy is published.
- 2026-10-05: Published all 15 bedroom drafts (Velour Haven + 14 from PDF 2): Active + Online Store.
- 2026-10-07: Hero replaced with sections/mallo-image-hero.liquid (split: tall sketch-to-reality image Files: mallo-hero-sketch.jpg + 'From sketch to reality / We design it. We build it.' + Shop the collection / Start your project). Video moved below New arrivals. On 'Price on Request' copy 161265352789 (unpublished).
- 2026-10-10: The 15 sofas were Active but not on the Online Store channel (living room page showed 0). Published all to Online Store; live page now shows 15. Note: setting a product Active in admin doesn't always add it to Online Store; always check publishedOnPublication.
- 2026-10-10: Product card images unified to portrait 4:5 (image_ratio adapt→portrait on all _product-card-gallery blocks in 7 templates). On unpublished copy 'Mallo Gallery - Even Photos' (161470873685), duplicated from live 'Price on Request'.
- 2026-10-10: Video sound: mallo-video now tries to play WITH sound when it scrolls into view (setting 'Play sound when visible', default on), with a volume fade-in, and pauses when scrolled away. Browsers block sound until the visitor has tapped, clicked or typed on the page; until then it plays muted with a 'Tap for sound' pill, and the first tap anywhere turns the sound on (and primes iPhone Safari). Clicking the speaker to mute is remembered. Pushed to 'Even Photos' copy 161470873685 (unpublished) together with the 4:5 product cards.
- 2026-10-10: Product page gallery (templates/product.json, _product-media-gallery) changed from auto/contain to portrait 4:5 (1/1.25) + cover so every product's photos are the same size, matching the 4:5 cards. On 'Even Photos' 161470873685 (unpublished). Note: the live site keeps uneven photos until that theme is published.
- 2026-10-12: User sent Bedroom_Inspiration_2.pdf: byte-identical to Bedroom_Inspiration.pdf (same md5, same 14 photos as photos/bedroom/pdf2), all 14 beds already Active on the Online Store, so nothing added.
- 2026-10-12: 10 new sofas from Living_Room_Sofa_Inspiration.pdf created as DRAFT (tags living-room, sofa, sectional/modular); see living-room-products.md. Published 2026-10-12 (Active + Online Store); Living Room & Sofas now has 25 products.
- 2026-10-12: Outdoor: first 2 products (tags outdoor, lounge-set; type Outdoor Set) as DRAFT, photos in photos/outdoor: Olive Terrace Lounge Set 8522954604629 (outdoor-23, -20; teak + earth-brown cushions), Douma Teak Lounge Set 8522954637397 (outdoor-21, -22; natural wood + charcoal). No duplicates.  Published 2026-10-12 (Active + Online Store).
- 2026-10-18: 7 accent chairs from Accent_Chairs.pdf (tags living-room, accent-chair, chair; see living-room-products.md) published (Active + Online Store). New smart collection "Accent Chairs" (handle accent-chairs, rule tag = accent-chair) published. Living Room & Sofas now 32 products. Living room collection uses the default template (no room tiles yet).
- 2026-10-18: New smart collection "Sofas" (handle sofas, tag sofa) published. Living Room page layout templates/collection.living-room.json (room tiles Sofas + Accent Chairs, 'Get a full living room quotation' WhatsApp button, then the product grid) pushed to new copy "Mallo Gallery - Living Room Tiles" 161782038613 (duplicated from live 'Even Photos' 161470873685). Preview: /collections/living-room-sofas?view=living-room. After the user publishes, set templateSuffix 'living-room' on collection living-room-sofas (collectionUpdate).
- 2026-10-19: User published "Mallo Gallery - Living Room Tiles" (161782038613, now live). Assigned templateSuffix 'living-room' to collection living-room-sofas; live page verified (Shop the living room tiles Sofas + Accent Chairs, quotation button). Store: 63 products, 0 drafts. Store name still 'My Store' and currency LBP (user to change in Settings → General / Store currency).
- 2026-10-19: User feedback round:
  1. Photos cut off: product cards now square frame with object-fit: contain on #F4EFE7 (snippets/mallo-photo-fit.liquid, rendered in layout/theme.liquid; image_ratio portrait -> square in 8 templates); product page gallery aspect 'adapt' + 'contain'. Room tiles: contain too.
  2. Renamed 34 products that had Lebanese place names (25 sofas/sets, 7 accent chairs, 2 outdoor sets) to classic descriptive names, handles updated with redirects, descriptions + image alt updated. Beds keep the client-supplied names. Mapping in living-room-products.md.
  3. Sub-categories (smart collections by tag, published): Living Room -> sofas (sub-sofas, 6), sectional-sofas (sub-sectionals, 6), modular-sofas (sub-modular, 6), living-room-sets (sub-sets, 5), loveseats-chaises (sub-loveseats, 2), accent-chairs (7). Bedroom (style; room collections master/guest/kids kept) -> upholstered-beds (9), statement-beds (6), platform-beds (5), wooden-beds (3). 'sofas' collection rule changed from tag 'sofa' to 'sub-sofas'.
  Theme on new copy "Mallo Gallery - Organised" 161817165909: living room page 6 tiles (3 per row, mallo-rooms new max_columns setting), bedroom page adds "Shop by style" tiles; mallo-rooms tiles have a product-photo option (Kids tile = stellar-high-back-bed). Outdoor has only 2 sets and Dining/Office/Decor are empty, so no sub-categories there yet.
- 2026-10-25: Live theme is now "[Draft] QA audit fixes" (161951252565), published outside this session; pull it before theme work.
- 2026-10-25: 9 dining sets from Dining_Room_Inspiration_2.pdf (11 photos; pages 4+5 and 8+11 are the same set, merged) created as **DRAFT**, type Dining Set, tags dining + dining-set + oval-dining / rectangular-dining, classic descriptive names (no place names), photos in photos/dining (img-000 = page 1). Oval: Oval Stone Dining Set with Bouclé Chairs, Walnut Oval Dining Set with Cream Chairs, Fluted Walnut Oval Dining Table, Organic Oval Dining Set Sculpted Chairs, Walnut Oval Dining Set Ivory Chairs. Rectangular: Walnut Dining Set with Display Cabinet (2 photos), Modern Walnut Dining Set Grey Chairs, Travertine Dining Set with Curved Chairs, Marble Top Dining Set Charcoal Chairs (2 photos). Published 2026-10-26 (Active + Online Store); Dining collection now 9, live at mallogallery.com/collections/dining.
- 2026-10-26: Dining sub-categories: smart collections oval-dining-tables (tag oval-dining, 5) and rectangular-dining-tables (tag rectangular-dining, 4), published. New template templates/collection.dining.json (title → "Shop the dining room" 2 tiles with product photos → "Get a full dining room quotation" WhatsApp → grid) added directly to the LIVE theme "[Draft] QA audit fixes" 161951252565 (new file only) and Dining collection templateSuffix = dining. Verified live on desktop/phone.
- 2026-10-27: Living Room & Sofas page reorganised by section (live theme 161951252565, templates/collection.living-room.json): title → "Shop the living room" tiles → product-list sections Sofas (6), Sectionals & Corner Sofas (6), Modular Sofas (6), Living Room Sets (5), Loveseats & Chaises (2), Accent Chairs (7), each with "View all" → Living room inspiration → quotation button. The single mixed grid (main-collection) was removed; all 32 products appear in exactly one section. Previous template saved as backup-collection.living-room.before-sections.json.
- 2026-10-27: New Catalog page /pages/catalog (template templates/page.catalog.json on live theme 161951252565): Living Room (Sofas, Sectionals & Corner Sofas, Modular, Sets, Loveseats & Chaises, Accent Chairs) → Bedroom (Upholstered, Statement, Platform, Wooden, Kids Beds) → Dining Room (Oval, Rectangular) → Outdoor → quotation WhatsApp button. Main menu "Catalog" now links to /pages/catalog (was /collections/all, which still exists). Mirage Panel Bed shows in both Upholstered and Kids (tagged both).
- 2026-10-27: Homepage "Shop by room" Living Room & Sofas tile: was a small landscape photo (first product, Grey L-Shaped Corner Sofa) letterboxed; now uses product tufted-pouf-modular-sofa (portrait, fills the tile) via mallo_rooms room_0 product setting on live theme. Collection living-room-sofas image set to the same photo. Office, Decor & Accessories, Custom Made tiles still show placeholders (no products).
