// Formation Summer '26 sale change (owner, 2026-11-10):
//   pieces at 30% off -> 50% off; pieces with no sale -> 20% off; any other discount left alone and listed.
// Sale = compareAtPrice (original) + price (sale price). New prices rounded to whole dollars.
// Usage: node clients/reina-store/scripts/formation-sale.mjs            (dry run: prints the plan)
//        node clients/reina-store/scripts/formation-sale.mjs --apply    (writes prices, saves a backup first)
process.env.SHOPIFY_CLIENT = 'reina-store';
import fs from 'fs';
const { gql, mutate } = await import('../../../lib/index.js');
const APPLY = process.argv.includes('--apply');
const HANDLE = 'formation-summer-26';
const r2 = (n) => Math.round(n);
const money = (n) => n.toFixed(2);

const col = (await gql(`{c:collectionByIdentifier(identifier:{handle:"${HANDLE}"}){title products(first:100){nodes{id title handle status variants(first:100){nodes{id title price compareAtPrice}}}}}}`)).c;
if (!col) throw new Error('collection not found: ' + HANDLE);
const plan = [];
const skipped = [];
for (const p of col.products.nodes) {
  const updates = [];
  for (const v of p.variants.nodes) {
    const price = Number(v.price);
    const cap = v.compareAtPrice ? Number(v.compareAtPrice) : 0;
    if (cap > price) {
      const off = Math.round((1 - price / cap) * 100);
      if (off >= 29 && off <= 31) updates.push({ v, from: [price, cap], to: [r2(cap * 0.5), cap], rule: '30%→50%' });
      else skipped.push(`${p.title} / ${v.title}: ${off}% off ($${price} from $${cap})`);
    } else {
      updates.push({ v, from: [price, cap || null], to: [r2(price * 0.8), price], rule: 'none→20%' });
    }
  }
  if (updates.length) plan.push({ p, updates });
}
for (const { p, updates } of plan) {
  const u = updates[0];
  const same = updates.every((x) => x.rule === u.rule && x.from[0] === u.from[0] && x.from[1] === u.from[1]);
  console.log(`${p.title} [${p.status}] ${u.rule}: $${u.from[0]}${u.from[1] ? ' (was $' + u.from[1] + ')' : ''} -> $${u.to[0]} (was $${u.to[1]})${same ? '' : '  (variants differ, see backup)'} · ${updates.length} variant(s)`);
}
if (skipped.length) {
  console.log('\nLeft alone (other discounts):');
  skipped.forEach((s) => console.log('  ' + s));
}
console.log(`\n${plan.length} products, ${plan.reduce((n, x) => n + x.updates.length, 0)} variants to change.`);
if (!APPLY) {
  console.log('Dry run. Re-run with --apply to write.');
  process.exit(0);
}

const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
const backup = `clients/reina-store/backup-formation-prices.${stamp}.json`;
fs.writeFileSync(backup, JSON.stringify(col.products.nodes.map((p) => ({ id: p.id, title: p.title, variants: p.variants.nodes })), null, 2));
console.log('Backup:', backup);
for (const { p, updates } of plan) {
  await mutate(
    `mutation($p:ID!,$v:[ProductVariantsBulkInput!]!){productVariantsBulkUpdate(productId:$p,variants:$v){productVariants{id} userErrors{field message}}}`,
    { p: p.id, v: updates.map((x) => ({ id: x.v.id, price: money(x.to[0]), compareAtPrice: money(x.to[1]) })) },
    'productVariantsBulkUpdate',
  );
  console.log('updated', p.title);
}
