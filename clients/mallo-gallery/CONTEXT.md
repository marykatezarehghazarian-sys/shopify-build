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
