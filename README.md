# Sveltia CMS + Astro — Proof of Concept

A static product landing page site powered by [Astro](https://astro.build) with [Sveltia CMS](https://github.com/sveltia/sveltia-cms) for content management, deployed to [Cloudflare Pages](https://pages.cloudflare.com).

## Architecture

```
src/
  content/products/   ← Markdown content (managed via Sveltia CMS)
  layouts/            ← Astro layout components
  pages/              ← Route pages (index + dynamic product pages)
  styles/             ← Global CSS
public/
  admin/              ← Sveltia CMS admin UI + config
  images/             ← Static assets
scripts/
  bundle-sveltia.mjs  ← Copies Sveltia CMS from npm for self-hosted fallback
```

## Sveltia CMS Strategy

The admin page (`/admin/`) loads Sveltia CMS with a **CDN-first, self-hosted fallback** approach:

1. **Primary**: Loads from `unpkg.com` CDN (latest stable)
2. **Fallback**: If CDN fails (timeout after 8s, network error, or blocked), loads the self-hosted bundle

The self-hosted bundle is copied from `node_modules/@sveltia/cms/dist/` into `public/admin/` during every build via `scripts/bundle-sveltia.mjs`. This ensures the fallback is always the version pinned in `package.json`.

## Local Development

```bash
npm install
npm run dev       # starts Astro dev server at http://localhost:4321
```

The CMS admin is available at `http://localhost:4321/admin/`.

> **Note**: Sveltia CMS requires GitHub OAuth for authentication. For local development, you may need to configure a [local auth proxy](https://github.com/sveltia/sveltia-cms#authentication) or use the Sveltia CMS companion browser extension.

## Deployment

### Prerequisites

1. Create a Cloudflare Pages project named `sveltia-astro-poc`
2. Add these GitHub repository secrets:
   - `CLOUDFLARE_API_TOKEN` — API token with Pages edit permissions
   - `CLOUDFLARE_ACCOUNT_ID` — Your Cloudflare account ID

### How it works

The GitHub Actions workflow (`.github/workflows/deploy.yml`):

- **On push to `main`**: Builds and deploys to production
- **On pull request**: Builds and creates a preview deployment

The build step:
1. Runs `scripts/bundle-sveltia.mjs` to copy the Sveltia CMS bundle into `public/admin/`
2. Runs `astro build` to generate static HTML into `dist/`
3. Deploys `dist/` to Cloudflare Pages via Wrangler

## Adding Content

1. Go to `/admin/` and authenticate with GitHub
2. Create or edit products — the CMS writes Markdown files to `src/content/products/`
3. Commit via the CMS triggers a rebuild and deploy
