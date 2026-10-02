# shopify-build

Multi-client Shopify workspace. Each client gets an isolated folder with its own credentials, theme and notes. Shared tooling covers theme development and the Admin API (products, inventory, collections, discounts, shipping, and raw GraphQL for everything else).

```
clients/<slug>/
  client.json     name, store domain, API version          (committed)
  .env            that client's tokens only                 (gitignored, chmod 600)
  theme/          that client's theme                       (committed)
  CONTEXT.md      brand, catalog conventions, decisions     (committed)
starter-theme/    OS 2.0 base copied into each new client
lib/              Admin API client + resource helpers
bin/              client / shop / theme CLIs
```

## Clients

```bash
npm install
npm run client -- new acme-co --name "Acme Co" --domain acme-co.myshopify.com
npm run client -- set acme-co admin          # paste token on stdin, then Ctrl-D
npm run client -- set acme-co theme          # Theme Access password (shptka_…)
npm run client -- list                       # * marks the active client
npm run client -- use acme-co                # switch active client
npm run client -- show                       # settings, tokens masked
```

Every command runs against the **active client**; override per command with `--client <slug>`. Each command prints `[slug] store` first, so it's always clear which store is being touched.

### Where credentials live

Credentials are resolved **only** for the selected client, in this order:

1. Env vars prefixed with the client slug: `ACME_CO_SHOPIFY_ADMIN_TOKEN`, `ACME_CO_SHOPIFY_CLI_THEME_TOKEN` (slug uppercased, `-` → `_`).
2. `clients/<slug>/.env`.

Unprefixed `SHOPIFY_*` vars are ignored on purpose so one client's token can never be used against another client's store.

> In Claude Code cloud sessions the container is temporary, so `.env` files disappear when it's reclaimed. For tokens that should persist, add the prefixed env vars in the cloud environment's settings.

Recommended custom-app Admin API scopes:
`read/write_products, read/write_inventory, read_locations, read/write_discounts, read/write_shipping, read/write_publications, read/write_themes, read/write_content, read/write_online_store_navigation, read_orders, read_customers`.

## Theme

```bash
npm run theme -- dev        # preview the active client's theme against their store
npm run theme -- check      # lint
npm run theme -- push       # upload as unpublished (unless you pass --theme/--live)
npm run theme -- pull       # pull editor changes back
npm run theme -- list --client other-client
```

## Admin CLI

```bash
npm run shop -- help
npm run shop -- shop:info                     # store info + granted scopes
npm run shop -- products:create --title "Linen Shirt" --price 48 --sku LS-01 --tags summer --status ACTIVE
npm run shop -- products:get linen-shirt
npm run shop -- locations
npm run shop -- inventory:set <inventoryItemId> <locationId> 25
npm run shop -- inventory:adjust <inventoryItemId> <locationId> -3
npm run shop -- collections:create --title Summer --tag summer --publish
npm run shop -- discounts:code --code SUMMER10 --percent 10 --once
npm run shop -- discounts:auto --title "$10 off $75" --amount 10 --min 75
npm run shop -- shipping:list
npm run shop -- shipping:zone --name Canada --countries CA --amount 12.50 --currency CAD
npm run shop -- gql @queries/recent-orders.graphql --vars '{"first":5}' --client acme-co
```

Ids can be numeric or `gid://shopify/...`. Add `--verbose` for raw API errors.

## Tests

`npm test`: client isolation and API client tests (no store needed).
