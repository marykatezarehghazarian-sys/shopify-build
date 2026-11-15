---
name: dm-order
description: Enter an order a customer placed by WhatsApp / Instagram DM into a client's Shopify store as a draft order, send them Shopify's checkout link, and complete it as paid once the money is received. Use when the user pastes a customer's order details or says "put this order in", "start a checkout for", "complete the order".
---

# DM order agent

Customers who order by DM become real Shopify orders through **draft orders**: the store's prices, stock, shipping rates, taxes, customer record, confirmation emails and order numbers all work as for a website order.

## Hard rules
- **Never handle card details.** Don't type, store, or ask for card numbers. If the user pastes card details, don't use them: tell them to delete the message and send the customer the checkout link instead. The customer pays on Shopify's own checkout page.
- **Confirm the client** (`--client <slug>`) before anything. Read `clients/<slug>/CONTEXT.md`.
- **Customer data stays out of git.** Write order JSON only to the scratchpad, never under `clients/`, and never put names, addresses, phones or emails in CONTEXT.md or commits.
- **Confirm before writing.** Show the summary (items, address, total) and get a yes before `orders:draft`. Only run `orders:paid` when the user says the money was actually received: it records the order as PAID.

## Steps
1. **Read the DM** and pull out:
   - name, email and/or phone
   - full shipping address with country (ISO code, e.g. US, LB) and state code where the country uses one
   - items and quantities
   - how they'll pay (card link / cash on delivery / transfer)
   - any discount the user agreed
   Ask only for what's missing (an email is needed to email the link; a phone is enough to DM it).
2. **Match products:** `npm run shop -- orders:variants <words> --client <slug>`. If more than one variant fits (e.g. 1 / 2 / 3 pack), ask. Warn if `available` is false.
3. **Price check (creates nothing):** write the order to `<scratchpad>/order.json` and run
   `npm run shop -- orders:quote --json @<scratchpad>/order.json --client <slug>`.
   It returns the totals and the store's shipping rates for that address. Put the chosen rate's `handle` in `shippingRateHandle`. Only use a custom `shipping: {title, amount}` if the user asks.
4. **Summary → confirm.** Show items × qty, address, shipping, discount and total. Wait for a yes.
5. **Create:** `npm run shop -- orders:draft --json @<scratchpad>/order.json --client <slug>`. This returns the draft id (`#D12`) and the **checkout link** (`invoiceUrl`).
6. **Get paid:**
   - **Card / online:** give the user the `invoiceUrl` to send to the customer in the DM. Or email it with `orders:invoice <draftId> [--message "..."]`, which needs an email. When the customer pays, Shopify turns the draft into an order automatically.
   - **Cash on delivery:** skip the draft. Run `npm run shop -- orders:cod --json @<scratchpad>/order.json --client <slug>` with `"shipping": {"amount": N}` (0 = delivery included). That creates a real order, payment PENDING, gateway "Cash on Delivery (COD)", with no email sent and stock reduced. Draft-order payment terms aren't available on Basic plans.
   - **Transfer / cash already received:** after the user confirms the money arrived, run `orders:paid <draftId>`, which creates the order marked as paid.
7. Report the order number (`order.name`, e.g. #1005), or the draft and its link if it's still waiting for payment.

Check open DM drafts with `orders:drafts` (default query `tag:dm-order`) and a single one with `orders:get <draftId>`.

## Feels Good Club: place orders through the website checkout
The owner wants DM orders to show as **Online Store** orders, so don't use the API order commands for this store:
- Every order is cash on delivery. The product is $16 and Lebanon delivery is $4, so the customer pays **$20 per item**.
- The user sends `name / phone / item / area`. With no last name, use "."; the phone goes in with the +961 prefix.
- Find variant ids with `orders:variants`. Write `<scratchpad>/co/oN.json`:
  `{"items":[{"variantId":"<numeric id>","quantity":1}],"firstName":"","lastName":".","phone":"+961…","address":"<area>","city":"<area>","countryCode":"LB","expectTotal":"<16×qty + 4>"}`
- Dry run with `node clients/feels-good-club/scripts/checkout.mjs <file>`, then the same command with `--submit` once the total matches. `expectTotal` blocks a wrong total.
- Confirm in the admin: the latest order should have source `web`, gateway COD, and status PENDING. Report the order number.

## order.json shape
```json
{
  "customer": { "firstName": "Ana", "lastName": "Lee", "email": "ana@example.com", "phone": "+12085550100" },
  "address": { "address1": "1 Main St", "address2": "Apt 2", "city": "Boise", "provinceCode": "ID", "zip": "83702", "countryCode": "US" },
  "items": [ { "variantId": "gid://shopify/ProductVariant/123", "quantity": 2 } ],
  "shippingRateHandle": "<from orders:quote>",
  "discount": { "percent": 10, "reason": "Instagram promo" },
  "shipping": { "title": "Standard", "amount": 4 },
  "note": "Ordered via Instagram DM",
  "tags": ["instagram"]
}
```
Drafts are tagged `dm-order`, with source `dm-order`.
