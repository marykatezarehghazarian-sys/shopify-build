// PKG. Packaging Factory: create the catalogue skeleton on the store (idempotent: skips what exists).
//   node clients/pkg-packaging/scripts/setup-store.mjs
// Creates: product metafield definitions (custom.material / sizes / printing / minimum_order),
// 8 collections, sample products as DRAFT (quote-only, price 0, not purchasable), pages, menus.
process.env.SHOPIFY_CLIENT = 'pkg-packaging';
const { gql, mutate } = await import('../../../lib/index.js');

const CATS = [
  ['food-takeaway', 'Food & Takeaway', 'Burger, pizza and meal boxes, printed with your logo.'],
  ['bakery-pastry', 'Bakery & Pastry', 'Cake and pastry boxes that keep sweets safe and on-brand.'],
  ['coffee-drinks', 'Coffee & Drinks', 'Branded cups, sleeves and carriers for every pour.'],
  ['paper-bags', 'Paper Bags', 'Kraft, white and luxury shopping bags in any size.'],
  ['labels-stickers', 'Labels & Stickers', 'Seals, stickers and labels to finish every pack.'],
  ['retail-clothing', 'Retail & Clothing', 'Mailer boxes, hang tags and tissue for fashion brands.'],
  ['corporate-print', 'Corporate Print', 'Business cards, letterheads and folders.'],
  ['school-print', 'School Print', 'Notebooks, certificates and school stationery.'],
];
const P = [
  ['burger-box', 'food-takeaway', 'Burger Box', 'Clamshell box that keeps burgers warm and intact on the way.', 'Kraft or white board', 'Small, medium, large', 1],
  ['pizza-box', 'food-takeaway', 'Pizza Box', 'Corrugated pizza box, strong and stackable, printed in one to full colour.', 'Corrugated E-flute', '26, 30, 33, 40 cm'],
  ['kraft-meal-box', 'food-takeaway', 'Kraft Meal Box', 'Leak-resistant meal box for salads, rice and mains.', 'Kraft board with PE lining', '500, 750, 1000 ml'],
  ['fries-scoop', 'food-takeaway', 'Fries Scoop', 'Open scoop for fries and snacks, printed edge to edge.', 'Food-grade board', 'Small, medium, large'],
  ['sandwich-wedge', 'food-takeaway', 'Sandwich Wedge', 'Window wedge that shows off the sandwich inside.', 'Kraft board, PLA window', 'Single, double'],
  ['cake-box-with-window', 'bakery-pastry', 'Cake Box with Window', 'Sturdy cake box with a clear window and easy fold.', 'White or kraft board', '20, 25, 30 cm', 1],
  ['pastry-box', 'bakery-pastry', 'Pastry Box', 'Classic pastry box for sweets, maamoul and petits fours.', 'Coated board', '250 g, 500 g, 1 kg'],
  ['cupcake-box', 'bakery-pastry', 'Cupcake Box', 'Box with inserts for 1, 2, 4, 6 or 12 cupcakes.', 'White board with insert', '1–12 pieces'],
  ['bread-bag', 'bakery-pastry', 'Bread Bag', 'Paper bag for bread and baguettes, with or without window.', 'Kraft or white paper', 'Several lengths'],
  ['single-wall-paper-cup', 'coffee-drinks', 'Single-Wall Paper Cup', 'Branded cup for hot drinks, with matching lids available.', 'Food-grade cup board', '4, 8, 12, 16 oz', 1],
  ['double-wall-cup', 'coffee-drinks', 'Double-Wall Cup', 'Insulated cup, no sleeve needed, premium feel.', 'Double-wall board', '8, 12, 16 oz'],
  ['cup-sleeve', 'coffee-drinks', 'Cup Sleeve', 'Printed sleeve that protects hands and carries your brand.', 'Kraft or white board', 'Fits 8–16 oz'],
  ['cup-carrier', 'coffee-drinks', 'Cup Carrier', 'Two or four cup carrier for takeaway and delivery.', 'Moulded fibre or board', '2 or 4 cups'],
  ['kraft-handle-bag', 'paper-bags', 'Kraft Handle Bag', 'Everyday kraft bag with twisted paper handles.', 'Kraft paper', 'Small to extra large', 1],
  ['luxury-rope-handle-bag', 'paper-bags', 'Luxury Rope-Handle Bag', 'Laminated bag with rope handles for boutiques and gifts.', 'Art board, matte or gloss', 'Custom sizes'],
  ['flat-handle-bag', 'paper-bags', 'Flat-Handle Bag', 'Practical bag for groceries, pharmacies and takeaway.', 'Kraft or white paper', 'Several sizes'],
  ['custom-stickers', 'labels-stickers', 'Custom Stickers', 'Die-cut stickers in any shape for boxes and bags.', 'Paper or vinyl', 'Any shape and size', 1],
  ['seal-labels', 'labels-stickers', 'Seal Labels', 'Tamper-evident seals for delivery bags and boxes.', 'Paper or security vinyl', 'Round or rectangle'],
  ['mailer-box', 'retail-clothing', 'Mailer Box', 'Printed mailer box for online orders and gift sets.', 'Corrugated E-flute', 'Custom sizes', 1],
  ['hang-tags', 'retail-clothing', 'Hang Tags', 'Clothing tags with string, foil or embossing options.', 'Heavy card', 'Custom shapes'],
  ['printed-tissue-paper', 'retail-clothing', 'Printed Tissue Paper', 'Thin wrapping tissue printed with your logo pattern.', 'Tissue paper', 'Standard sheets'],
  ['business-cards', 'corporate-print', 'Business Cards', 'Premium cards with matte, gloss, foil or spot UV.', '350–600 gsm card', '85 × 55 mm', 1],
  ['letterhead-envelopes', 'corporate-print', 'Letterhead & Envelopes', 'Matching letterheads, envelopes and compliment slips.', 'Offset paper', 'A4, DL, C4'],
  ['presentation-folders', 'corporate-print', 'Presentation Folders', 'Pocket folders for proposals and company profiles.', 'Coated board', 'A4'],
  ['custom-notebooks', 'school-print', 'Custom Notebooks', 'Notebooks with your school or company cover.', 'Offset paper, card cover', 'A4, A5', 1],
  ['certificates', 'school-print', 'Certificates', 'Certificates and diplomas with foil and embossing.', 'Textured card', 'A4, A3'],
];

// 1. Metafield definitions
const defs = (await gql(`{metafieldDefinitions(first:50,ownerType:PRODUCT,namespace:"custom"){nodes{key}}}`)).metafieldDefinitions.nodes.map((n) => n.key);
for (const [key, name] of [['material', 'Material'], ['sizes', 'Sizes'], ['printing', 'Printing'], ['minimum_order', 'Minimum order']]) {
  if (defs.includes(key)) continue;
  await mutate(`mutation($d:MetafieldDefinitionInput!){metafieldDefinitionCreate(definition:$d){createdDefinition{id} userErrors{field message}}}`,
    { d: { name, namespace: 'custom', key, type: 'single_line_text_field', ownerType: 'PRODUCT', pin: true, access: { storefront: 'PUBLIC_READ' } } }, 'metafieldDefinitionCreate');
  console.log('metafield', key);
}

// 2. Online Store publication
const pubs = (await gql(`{publications(first:20){nodes{id name}}}`)).publications.nodes;
const online = pubs.find((p) => p.name === 'Online Store');
if (!online) throw new Error('Online Store publication not found');

// 3. Collections
const colIds = {};
for (const [handle, title, desc] of CATS) {
  let c = (await gql(`{c:collectionByIdentifier(identifier:{handle:"${handle}"}){id}}`)).c;
  if (!c) {
    c = (await mutate(`mutation($i:CollectionInput!){collectionCreate(input:$i){collection{id} userErrors{field message}}}`,
      { i: { title, handle, descriptionHtml: `<p>${desc}</p>`, sortOrder: 'MANUAL' } }, 'collectionCreate')).collection;
    await mutate(`mutation($id:ID!,$p:[PublicationInput!]!){publishablePublish(id:$id,input:$p){userErrors{field message}}}`, { id: c.id, p: [{ publicationId: online.id }] }, 'publishablePublish');
    console.log('collection', handle);
  }
  colIds[handle] = c.id;
}

// 4. Products (DRAFT; quote-only)
const loc = (await gql(`{locations(first:1){nodes{id}}}`)).locations.nodes[0].id;
for (const [handle, cat, title, desc, material, sizes, popular] of P) {
  const exists = (await gql(`{p:productByIdentifier(identifier:{handle:"${handle}"}){id}}`)).p;
  if (exists) continue;
  const r = await mutate(`mutation($i:ProductSetInput!){productSet(synchronous:true,input:$i){product{id} userErrors{field message}}}`, { i: {
    title, handle, status: 'DRAFT', vendor: 'PKG. Packaging Factory', productType: CATS.find((c) => c[0] === cat)[1],
    descriptionHtml: `<p>${desc}</p>`, tags: ['sample', ...(popular ? ['popular'] : [])],
    productOptions: [{ name: 'Title', values: [{ name: 'Default Title' }] }],
    variants: [{ optionValues: [{ optionName: 'Title', name: 'Default Title' }], price: '0.00', inventoryPolicy: 'DENY', inventoryItem: { tracked: true }, inventoryQuantities: [{ locationId: loc, name: 'available', quantity: 0 }] }],
    metafields: [
      { namespace: 'custom', key: 'material', type: 'single_line_text_field', value: material },
      { namespace: 'custom', key: 'sizes', type: 'single_line_text_field', value: sizes },
    ],
    collections: [colIds[cat]],
  } }, 'productSet');
  await mutate(`mutation($id:ID!,$p:[PublicationInput!]!){publishablePublish(id:$id,input:$p){userErrors{field message}}}`, { id: r.product.id, p: [{ publicationId: online.id }] }, 'publishablePublish');
  console.log('product', handle);
}

// 5. Pages
const PAGES = [
  ['about', 'About us', 'about', '<p>PKG. Packaging Factory makes custom printed packaging and business print for restaurants, bakeries, coffee shops, schools, clothing stores and corporate offices.</p><p>[Raffi: 2–3 sentences about the factory: when it started, the team, what you are proud of.]</p>'],
  ['showroom', 'Showroom', 'showroom', ''],
  ['contact', 'Contact', 'contact', ''],
];
for (const [handle, title, suffix, body] of PAGES) {
  const ex = (await gql(`{pages(first:1,query:"handle:${handle}"){nodes{id}}}`)).pages.nodes[0];
  if (ex) continue;
  await mutate(`mutation($p:PageCreateInput!){pageCreate(page:$p){page{id} userErrors{field message}}}`, { p: { title, handle, body, templateSuffix: suffix, isPublished: true } }, 'pageCreate');
  console.log('page', handle);
}

// 6. Menus
const menus = (await gql(`{menus(first:20){nodes{id handle title}}}`)).menus.nodes;
const L = (title, type, url, resourceId) => ({ title, type, ...(url ? { url } : {}), ...(resourceId ? { resourceId } : {}), items: [] });
const pageIds = Object.fromEntries((await gql(`{pages(first:20){nodes{id handle}}}`)).pages.nodes.map((p) => [p.handle, p.id]));
const want = {
  'main-menu': ['Main menu', [L('Home', 'FRONTPAGE', '/'), L('Catalogue', 'CATALOG', '/collections/all'), L('About us', 'PAGE', null, pageIds.about), L('Showroom', 'PAGE', null, pageIds.showroom), L('Contact', 'PAGE', null, pageIds.contact)]],
  catalogue: ['Catalogue', CATS.map(([h, t]) => L(t, 'COLLECTION', null, colIds[h]))],
  company: ['Company', [L('About us', 'PAGE', null, pageIds.about), L('Showroom', 'PAGE', null, pageIds.showroom), L('Contact', 'PAGE', null, pageIds.contact)]],
};
for (const [handle, [title, items]] of Object.entries(want)) {
  const m = menus.find((x) => x.handle === handle);
  if (m) await mutate(`mutation($id:ID!,$t:String!,$i:[MenuItemUpdateInput!]!){menuUpdate(id:$id,title:$t,items:$i){menu{id} userErrors{field message}}}`, { id: m.id, t: title, i: items }, 'menuUpdate');
  else await mutate(`mutation($t:String!,$h:String!,$i:[MenuItemCreateInput!]!){menuCreate(title:$t,handle:$h,items:$i){menu{id} userErrors{field message}}}`, { t: title, h: handle, i: items }, 'menuCreate');
  console.log('menu', handle);
}
console.log('done');
