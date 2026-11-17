// Loads catalogue-draft.csv into the store (quote-only products, like the samples) and moves the old samples to DRAFT.
// node clients/pkg-packaging/scripts/load-catalogue.mjs           -> dry run
// node clients/pkg-packaging/scripts/load-catalogue.mjs --apply
process.env.SHOPIFY_CLIENT = 'pkg-packaging';
import { readFileSync } from 'node:fs';
const { gql, mutate } = await import('../../../lib/index.js');
const APPLY = process.argv.includes('--apply');
const POPULAR = ['Burger Box', 'Pizza Box', 'Cake Box', 'Paper Cup', 'Kraft Bag with Twisted Handle', 'Logo Stickers', 'Mailer Box', 'Business Cards'];

function parseCsv(t) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"' && t[i + 1] === '"') { f += '"'; i++; } else if (c === '"') q = false; else f += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && t[i + 1] === '\n') i++; row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  const [h, ...r] = rows.filter((x) => x.length > 1);
  return r.map((x) => Object.fromEntries(h.map((k, i) => [k, x[i]])));
}
const slug = (s) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const items = parseCsv(readFileSync(new URL('../catalogue-draft.csv', import.meta.url), 'utf8'));
const catTitles = Object.fromEntries(items.map((i) => [i.category_handle, i.category.replace(' (new)', '')]));
console.log(items.length, 'products,', Object.keys(catTitles).length, 'categories');

const online = (await gql(`{publications(first:20){nodes{id name}}}`)).publications.nodes.find((p) => p.name === 'Online Store');
const loc = (await gql(`{locations(first:1){nodes{id}}}`)).locations.nodes[0].id;
const cols = Object.fromEntries((await gql(`{collections(first:100){nodes{id handle title}}}`)).collections.nodes.map((c) => [c.handle, c]));
const pub = (id) => mutate(`mutation($id:ID!,$p:[PublicationInput!]!){publishablePublish(id:$id,input:$p){userErrors{field message}}}`, { id, p: [{ publicationId: online.id }] }, 'publishablePublish');

for (const [h, title] of Object.entries(catTitles)) {
  if (!cols[h]) {
    console.log('create collection', h, title);
    if (APPLY) {
      const c = (await mutate(`mutation($i:CollectionInput!){collectionCreate(input:$i){collection{id handle title} userErrors{field message}}}`,
        { i: { title, handle: h, descriptionHtml: '<p>Invitations, envelopes, programs, favour boxes and gift bags, printed for weddings, engagements and events.</p>', sortOrder: 'MANUAL' } }, 'collectionCreate')).collection;
      await pub(c.id); cols[h] = c;
    }
  } else if (cols[h].title !== title) {
    console.log('rename collection', h, cols[h].title, '->', title);
    if (APPLY) await mutate(`mutation($i:CollectionInput!){collectionUpdate(input:$i){collection{id} userErrors{field message}}}`, { i: { id: cols[h].id, title } }, 'collectionUpdate');
  }
}

const keep = new Set();
for (const it of items) {
  const handle = slug(it.name);
  const ex = (await gql(`query($h:String!){productByHandle(handle:$h){id tags}}`, { h: handle })).productByHandle;
  const input = {
    title: it.name, handle, vendor: 'PKG. Packaging Factory', productType: catTitles[it.category_handle], status: 'ACTIVE',
    descriptionHtml: `<p>${it.description}</p><p>Made to order with your logo, colours and sizes. Ask us on WhatsApp for a quote.</p>`,
    tags: ['catalogue', ...(POPULAR.includes(it.name) ? ['popular'] : [])],
    collections: cols[it.category_handle] ? [cols[it.category_handle].id] : [],
    productOptions: [{ name: 'Title', values: [{ name: 'Default Title' }] }],
    variants: [{ optionValues: [{ optionName: 'Title', name: 'Default Title' }], price: '0.00', inventoryPolicy: 'DENY', inventoryItem: { tracked: true }, inventoryQuantities: [{ locationId: loc, name: 'available', quantity: 0 }] }],
    metafields: [
      { namespace: 'custom', key: 'material', type: 'single_line_text_field', value: it.material },
      { namespace: 'custom', key: 'sizes', type: 'single_line_text_field', value: it.sizes },
      { namespace: 'custom', key: 'minimum_order', type: 'single_line_text_field', value: it.minimum_order || 'On request' },
    ],
    seo: { title: `${it.name} | Custom Printed in Lebanon | PKG.`, description: `${it.description} Made to order in Lebanon. Ask PKG. Packaging Factory for a quote on WhatsApp.`.slice(0, 160) },
  };
  if (ex) input.id = ex.id;
  console.log(ex ? 'update' : 'create', handle);
  if (APPLY) {
    const r = await mutate(`mutation($i:ProductSetInput!){productSet(synchronous:true,input:$i){product{id} userErrors{field message}}}`, { i: input }, 'productSet');
    await pub(r.product.id); keep.add(r.product.id);
  }
}

const samples = (await gql(`{products(first:100,query:"tag:sample"){nodes{id handle status}}}`)).products.nodes;
const toDraft = samples.filter((s) => !keep.has(s.id) && s.status !== 'DRAFT');
console.log('samples to draft:', toDraft.length, toDraft.map((s) => s.handle).join(', '));
if (APPLY) for (const s of toDraft) await mutate(`mutation($i:ProductInput!){productUpdate(input:$i){product{id} userErrors{field message}}}`, { i: { id: s.id, status: 'DRAFT' } }, 'productUpdate');
console.log(APPLY ? 'applied' : 'dry run (add --apply)');
