/**
 * bundle-sveltia.mjs
 *
 * Copies the Sveltia CMS production bundle from node_modules into public/admin/
 * so it can be served as a self-hosted fallback (the CDN version is tried first
 * in production). This runs as part of the build step.
 */
import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const src = resolve(root, "node_modules/@sveltia/cms/dist/sveltia-cms.js");
const dest = resolve(root, "public/admin/sveltia-cms.js");

const srcMap = src + ".map";
const destMap = dest + ".map";

if (!existsSync(src)) {
  console.error(
    "[bundle-sveltia] @sveltia/cms not found in node_modules. Run npm install first."
  );
  process.exit(1);
}

mkdirSync(dirname(dest), { recursive: true });

copyFileSync(src, dest);
console.log(`[bundle-sveltia] Copied sveltia-cms.js → public/admin/`);

if (existsSync(srcMap)) {
  copyFileSync(srcMap, destMap);
  console.log(`[bundle-sveltia] Copied sveltia-cms.js.map → public/admin/`);
}
