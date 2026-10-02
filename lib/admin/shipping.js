import { gql, mutate } from '../shopify.js';

export async function listDeliveryProfiles() {
  const d = await gql(`{ deliveryProfiles(first: 20) { nodes { id name default
    profileLocationGroups { locationGroup { id } locationGroupZones(first: 50) { nodes {
      zone { id name countries { code { countryCode } } }
      methodDefinitions(first: 50) { nodes { id name active rateProvider { ... on DeliveryRateDefinition { id price { amount currencyCode } } } } }
    } } }
  } } }`);
  return d.deliveryProfiles.nodes;
}

/**
 * Low-level profile update. `profile` is a DeliveryProfileInput, e.g. to add a zone to a location group:
 * { locationGroupsToUpdate: [{ id, zonesToCreate: [{ name, countries: [{ code: "CA", includeAllProvinces: true }],
 *   methodDefinitionsToCreate: [{ name: "Standard", active: true, rateDefinition: { price: { amount: "9.99", currencyCode: "USD" } } }] }] }] }
 */
export async function updateDeliveryProfile(id, profile) {
  const { profile: out } = await mutate(
    `mutation($id: ID!, $profile: DeliveryProfileInput!) {
      deliveryProfileUpdate(id: $id, profile: $profile) { profile { id name } userErrors { field message } }
    }`,
    { id, profile },
    'deliveryProfileUpdate',
  );
  return out;
}

/** Convenience: add a flat-rate zone to the default profile's first location group. */
export async function addFlatRateZone({ name, countries, rateName = 'Standard', amount, currencyCode = 'USD' }) {
  const profiles = await listDeliveryProfiles();
  const def = profiles.find((p) => p.default);
  const groupId = def.profileLocationGroups[0].locationGroup.id;
  return updateDeliveryProfile(def.id, {
    locationGroupsToUpdate: [{
      id: groupId,
      zonesToCreate: [{
        name,
        countries: countries.map((code) => ({ code, includeAllProvinces: true })),
        methodDefinitionsToCreate: [{ name: rateName, active: true, rateDefinition: { price: { amount: String(amount), currencyCode } } }],
      }],
    }],
  });
}
