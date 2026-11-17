// Launch the last 5 Noctra coming-soon pieces (owner PDF "Reina Reichouni Collection", 17 Nov 2026).
process.env.SHOPIFY_CLIENT = 'reina-store';
import { writeFileSync } from 'node:fs';
const { gql, mutate } = await import('../../../lib/index.js');
const { stageUpload } = await import('../../../lib/admin/files.js');
const T = 'gid://shopify/OnlineStoreTheme/189399957808';
const FIT = 'the model is wearing size S';
const P = {
  'notte-dress': 'crepe, with a detachable lace belt',
  'prima-set': 'crepe',
  'rose-top': 'crepe, with a detachable belt',
  'noctra-blazer': 'croc leather, with fringe detailing on the back',
  'brezza-set': 'embossed suede, with handmade genuine leather braid detailing',
};
const backup = {};
for (const [h, fabric] of Object.entries(P)) {
  const p = (await gql(`query($h:String!){productByHandle(handle:$h){id title tags descriptionHtml}}`, { h })).productByHandle;
  backup[h] = p;
  let d = p.descriptionHtml;
  if (!/Fabric:/.test(d)) {
    const line = `<p><strong>Fabric:</strong> ${fabric}<br><strong>Fit:</strong> ${FIT}</p>`;
    d = d.includes('<p>Part of') ? d.replace('<p>Part of', line + '<p>Part of') : d + line;
  }
  await mutate(`mutation($i:ProductInput!){productUpdate(input:$i){product{id} userErrors{field message}}}`, { i: { id: p.id, descriptionHtml: d } }, 'productUpdate');
  await mutate(`mutation($id:ID!,$t:[String!]!){tagsRemove(id:$id,tags:$t){userErrors{message}}}`, { id: p.id, t: ['coming-soon'] }, 'tagsRemove');
  console.log('launched', p.title);
}
writeFileSync('clients/reina-store/backup-launch-noctra5.json', JSON.stringify(backup, null, 1));

// Notte: 2 new studio shots after the packshot
const notte = backup['notte-dress'].id;
const shots = [['clients/reina-store/photos/notte-studio-front.jpg', 'front'], ['clients/reina-store/photos/notte-studio-side.jpg', 'side']];
const media = [];
for (const [f, v] of shots) media.push({ originalSource: await stageUpload(f), mediaContentType: 'IMAGE', alt: `Notte Dress: Reina Reichouni Noctra FW 26/27, black crepe column gown, studio ${v}` });
const cm = await mutate(`mutation($p:ID!,$m:[CreateMediaInput!]!){productCreateMedia(productId:$p,media:$m){media{id} mediaUserErrors{field message}}}`, { p: notte, m: media }, 'productCreateMedia');
const ids = cm.media.map((m) => m.id);
await new Promise((r) => setTimeout(r, 6000));
await mutate(`mutation($id:ID!,$m:[MoveInput!]!){productReorderMedia(id:$id,moves:$m){job{id} mediaUserErrors{field message}}}`, { id: notte, m: ids.map((id, i) => ({ id, newPosition: String(i + 1) })) }, 'productReorderMedia');
console.log('notte photos added', ids.length);

// New arrivals: only the fw26 tag rule
const c = (await gql(`{collectionByHandle(handle:"new-in"){id ruleSet{appliedDisjunctively rules{column relation condition}}}}`)).collectionByHandle;
writeFileSync('clients/reina-store/backup-new-in-rules.before-launch-noctra5.json', JSON.stringify(c.ruleSet));
await mutate(`mutation($i:CollectionInput!){collectionUpdate(input:$i){collection{id} userErrors{field message}}}`, { i: { id: c.id, ruleSet: { appliedDisjunctively: false, rules: [{ column: 'TAG', relation: 'EQUALS', condition: 'fw26' }] } } }, 'collectionUpdate');
console.log('new-in rules reset to TAG=fw26');

// Hide the now-empty Coming Soon section on the New In page
const raw = (await gql(`{theme(id:"${T}"){files(filenames:["templates/collection.new-in.json"]){nodes{body{... on OnlineStoreThemeFileBodyText{content}}}}}}`)).theme.files.nodes[0].body.content;
const m = raw.match(/^\s*\/\*[\s\S]*?\*\/\s*/); const head = m ? m[0] : ''; const j = JSON.parse(raw.slice(head.length));
j.sections.coming.disabled = true;
await mutate(`mutation($t:ID!,$f:[OnlineStoreThemeFilesUpsertFileInput!]!){themeFilesUpsert(themeId:$t,files:$f){upsertedThemeFiles{filename} userErrors{filename message}}}`, { t: T, f: [{ filename: 'templates/collection.new-in.json', body: { type: 'TEXT', value: head + JSON.stringify(j, null, 2) } }] }, 'themeFilesUpsert');
console.log('coming soon section hidden');
