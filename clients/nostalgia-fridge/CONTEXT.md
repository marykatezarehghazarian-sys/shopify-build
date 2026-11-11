# Nostalgia Fridge

Store: hp01yp-xp.myshopify.com

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

## 2026-11-11: setup
- Store: hp01yp-xp.myshopify.com (Nostalgia Fridge). New client.
- The first app keys the owner sent (Client ID 151196…) fail the token exchange with `shop_not_permitted`: the store isn't in that app's organization, the same issue Elle.ay had. Not saved. The fix that worked for Elle.ay: create the app from this store's own admin (Settings → Apps → Develop apps / Dev Dashboard), install it, and use that app's Client ID and secret.
- Live site: nostalgiafridge.com, theme "Nostalgia v4" (Horizon). Products: One Door ($239, 5 colours) and Two Door (4 colours). The site already says cash on delivery, free delivery in Beirut, $10 elsewhere in Lebanon, "VAT added at checkout", a WhatsApp button, and "No cards, no deposit".
- 2026-11-11: Owner (Joe) requests, waiting for admin access (the client-credentials keys are refused with "cannot be performed on this shop"; a shpat_ token from a custom app made in the store admin is needed):
  1. Banner: "Lock in our exclusive Early Bird pricing before it's gone! Cash on delivery (COD). Free delivery in Beirut." Any format.
  2. VAT is 11%, not 10%. This is admin-only: Settings → Taxes and duties → Lebanon. Then check the "VAT added at checkout" wording.
  3. Mention Whish payment with the Whish logo (front page or near checkout), next to a WhatsApp link for direct contact. Note the site currently says "No cards, no deposit" and "Pay cash when it arrives", so the payment wording must be adjusted.
- 2026-11-11 ACCESS: the client-credentials grant is refused on this store ("cannot be performed on this shop"). Solved with the authorization-code flow: app 4fee113a… has allowed redirect https://example.com/. The owner opened /admin/oauth/authorize?client_id=…&scope=…&redirect_uri=https://example.com/ and sent back the ?code=…; I exchanged it for an offline token, saved as SHOPIFY_ADMIN_TOKEN in .env (gitignored) with broad write scopes. If it's lost, repeat the same flow.
- 2026-11-11 DONE on the live theme 190638850353 "Nostalgia v4":
  - Announcement bar (sections/header-group.json): "Lock in our exclusive Early Bird pricing before it's gone! Cash on delivery (COD). Free delivery in Beirut."
  - Whish: official Whish Money logo (assets/whish-logo.svg, from whish.money) in a new snippet, snippets/ns-pay-whish.liquid: "Pay with [logo] or cash on delivery", logo on a cream pill so it reads on dark sections. It's rendered on the homepage "Ordering is the easy part" section (above the WhatsApp button) and on product pages under the trust list.
  - Wording: homepage card "Cash on delivery / No cards, no deposit" became "Cash or Whish / Pay cash when it arrives, or pay with Whish. No deposit." The product delivery accordion text was changed the same way.
  - Backups: backup-*.before-whish.
- OPEN:
  - No WhatsApp number anywhere. snippets/nostalgia-whatsapp.liquid ns_wa_number is '', and the nostalgia-trust and nostalgia-pdp `whatsapp` settings are empty, so "Message us on WhatsApp" links to #buy. Waiting for Joe's number.
  - VAT 11% must be changed in admin (Settings → Taxes and duties → Lebanon); it can't be done through the API.
