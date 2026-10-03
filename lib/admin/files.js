import { readFileSync } from 'node:fs';
import { basename, extname } from 'node:path';
import { mutate } from '../shopify.js';

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif' };

/** Upload a local file to Shopify's staging area; returns a resourceUrl usable as originalSource. */
export async function stageUpload(path, filename = basename(path)) {
  const buf = readFileSync(path);
  const mimeType = MIME[extname(filename).toLowerCase()] || 'application/octet-stream';
  const { stagedTargets } = await mutate(
    `mutation($i:[StagedUploadInput!]!){stagedUploadsCreate(input:$i){stagedTargets{url resourceUrl parameters{name value}} userErrors{field message}}}`,
    { i: [{ filename, mimeType, resource: 'IMAGE', httpMethod: 'POST', fileSize: String(buf.length) }] },
    'stagedUploadsCreate',
  );
  const t = stagedTargets[0];
  const form = new FormData();
  for (const p of t.parameters) form.append(p.name, p.value);
  form.append('file', new Blob([buf], { type: mimeType }), filename);
  const res = await fetch(t.url, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Staged upload failed: HTTP ${res.status}`);
  return t.resourceUrl;
}
