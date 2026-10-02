import { gql, mutate, gid } from '../shopify.js';

export async function listCollections() {
  const d = await gql(`{ collections(first: 100) { nodes { id title handle productsCount { count } ruleSet { appliedDisjunctively } } } }`);
  return d.collections.nodes;
}

/**
 * Create a collection. Pass `ruleSet` for a smart collection, e.g.
 * { appliedDisjunctively: false, rules: [{ column: "TAG", relation: "EQUALS", condition: "summer" }] }
 * Pass `productIds` for a manual collection.
 */
export async function createCollection({ productIds, ...input }) {
  const { collection } = await mutate(
    `mutation($input: CollectionInput!) {
      collectionCreate(input: $input) { collection { id title handle } userErrors { field message } }
    }`,
    { input },
    'collectionCreate',
  );
  if (productIds?.length) await addProducts(collection.id, productIds);
  return collection;
}

export async function addProducts(collectionId, productIds) {
  return mutate(
    `mutation($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) { collection { id productsCount { count } } userErrors { field message } }
    }`,
    { id: gid('Collection', collectionId), productIds: productIds.map((p) => gid('Product', p)) },
    'collectionAddProducts',
  );
}

/** Publish to the Online Store (or any publication id). */
export async function publish(resourceId, publicationId) {
  if (!publicationId) {
    const d = await gql(`{ publications(first: 20) { nodes { id name } } }`);
    publicationId = d.publications.nodes.find((p) => p.name === 'Online Store')?.id;
    if (!publicationId) throw new Error('Online Store publication not found; pass a publication id');
  }
  return mutate(
    `mutation($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) { userErrors { field message } }
    }`,
    { id: resourceId, input: [{ publicationId }] },
    'publishablePublish',
  );
}
