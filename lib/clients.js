import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, cpSync, chmodSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Each client lives in clients/<slug>/:
//   client.json   non-secret settings (name, store domain, API version) — committed
//   .env          credentials — gitignored, chmod 600, never shared between clients
//   theme/        that client's theme
//   CONTEXT.md    brand, decisions and notes for that client
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const CLIENTS_DIR = join(ROOT, 'clients');
const CURRENT_FILE = join(ROOT, '.current-client');

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;
export const clientDir = (slug) => join(CLIENTS_DIR, slug);
// Env var prefix for a client, e.g. "acme-co" -> "ACME_CO_" (ACME_CO_SHOPIFY_ADMIN_TOKEN).
export const envPrefix = (slug) => `${slug.toUpperCase().replace(/-/g, '_')}_`;

export function listClients() {
  if (!existsSync(CLIENTS_DIR)) return [];
  return readdirSync(CLIENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(CLIENTS_DIR, d.name, 'client.json')))
    .map((d) => d.name);
}

function parseEnvFile(path) {
  const out = {};
  if (!existsSync(path)) return out;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

/** Active client: explicit arg > SHOPIFY_CLIENT env > .current-client file. */
export function activeClient(explicit) {
  const slug = explicit || process.env.SHOPIFY_CLIENT || (existsSync(CURRENT_FILE) && readFileSync(CURRENT_FILE, 'utf8').trim());
  if (!slug) {
    const all = listClients();
    throw new Error(`No client selected. Use --client <slug> or \`npm run client -- use <slug>\`. Clients: ${all.join(', ') || '(none yet; run `npm run client -- new <slug>`)'}`);
  }
  if (!SLUG_RE.test(slug) || !existsSync(join(clientDir(slug), 'client.json'))) {
    throw new Error(`Unknown client "${slug}". Clients: ${listClients().join(', ') || '(none)'}`);
  }
  return slug;
}

export function useClient(slug) {
  activeClient(slug);
  writeFileSync(CURRENT_FILE, `${slug}\n`);
}

/**
 * Resolve a client's settings and credentials. Credentials come only from that client's
 * own .env, or from env vars prefixed with its slug (for cloud environment secrets).
 * Unprefixed SHOPIFY_* vars are deliberately ignored so one client's token can't leak to another.
 */
export function clientConfig(explicit) {
  const slug = activeClient(explicit);
  const dir = clientDir(slug);
  const meta = JSON.parse(readFileSync(join(dir, 'client.json'), 'utf8'));
  const file = parseEnvFile(join(dir, '.env'));
  const p = envPrefix(slug);
  const get = (k) => process.env[p + k] || file[k];

  const domain = (get('SHOPIFY_STORE_DOMAIN') || meta.storeDomain || '').replace(/^https?:\/\//, '').replace(/\/$/, '');
  return {
    slug,
    name: meta.name || slug,
    dir,
    themeDir: join(dir, 'theme'),
    domain,
    token: get('SHOPIFY_ADMIN_TOKEN'),
    themeToken: get('SHOPIFY_CLI_THEME_TOKEN'),
    apiVersion: get('SHOPIFY_API_VERSION') || meta.apiVersion || '2026-07',
  };
}

/** Config for Admin API calls; throws if the client is missing credentials. */
export function config(explicit) {
  const c = clientConfig(explicit);
  const missing = [!c.domain && 'SHOPIFY_STORE_DOMAIN', !c.token && 'SHOPIFY_ADMIN_TOKEN'].filter(Boolean);
  if (missing.length) {
    throw new Error(`Client "${c.slug}" is missing ${missing.join(', ')}. Set them in clients/${c.slug}/.env or as env vars named ${missing.map((k) => envPrefix(c.slug) + k).join(", ")}.`);
  }
  return c;
}

export function createClient(slug, { name, domain, apiVersion = '2026-07', theme = true } = {}) {
  if (!SLUG_RE.test(slug)) throw new Error('Slug must be lowercase letters, numbers and dashes (e.g. acme-co)');
  const dir = clientDir(slug);
  if (existsSync(join(dir, 'client.json'))) throw new Error(`Client "${slug}" already exists`);
  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, 'client.json'), JSON.stringify({ name: name || slug, storeDomain: domain || '', apiVersion }, null, 2) + '\n');
  writeFileSync(join(dir, '.env'), [
    `# Credentials for ${name || slug} only. Gitignored; do not copy between clients.`,
    'SHOPIFY_ADMIN_TOKEN=',
    'SHOPIFY_CLI_THEME_TOKEN=',
    '',
  ].join('\n'));
  chmodSync(join(dir, '.env'), 0o600);
  writeFileSync(join(dir, 'CONTEXT.md'), `# ${name || slug}

Store: ${domain || '(not set)'}

## Brand
- Voice / tone:
- Colors / fonts:

## Catalog
- Product types, vendors, tagging conventions:

## Store setup
- Collections:
- Discounts:
- Shipping:

## Decisions & notes
`);
  if (theme) cpSync(join(ROOT, 'starter-theme'), join(dir, 'theme'), { recursive: true });
  return clientConfig(slug);
}

/** Write one credential into a client's .env (keeps other lines). */
export function setCredential(slug, key, value) {
  activeClient(slug);
  if (!/^SHOPIFY_[A-Z_]+$/.test(key)) throw new Error('Key must look like SHOPIFY_ADMIN_TOKEN');
  const path = join(clientDir(slug), '.env');
  const lines = existsSync(path) ? readFileSync(path, 'utf8').split('\n') : [];
  const i = lines.findIndex((l) => l.startsWith(`${key}=`));
  if (i >= 0) lines[i] = `${key}=${value}`; else lines.splice(lines.length - (lines.at(-1) === '' ? 1 : 0), 0, `${key}=${value}`);
  writeFileSync(path, lines.join('\n'));
  chmodSync(path, 0o600);
}
