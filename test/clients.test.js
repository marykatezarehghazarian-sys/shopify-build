import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { rmSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createClient, clientConfig, config, setCredential, clientDir, envPrefix } from '../lib/clients.js';

const A = 'zz-test-a', B = 'zz-test-b';
after(() => { for (const s of [A, B]) rmSync(clientDir(s), { recursive: true, force: true }); });

test('clients are created with isolated, private credential files', () => {
  createClient(A, { name: 'A', domain: 'a.myshopify.com', theme: false });
  createClient(B, { name: 'B', domain: 'b.myshopify.com', theme: false });
  setCredential(A, 'SHOPIFY_ADMIN_TOKEN', 'shpat_aaaa');
  setCredential(B, 'SHOPIFY_ADMIN_TOKEN', 'shpat_bbbb');
  assert.equal(config(A).token, 'shpat_aaaa');
  assert.equal(config(B).token, 'shpat_bbbb');
  assert.equal(config(B).domain, 'b.myshopify.com');
  assert.equal(statSync(join(clientDir(A), '.env')).mode & 0o777, 0o600);
  assert.ok(existsSync(join(clientDir(A), 'CONTEXT.md')));
});

test('setCredential replaces in place', () => {
  setCredential(A, 'SHOPIFY_ADMIN_TOKEN', 'shpat_new');
  const env = readFileSync(join(clientDir(A), '.env'), 'utf8');
  assert.equal(env.match(/SHOPIFY_ADMIN_TOKEN=/g).length, 1);
  assert.equal(config(A).token, 'shpat_new');
});

test('prefixed env vars override, unprefixed ones are ignored', () => {
  process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_global';
  assert.equal(config(B).token, 'shpat_bbbb');
  process.env[envPrefix(B) + 'SHOPIFY_ADMIN_TOKEN'] = 'shpat_secret_b';
  assert.equal(config(B).token, 'shpat_secret_b');
  delete process.env.SHOPIFY_ADMIN_TOKEN;
  delete process.env[envPrefix(B) + 'SHOPIFY_ADMIN_TOKEN'];
});

test('unknown or missing client fails loudly', () => {
  assert.throws(() => clientConfig('nope-does-not-exist'), /Unknown client/);
  assert.throws(() => clientConfig('../etc'), /Unknown client/);
});
