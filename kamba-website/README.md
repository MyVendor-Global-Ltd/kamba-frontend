# Kamba pre-launch website

This is the public-facing React + Vite website, isolated under `kamba-website/` so the Expo app and its Android build configuration remain at the repository root. The repository is proprietary; see the repository-level `LICENSE`.

## Local development

Use Node.js 22.13 or newer and npm 10.9.2, as pinned in `package.json`:

```bash
cd kamba-website
npm ci
npm run dev
```

The development server uses port `3000`. To produce and inspect a static build:

```bash
npm run lint
npm run build
npm run preview
```

The build prerenders the React page into `dist/index.html`; the final site is static and the Three.js canvas chunks remain lazy. The SEO script uses Node rendering rather than a browser-based prerender pass.

## Environment and launch blockers

`VITE_SITE_URL` must be set to the real bare HTTPS public origin before an indexable production release. It generates canonical, `en-NG` alternate, Open Graph and social-image URLs, production `robots.txt`, and `sitemap.xml`. Local and deploy-preview builds without a confirmed production origin intentionally omit guessed absolute URLs and emit `noindex,nofollow` plus `Disallow: /`. A Vercel or Netlify production origin is used only when its platform variables identify a production context. See `.env.example`.

The waitlist endpoint is **not connected**. Until `VITE_WAITLIST_ENDPOINT` is supplied, the form validates the inputs, explains that no details were sent, and does not persist personal information or claim that a place was reserved. A configured endpoint must accept `POST` JSON with `email`, optional `phone`, `source` and optional `vendorType`, use an appropriate consent/privacy policy and return a successful 2xx response only after it has actually accepted the submission. Do not place private credentials in `VITE_*` browser variables.

App Store and Google Play availability, payment processing, seller verification and usage statistics are not live; the page labels planned/illustrative content and does not claim these capabilities exist.

## Deployment

**Netlify:** keep the repository root as the base; `netlify.toml` builds from `kamba-website/` and publishes `dist/`.

**Vercel:** keep the repository root as the project root; `vercel.json` runs the site package build and serves only `kamba-website/dist`.

Before indexing the public site, configure the actual domain in the host and verify the generated page head, `robots.txt`, `sitemap.xml`, social preview image and real waitlist API. The website has not been published from this repository yet.
