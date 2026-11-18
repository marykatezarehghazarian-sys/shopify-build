// Replaces each catalogue product's image with renders/out/<handle>.jpg (3D mockup).
// node clients/pkg-packaging/scripts/upload-mockups.mjs [handle ...]   (no args = all catalogue products)
// Adds the new image first, then removes the product's other media. Skips products whose only image is already a mockup.
process.env.SHOPIFY_CLIENT = 'pkg-packaging';
import { readFileSync, existsSync } from 'node:fs';
const { gql, mutate } = await import('../../../lib/index.js');
const { stageUpload } = await import('../../../lib/admin/files.js');
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const rows = readFileSync(new URL('../catalogue-draft.csv', import.meta.url), 'utf8').trim().split('\n').slice(1)
  .map((l) => l.match(/^([^,]+),("[^"]*"|[^,]*),("[^"]*"|[^,]*)/)[3].replace(/^"|"$/g, ''));
const only = process.argv.slice(2);
let done = 0, skipped = 0;
for (const name of rows) {
  const h = slug(name); if (only.length && !only.includes(h)) continue;
  const file = new URL(`../renders/out/${h}.jpg`, import.meta.url).pathname;
  const p = (await gql(`query($h:String!){productByHandle(handle:$h){id media(first:20){nodes{id alt}}}}`, { h })).productByHandle;
  if (!p || !existsSync(file)) { console.log('missing', h); continue; }
  const old = p.media.nodes;
  if (old.length === 1 && old[0].alt?.includes('mockup')) { skipped++; continue; }
  const src = await stageUpload(file, `pkg-${h}-mockup.jpg`);
  await mutate(`mutation($p:ID!,$m:[CreateMediaInput!]!){productCreateMedia(productId:$p,media:$m){media{id} mediaUserErrors{field message}}}`,
    { p: p.id, m: [{ originalSource: src, mediaContentType: 'IMAGE', alt: `${name} mockup, custom printed with your logo by PKG. Packaging Factory, Lebanon` }] }, 'productCreateMedia');
  if (old.length) await mutate(`mutation($p:ID!,$m:[ID!]!){productDeleteMedia(productId:$p,mediaIds:$m){deletedMediaIds mediaUserErrors{field message}}}`, { p: p.id, m: old.map((m) => m.id) }, 'productDeleteMedia');
  done++; console.log('replaced', h, '(removed', old.length, 'old)');
}
console.log('replaced', done, 'skipped', skipped);
