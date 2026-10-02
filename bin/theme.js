#!/usr/bin/env node
// Run Shopify CLI theme commands against the active client's store and theme folder.
// Usage: npm run theme -- <dev|pull|push|check|list|...> [--client slug] [extra shopify flags]
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { clientConfig, ROOT } from '../lib/clients.js';

const argv = process.argv.slice(2);
const ci = argv.indexOf('--client');
const explicit = ci >= 0 ? argv.splice(ci, 2)[1] : undefined;
const [sub, ...rest] = argv;
if (!sub) { console.log('Usage: npm run theme -- <dev|pull|push|check|list|...> [--client slug]'); process.exit(0); }

try {
  const c = clientConfig(explicit);
  const args = ['theme', sub, ...rest];
  if (sub !== 'check' || !rest.includes('--path')) args.push('--path', c.themeDir);
  if (sub !== 'check') {
    if (!c.domain) throw new Error(`Client "${c.slug}" has no store domain`);
    args.push('--store', c.domain);
    if (sub === 'push' && !rest.some((a) => ['--live', '--theme', '-t', '--unpublished', '--development'].includes(a))) args.push('--unpublished');
  }
  console.error(`[${c.slug}] shopify ${args.join(' ')}`);
  // Only this client's theme token is passed through; any inherited one is dropped.
  const env = { ...process.env, SHOPIFY_CLI_THEME_TOKEN: c.themeToken || '' };
  if (!c.themeToken) delete env.SHOPIFY_CLI_THEME_TOKEN;
  const r = spawnSync(join(ROOT, 'node_modules/.bin/shopify'), args, { stdio: 'inherit', env });
  process.exit(r.status ?? 1);
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
