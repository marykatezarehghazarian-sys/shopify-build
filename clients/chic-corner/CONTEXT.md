# Chic Corner

- Store: 586ceh-0v.myshopify.com (new client, added 2026-11-23).
- API: Dev Dashboard app (client ID/secret in .env). Client-credentials grant refused ("shop_not_permitted"), so use the authorization-code OAuth flow: redirect https://example.com/ must be in the app version's allowed redirect URLs; user approves the authorize link and sends back the ?code=… URL; exchange it at /admin/oauth/access_token and save SHOPIFY_ADMIN_TOKEN in .env.
- Requested scopes: products, orders, draft orders, customers, inventory, themes, files, content, navigation, shipping, discounts, publications, locations, markets (read), legal policies.
- Status: waiting for the ?code=… URL.
- Brand details, conventions and decisions: (none yet)
