#!/usr/bin/env node
// Shopify Admin CLI. Usage: npm run shop -- <command> [args] [--flag value]
// JSON flags (e.g. --json '{"title":"x"}' or --json @file.json) pass straight through to the API helpers.
import { readFileSync } from 'node:fs';
import { gql, shop, products, inventory, collections, discounts, shipping } from '../lib/index.js';

function parseArgs(argv) {
  const pos = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      flags[key] = next === undefined || next.startsWith('--') ? true : (i++, next);
    } else pos.push(a);
  }
  return { pos, flags };
}

const readJson = (v) => (v === undefined ? {} : JSON.parse(String(v).startsWith('@') ? readFileSync(v.slice(1), 'utf8') : v));
const list = (v) => (v ? String(v).split(',').map((s) => s.trim()).filter(Boolean) : undefined);

const commands = {
  'shop:info': { help: 'Store details and granted access scopes', run: () => shop.shopInfo() },
  'locations': { help: 'List locations', run: () => shop.listLocations() },

  'products:list': { help: '[--query "status:active"]', run: ({ flags }) => products.listProducts({ query: flags.query }) },
  'products:get': { help: '<id|handle>', run: ({ pos }) => products.getProduct(pos[0]) },
  'products:create': {
    help: '--title T [--price 19.99] [--sku S] [--vendor V] [--type T] [--tags a,b] [--status ACTIVE] [--json {...}]',
    run: ({ flags }) => products.createProduct({
      ...readJson(flags.json),
      ...(flags.title && { title: flags.title }),
      ...(flags.vendor && { vendor: flags.vendor }),
      ...(flags.type && { productType: flags.type }),
      ...(flags.tags && { tags: list(flags.tags) }),
      ...(flags.status && { status: flags.status }),
      ...(flags.description && { descriptionHtml: flags.description }),
      price: flags.price, sku: flags.sku,
    }),
  },
  'products:update': { help: '<id> --json {...ProductUpdateInput}', run: ({ pos, flags }) => products.updateProduct(pos[0], readJson(flags.json)) },
  'products:delete': { help: '<id>', run: ({ pos }) => products.deleteProduct(pos[0]) },
  'variants:update': { help: '<productId> --json [{id, price, ...}]', run: ({ pos, flags }) => products.updateVariants(pos[0], readJson(flags.json)) },

  'inventory:get': { help: '<inventoryItemId>', run: ({ pos }) => inventory.getInventoryLevels(pos[0]) },
  'inventory:set': {
    help: '<inventoryItemId> <locationId> <quantity>  (absolute)',
    run: ({ pos }) => inventory.setAvailable([{ inventoryItemId: pos[0], locationId: pos[1], quantity: pos[2] }]),
  },
  'inventory:adjust': {
    help: '<inventoryItemId> <locationId> <delta>  (e.g. -3)',
    run: ({ pos }) => inventory.adjustAvailable([{ inventoryItemId: pos[0], locationId: pos[1], delta: pos[2] }]),
  },

  'collections:list': { help: '', run: () => collections.listCollections() },
  'collections:create': {
    help: '--title T [--products id1,id2] [--tag summer (smart: tag equals)] [--json {...CollectionInput}] [--publish]',
    run: async ({ flags }) => {
      const input = { ...readJson(flags.json), ...(flags.title && { title: flags.title }) };
      if (flags.tag) input.ruleSet = { appliedDisjunctively: false, rules: [{ column: 'TAG', relation: 'EQUALS', condition: flags.tag }] };
      const c = await collections.createCollection({ ...input, productIds: list(flags.products) });
      if (flags.publish) await collections.publish(c.id);
      return c;
    },
  },
  'collections:add': { help: '<collectionId> <productId,...>', run: ({ pos }) => collections.addProducts(pos[0], list(pos[1])) },
  'publish': { help: '<gid> [publicationId]  (defaults to Online Store)', run: ({ pos }) => collections.publish(pos[0], pos[1]) },

  'discounts:list': { help: '', run: () => discounts.listDiscounts() },
  'discounts:code': {
    help: '--title T --code CODE (--percent 10 | --amount 5) [--ends ISO] [--limit N] [--once] [--collections ids]',
    run: ({ flags }) => discounts.createCodeDiscount({
      title: flags.title || flags.code, code: flags.code, percent: flags.percent, amount: flags.amount,
      endsAt: flags.ends, usageLimit: flags.limit && Number(flags.limit), appliesOncePerCustomer: !!flags.once,
      collectionIds: list(flags.collections), productIds: list(flags.products),
    }),
  },
  'discounts:auto': {
    help: '--title T (--percent 10 | --amount 5) [--min 50] [--ends ISO] [--collections ids]',
    run: ({ flags }) => discounts.createAutomaticDiscount({
      title: flags.title, percent: flags.percent, amount: flags.amount, minSubtotal: flags.min,
      endsAt: flags.ends, collectionIds: list(flags.collections), productIds: list(flags.products),
    }),
  },

  'shipping:list': { help: 'Delivery profiles, zones and rates', run: () => shipping.listDeliveryProfiles() },
  'shipping:zone': {
    help: '--name Z --countries US,CA --amount 9.99 [--rate Standard] [--currency USD]',
    run: ({ flags }) => shipping.addFlatRateZone({
      name: flags.name, countries: list(flags.countries), amount: flags.amount, rateName: flags.rate, currencyCode: flags.currency,
    }),
  },
  'shipping:update': { help: '<profileId> --json {...DeliveryProfileInput}', run: ({ pos, flags }) => shipping.updateDeliveryProfile(pos[0], readJson(flags.json)) },

  'gql': {
    help: '<query string | @file.graphql> [--vars {...}]  (escape hatch for anything else)',
    run: ({ pos, flags }) => gql(pos[0].startsWith('@') ? readFileSync(pos[0].slice(1), 'utf8') : pos[0], readJson(flags.vars)),
  },
};

function usage() {
  console.log('Usage: npm run shop -- <command> [args]\n');
  for (const [name, c] of Object.entries(commands)) console.log(`  ${name.padEnd(20)} ${c.help}`);
}

const { pos, flags } = parseArgs(process.argv.slice(2));
const name = pos.shift();
if (!name || name === 'help' || !commands[name]) {
  usage();
  process.exit(name && name !== 'help' ? 1 : 0);
}
try {
  const result = await commands[name].run({ pos, flags });
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error(`Error: ${err.message}`);
  if (flags.verbose && err.details) console.error(JSON.stringify(err.details, null, 2));
  process.exit(1);
}
