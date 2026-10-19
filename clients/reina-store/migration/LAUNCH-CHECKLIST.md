# Reina Reichouni: launch checklist

## Done (by Claude)
- [x] Theme "Reina Reichouni - Build" (189295591728): reference-site look (Tove / Khaite / Toteme / The Concept), brand burgundy #642226, fonts, RR monogram, footer wordmark
- [x] Homepage: full-screen video hero, Collections rail, Summer Drop / Formation Summer '26 editorial, Summer Drop grid, editorial photo, newsletter footer
- [x] Quick buy: bag icon on every product card → choose size → straight to checkout (tested)
- [x] 22 products, 82 photos, sizes, stock per size, sale prices (struck through), active
- [x] Collections: COLLECTIONS (22), FORMATION SUMMER '26 (22), Front Page (4), same order as Wix
- [x] Pages: About us, Contact us (First name*, Last name, Email*, Message), Privacy policy
- [x] Policies: Refund, Terms of service, Shipping (Shopify policy pages, shown at checkout)
- [x] Menus: header (Home, Collections › Formation Summer '26, About us, Contact us), footer (2 columns)
- [x] 32 redirects from the old Wix addresses (`url-redirects.csv`), all tested
- [x] Product import file `products-import.csv` (backup / re-import)

## You need to do in Shopify admin
1. Settings → General: Store currency **USD** (prices are already the right numbers), store name **Reinareichouni**
2. Choose a **plan** (Settings → Plan). Checkout won't take orders on the trial.
3. Settings → Payments: **Cash on Delivery** (Manual payment methods → Cash on Delivery) and a **card provider** (areeba / NetCommerce app; Shopify Payments isn't available in Lebanon)
4. Settings → Shipping and delivery: add your rates (Lebanon, and any countries you ship to)
5. Settings → Notifications / Store details: set the sender email and the contact email (contact form messages go there)
6. Online Store → Themes: **Publish "Reina Reichouni - Build"** (or tell Claude to do it)
7. Settings → Domains: connect **reinareichouni.com** (point DNS from Wix to Shopify; Wix shows the DNS settings under Domains)
8. Online Store → Preferences: **remove the password** when you're ready to open
9. Optional: Settings → Policies → turn off automatic management of the Privacy policy if you want the Wix privacy text at /policies/privacy-policy too (it's already on /pages/privacy-policy, linked from the footer)
