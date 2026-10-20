# Kamba pre-launch website plan

## Product and delivery scope

Create the public, pre-launch Kamba marketing site in `kamba-website/` inside the existing private repository `MyVendor-Global-Ltd/kamba-frontend`. Keep the current Expo Android app and its EAS configuration untouched. Use React + Vite and produce a static `dist/` build that can be deployed on either Vercel or Netlify; add deployment configuration for both, but do not publish without an explicit host/domain decision.

The four custom website visuals are already generated with Manus after the connected Higgsfield service declined generation on the current plan. The approved substitutes are stored as optimized WebP in `public/images/`: glossy emerald shopping bag for the hero, market vignette for the marketplace story, phone mockup for the app reveal, and buyer/seller connection nodes for the location story.

## Research applied

The ten website references, Pinterest candidate pins, source limitations, Playwright viewport-step screenshots and capture manifest are documented in [`docs/design-references.md`](docs/design-references.md). The live Velwax domain did not resolve, Linear's first hero screenshot was blank, Pinterest was partially gated, and several WebGL behaviors could not be directly verified. Those effects will therefore be implemented from the user's supplied specification rather than claimed as copied observations. Preserve all reference screenshots under `docs/design-references/screenshots/`.

## Design system

- **Design movement:** cinematic Nigerian marketplace product storytelling with a restrained dark-premium and tactile 3D influence.
- **Core principles:** credible over inflated claims; local commerce made concrete; motion explains rather than decorates; touch performance and reduced-motion behavior are first-class.
- **Color philosophy:** use the brief's deep-space background `#04070a`/`#060c10`, surfaces `#0a1520`/`#0f1f2e`, signature emerald `#2DB845`/`#1A6B2A`, warm accent `#F5A623` and layered whites. Emerald signals local opportunity; gold is a sparing highlight, not a status claim.
- **Layout paradigm:** full-screen editorial narrative, six horizontal/pinned story moments on capable desktop devices, then a differentiated 12-column feature composition; stack into a readable single-column phone experience.
- **Signature elements:** thin green-to-gold scroll line; glossy emerald bag/product silhouette; spotlight moments that focus attention on one clear action.
- **Interaction philosophy:** use direct labels and large touchable actions; magnetic pointer effects only for fine pointers; keyboard, touch and screen-reader paths remain complete without hover.
- **Animation:** GSAP ScrollTrigger for story transitions; Lenis smooth-scroll only where supported; spring-like hover/tap feedback; load 3D modules after the relevant section enters view. On mobile, replace the particle grid with a static gradient and skip heavyweight 3D. Use Framer Motion's `useReducedMotion()`/the system setting to remove nonessential motion. Keep page reading and form submission usable if animation libraries fail.
- **Typography system:** Clash Display bold for major headings, Cabinet Grotesk for body text and JetBrains Mono for compact metadata, using the supplied scale, tight tracking and generous spacing. Self-host fonts where available to avoid blocking content on an external font request.
- **Brand essence:** a Nigeria-first marketplace connecting buyers with nearby student and neighbourhood sellers; direct, optimistic and grounded.
- **Brand voice:** concise, confident and locally specific. Example headline: “Your store. Your customers. Your area.” Example supporting line: “Find the shops and sellers already around you.”
- **Wordmark and logo:** create a compact geometric K/market-pin SVG mark and a readable Kamba wordmark; do not rely on generated text or emoji.
- **Signature brand color:** emerald `#2DB845`.

## Application structure

```text
kamba-website/
  public/
    images/                 # Four optimized WebP originals
    manus-routes.json       # One public route: /
    robots.txt              # Crawl policy; sitemap URL added at build when origin exists
  scripts/
    prerender.mjs           # Static React render for crawler-visible HTML
    generate-seo.mjs        # Canonical, hreflang, JSON-LD, sitemap and robots from real site URL
  src/
    components/
      3d/                   # Lazy desktop globe, bag motion, particles and connection scene
      cursor/               # Fine-pointer-only magnetic cursor
      sections/             # Hero, globe/story, six pain panels, game, features, app and CTA
      ui/                   # Buttons, image blur-up, headings, progress and loader
    hooks/                  # Pointer, reduced motion, viewport and scroll progress
    styles/                 # Palette, type, layout and responsive/reduced-motion rules
    App.jsx
    main.jsx
  index.html                # Semantic metadata and static render insertion point
  vite.config.js
  vercel.json
  netlify.toml
  .env.example
  package.json / package-lock.json
  plan.md / TODO.md
```

The build will prerender the single public route from React so meaningful page content exists in the initial HTML. URL-dependent SEO fields must be derived from a real `VITE_SITE_URL` (or the Vercel/Netlify-provided canonical URL). Do not guess a production domain. Until the owner supplies or confirms one, local output must omit invalid absolute canonical/social/sitemap URLs and the site must not be treated as production SEO-complete.

## Experience behavior

The first screen uses the specified launch label, staggered “Your store. Your customers. Your area.” headline, concise Nigerian marketplace copy, primary waitlist CTA, secondary how-it-works action and generated emerald bag artwork. Use small floating benefit callouts, not fabricated sales, signup or vendor counters. The next story introduces Umuahia, Aba, Lagos and Port Harcourt through an animated globe/connection visual on desktop and a static mobile treatment. Six contrasting panels translate the supplied pain points into a scroll-led narrative.

The four-round vendor game keeps the exact round names, questions and options from the brief. Each answer advances state, gives the mascot a matching reaction and produces a personalized vendor-type result; the Flip round includes the pricing tokens, dramatic “we're not charging any of that” reveal and a brief confetti/flash transition. The mascot is an original SVG/DOM character with accessible state labels and lightweight pupil tracking; pointer-only behavior is optional.

The feature story demonstrates local discovery, a planned storefront, a conceptual payment flow and the difference between a post that disappears and a durable shop page. A phone reveal uses the generated phone image and safe, illustrative UI; App Store and Google Play actions say “Coming Soon”. The closing CTA offers the requested email input and shape-morph success state only after a configured endpoint confirms submission. With no endpoint, it validates locally, explains that details were not sent and never claims that a place was reserved.

The first-page loader draws the Kamba SVG mark and fills a progress line for at least 1.5 seconds, then fades; lazy 3D scenes use local section loading states rather than holding the entire site hostage. The four WebP visuals use `loading=lazy` where appropriate and a blur-up transition.

## Dependencies and compatibility

Use React, Vite, Framer Motion, GSAP/`@gsap/react` with ScrollTrigger, Lenis, and the requested React Three Fiber/Three.js ecosystem only where the result benefits from it. Keep Three.js/Drei/postprocessing out of the initial client chunk and import only after an in-view desktop scene requests them. Prefer the maintained `lenis` API; do not install a redundant or abandoned React wrapper if its API conflicts. Attempt the public GSAP ScrollSmoother export; if it is unavailable or requires a separately licensed bundle, use Lenis + ScrollTrigger for the requested smooth/scroll-linked behavior and document that adaptation. Pin npm in `packageManager`, commit the lockfile, and use one Node-compatible Vite toolchain isolated from the root Expo app.

## Serving and release boundaries

Use the existing WebDev Preview resource only as a development preview surface on port 3000; its canonical repository is the Manus-managed repo, not the user's GitHub. Keep the source of truth in `MyVendor-Global-Ltd/kamba-frontend`, make and validate changes under `kamba-website/`, and do not switch the WebDev project's canonical repository. Do not publish to the WebDev managed host. Use Vite's relative asset paths so the app works in Preview and on Vercel/Netlify. Build output is `kamba-website/dist/` and is not committed. The actual public hostname and waitlist endpoint remain owner-provided production inputs.
