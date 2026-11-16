# SBEA Cosmetics

Store: pk1610-hu.myshopify.com (SBEA, https://sbeacosmetics.com)

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

## Notes
- 2026-11-16: New store pk1610-hu.myshopify.com, live at https://sbeacosmetics.com (cosmetics). App keys in .env (client id 6a6802…). The client-credentials exchange is refused ('cannot be performed on this shop'), so it needs the authorization-code OAuth flow with redirect https://example.com/. Owner name and what the user wants done: not known yet.
- 2026-11-16: LINKED via authorization-code OAuth; SHOPIFY_ADMIN_TOKEN in .env (32 scopes). Shop 'SBEA', USD, Asia/Beirut, Basic plan, 31 products, 5 collections, live theme 'without 10%', location Sidon (LB).
- 2026-11-16: Owner's request list (WhatsApp, via the user):
  - return policy: damaged items only
  - change the hair bundle picture in the category card (photo coming)
  - contacts: 76/555123 and ola.khalifeh@live.com
  - Instagram link
  - product sizes
- Done:
  - Product metafield `custom.size` (pinned). Sizes per her list on 22 products: scrubs 150 ml, Cheese Cake Scrub 400 ml, dry fruit scrubs 150 ml, butters 150 ml, lotions 200 ml, body oils 100 ml, hair oil and hair serum 100 ml, Golden Kiss shimmery body oil 50 ml. Hair mists and bundles have no size: not on her list.
  - Live theme 188957688112 "without 10%" (Horizon): templates/product.json got a text block `text_size_sbea` under the title, `{{ closest.product.metafields.custom.size.value }}`, hidden when empty. Backup: backup-product.json.before-size. Full live theme dump in theme-live/.
  - Contact page body: Phone/WhatsApp +961 76 555 123 (wa.me link) and ola.khalifeh@live.com.
  - Checked on mobile: Cheese Cake Scrub shows "400 ml"; Contact page shows both.
- Open:
  - The phone number may be a typo: the owner's WhatsApp is +961 76 556 123 and the jar label reads 76 556 12x, but she typed 76/555123. Asked to confirm.
  - Return policy: the app has only read_legal_policies. Owner pastes it in Settings → Policies, or we add write_legal_policies.
  - Instagram URL: the label shows "SBEACOSMETICS.LB". Asked to confirm.
  - Hair bundle photo: waiting.
- 2026-11-16: confirmed phone +961 76 556 123 (not 555) and Instagram @sbeacosmetics.lb. Contact page now has phone (wa.me/96176556123), email and Instagram. Footer social-links block instagram_url = https://www.instagram.com/sbeacosmetics.lb/ (backup-footer-group.before-instagram.json). Checked live.
- 2026-11-16: Homepage 'Find your SBEA ritual' (section category_showcase, sbea-category-showcase.liquid):
  - The Hair care card showed a Bubble Gum lotion on cotton candy (hard-coded photo). It now uses the owner's photo (hair serum + hair oil in a hair bun; file sbea-hair-care-card.jpg, source hair-care-card.jpg).
  - Added a per-card 'Card photo' image_picker that overrides the hard-coded image, cropped to the top with an inline <style> (object-position 50% 8%). Notes: image_tag drops style=; {% stylesheet %} changes are cached.
  - Backups: backup-sbea-category-showcase.before-hair-image.liquid, backup-index.before-hair-image.json. Checked on mobile and desktop.
  - Note: the Hair care card links to /collections/all, not /collections/hair-care (left as is).
