import { readFileSync, writeFileSync, existsSync, chmodSync } from 'node:fs';
import { join } from 'node:path';

// Access tokens for Dev Dashboard apps come from the client credentials grant and
// expire after ~24h. They're cached per client in clients/<slug>/.token-cache.json
// (gitignored, chmod 600) and refreshed shortly before expiry.
const memory = new Map();
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

function cachePath(c) { return join(c.dir, '.token-cache.json'); }

function readCache(c) {
  const hit = memory.get(c.slug);
  if (hit) return hit;
  try { return existsSync(cachePath(c)) ? JSON.parse(readFileSync(cachePath(c), 'utf8')) : null; } catch { return null; }
}

function valid(entry, c) {
  return entry && entry.clientId === c.clientId && entry.domain === c.domain && entry.expiresAt - REFRESH_MARGIN_MS > Date.now();
}

/** Exchange client ID + secret for an Admin API access token. */
export async function exchangeClientCredentials(c) {
  const res = await fetch(`https://${c.domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: c.clientId, client_secret: c.clientSecret }),
  });
  const text = await res.text();
  let body; try { body = JSON.parse(text); } catch { body = { raw: text.slice(0, 300) }; }
  if (!res.ok || !body.access_token) {
    const reason = body.error_description || body.error || body.errors || body.raw || `HTTP ${res.status}`;
    throw new Error(`Token exchange for "${c.slug}" failed (${res.status}): ${typeof reason === 'string' ? reason : JSON.stringify(reason)}. ` +
      'Check the client ID/secret, that the app is installed on this store, and that the store belongs to the same organization as the app.');
  }
  const entry = {
    accessToken: body.access_token,
    scope: body.scope,
    expiresAt: Date.now() + (Number(body.expires_in) || 86399) * 1000,
    clientId: c.clientId,
    domain: c.domain,
  };
  memory.set(c.slug, entry);
  writeFileSync(cachePath(c), JSON.stringify(entry));
  chmodSync(cachePath(c), 0o600);
  return entry;
}

/** Token for API calls: a static token if set, else a cached or freshly exchanged one. */
export async function accessToken(c, { force = false } = {}) {
  if (c.token) return c.token;
  const cached = readCache(c);
  if (!force && valid(cached, c)) { memory.set(c.slug, cached); return cached.accessToken; }
  return (await exchangeClientCredentials(c)).accessToken;
}

export function clearToken(c) { memory.delete(c.slug); }
