# Mathinking

A React/Vite AMC 8 learning site with guided lessons, visual explanations, a problem archive, and browser-local practice progress. Production hosting remains static on Vercel.

## Development and verification

Run from this `Source` directory with the existing lockfile and a Node version supported by the installed Vite release:

```bash
npm ci
npm run dev
```

For production-like local review:

```bash
npm run build
npm run validate:seo
npm run qa:seo
npm run validate:learn
npm run qa:lesson -- C1
npm run preview
```

The static preview listens at `http://127.0.0.1:4173`. Browser QA requires Chrome/Chromium; set `CHROME_PATH` if needed. Development mode provides page data through Vite middleware; it does not reproduce production HTTP status/redirect behavior.

Run `npm run qa:seo:preview` to check both preview noindex and production indexing in Chrome. It rebuilds locally, runs the SEO/archive regression suite in each mode, and restores production-mode output. It does not deploy anything. Stop any separately running local preview server before this command so the tests can start their own server with the correct build mode.

## SEO and publication

The build renders public React content to HTML, then emits page data for hydration, selected interaction payloads, sitemap, robots, and a 404 document. Do not restore an all-paths rewrite to the homepage.

- `src/seo/site.ts`: Mathinking identity, preferred www origin, query policy.
- `src/seo/catalog.server.ts`: build-only content catalog and URL inventory.
- `src/seo/content-overrides.json`: explicit problem publication pilot, diagram descriptions, and lesson recaps.
- `src/pages/PublicContentPage.tsx`: shared public content and interaction boundaries.
- `tools/build-site.mjs`, `validate-seo.mjs`, `qa-seo.mjs`: generation and checks.
- `vercel.json`: clean URLs, permanent aliases, and functional-query noindex headers.

Existing 50 lessons remain available. Standalone problem pages are limited to the reviewed 25-problem pilot; all other problems remain usable in the bank. Content authoring stays in the existing curriculum/lesson/problem records. Preserve attribution and review rights before adding content.

Preview builds with `VERCEL_ENV=preview` are noindex; production builds use the indexable catalog. Generated reports/screenshots under `.seo-build/` and output under `dist/` are not source files.

See the [SEO audit and marketing plan](docs/seo-marketing-plan.md), [technical specification](docs/seo-technical-spec.md), and [implementation results / release checklist](docs/seo-implementation.md). The latter records the existing N4 font-size QA failure and other release limitations. Production deployment and search-account actions are pending review.
