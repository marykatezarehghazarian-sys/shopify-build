# shopify-build

Workspace for building a Shopify store: an Online Store 2.0 **theme** (`theme/`) plus an **Admin API toolkit** (`lib/`, `bin/shop.js`) for products, inventory, collections, discounts, shipping, and anything else via raw GraphQL.

## Setup

```bash
npm install
cp .env.example .env   # fill in your values
npm run check:env      # prints store info + granted scopes
```

### Tokens

| Variable | Where it comes from |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
| `SHOPIFY_ADMIN_TOKEN` | Admin → Settings → Apps → Develop apps → custom app → Admin API access token (`shpat_…`) |
| `SHOPIFY_API_VERSION` | Admin API version, default `2026-07` |
| `SHOPIFY_CLI_THEME_TOKEN` | [Theme Access](https://apps.shopify.com/theme-access) app password (`shptka_…`), used by `shopify theme` commands |

Recommended Admin API scopes for the custom app:

```
read_products, write_products
read_inventory, write_inventory, read_locations
read_discounts, write_discounts
read_shipping, write_shipping
read_publications, write_publications
read_themes, write_themes
read_content, write_content
read_online_store_navigation, write_online_store_navigation
read_orders, read_customers
```

## Theme

```bash
npm run theme:dev     # local preview with hot reload against your store
npm run theme:check   # lint
npm run theme:push    # upload as an unpublished theme
npm run theme:pull    # pull editor changes back into theme/
```

Layout: `layout/` · `sections/` (incl. header/footer groups) · `snippets/` · `templates/*.json` · `config/` · `locales/` · `assets/`.

## Admin CLI

```bash
npm run shop -- help
npm run shop -- products:create --title "Linen Shirt" --price 48 --sku LS-01 --tags summer --status ACTIVE
npm run shop -- products:get linen-shirt                 # id or handle; shows variant inventoryItem ids
npm run shop -- locations
npm run shop -- inventory:set <inventoryItemId> <locationId> 25
npm run shop -- inventory:adjust <inventoryItemId> <locationId> -3
npm run shop -- collections:create --title Summer --tag summer --publish   # smart collection
npm run shop -- collections:create --title Picks --products 123,456         # manual collection
npm run shop -- discounts:code --code SUMMER10 --percent 10 --once
npm run shop -- discounts:auto --title "$10 off $75" --amount 10 --min 75
npm run shop -- shipping:list
npm run shop -- shipping:zone --name Canada --countries CA --amount 12.50 --currency CAD
npm run shop -- gql '{ shop { name } }'
npm run shop -- gql @queries/recent-orders.graphql --vars '{"first":5}'
```

Ids can be numeric or full `gid://shopify/...` strings. Add `--verbose` to see raw API errors.

### As a library

```js
import { products, inventory, gql } from './lib/index.js';
const p = await products.createProduct({ title: 'Mug', price: 18 });
```

The client (`lib/shopify.js`) retries throttled and 5xx responses, throws on `userErrors`, and `paginate()` walks connections.

## Tests

`npm test` runs the client unit tests (fetch is mocked, so no store is needed).
