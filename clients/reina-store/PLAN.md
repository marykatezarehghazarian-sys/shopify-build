# Reina Reichouni: build plan (agency brief, 2026-10-19)

## Stack decision
The project is a **Shopify store** (zi50i6-b0.myshopify.com) on the **Horizon** theme, extended with custom
`rr-*` sections, snippets and assets in `theme/`. It works, so per the brief ("keep the existing stack unless it
is fundamentally broken") the build stays on Shopify. A separate Next.js storefront would duplicate what Shopify
already does (products, inventory, cart, checkout, orders, emails, taxes, payments, sitemap) and add hosting,
security and payment-compliance work for no gain.

What that means for the brief:

| Brief item | On Shopify |
|---|---|
| Multi-step custom checkout, order storage, confirmation page and email | **Shopify Checkout** (hosted, PCI-compliant; multi-step layout is a Checkout setting). Orders are stored in Shopify Admin; confirmation page and email are Shopify's. Not editable from a theme on this plan. |
| Cart state persisting across refresh | Shopify cart (cookie + server), shared by the bag drawer and `/cart` |
| Pricing math, discounts, shipping rules | Calculated by Shopify; shipping rates and discounts live in Admin |
| Unit tests for cart math | Not applicable (no custom pricing code). Quick-buy and add-to-bag flows are tested end to end with Playwright instead. |
| `.env.example` / secrets | Theme has no secrets. Admin API credentials live in `clients/reina-store/.env` (gitignored). |
| Sitemap, robots.txt, product JSON-LD, clean URLs | Shopify generates `/sitemap.xml`, `/robots.txt`; Horizon outputs product JSON-LD |
| GA4 / Meta Pixel events (add_to_cart, begin_checkout, purchase) | Shopify **Customer events**: install the Google & YouTube and Facebook & Instagram apps; they fire these events from the storefront and checkout automatically |
| Instant search | Horizon predictive search (live product results) |
| Lenis, GSAP, Framer Motion | Lenis included as a theme asset; motion written in small vanilla JS (no GSAP/Framer needed, keeps the theme light) |

## What exists
- Design: black background + 3D starfield, ivory type (Cormorant Garamond / Inter), RR monogram, editorial layout
  inspired by Tove / Khaite / Toteme / The Concept
- Home: video hero, Collections rail, editorial pair, Summer Drop grid, editorial photo, newsletter footer
- Collection pages with filters/sort/pagination; product pages; bag drawer + cart page; quick buy (bag icon → size → checkout)
- 22 products / 82 photos / 3 collections; About, Contact (working form), Privacy; Refund, Terms, Shipping policies; 32 redirects

## Missing (this build)
1. Design tokens: spacing, type scale, motion durations/easings as CSS variables
2. Motion layer: Lenis smooth scroll, page transitions, scroll reveals (staggered text, image unmask, parallax),
   magnetic buttons, custom cursor (desktop), first-visit preloader (< 2 s), hero headline reveal, reduced-motion support
3. Home: brand-story section, lookbook strip (from real campaign photos)
4. Product page: Details / Shipping / Returns accordions (from the real policies), sticky "Buy" bar on mobile
5. FAQ page (answers taken from the real policies) + Shipping & Returns page; footer links
6. Custom 404
7. SEO: meta titles and descriptions for products, collections and pages
8. QA: full journey on phone / tablet / desktop, console errors, theme check, Lighthouse

## Not built, on purpose
- **Testimonials**: there are no real customer reviews yet; invented ones would be fake. Add a reviews app
  (e.g. Judge.me) when reviews come in.
- **Free-shipping progress bar**: shipping rates/threshold not decided yet ("skip" for now). Easy to add once set.
- **Quantity stepper on product page**: removed earlier at the owner's request ("make the checkout very easy");
  quantity can still be changed in the bag.
- **Size/colour filters**: need Shopify's Search & Discovery app filter setup in Admin (one click per filter).

## Build order
tokens → motion layer → home sections → product page → FAQ / Shipping & Returns / 404 → SEO → QA → commit
