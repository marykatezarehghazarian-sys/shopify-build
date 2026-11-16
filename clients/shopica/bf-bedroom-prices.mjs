// Black Friday: 30% off every variant in the Bedroom collection via compare-at prices (same method as Homeware & Decor).
// node clients/shopica/bf-bedroom-prices.mjs            -> dry run
// node clients/shopica/bf-bedroom-prices.mjs --apply    -> backup + apply
// node clients/shopica/bf-bedroom-prices.mjs --restore <backup.json>
process.env.SHOPIFY_CLIENT = 'shopica';
import { writeFileSync, readFileSync } from 'node:fs';
const { gql, mutate } = await import('../../lib/index.js');
const M = `mutation($p:ID!,$v:[ProductVariantsBulkInput!]!){productVariantsBulkUpdate(productId:$p,variants:$v){productVariants{id price compareAtPrice} userErrors{field message}}}`;
const args = process.argv.slice(2);
if (args[0] === '--restore') {
  const b = JSON.parse(readFileSync(args[1], 'utf8'));
  for (const p of b) await mutate(M, { p: p.id, v: p.variants.map((v) => ({ id: v.id, price: v.price, compareAtPrice: v.compareAtPrice })) }, 'productVariantsBulkUpdate');
  console.log('restored', b.length, 'products'); process.exit(0);
}
let after = null, products = [];
do {
  const d = await gql(`query($a:String){collectionByHandle(handle:"bedroom"){products(first:100,after:$a){nodes{id title variants(first:50){nodes{id title price compareAtPrice}}} pageInfo{hasNextPage endCursor}}}}`, { a: after });
  const c = d.collectionByHandle.products; products.push(...c.nodes); after = c.pageInfo.hasNextPage ? c.pageInfo.endCursor : null;
} while (after);
const r2 = (x) => (Math.round(x * 100) / 100).toFixed(2);
let n = 0, skip = 0;
const plan = products.map((p) => ({ id: p.id, title: p.title, v: p.variants.nodes.filter((v) => {
  if (v.compareAtPrice && +v.compareAtPrice > +v.price) { skip++; return false; } return true; }).map((v) => { n++; return { id: v.id, price: r2(+v.price * 0.7), compareAtPrice: v.price }; }) }));
console.log('products', products.length, 'variants to change', n, 'already on sale (skipped)', skip);
console.log('sample', JSON.stringify(plan.slice(0, 3).map((p) => [p.title, p.v[0]])));
if (!args.includes('--apply')) process.exit(0);
const file = `clients/shopica/backup-bedroom-prices.${new Date().toISOString().slice(0, 16).replace(':', '-')}.json`;
writeFileSync(file, JSON.stringify(products.map((p) => ({ id: p.id, title: p.title, variants: p.variants.nodes })), null, 1));
console.log('backup', file);
let done = 0;
for (const p of plan) { if (!p.v.length) continue; await mutate(M, { p: p.id, v: p.v }, 'productVariantsBulkUpdate'); done += p.v.length; }
console.log('updated variants', done);
