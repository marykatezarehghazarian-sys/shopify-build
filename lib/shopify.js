import { config } from './clients.js';

export class ShopifyError extends Error {
  constructor(message, details) {
    super(message);
    this.details = details;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Run an Admin GraphQL query. Retries on throttling and 5xx with backoff.
 * Throws on top-level GraphQL errors.
 */
export async function gql(query, variables = {}, { retries = 5 } = {}) {
  const { domain, token, apiVersion } = config();
  const url = `https://${domain}/admin/api/${apiVersion}/graphql.json`;

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables }),
    });

    if ((res.status === 429 || res.status >= 500) && attempt < retries) {
      await sleep(Number(res.headers.get('retry-after') || 0) * 1000 || 500 * 2 ** attempt);
      continue;
    }
    if (!res.ok) throw new ShopifyError(`HTTP ${res.status} ${res.statusText}`, await res.text());

    const body = await res.json();
    const throttled = body.errors?.some((e) => e.extensions?.code === 'THROTTLED');
    if (throttled && attempt < retries) {
      const cost = body.extensions?.cost;
      const wait = cost
        ? Math.ceil((cost.requestedQueryCost - cost.throttleStatus.currentlyAvailable) / cost.throttleStatus.restoreRate) * 1000
        : 1000 * 2 ** attempt;
      await sleep(Math.max(wait, 500));
      continue;
    }
    if (body.errors?.length) throw new ShopifyError(body.errors.map((e) => e.message).join('; '), body.errors);
    return body.data;
  }
}

/** Run a mutation and throw if its payload has userErrors. Returns the payload. */
export async function mutate(query, variables, payloadKey) {
  const data = await gql(query, variables);
  const payload = data[payloadKey];
  const errs = payload?.userErrors;
  if (errs?.length) {
    throw new ShopifyError(errs.map((e) => `${(e.field || []).join('.')}: ${e.message}`).join('; '), errs);
  }
  return payload;
}

/** Iterate every node of a paginated connection. `path` points at the connection in the response. */
export async function* paginate(query, variables, path) {
  let after = null;
  do {
    const data = await gql(query, { ...variables, after });
    const conn = path.split('.').reduce((o, k) => o[k], data);
    for (const edge of conn.edges) yield edge.node;
    after = conn.pageInfo.hasNextPage ? conn.pageInfo.endCursor : null;
  } while (after);
}

/** Accept a numeric id or a full gid and return a gid. */
export function gid(type, id) {
  return String(id).startsWith('gid://') ? String(id) : `gid://shopify/${type}/${id}`;
}
