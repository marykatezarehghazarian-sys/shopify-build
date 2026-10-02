import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Minimal .env loader (no dependency). Real env vars win over .env values.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

export function config() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;
  const missing = [!domain && 'SHOPIFY_STORE_DOMAIN', !token && 'SHOPIFY_ADMIN_TOKEN'].filter(Boolean);
  if (missing.length) throw new Error(`Missing env: ${missing.join(', ')} (see .env.example)`);
  return {
    domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
    token,
    apiVersion: process.env.SHOPIFY_API_VERSION || '2026-07',
  };
}
