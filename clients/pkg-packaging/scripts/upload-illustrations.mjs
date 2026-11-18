// Adds illustrations/all/<handle>.png as the image of each catalogue product (skips products that already have media).
process.env.SHOPIFY_CLIENT = 'pkg-packaging';
import { readFileSync, existsSync } from 'node:fs';
const { gql, mutate } = await import('../../../lib/index.js');
const { stageUpload } = await import('../../../lib/admin/files.js');
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rows = readFileSync(new URL('../catalogue-draft.csv', import.meta.url), 'utf8').trim().split('\n').slice(1)
  .map((l) => l.match(/^([^,]+),("[^"]*"|[^,]*),("[^"]*"|[^,]*)/)[3].replace(/^"|"$/g, ''));
let added = 0, skipped = 0;
for (const name of rows) {
  const h = slug(name), file = new URL(`../illustrations/all/${h}.png`, import.meta.url).pathname;
  const p = (await gql(`query($h:String!){productByHandle(handle:$h){id mediaCount{count}}}`, { h })).productByHandle;
  if (!p || !existsSync(file)) { console.log('missing', h); continue; }
  if (p.mediaCount.count > 0) { skipped++; continue; }
  const src = await stageUpload(file, `pkg-${h}.png`);
  await mutate(`mutation($p:ID!,$m:[CreateMediaInput!]!){productCreateMedia(productId:$p,media:$m){media{id} mediaUserErrors{field message}}}`,
    { p: p.id, m: [{ originalSource: src, mediaContentType: 'IMAGE', alt: `${name}, custom printed with your logo by PKG. Packaging Factory, Lebanon` }] }, 'productCreateMedia');
  added++;
}
console.log('added', added, 'skipped (already had images)', skipped);
