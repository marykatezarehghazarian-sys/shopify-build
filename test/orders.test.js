import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toDraftInput } from '../lib/admin/orders.js';

test('toDraftInput maps a DM order to DraftOrderInput', () => {
  const i = toDraftInput({
    customer: { firstName: 'Ana', lastName: 'Lee', email: 'ana@example.com', phone: '+12085550100' },
    address: { address1: '1 Main St', city: 'Boise', provinceCode: 'ID', zip: '83702', countryCode: 'US' },
    items: [{ variantId: 'gid://shopify/ProductVariant/1', quantity: '2' }],
    shipping: { title: 'Standard', amount: 4.99 },
    discount: { percent: 10, reason: 'DM promo' },
    tags: ['instagram'],
  });
  assert.equal(i.email, 'ana@example.com');
  assert.deepEqual(i.lineItems, [{ variantId: 'gid://shopify/ProductVariant/1', quantity: 2 }]);
  assert.equal(i.shippingAddress.firstName, 'Ana');
  assert.equal(i.shippingAddress.phone, '+12085550100');
  assert.deepEqual(i.billingAddress, i.shippingAddress);
  assert.deepEqual(i.shippingLine, { title: 'Standard', priceWithCurrency: { amount: '4.99', currencyCode: 'USD' } });
  assert.deepEqual(i.appliedDiscount, { title: 'DM promo', description: 'DM promo', valueType: 'PERCENTAGE', value: 10 });
  assert.deepEqual(i.tags, ['dm-order', 'instagram']);
  assert.equal(i.paymentTerms, undefined);
});

test('shipping rate handle', () => {
  const i = toDraftInput({ items: [], shippingRateHandle: 'h1' });
  assert.deepEqual(i.shippingLine, { shippingRateHandle: 'h1' });
});
