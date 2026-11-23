# Chic Corner

- Store: 586ceh-0v.myshopify.com (new client, added 2026-11-23).
- API: Dev Dashboard app (client ID/secret in .env). Client-credentials grant refused ("shop_not_permitted"), so use the authorization-code OAuth flow: redirect https://example.com/ must be in the app version's allowed redirect URLs; user approves the authorize link and sends back the ?code=… URL; exchange it at /admin/oauth/access_token and save SHOPIFY_ADMIN_TOKEN in .env.
- Requested scopes: products, orders, draft orders, customers, inventory, themes, files, content, navigation, shipping, discounts, publications, locations, markets (read), legal policies.
- Status: 2026-11-23 connected via authorization code (hmac + state verified); offline SHOPIFY_ADMIN_TOKEN saved in .env. Scopes granted: products, orders, draft orders, customers, inventory, themes, files, content, navigation, shipping, discounts, publications, locations, markets (read), legal policies (write).
- Brand details, conventions and decisions: (none yet)
- 2026-11-23: my first Chic Corner authorize links lacked the `state` parameter (every link that returned a code for other clients had one) and Shopify sent the owner to the app URL instead (hmac/host/shop only, no code). New link with state sent. Same client ID/secret as saved.
- 2026-11-23: IP restriction removed by the owner; API works. Store facts: name "Chic Corner", domain chiccornerlb.com (Lebanon), currency USD, timezone Asia/Beirut, Basic plan, 147 products, 184 orders all-time. Live theme "gatello-EDITS" (135489454135).
