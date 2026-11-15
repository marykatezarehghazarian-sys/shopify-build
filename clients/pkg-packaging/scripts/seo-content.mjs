// SEO text for collections and pages (idempotent). Run: node clients/pkg-packaging/scripts/seo-content.mjs [--apply]
process.env.SHOPIFY_CLIENT = 'pkg-packaging';
const { gql, mutate } = await import('../../../lib/index.js');
const APPLY = process.argv.includes('--apply');

const p = (...xs) => xs.map((x) => `<p>${x}</p>`).join('');
const h = (x) => `<h2>${x}</h2>`;
const COLLECTIONS = {
  'food-takeaway': {
    intro: 'Burger, pizza, shawarma and meal boxes printed with your logo, made in Lebanon.',
    seo: ['Custom Food Packaging & Takeaway Boxes in Lebanon', 'Custom printed burger boxes, pizza boxes, meal boxes, wrapping paper and delivery bags for restaurants in Lebanon. Ask for a quote on WhatsApp.'],
    body: h('Custom food packaging for restaurants in Lebanon') + p(
      'PKG. Packaging Factory prints takeaway and delivery packaging for restaurants, snack shops and cloud kitchens across Lebanon. Burger boxes, pizza boxes, shawarma and sandwich wraps, meal boxes, fries holders, food trays, greaseproof paper and paper delivery bags are all made to order with your logo and brand colours.',
      'Every order is printed in our own factory, from offset and digital printing to die-cutting, so the shape, size and finish match what your kitchen needs. Tell us what you serve and how many orders you send out, and we will suggest the right material and size.',
      'We deliver all over Lebanon and to the Middle East. Send us your logo and quantities on WhatsApp to get a quote.'),
  },
  'bakery-pastry': {
    intro: 'Cake, pastry, chocolate and Bûche de Noël boxes printed for your bakery.',
    seo: ['Custom Cake Boxes & Bakery Packaging in Lebanon', 'Printed cake boxes, pastry boxes, chocolate boxes, trays and labels for bakeries and pâtisseries in Lebanon. Made to order with your logo.'],
    body: h('Bakery and pastry packaging, printed in Lebanon') + p(
      'Cake boxes, pastry and croissant boxes, cupcake boxes, chocolate and sweets boxes, Bûche de Noël boxes, trays and labels for bakeries, pâtisseries and chocolatiers in Lebanon. We print them with your logo and colours so every box that leaves your shop carries your brand.',
      'Choose window boxes to show the product, rigid boxes for gifts or simple folding cartons for daily orders. We print and die-cut in our own factory, so we can make seasonal boxes for Christmas, Eid, Easter and Mother\'s Day.',
      'Send us your sizes and quantities on WhatsApp for a quote. Delivery across Lebanon and the Middle East.'),
  },
  'coffee-drinks': {
    intro: 'Paper cups, sleeves, cup holders and carriers with your café\'s logo.',
    seo: ['Custom Printed Paper Cups & Coffee Packaging in Lebanon', 'Branded paper cups, cup sleeves, cup holders, napkins and takeaway packaging for coffee shops and juice bars in Lebanon. Quote on WhatsApp.'],
    body: h('Branded coffee cups and café packaging in Lebanon') + p(
      'Custom printed paper cups, cup sleeves, cup holders and carriers, napkins, stickers and takeaway packaging for coffee shops, juice bars and kiosks in Lebanon. Your logo on every cup turns each takeaway order into advertising.',
      'Tell us your cup sizes and how many you use per month and we will suggest the right option for hot and cold drinks.',
      'We deliver all over Lebanon and the Middle East. Message us on WhatsApp with your logo for a quote.'),
  },
  'paper-bags': {
    intro: 'Kraft, white and luxury paper bags printed with your logo, in any size.',
    seo: ['Custom Printed Paper Bags in Lebanon | Kraft & Luxury Bags', 'Custom paper bags printed with your logo: kraft bags, white bags, luxury shopping bags and food delivery bags. Made in Lebanon.'],
    body: h('Custom printed paper bags made in Lebanon') + p(
      'Kraft paper bags, white paper bags, luxury shopping bags, food delivery bags and gift bags, printed with your logo for shops, restaurants, pharmacies, events and brands in Lebanon.',
      'Pick the size, paper, handle and finish and we will produce the bags in our factory. We can match your brand colours and prepare the design proof before printing.',
      'Delivery all over Lebanon and the Middle East. Ask for a quote on WhatsApp.'),
  },
  'labels-stickers': {
    intro: 'Product labels, seals and stickers printed for your packaging.',
    seo: ['Custom Labels & Stickers Printing in Lebanon', 'Printed product labels, logo stickers, seals, jar and bottle labels for food, cosmetics and retail brands in Lebanon. Quote on WhatsApp.'],
    body: h('Labels and stickers printing in Lebanon') + p(
      'Product labels, logo stickers, box seals, jar and bottle labels, price and barcode labels for food producers, cosmetics brands, bakeries, cafés and shops in Lebanon.',
      'We print labels in the shape, size and finish your product needs. Send us your design, or your logo and we will prepare the proof.',
      'Delivery all over Lebanon and the Middle East. Message us on WhatsApp for a quote.'),
  },
  'retail-clothing': {
    intro: 'Mailer boxes, hang tags, tissue and bags for clothing stores and brands.',
    seo: ['Retail & Clothing Packaging in Lebanon | Boxes, Tags, Bags', 'Printed mailer boxes, hang tags, tissue paper, shopping bags and stickers for clothing stores and online brands in Lebanon.'],
    body: h('Packaging for clothing stores and fashion brands') + p(
      'Mailer boxes, gift boxes, hang tags, tissue paper, stickers and shopping bags for clothing stores, boutiques and online brands in Lebanon. Premium retail packaging makes every order feel special and helps customers remember your brand.',
      'We print and cut everything in our factory, so your boxes, tags and bags can match in colour and style.',
      'Delivery across Lebanon and the Middle East. Ask for a quote on WhatsApp.'),
  },
  'corporate-print': {
    intro: 'Business cards, letterheads, folders, catalogues and company stationery.',
    seo: ['Business Cards & Corporate Printing in Lebanon', 'Business cards, letterheads, envelopes, folders, catalogues, brochures and company stationery printed in Lebanon. Quote on WhatsApp.'],
    body: h('Corporate printing for offices and companies') + p(
      'Business cards, letterheads, envelopes, presentation folders, catalogues, brochures, flyers, notebooks and corporate gifts for companies and offices in Lebanon.',
      'Keep your company\'s print consistent: we print all your stationery in one place, with the same colours and paper quality, using offset printing for large runs and digital printing for short runs.',
      'Delivery across Lebanon and the Middle East. Send us your files on WhatsApp for a quote.'),
  },
  'school-print': {
    intro: 'Notebooks, books, folders, certificates and event material for schools.',
    seo: ['School & University Printing in Lebanon', 'Printed notebooks, books, folders, reports, certificates and event material for schools and universities in Lebanon. Quote on WhatsApp.'],
    body: h('Printing for schools and universities') + p(
      'Notebooks, exercise books, books, folders, reports, certificates, diplomas, agendas and event material for schools, universities and training centres in Lebanon.',
      'We print with your school\'s logo and colours, in the quantities you need for the school year or a single event.',
      'Delivery across Lebanon. Message us on WhatsApp for a quote.'),
  },
};
const PAGES = {
  about: ['About PKG. Packaging Factory | Printing & Packaging in Lebanon', 'PKG. Packaging Factory is a printing and packaging factory in Lebanon making custom boxes, bags, cups, labels and business print for businesses.'],
  showroom: ['Showroom | PKG. Packaging Factory, Lebanon', 'Visit the PKG. Packaging Factory showroom to see packaging samples and materials. Address, opening hours and directions.'],
  contact: ['Contact PKG. Packaging Factory | Get a Quote on WhatsApp', 'Get a quote for custom printing and packaging in Lebanon. Message PKG. Packaging Factory on WhatsApp or by email.'],
};

const { collections } = await gql(`{collections(first:50){nodes{id handle}}}`);
for (const c of collections.nodes) {
  const d = COLLECTIONS[c.handle]; if (!d) continue;
  const input = { id: c.id, descriptionHtml: d.body, seo: { title: d.seo[0], description: d.seo[1] },
    metafields: [{ namespace: 'custom', key: 'intro', type: 'single_line_text_field', value: d.intro }] };
  console.log(c.handle, d.seo[0].length, d.seo[1].length);
  if (APPLY) await mutate(`mutation($i:CollectionInput!){collectionUpdate(input:$i){collection{id} userErrors{field message}}}`, { i: input }, 'collectionUpdate');
}
const { pages } = await gql(`{pages(first:50){nodes{id handle}}}`);
for (const pg of pages.nodes) {
  const d = PAGES[pg.handle]; if (!d) continue;
  console.log(pg.handle, d[0].length, d[1].length);
  if (APPLY) await mutate(`mutation($id:ID!,$p:PageUpdateInput!){pageUpdate(id:$id,page:$p){page{id} userErrors{field message}}}`,
    { id: pg.id, p: { metafields: [
      { namespace: 'global', key: 'title_tag', type: 'single_line_text_field', value: d[0] },
      { namespace: 'global', key: 'description_tag', type: 'multi_line_text_field', value: d[1] }] } }, 'pageUpdate');
}
console.log(APPLY ? 'applied' : 'dry run (add --apply)');
