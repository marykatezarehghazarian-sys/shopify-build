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
