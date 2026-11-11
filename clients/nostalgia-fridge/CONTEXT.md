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
