import { gql, mutate } from '../shopify.js';

// Orders taken outside the storefront (WhatsApp / Instagram DMs), entered as draft orders.
// Flow: findVariants -> quoteDraft (prices + shipping rates) -> createDraft -> share invoiceUrl or sendInvoice -> markPaid.
// Card details are never handled here: the customer pays on Shopify's own checkout page (invoiceUrl).

/** Sellable variants whose "product / variant" name contains every word of `text` (case-insensitive). */
export async function findVariants(text = '') {
  const d = await gql(`{ productVariants(first: 250) { nodes {
    id title sku price inventoryQuantity availableForSale product { title status } } } }`);
  const words = String(text).toLowerCase().split(/\s+/).filter(Boolean);
  return d.productVariants.nodes
    .map((v) => ({
      variantId: v.id,
      name: `${v.product.title}${v.title === 'Default Title' ? '' : ` / ${v.title}`}`,
      price: v.price, sku: v.sku, available: v.availableForSale, stock: v.inventoryQuantity, productStatus: v.product.status,
    }))
    .filter((v) => words.every((w) => v.name.toLowerCase().includes(w)));
}

const NAME = (o) => ({ firstName: o.firstName, lastName: o.lastName });

/**
 * Build a DraftOrderInput from a plain order description:
 * { customer: {firstName, lastName, email?, phone?},
 *   address: {address1, address2?, city, provinceCode?, zip?, countryCode, phone?},
 *   items: [{variantId, quantity}],
 *   shippingRateHandle? | shipping?: {title, amount},
 *   discount?: {percent | amount, reason?}, note?, tags?, currency? }
 */
export function toDraftInput(o) {
  const c = o.customer || {};
  const addr = o.address && { ...NAME(c), phone: c.phone, ...o.address };
  const input = {
    email: c.email || undefined,
    phone: c.phone || undefined,
    shippingAddress: addr,
    billingAddress: addr,
    lineItems: (o.items || []).map((i) => ({ variantId: i.variantId, quantity: Number(i.quantity || 1) })),
    note: o.note,
    tags: ['dm-order', ...(o.tags || [])],
    sourceName: 'dm-order',
    acceptAutomaticDiscounts: true,
  };
  if (o.shippingRateHandle) input.shippingLine = { shippingRateHandle: o.shippingRateHandle };
  else if (o.shipping) input.shippingLine = { title: o.shipping.title || 'Shipping', priceWithCurrency: { amount: String(o.shipping.amount), currencyCode: o.currency || 'USD' } };
  if (o.discount) {
    const pct = o.discount.percent !== undefined;
    input.appliedDiscount = {
      title: o.discount.reason || 'Discount',
      description: o.discount.reason,
      valueType: pct ? 'PERCENTAGE' : 'FIXED_AMOUNT',
      value: Number(pct ? o.discount.percent : o.discount.amount),
    };
  }
  if (o.paymentPending) input.paymentTerms = { paymentTermsTemplateId: 'gid://shopify/PaymentTermsTemplate/9' }; // Due on fulfillment (cash on delivery)
  return input;
}

const MONEY = 'shopMoney { amount currencyCode }';

/** Price check before creating anything: totals, tax, and the store's shipping rates for that address. */
export async function quoteDraft(order) {
  const { calculatedDraftOrder: c } = await mutate(
    `mutation($i: DraftOrderInput!) { draftOrderCalculate(input: $i) { calculatedDraftOrder {
      lineItems { name quantity originalUnitPriceSet { ${MONEY} } }
      availableShippingRates { handle title price { amount currencyCode } }
      subtotalPriceSet { ${MONEY} } totalShippingPriceSet { ${MONEY} } totalTaxSet { ${MONEY} } totalPriceSet { ${MONEY} }
      warnings { message } alerts { title content }
    } userErrors { field message } } }`,
    { i: toDraftInput(order) },
    'draftOrderCalculate',
  );
  return {
    items: c.lineItems.map((l) => `${l.quantity} × ${l.name} @ ${l.originalUnitPriceSet.shopMoney.amount}`),
    shippingRates: c.availableShippingRates,
    subtotal: c.subtotalPriceSet.shopMoney.amount,
    shipping: c.totalShippingPriceSet.shopMoney.amount,
    tax: c.totalTaxSet.shopMoney.amount,
    total: `${c.totalPriceSet.shopMoney.amount} ${c.totalPriceSet.shopMoney.currencyCode}`,
    warnings: [...(c.warnings || []).map((w) => w.message), ...(c.alerts || []).map((a) => `${a.title}: ${a.content}`)],
  };
}

const DRAFT_FIELDS = `id name status invoiceUrl totalPriceSet { ${MONEY} } customer { id displayName } order { id name }`;

export async function createDraft(order) {
  const { draftOrder } = await mutate(
    `mutation($i: DraftOrderInput!) { draftOrderCreate(input: $i) { draftOrder { ${DRAFT_FIELDS} } userErrors { field message } } }`,
    { i: toDraftInput(order) },
    'draftOrderCreate',
  );
  return draftOrder;
}

/** Email the customer Shopify's checkout link (needs an email on the draft). */
export async function sendInvoice(id, { to, customMessage } = {}) {
  const { draftOrder } = await mutate(
    `mutation($id: ID!, $e: EmailInput) { draftOrderInvoiceSend(id: $id, email: $e) { draftOrder { ${DRAFT_FIELDS} } userErrors { field message } } }`,
    { id, e: to || customMessage ? { to, customMessage } : undefined },
    'draftOrderInvoiceSend',
  );
  return draftOrder;
}

/** Turn the draft into a real order. Without payment terms it is recorded as PAID (use only when the money was received). */
export async function completeDraft(id) {
  const { draftOrder } = await mutate(
    `mutation($id: ID!) { draftOrderComplete(id: $id, sourceName: "dm-order") { draftOrder { ${DRAFT_FIELDS} } userErrors { field message } } }`,
    { id },
    'draftOrderComplete',
  );
  return draftOrder;
}

export async function getDraft(id) {
  const d = await gql(`query($id: ID!) { draftOrder(id: $id) { ${DRAFT_FIELDS} email phone
    lineItems(first: 50) { nodes { name quantity } } shippingAddress { formatted } } }`, { id });
  return d.draftOrder;
}

export async function listDrafts(query = 'tag:dm-order') {
  const d = await gql(`query($q: String) { draftOrders(first: 50, query: $q, reverse: true) { nodes { ${DRAFT_FIELDS} createdAt } } }`, { q: query });
  return d.draftOrders.nodes;
}
