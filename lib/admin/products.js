import { gql, mutate, paginate, gid } from '../shopify.js';

const PRODUCT_FIELDS = `id title handle status vendor productType tags totalInventory
  variants(first: 100) { nodes { id title sku price inventoryItem { id } inventoryQuantity } }`;

export async function listProducts({ query } = {}) {
  const out = [];
  const q = `query($after: String, $query: String) {
    products(first: 50, after: $after, query: $query) {
      edges { node { id title handle status totalInventory } }
      pageInfo { hasNextPage endCursor }
    }
  }`;
  for await (const p of paginate(q, { query }, 'products')) out.push(p);
  return out;
}

export async function getProduct(idOrHandle) {
  if (String(idOrHandle).match(/^(\d+|gid:\/\/.*)$/)) {
    const d = await gql(`query($id: ID!) { product(id: $id) { ${PRODUCT_FIELDS} } }`, { id: gid('Product', idOrHandle) });
    return d.product;
  }
  const d = await gql(`query($h: String!) { productByIdentifier(identifier: { handle: $h }) { ${PRODUCT_FIELDS} } }`, { h: idOrHandle });
  return d.productByIdentifier;
}

/**
 * Create a product. `input` follows ProductCreateInput (title, descriptionHtml, vendor,
 * productType, tags, status, productOptions...). Optional `price`/`sku` set the default variant.
 */
export async function createProduct({ price, sku, ...input }) {
  const { product } = await mutate(
    `mutation($product: ProductCreateInput!) {
      productCreate(product: $product) { product { ${PRODUCT_FIELDS} } userErrors { field message } }
    }`,
    { product: { status: 'DRAFT', ...input } },
    'productCreate',
  );
  if (price !== undefined || sku !== undefined) {
    const v = product.variants.nodes[0];
    await updateVariants(product.id, [{ id: v.id, ...(price !== undefined && { price: String(price) }), ...(sku !== undefined && { inventoryItem: { sku } }) }]);
    return getProduct(product.id);
  }
  return product;
}

export async function updateProduct(id, fields) {
  const { product } = await mutate(
    `mutation($product: ProductUpdateInput!) {
      productUpdate(product: $product) { product { id title handle status } userErrors { field message } }
    }`,
    { product: { id: gid('Product', id), ...fields } },
    'productUpdate',
  );
  return product;
}

export async function deleteProduct(id) {
  return mutate(
    `mutation($input: ProductDeleteInput!) { productDelete(input: $input) { deletedProductId userErrors { field message } } }`,
    { input: { id: gid('Product', id) } },
    'productDelete',
  );
}

/** Bulk update variants: [{ id, price, compareAtPrice, inventoryItem: { sku, tracked } }] */
export async function updateVariants(productId, variants) {
  const { productVariants } = await mutate(
    `mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id title sku price } userErrors { field message }
      }
    }`,
    { productId: gid('Product', productId), variants: variants.map((v) => ({ ...v, id: gid('ProductVariant', v.id) })) },
    'productVariantsBulkUpdate',
  );
  return productVariants;
}
