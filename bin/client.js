#!/usr/bin/env node
// Manage client projects. Usage: npm run client -- <command>
import { readFileSync } from 'node:fs';
import { listClients, createClient, useClient, clientConfig, setCredential, envPrefix } from '../lib/clients.js';

const [cmd, ...args] = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const mask = (v) => (v ? `${v.slice(0, 6)}…${v.slice(-4)}` : '(not set)');
const KEYS = { 'client-id': 'SHOPIFY_CLIENT_ID', 'client-secret': 'SHOPIFY_CLIENT_SECRET', admin: 'SHOPIFY_ADMIN_TOKEN', theme: 'SHOPIFY_CLI_THEME_TOKEN', domain: 'SHOPIFY_STORE_DOMAIN', version: 'SHOPIFY_API_VERSION' };

function show(slug) {
  const c = clientConfig(slug);
  console.log(`${c.name} (${c.slug})
  store:        ${c.domain || '(not set)'}
  api version:  ${c.apiVersion}
  client id:    ${c.clientId || '(not set)'}
  client secret:${' '}${mask(c.clientSecret)}
  admin token:  ${mask(c.token)}${!c.token && c.clientId ? ' (exchanged automatically from client id/secret)' : ''}
  theme token:  ${mask(c.themeToken)}
  folder:       clients/${c.slug}/
  env prefix:   ${envPrefix(c.slug)}SHOPIFY_*`);
}

const usage = `Usage: npm run client -- <command>
  new <slug> [--name "Acme Co"] [--owner "Jane"] [--domain acme.myshopify.com]   create clients/<slug>/ (theme copied from starter-theme)
  list                                                          list clients (* = active)
  use <slug>                                                    make <slug> the active client
  current                                                       show the active client
  show [slug]                                                   show settings with tokens masked
  token [slug]                                                  exchange client id/secret for a fresh token now
  set <slug> <client-id|client-secret|admin|theme|domain|version> [value]               save a credential to clients/<slug>/.env
                                                                (omit value to read it from stdin)`;

try {
  switch (cmd) {
    case 'new': {
      const slug = args[0];
      createClient(slug, { name: flag('name'), owner: flag('owner'), domain: flag('domain') });
      console.log(`Created clients/${slug}/. Add tokens with: npm run client -- set ${slug} admin`);
      if (listClients().length === 1) useClient(slug);
      break;
    }
    case 'list': {
      let current; try { current = clientConfig().slug; } catch {}
      const all = listClients();
      console.log(all.length ? all.map((s) => `${s === current ? '*' : ' '} ${s}`).join('\n') : '(no clients yet)');
      break;
    }
    case 'use': useClient(args[0]); console.log(`Active client: ${args[0]}`); break;
    case 'current': case 'show': show(args[0]); break;
    case 'token': {
      // Force a fresh client-credentials exchange and report scopes/expiry (token stays masked).
      const { config } = await import('../lib/clients.js');
      const { exchangeClientCredentials } = await import('../lib/auth.js');
      const c = config(args[0]);
      if (!c.clientId) throw new Error(`${c.slug} has no client ID/secret (uses a static admin token)`);
      const t = await exchangeClientCredentials(c);
      console.log(`Token for ${c.slug}: ${mask(t.accessToken)}\n  expires: ${new Date(t.expiresAt).toISOString()}\n  scopes:  ${t.scope}`);
      break;
    }
    case 'set': {
      const [slug, which, value] = args;
      const key = KEYS[which];
      if (!key) throw new Error(`Second argument must be one of: ${Object.keys(KEYS).join(', ')}`);
      const v = (value ?? readFileSync(0, 'utf8')).trim();
      if (!v) throw new Error('No value given');
      setCredential(slug, key, v);
      console.log(`Saved ${key} for ${slug}: ${/TOKEN|SECRET/.test(key) ? mask(v) : v}`);
      break;
    }
    default: console.log(usage); process.exit(cmd ? 1 : 0);
  }
} catch (e) {
  console.error(`Error: ${e.message}`);
  process.exit(1);
}
