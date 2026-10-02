import { gql } from '../shopify.js';

export async function shopInfo() {
  const data = await gql(`{
    shop { name myshopifyDomain primaryDomain { url } currencyCode plan { displayName } }
    currentAppInstallation { accessScopes { handle } }
  }`);
  return { ...data.shop, scopes: data.currentAppInstallation.accessScopes.map((s) => s.handle) };
}

export async function listLocations() {
  const data = await gql(`{ locations(first: 50) { nodes { id name isActive } } }`);
  return data.locations.nodes;
}
