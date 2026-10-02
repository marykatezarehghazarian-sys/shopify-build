import { gql, mutate } from '../shopify.js';

export async function listDiscounts() {
  const d = await gql(`{ discountNodes(first: 100) { nodes { id discount { __typename
    ... on DiscountCodeBasic { title status startsAt endsAt codes(first: 5) { nodes { code } } }
    ... on DiscountAutomaticBasic { title status startsAt endsAt }
  } } } }`);
  return d.discountNodes.nodes;
}

function customerGets({ percent, amount, collectionIds, productIds }) {
  const value = percent !== undefined
    ? { percentage: Number(percent) / 100 }
    : { discountAmount: { amount: String(amount), appliesOnEachItem: false } };
  let items = { all: true };
  if (collectionIds?.length) items = { collections: { add: collectionIds } };
  else if (productIds?.length) items = { products: { productsToAdd: productIds } };
  return { value, items };
}

/** Code discount: { title, code, percent | amount, startsAt?, endsAt?, usageLimit?, appliesOncePerCustomer?, collectionIds?, productIds? } */
export async function createCodeDiscount(opts) {
  const { title, code, startsAt = new Date().toISOString(), endsAt, usageLimit, appliesOncePerCustomer = false } = opts;
  const { codeDiscountNode } = await mutate(
    `mutation($d: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $d) { codeDiscountNode { id } userErrors { field message } }
    }`,
    { d: { title, code, startsAt, endsAt, usageLimit, appliesOncePerCustomer, context: { all: 'ALL' }, customerGets: customerGets(opts) } },
    'discountCodeBasicCreate',
  );
  return codeDiscountNode;
}

/** Automatic discount: { title, percent | amount, startsAt?, endsAt?, minSubtotal?, collectionIds?, productIds? } */
export async function createAutomaticDiscount(opts) {
  const { title, startsAt = new Date().toISOString(), endsAt, minSubtotal } = opts;
  const { automaticDiscountNode } = await mutate(
    `mutation($d: DiscountAutomaticBasicInput!) {
      discountAutomaticBasicCreate(automaticBasicDiscount: $d) { automaticDiscountNode { id } userErrors { field message } }
    }`,
    {
      d: {
        title, startsAt, endsAt, context: { all: 'ALL' },
        minimumRequirement: minSubtotal ? { subtotal: { greaterThanOrEqualToSubtotal: String(minSubtotal) } } : undefined,
        customerGets: customerGets(opts),
      },
    },
    'discountAutomaticBasicCreate',
  );
  return automaticDiscountNode;
}
