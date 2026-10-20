import { readFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadEnv } from 'vite';

const dist = resolve(process.cwd(), 'dist');
const htmlPath = resolve(dist, 'index.html');
const viteEnv = loadEnv(process.env.MODE || 'production', process.cwd(), 'VITE_');
const imagePath = '/images/emerald-market-bag.webp';
const isPreview = process.env.VERCEL_ENV === 'preview'
  || ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT ?? '');
const isProduction = process.env.VERCEL_ENV === 'production' || process.env.CONTEXT === 'production';
const rawOrigin = process.env.VITE_SITE_URL || viteEnv.VITE_SITE_URL
  || (isPreview ? '' : process.env.VERCEL_PROJECT_PRODUCTION_URL)
  || (isPreview ? '' : process.env.URL)
  || (!isPreview ? process.env.VERCEL_URL : '')
  || (!isPreview ? process.env.DEPLOY_PRIME_URL : '');

function normalizeOrigin(value) {
  if (!value) return '';
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  const url = new URL(candidate);
  if (url.protocol !== 'https:') throw new Error('VITE_SITE_URL must use HTTPS.');
  if (url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('VITE_SITE_URL must be a bare HTTPS origin without credentials, path, query or fragment.');
  }
  return url.origin;
}

const origin = normalizeOrigin(rawOrigin);
if (isProduction && !origin) {
  throw new Error('Set the real VITE_SITE_URL or a production hosting URL before building the production site.');
}
const noindex = isPreview || !origin;
let html = await readFile(htmlPath, 'utf8');
const dynamicTags = [];
if (origin && !isPreview) {
  const canonical = `${origin}/`;
  const image = `${origin}${imagePath}`;
  dynamicTags.push(
    `<link rel="canonical" href="${canonical}" />`,
    `<link rel="alternate" hreflang="en-NG" href="${canonical}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    '<meta name="robots" content="index,follow,max-image-preview:large" />',
  );
} else {
  dynamicTags.push('<meta name="robots" content="noindex,nofollow" />');
}

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kamba',
  ...(origin && !isPreview ? { url: `${origin}/`, logo: `${origin}/brand-mark.svg` } : {}),
};
const software = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Kamba',
  applicationCategory: 'ShoppingApplication',
  operatingSystem: 'Android',
  description: 'A pre-launch local marketplace concept for discovering student and neighborhood sellers in Nigeria.',
  ...(origin && !isPreview ? { url: `${origin}/` } : {}),
};
const faq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Kamba?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kamba is a pre-launch marketplace concept designed to help buyers discover nearby Nigerian sellers and give vendors a dedicated store page.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Kamba app available to download?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not yet. The app is in pre-launch and its App Store and Google Play links will be announced when it is available.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I sign up for the Kamba waitlist?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: process.env.VITE_WAITLIST_ENDPOINT || viteEnv.VITE_WAITLIST_ENDPOINT
          ? 'Use the waitlist form on this page to send your details.'
          : 'The waitlist form is displayed, but no submission endpoint is configured yet, so details are not currently collected.',
      },
    },
  ],
};
for (const schema of [organization, software, faq]) {
  dynamicTags.push(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
}
if (!html.includes('<!-- SEO_DYNAMIC -->')) throw new Error('Missing SEO_DYNAMIC placeholder in index.html.');
html = html.replace('<!-- SEO_DYNAMIC -->', dynamicTags.join('\n    '));
await writeFile(htmlPath, html);

const robots = noindex
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\nDisallow: /api/*\nSitemap: ${origin}/sitemap.xml\n`;
await writeFile(resolve(dist, 'robots.txt'), robots);
const sitemapPath = resolve(dist, 'sitemap.xml');
if (origin && !isPreview) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`;
  await writeFile(sitemapPath, sitemap);
} else {
  await rm(sitemapPath, { force: true });
}
console.log(origin && !isPreview
  ? `SEO origin configured for ${origin}.`
  : 'Local/preview build is noindex; absolute canonical/social/sitemap URLs are intentionally omitted.');
