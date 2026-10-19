# Reina Reichouni: Wix → Shopify migration audit (Stage 1)

Source: https://www.reinareichouni.com (Wix Stores, crawled 2026-10-19)
Target: zi50i6-b0.myshopify.com, theme **Horizon** (live theme 189251191088; build will happen on a duplicate)
Status: **awaiting approval**. Nothing has been built or changed in Shopify yet.

## 1. Inventory of the site

| Type | Count | Items |
|---|---|---|
| Products | 22 | all physical, USD, table in §5 |
| Categories → collections | 3 | COLLECTIONS (`all-products`, 22), FORMATION SUMMER '26 (`formation-summer-26`, 22), Front Page (`front-page`, 4, hidden; feeds the homepage) |
| Pages | 7 | Home, About Us, Contact Us, Privacy Policy, Refund Policy, Terms and Conditions, Shipping Policy |
| Blog posts | 0 | no blog |
| Product images | 82 | 4672 × 7008 px originals |
| Other media | 1 hero video + 7 page images + 2 logo PNGs | |

## 2. Navigation

**Header** (desktop: links left, logo centre, utilities right; burgundy, Inter Light 10px caps, thin vertical dividers)
HOME · COLLECTIONS (submenu: FORMATION SUMMER '26) · ABOUT US · CONTACT US. Right side: search icon, "Cart (0)", member icon + "Log In". Logo: "RR" monogram PNG, centred.

**Footer**: "SIGN UP FOR UPDATES" email form + disclaimer · column 1: HOME, COLLECTION, CONTACT US, ABOUT US · column 2: TERMS AND CONDITIONS, PRIVACY POLICY, REFUND POLICY, SHIPPING POLICY · large "REINA REICHOUNI" wordmark image · "© 2026 REINAREICHOUNI | All Rights Reserved | Designed by The Virtual Stylist" (links to instagram.com/thevirtualstylistt).

## 3. Page-by-page sections

**Home** (in order)
1. Full-width hero **video** (autoplay, muted, loop), text right: "New Arrivals" (Didot italic 30px) + "Shop" link → COLLECTIONS
2. Product slider: all 22 products, 3 visible, arrows, image + small name (no price)
3. Single centred editorial image (KSM01333)
4. "SUMMER DROP" (Playfair Display Bold, 2.4px tracking) + "SEE MORE" → COLLECTIONS
5. Product slider: Front Page category (Paradox Skirt, Forma Denim Set, Cielo Dress, Fiore Dress)
6. Two editorial images side by side
7. Footer (above)

**Collection pages**: image banner behind the header, title (Kepler 32px, left), 4-column grid, 20 per page with numbered pagination, cards show name, price/strike-through sale price or "OUT OF STOCK", wishlist heart on each image. No filters, no sort menu.

**Product page**: vertical thumbnails left + large image, title, ~~$75.00~~ $52.50, "SALE" label, Color swatch (single colour), Size buttons S/M/L (sold-out sizes crossed out), Quantity stepper, "ADD TO CART" (outlined) + wishlist heart, "BUY NOW" (solid burgundy), description below. Prev/next product arrows.

**About Us**: 3 paragraphs of text (Inter ExtraLight 18px), no heading.
**Contact Us**: form only: FIRST NAME*, LAST NAME, EMAIL*, WRITE A MESSAGE, SUBMIT. No address/phone/WhatsApp shown.
**Policies**: 4 long text pages (Privacy 5.0k chars, Refund 2.6k, Terms 6.1k, Shipping 3.6k), each "Effective Date: [07/23/2026]".

## 4. Design system

| Token | Value |
|---|---|
| Brand / text colour | **#642226** (burgundy), used for all text, links, solid buttons |
| Background | #FFFFFF; product swatch tint rgba(100,34,38,.06) |
| Buttons | square corners; primary solid #642226 + white text; secondary 1px outline |
| Fonts in use | Kepler W03 Light SCD (titles/prices), Inter 200/300 (nav, body, footer), Didot Italic ("New Arrivals"), Playfair Display Bold ("SUMMER DROP"), Avenir LT 35 Light (slider names), Aboreto ("Sign up for updates") |
| Favicon | none (Wix default) |

## 5. Products

Sale prices come from one Wix **automatic discount named "SALE"** (30% on some items, 15% on others). Every product has one Color value and a Size option. Inventory is tracked per size. No SKUs, weights, alt text or custom SEO titles/descriptions are set on Wix.

| Product | Wix slug | Price | Sale | Colour | Stock per size | Imgs | Description | Also in |
|---|---|---|---|---|---|---|---|---|
| APEX TOP | `apex` | $70 | $49 (−30%) | Black | S 1, M 1, L 0 | 3 | Fabric: Suiting Fabric | FORMATION SUMMER '26 |
| AUREA PANCHO | `aurea` | $120 | — | Gold | ONE SIZE 0 | 8 | Fabric: Gold Lurex Knit | FORMATION SUMMER '26 |
| AXIS BLAZER | `axis` | $90 | — | Black | S 0, M 0, L 0 | 4 | Fabric: Crepe | FORMATION SUMMER '26 |
| CIELO DRESS | `cielod` | $90 | $76.5 (−15%) | Blue | ONE SIZE 0 | 4 | Fabric: Crystal Organza  · Removable Belt | FORMATION SUMMER '26, Front Page |
| CIELO TROUSERS | `cielo` | $90 | $76.5 (−15%) | Blue | ONE SIZE 1 | 3 | Fabric: Crystal Organza | FORMATION SUMMER '26 |
| COVE TOP | `cove` | $70 | $49 (−30%) | Black | S 1, M 1, L 0 | 3 | Fabric: Suiting Fabric | FORMATION SUMMER '26 |
| ELAN BLAZER | `elan` | $140 | — | Black | S 0, M 0, L 1 | 3 | Fabric: Suiting Fabric and Chiffon  · Detachable Scarf | FORMATION SUMMER '26 |
| FIORE DRESS | `fiore` | $115 | $80.5 (−30%) | Beige | S 2, M 2, L 2 | 4 | Fabric: Poplon | FORMATION SUMMER '26, Front Page |
| FORM SET | `form` | $135 | — | Black | S 2, M 1, L 2 | 2 | Fabric: Suiting Fabric | FORMATION SUMMER '26 |
| FORMA DENIM SET | `forma` | $100 | — | Blue | S 0, M 0, L 0 | 5 | Fabric: Denim | FORMATION SUMMER '26, Front Page |
| FRAME TROUSERS | `frame` | $90 | — | Black | S 0, M 2, L 2 | 3 | Fabric: Suiting Fabric | FORMATION SUMMER '26 |
| MUSE TOP | `muse` | $80 | $56 (−30%) | Blue | S 3, M 2, L 2 | 3 | Fabric: Suiting Fabric | FORMATION SUMMER '26 |
| OMBRA TROUSERS | `ombra` | $85 | — | Black | S 0, M 0, L 0 | 4 | Fabric: Taffeta and Lace | FORMATION SUMMER '26 |
| PARADOX SKIRT | `paradox` | $65 | $45.5 (−30%) | Black | S 0, M 1, L 1 | 3 | Fabric: Satin and Poplin | FORMATION SUMMER '26, Front Page |
| PETAL SKIRT | `petal` | $80 | $68 (−15%) | Beige | S 1, M 1, L 2 | 3 | Fabric: Crepe | FORMATION SUMMER '26 |
| POISE TOP | `poise` | $75 | $52.5 (−30%) | Beige | S 2, M 1, L 0 | 5 | Fabric: Crepe | FORMATION SUMMER '26 |
| SELENE JUMPSUIT | `selene` | $120 | $102 (−15%) | Beige | S 0, M 0, L 2 | 5 | Fabric: Linen | FORMATION SUMMER '26 |
| SWAY TOP | `sway` | $70 | $49 (−30%) | Blue | S 3, M 2, L 2 | 3 | Fabric: Suiting Fabric | FORMATION SUMMER '26 |
| VEIL JEANS | `veil` | $100 | — | Blue | S 0, M 0, L 0 | 3 | Fabric: Denim And Lace | FORMATION SUMMER '26 |
| VELA TROUSERS | `vela` | $80 | — | White | S 0, M 0, L 2 | 3 | Fabric: Satin | FORMATION SUMMER '26 |
| VENTO TOP | `vento` | $70 | $49 (−30%) | Blue | S 0, M 0, L 2 | 4 | Fabric: Satin | FORMATION SUMMER '26 |
| WHISPER TOP | `whisper` | $65 | $45.5 (−30%) | White | S 0, M 2, L 2 | 4 | Fabric: Poplin | FORMATION SUMMER '26 |

(All 22 are in COLLECTIONS and FORMATION SUMMER '26.)

## 6. Features found and how each maps to Shopify

| Feature | Shopify solution |
|---|---|
| Hero video with text | Horizon hero/video section, native |
| Product sliders | Horizon product carousel, native |
| Search | native |
| Cart + Buy Now | native cart + dynamic checkout button |
| Member "Log In" | Shopify customer accounts, native |
| Newsletter signup | native customer form (subscribers go to Customers) |
| Contact form with first/last name | native contact form with custom fields |
| Pagination 20 per page | native |
| Sold-out size crossed out | native |
| Wishlist hearts | **not native**, see decision C |
| Prev/next product arrows | small theme addition (Liquid) |
| Popups, announcement bar, reviews, Instagram feed, size guide, WhatsApp, currency/language switchers, filters, blog | **none on the original**, so none will be added |

## 7. Things that can't map 1:1: your decisions needed

**A. Fonts.** Kepler, Didot and Avenir are licensed fonts that Wix provides; Shopify can't use them without a licence.
- Option 1 (recommended): self-host free near-identical fonts: Kepler → *Cormorant Garamond Light*, Didot Italic → *Bodoni Moda Italic*, Avenir Light → *Nunito Sans Light*. Inter, Playfair Display and Aboreto are free and will match exactly.
- Option 2: the client buys web licences (Adobe Fonts / MyFonts) and I install the exact files.

**B. Sale pricing.** Wix applies a "SALE" automatic discount, so the site shows a strike-through price.
- Option 1 (recommended, looks identical): set Shopify *compare-at price* = original and *price* = sale price.
- Option 2: keep the original price and create a Shopify automatic discount. The strike-through then only appears in the cart, not on product or collection pages, so it doesn't look the same.

**C. Wishlist hearts.** Not native to Shopify.
- Option 1: free wishlist app (e.g. *Wishlist Plus* by Swym), hearts on cards and product page.
- Option 2: leave the wishlist out.

**D. Image size.** Originals are 4672 × 7008 px, above Shopify's 5000 px limit. They'll be resized to 3333 × 5000 with no visible loss. Order is kept exactly.

**E. Content typos, kept as-is unless you say otherwise:** "Fabric: Poplon" (Fiore Dress), "AUREA **PANCHO**", policies show "Effective Date: **[**07/23/2026**]**" with brackets, Shipping Policy mentions a "Returns & Exchanges Policy" while the page is titled "Refund Policy".

**F. Policy pages.** Shopify has built-in policy pages (`/policies/...`) that also link from checkout.
- Option 1 (recommended): put the text in Shopify's policy settings; footer links go there.
- Option 2: ordinary pages at `/pages/...`.

**G. Front Page category** becomes a hidden collection that feeds homepage slider 2 (not in menus, same as Wix).

## 8. URLs and redirects (Shopify can't use Wix's paths)

| Wix | Shopify |
|---|---|
| /product-page/{slug} | /products/{slug} (same slugs, e.g. `cielod`) |
| /category/all-products, /category/formation-summer-26, /category/front-page | /collections/{same} |
| /aboutus, /contactus | /pages/aboutus, /pages/contactus |
| /privacy-policy, /refund-policy, /terms-and-conditions, /shipping-policy | /policies/… (or /pages/…, see F) |
| /cart-page | /cart |

That's 34 redirects, delivered as a CSV. Page titles keep the Wix pattern "NAME | Reinareichouni".

## 9. Admin settings you'll need to provide or do

- **Currency**: store is in LBP; the original sells in USD. Change it in Settings → Store details / Markets.
- **Store name**: currently "My Store", should be "Reinareichouni".
- **Shipping rates**: Wix calculates these at checkout and they aren't visible from outside. Please send the zones and prices.
- **Payments**: how does the client take payment on Wix (cards, COD, Whish)? I'll mirror it.
- **Domain**: connect reinareichouni.com only at launch, after sign-off. Remove the store password then.

## 10. Proposed build stages (check-in after each)

1. Theme duplicate + design system (fonts, colours, header, footer, logo), with preview link
2. Products + collections (import CSV, images in order, stock), with counts check
3. Homepage + pages + policies + menus, with side-by-side comparison
4. Redirect CSV, SEO titles, QA (desktop/tablet/mobile, links, cart/checkout), final admin checklist
