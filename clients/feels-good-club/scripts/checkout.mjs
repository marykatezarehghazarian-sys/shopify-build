// Place a cash-on-delivery order through the store's own website checkout, filling in the customer's details.
// Usage: node clients/feels-good-club/scripts/checkout.mjs <order.json> [--submit] [--shot out.png]
// order.json: { "items": [{ "variantId": "4683...", "quantity": 1 }], "firstName": "", "lastName": "", "phone": "+961...",
//               "address": "Area", "city": "Area", "countryCode": "LB", "expectTotal": "20.00" }
// Without --submit it stops before "Complete order" (dry run). Customer data comes from a file outside the repo.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node-tools/node_modules/');
const { chromium } = require('playwright');

const STORE = 'https://feelsgoodclub.com';
const args = process.argv.slice(2);
const o = JSON.parse(readFileSync(args[0], 'utf8'));
const SUBMIT = args.includes('--submit');
const shot = args.includes('--shot') ? args[args.indexOf('--shot') + 1] : null;
const num = (gid) => String(gid).split('/').pop();

const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY, bypass: 'localhost' } : undefined;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy });
const ctx = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 } });
await ctx.addCookies([{ name: 'localization', value: o.countryCode || 'LB', domain: 'feelsgoodclub.com', path: '/' }]);
const p = await ctx.newPage();
try {
  const cart = o.items.map((i) => `${num(i.variantId)}:${i.quantity || 1}`).join(',');
  await p.goto(`${STORE}/cart/${cart}?checkout`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const contact = p.getByRole('textbox', { name: 'Email or mobile phone number' });
  await contact.waitFor({ timeout: 30000 });
  await contact.fill(o.phone || o.email);

  const country = p.getByRole('combobox', { name: 'Country/Region' });
  if (await country.count()) await country.selectOption(o.countryCode || 'LB').catch(() => {});
  await p.getByRole('textbox', { name: 'First name' }).fill(o.firstName || '');
  await p.getByRole('textbox', { name: 'Last name' }).fill(o.lastName || '');
  await p.getByRole('combobox', { name: 'Address' }).or(p.getByRole('textbox', { name: 'Address', exact: true })).first().fill(o.address);
  await p.keyboard.press('Escape'); // close address suggestions
  await p.getByRole('textbox', { name: 'City' }).fill(o.city || o.address);
  if (o.phone) {
    const ph = p.getByRole('textbox', { name: /^Phone/ });
    if (await ph.count()) await ph.first().fill(o.phone);
  }

  const cod = p.getByText('Cash on Delivery (COD)').first();
  await cod.waitFor({ timeout: 30000 });
  await cod.click().catch(() => {});
  await p.waitForTimeout(2500);

  const body = await p.locator('body').innerText();
  const total = (body.match(/Total\s*USD\s*\$([\d.,]+)/) || [])[1];
  console.log(JSON.stringify({ total, expected: o.expectTotal ?? null }));
  if (shot) await p.screenshot({ path: shot, fullPage: true });
  if (o.expectTotal && total && Number(total) !== Number(o.expectTotal)) {
    throw new Error(`Total $${total} doesn't match the expected $${o.expectTotal}; not submitting.`);
  }
  if (!SUBMIT) {
    console.log('dry run: stopped before Complete order');
  } else {
    await p.getByRole('button', { name: /Complete order/i }).click();
    await p.waitForURL(/thank[-_]you|orders\//, { timeout: 90000 });
    await p.waitForTimeout(3000);
    const t = await p.locator('body').innerText();
    const m = t.match(/(?:Order|Confirmation)\s*#\s*([A-Z0-9]+)/i);
    console.log(JSON.stringify({ placed: true, confirmation: m ? m[1] : null }));
    if (shot) await p.screenshot({ path: shot, fullPage: true });
  }
} catch (e) {
  if (shot) await p.screenshot({ path: shot, fullPage: true }).catch(() => {});
  console.error('Checkout failed:', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
}
