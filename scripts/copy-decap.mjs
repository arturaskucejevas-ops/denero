// Copies the Decap CMS bundle from node_modules into public/admin/cms so the
// admin panel is self-hosted (no third-party CDN, strict CSP possible).
import { cpSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const src = 'node_modules/decap-cms/dist';
const dest = 'public/admin/cms';
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
for (const f of readdirSync(src)) {
  if (f.endsWith('decap-cms.js')) cpSync(join(src, f), join(dest, f));
}
console.log('Decap CMS copied to', dest);
