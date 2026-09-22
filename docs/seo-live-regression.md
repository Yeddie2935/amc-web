# Post-merge SEO regression check

Date: September 22, 2026. Target: https://www.mathinking.org. The owner merged PR #10; public responses identify Vercel as the server. These are actual deployed-site checks, not only the local static preview. No Vercel login was necessary for public HTTP/browser verification, and no deployment/account/domain settings were changed.

## Deployed site results

- All 85 catalog URLs return 200 with the expected title, one H1 and main landmark, self-canonical www URL, matching Open Graph/Twitter metadata, and correct production robots directives. Dashboard remains noindex. Lesson overviews and problem solutions are present in raw HTML; JSON-LD parses successfully.
- The live sitemap contains the expected 84 URLs, and robots.txt advertises the canonical sitemap without blocking the entire site.
- Missing lessons, problems, years, routes, and images return 404. Lowercase lesson URLs, trailing slashes, `.html` URLs, and index aliases permanently redirect to the expected clean URL while preserving query parameters.
- Functional-query noindex headers, interaction JSON noindex, tracking-only query behavior, and favicon/social image MIME types pass.
- The live browser suite passes hydration, JavaScript-disabled written content, answer/bookmark/progress preservation, search and practice filters, six lesson startup checks, and mobile layout checks.
- Full guided-lesson flows against the deployed site pass for C1 (16/16 beats), C5 (18/18), and G4 (12/12), on both desktop and mobile, including retry behavior. These runs report zero console errors and zero document overflow.
- Blocking a lesson JSON download leaves the public heading/overview available; retry recovers the activity.
- Archive switching and all four original animation steps pass for 2022 Problem 3 and 2020 Problem 17, including final answer labels, backward navigation, and hiding the player. No original scene or animation-data files were changed.

One hosting follow-up remains: `https://mathinking.org/` returns **307** to the correct `https://www.mathinking.org/` URL. The target is consistent with canonical metadata, but a permanent 301/308 is preferable for this permanent host choice. Review the existing Vercel domain redirect setting separately; the repository rule has not overridden it. This is not a broken destination or a reason to alter animations.

The previously documented N4 full-flow font-size test failure remains a known pre-existing issue. Successful startup/archive checks do not mean that its strict full-flow readability gate now passes. Search Console indexing and actual field Core Web Vitals were not checked.

## Homepage equation: confirmed and fixed locally

The deployed “900 − 729 = 171” preview uses viewport-relative font sizes even when its card occupies only part of the viewport. At a 1440px viewport the text is 72px and extends outside the equation's padded content area. The same test also fails at 320px; the card's hidden overflow means a whole-document overflow test alone misses it.

The local fix changes only the C5 homepage preview CSS in `src/styles/homePage.css`: establish an inline-size container, scale the equation to its card using `cqw`, cap it at 42px, keep a 24px fallback, and remove the oversized mobile override. The grid uses shrinkable numeric tracks. Mathematics, lesson content, original animation scenes, and archive data are unchanged.

| Viewport | Deployed font | Local fixed font | Local fit |
| --- | ---: | ---: | --- |
| 320px | 35.2px | 24px | Pass |
| 390px | 42.9px | 24.96px | Pass |
| 1041px | 52.05px | 31.955px | Pass |
| 1440px | 72px | 38.521px | Pass |

Nine widths are checked: 320, 375, 390, 620, 768, 1024, 1041, 1280, and 1440px. Screenshots at 390, 1041, and 1440px were visually reviewed. The build and local SEO/browser suite pass with the fix. It has **not** been committed, pushed, or deployed by the assistant.

## Reproducing checks

From `Source`:

```bash
npm run build
npm run qa:seo
node tools/audit-live-seo.mjs
```

For the complete browser suite against production:

```bash
SEO_QA_BASE_URL=https://www.mathinking.org npm run qa:seo
```

Until the homepage fix is deployed, that last command is expected to fail the newly added equation-size regression after completing the earlier checks. This is the reproduced production bug, not an archive-animation regression. After deployment it should pass the added check too.

Artifacts under ignored `.seo-build/`: `live-seo-results.json`, `qa-results.json`, `home-equation-measurements.json`, and `home-equation-{390,1041,1440}.png`. Rebuilds replace this directory, so run the live audit after the final build to retain its report. `tools/audit-live-seo.mjs` limits concurrent public requests to four.
