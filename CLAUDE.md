# CLAUDE.md

Shopify theme + Admin API workspace. See README.md for commands.

- Credentials come from `.env` / env vars (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_ADMIN_TOKEN`, `SHOPIFY_CLI_THEME_TOKEN`). Never commit them or echo tokens.
- Store changes: prefer `npm run shop -- <cmd>`; for anything not covered, use `gql` or add a function in `lib/admin/<resource>.js` + a command in `bin/shop.js`. Use `mutate()` for mutations so `userErrors` throw.
- Use the GraphQL Admin API only (REST is legacy). Check input shapes against the API version in `SHOPIFY_API_VERSION`.
- Products are created as DRAFT by default; confirm with the user before publishing, deleting, or bulk-changing live data.
- Theme: OS 2.0 JSON templates. Run `npm run theme:check` after theme edits; push as unpublished (`theme:push`) and never publish the live theme without asking.
- Run `npm test` after changing `lib/`.
