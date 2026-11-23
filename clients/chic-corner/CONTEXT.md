# Chic Corner

- Store: 586ceh-0v.myshopify.com (new client, added 2026-11-23).
- API: Dev Dashboard app (client ID/secret in .env). Client-credentials grant refused ("shop_not_permitted"), so use the authorization-code OAuth flow: redirect https://example.com/ must be in the app version's allowed redirect URLs; user approves the authorize link and sends back the ?code=… URL; exchange it at /admin/oauth/access_token and save SHOPIFY_ADMIN_TOKEN in .env.
- Requested scopes: products, orders, draft orders, customers, inventory, themes, files, content, navigation, shipping, discounts, publications, locations, markets (read), legal policies.
- Status: 2026-11-23 connected via authorization code (hmac + state verified); offline SHOPIFY_ADMIN_TOKEN saved in .env. Scopes granted: products, orders, draft orders, customers, inventory, themes, files, content, navigation, shipping, discounts, publications, locations, markets (read), legal policies (write).
- BLOCKED: the app has an IP allowlist ("This app's IP restrictions don't allow requests from 34.123.142.44"). Cloud session IPs change, so the restriction must be turned off in the Dev Dashboard app settings.
- Brand details, conventions and decisions: (none yet)
- 2026-11-23: my first Chic Corner authorize links lacked the `state` parameter (every link that returned a code for other clients had one) and Shopify sent the owner to the app URL instead (hmac/host/shop only, no code). New link with state sent. Same client ID/secret as saved.
