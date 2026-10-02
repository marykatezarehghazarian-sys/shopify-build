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

## Store snapshot (2026-10-02)
- Auth: Dev Dashboard app, client credentials grant (tokens auto-refresh every 24h). Full write scopes.
- Plan: Basic. Name "My Store", currency LBP (both need changing in admin; no API for either).
- Location: "Shop location" (gid://shopify/Location/89964511317)
- Live theme: Horizon (gid://shopify/OnlineStoreTheme/161145880661)

## Open questions for Joe
- Delivery fees (keep $4 flat? free over a threshold?)
- Showroom exact address in Zahle, opening hours, Google Maps link
- Logo file and product photos
- Reference site URL for "Wood and gas"
- Reference sites to study (blocked by network allowlist so far): mkatelier.club, 964dials.com, linksbeirut.com, nostalgiafridge.com, silvaura.org, velouriafashion.club

## Decisions & notes
- 2026-10-02: Created 7 tag-based collections (published) and draft pages: About Us (/pages/about), Visit Our Showroom (/pages/showroom), Custom Orders (/pages/custom-orders), all unpublished with [PLACEHOLDERS] to fill. Existing Contact page left as-is.
- 2026-10-02: Theme work happens on "Mallo Gallery - Sand Preview" (gid://shopify/OnlineStoreTheme/161202470997), a themeDuplicate of live Horizon. Changes so far: sand palette (#F6F1EA bg, #2B2620 text, #5E5449, #E3D7C6), Jost headings, 2px button radius, floating WhatsApp button (Theme settings > WhatsApp).
  Preview: https://zcjd1f-ge.myshopify.com?preview_theme_id=161202470997
- "Mallo Gallery - Draft" (161202438229) is a broken upload; delete it in Online Store > Themes.
- Main menu not yet updated (it's shared with the live theme); do it when the new theme goes live.
