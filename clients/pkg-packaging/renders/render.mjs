// Renders PKG product images as realistic 3D studio shots (three.js in headless Chromium).
// node clients/pkg-packaging/renders/render.mjs [name filter...]   -> out/<handle>.jpg (1200x1200)
// three.js is served from THREE_DIR (a folder containing node_modules/three), default: ./node_modules
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, extname } from 'node:path';
const dir = new URL('.', import.meta.url).pathname;
const THREE_DIR = process.env.THREE_DIR || join(dir, 'node_modules');
if (!existsSync(join(THREE_DIR, 'three'))) throw new Error('three.js not found in ' + THREE_DIR + ' (npm i three@0.170.0 there, or set THREE_DIR)');
mkdirSync(join(dir, 'out'), { recursive: true });
const require = createRequire('/opt/node-tools/node_modules/');
const { chromium } = require('playwright');
const filter = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await b.newPage({ viewport: { width: 1200, height: 1200 } });
page.on('console', (m) => console.log('[page]', m.text()));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
const types = { '.js': 'text/javascript', '.html': 'text/html', '.png': 'image/png' };
await page.route('http://r.local/**', (route) => {
  const p = new URL(route.request().url()).pathname;
  const f = p.startsWith('/three/') ? join(THREE_DIR, p) : join(dir, p);
  if (!existsSync(f)) return route.fulfill({ status: 404, body: 'nf' });
  route.fulfill({ status: 200, contentType: types[extname(f)] || 'application/octet-stream', body: readFileSync(f) });
});
await page.goto('http://r.local/scene.html');
await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
const names = await page.evaluate(() => Object.keys(window.PRODUCTS));
for (const n of names) {
  if (filter.length && !filter.some((f) => n.toLowerCase().includes(f.toLowerCase()))) continue;
  const t = Date.now();
  const url = await page.evaluate((n) => window.renderProduct(n), n);
  const handle = n.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  writeFileSync(join(dir, 'out', handle + '.jpg'), Buffer.from(url.split(',')[1], 'base64'));
  console.log('rendered', handle, Date.now() - t, 'ms');
}
await b.close();
