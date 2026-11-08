# Tech Global

Store: svc4nx-e5.myshopify.com

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

## Setup (2026-11-03)
- Store: Tech Global, svc4nx-e5.myshopify.com, Beirut, USD, Basic plan, ships to LB only. Credentials (Dev Dashboard app, full write scopes) in `clients/tech-global/.env` (gitignored).
- Catalog: portable monitors. Active: TriView Pro Max, TriView Pro, TriView Go, DuoView Pro Max 15.6″, DuoView Pro, DuoView Play, DuoView Lite 14″ ($289–$799). Draft: SoloView 15.6″. All stock 0 at setup.
- Collections: Triple / Dual / Single Monitors, Accessories (empty).
- Live theme: "[Draft] Tech Global – no empty products" (189502586973), Horizon-based; other drafts exist (build, workspace & compare, hero video). No orders yet.
- Owner confirmed this is the "new site" (2026-11-03). Homepage sections: tg_hero, tg_ticker, tg_models ("Choose your workspace" cards), tg_tiles ("Find your setup"), tg_trust, tg_compare, tg_faq. No JS errors.
- Inventory is not tracked on any product (so "stock 0" is fine; everything can be ordered).
- DuoView Pro shows "From $399" because the 15.6″ Amber option is $399 while the other 15.6″ Full HD colours are $449. To confirm with owner.
- Header video (2026-11-03): owner's clip (white desk, blue lights; owner confirmed they have the rights) compressed without sound to `media/tg-hero-desk-white.mp4` and uploaded as file `tg-hero-desk-white.mp4`. Set as `bg_video` on the tg_hero section of draft theme "[Draft] Tech Global – hero video" (189502816349); it previously used `tg-hero-desk.mp4` (dark trading-desk clip). That draft is identical to the live theme except tg-hero.liquid + index.json (checked by checksum). Published 2026-11-03 with owner OK: "[Draft] Tech Global – hero video" (189502816349) is now the live theme. Previous live: "[Draft] Tech Global – no empty products" (189502586973), kept as rollback.
- Photos from owner (2026-11-03, `media/`): live homepage "Find your setup" tiles now use `tg-triple-laptop-desk.jpg` (Triple) and `tg-dual-laptop-studio.jpg` (Dual); "Which portable monitor is right for you?" banner (tg_compare) uses `tg-desk-setup-dark.jpg`. Tiles show photos at natural height (no crop). Backup: `backup-live-index.before-photos.json`.
- Payments (2026-11-03): only manual "Bank Deposit" is set up, so checkout never asks for a card. Shopify Payments, Stripe and PayPal don't take Lebanese merchants; owner needs a third-party card gateway (Settings → Payments, or via their bank), admin-only. Owner's test orders #1001 and #1002 ($549 each, Bank Deposit) cancelled at owner's request (voided, customer not notified).
- 2026-11-08: Owner policy: online payment only, no cash on delivery; customers pay instantly. Theme, pages and policies don't mention cash or COD.
  - Payments: the last order #1003 (2026-11-06, pending) shows gateways "Money Order" and "bogus". That's Shopify's test (Bogus) gateway, so card payments are in test mode or fake. Manual methods are Money Order and Bank Deposit. All of this is admin-only. The owner must set up a real card provider, turn off test mode and the Bogus gateway, and turn off Money Order and Bank Deposit (and COD if present).
  - BLOCKER found: every product can't be bought. Add to cart returns "already sold out", and checkout goes to "Out of stock". Variants are untracked but inventoryPolicy DENY with 0 available (sellableOnlineQuantity 0). The proposed fix is to set inventoryPolicy to CONTINUE on all variants (matching the earlier "everything can be ordered" decision), waiting for the owner's OK. My first attempt on one product was blocked pending approval.
