import { gql, mutate, gid } from '../shopify.js';

export async function getInventoryLevels(inventoryItemId) {
  const d = await gql(
    `query($id: ID!) { inventoryItem(id: $id) { id sku tracked
      inventoryLevels(first: 50) { nodes { location { id name } quantities(names: ["available", "on_hand", "committed"]) { name quantity } } }
    } }`,
    { id: gid('InventoryItem', inventoryItemId) },
  );
  return d.inventoryItem;
}

/** Set absolute available quantities: [{ inventoryItemId, locationId, quantity }] */
export async function setAvailable(quantities, reason = 'correction') {
  return mutate(
    `mutation($input: InventorySetQuantitiesInput!) {
      inventorySetQuantities(input: $input) {
        inventoryAdjustmentGroup { reason changes { name delta } } userErrors { field message }
      }
    }`,
    {
      input: {
        name: 'available',
        reason,
        ignoreCompareQuantity: true,
        quantities: quantities.map((q) => ({
          inventoryItemId: gid('InventoryItem', q.inventoryItemId),
          locationId: gid('Location', q.locationId),
          quantity: Number(q.quantity),
        })),
      },
    },
    'inventorySetQuantities',
  );
}

/** Adjust by delta: [{ inventoryItemId, locationId, delta }] */
export async function adjustAvailable(changes, reason = 'correction') {
  return mutate(
    `mutation($input: InventoryAdjustQuantitiesInput!) {
      inventoryAdjustQuantities(input: $input) {
        inventoryAdjustmentGroup { reason changes { name delta } } userErrors { field message }
      }
    }`,
    {
      input: {
        name: 'available',
        reason,
        changes: changes.map((c) => ({
          inventoryItemId: gid('InventoryItem', c.inventoryItemId),
          locationId: gid('Location', c.locationId),
          delta: Number(c.delta),
        })),
      },
    },
    'inventoryAdjustQuantities',
  );
}
