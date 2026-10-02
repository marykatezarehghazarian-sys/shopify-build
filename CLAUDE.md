# CLAUDE.md

Multi-client Shopify workspace. See README.md for commands.

## Client isolation (most important)
- Every client lives in `clients/<slug>/`. Before any store or theme work, confirm which client the user means and run `npm run client -- show` (or pass `--client <slug>`). Never act on a store when the client is ambiguous.
- Credentials: `clients/<slug>/.env` or `<SLUG>_SHOPIFY_*` env vars only. Never copy tokens between clients, commit them, print them unmasked, or ask the user to paste them into chat (use `npm run client -- set <slug> <key>` or environment secrets).
- Read `clients/<slug>/CONTEXT.md` before working on a client, and record brand details, conventions and decisions there as they come up.
- Theme edits for a client go in `clients/<slug>/theme/`. `starter-theme/` is the shared base for new clients only.

## Working rules
- Store changes: prefer `npm run shop -- <cmd>`; otherwise `gql`, or add a helper in `lib/admin/<resource>.js` + command in `bin/shop.js`. Use `mutate()` so `userErrors` throw.
- GraphQL Admin API only. Check input shapes against the client's API version.
- Products are created as DRAFT. Confirm before publishing, deleting, bulk-changing live data, or publishing a live theme (`theme push` defaults to unpublished).
- Run `npm run theme -- check` after theme edits, `npm test` after changing `lib/` or `bin/`.
