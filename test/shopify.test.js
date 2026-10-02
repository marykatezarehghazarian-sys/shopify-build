import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

process.env.SHOPIFY_STORE_DOMAIN = 'https://test-shop.myshopify.com/';
process.env.SHOPIFY_ADMIN_TOKEN = 'shpat_test';
const { gql, mutate, paginate, gid, ShopifyError } = await import('../lib/shopify.js');

let calls;
const respond = (...bodies) => {
  calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    const b = bodies.shift();
    return { ok: true, status: 200, headers: new Headers(), json: async () => b };
  };
};
beforeEach(() => (calls = []));

test('gid normalises ids', () => {
  assert.equal(gid('Product', 123), 'gid://shopify/Product/123');
  assert.equal(gid('Product', 'gid://shopify/Product/1'), 'gid://shopify/Product/1');
});

test('gql sends token to normalised endpoint', async () => {
  respond({ data: { shop: { name: 'x' } } });
  const d = await gql('{ shop { name } }');
  assert.equal(d.shop.name, 'x');
  assert.match(calls[0].url, /^https:\/\/test-shop\.myshopify\.com\/admin\/api\/\d{4}-\d{2}\/graphql\.json$/);
  assert.equal(calls[0].init.headers['X-Shopify-Access-Token'], 'shpat_test');
});

test('gql retries when throttled', async () => {
  respond(
    { errors: [{ message: 'Throttled', extensions: { code: 'THROTTLED' } }], extensions: { cost: { requestedQueryCost: 1, throttleStatus: { currentlyAvailable: 1, restoreRate: 50 } } } },
    { data: { ok: true } },
  );
  assert.deepEqual(await gql('{ ok }'), { ok: true });
  assert.equal(calls.length, 2);
});

test('mutate throws on userErrors', async () => {
  respond({ data: { productCreate: { userErrors: [{ field: ['title'], message: "can't be blank" }] } } });
  await assert.rejects(mutate('m', {}, 'productCreate'), (e) => e instanceof ShopifyError && /title: can't be blank/.test(e.message));
});

test('paginate follows cursors', async () => {
  respond(
    { data: { products: { edges: [{ node: 1 }], pageInfo: { hasNextPage: true, endCursor: 'c1' } } } },
    { data: { products: { edges: [{ node: 2 }], pageInfo: { hasNextPage: false } } } },
  );
  const out = [];
  for await (const n of paginate('q', {}, 'products')) out.push(n);
  assert.deepEqual(out, [1, 2]);
  assert.equal(JSON.parse(calls[1].init.body).variables.after, 'c1');
});
