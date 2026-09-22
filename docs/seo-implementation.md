# SEO implementation and release review

September 22, 2026. Baseline: `2cba8fc`. Implements the [technical specification](seo-technical-spec.md) and [marketing plan](seo-marketing-plan.md). Changes are local and uncommitted; no production deployment, account changes, or outreach has been performed.

Owner constraint: preserve original shared animation scenes and problem animation data so archive behavior cannot be changed by a lesson/SEO adjustment. The attempted FactorTripleScene font-size edit was undone; no shared animation scene or bank-data changes remain. Any later lesson readability work must be isolated to lesson presentation and separately checked against archive behavior. The existing N4 font-size gate remains unresolved; do not weaken the test or silently modify a shared scene to clear it.

## What is implemented

React/Vite/Vercel remain in place, with no database, runtime rendering server, CMS, dependency upgrade, or progress-storage migration. The build now produces educational HTML, then hydrates the same React tree. Interactive tools load separately; selected lessons receive only their own beats and referenced problems. Internal generation and artifact-validation records are excluded from lesson interaction payloads.

The production build emits 85 catalog pages plus a separate 404 document:

| Pages | Count | Index policy |
| --- | ---: | --- |
| Existing root pages | 8 | All except dashboard |
| Existing lessons | 50 | Indexable; original editorial status unchanged |
| Dedicated problem pilot | 25 | Indexable |
| Year hubs: 1999 and 2026 | 2 | Indexable |
| Missing-page document | Separate | Noindex; no canonical |

The sitemap contains 84 URLs. It is generated from the same catalog as the HTML; dashboard and functional query variants are excluded. Robots permits crawling so noindex directives can be read. Preview builds (`VERCEL_ENV=preview`) emit noindex metadata and page data for every page, an empty sitemap, and no sitemap advertisement. The final local build is production-mode, not preview-mode.

Metadata uses `https://www.mathinking.org` consistently, with page-specific titles/descriptions/canonicals, Open Graph/Twitter tags, WebSite or visible-breadcrumb structured data, a real 1200×630 preview PNG, and SVG/ICO favicons. No fabricated credentials, ratings, or course claims were added.

Public content includes lesson objectives, prerequisites, six worked recaps, related practice links, native expandable written solutions, and crawlable year/problem directories. All pilot diagrams have reviewed descriptions and intrinsic image dimensions. Homepage positioning and its existing teaching method are preserved.

Search deep links now read `q`, `problem`, `year`, `category`, `difficulty`, and `status`, with invalid-filter guidance. Existing practice skill/category aliases and difficulty links continue to work. Session launch now respects the selected difficulty. Saved progress still uses `fmj-amc8-progress-v2`.

## Problem publication review

The pilot is explicitly listed in `src/seo/content-overrides.json`: 1999 problems 1–3, and 2026 problems 1–11, 13–14, 16, and 18–25. This is an implementation-time AI review of existing statements, choices, written reasoning, and all referenced pilot diagrams—not independent human/editorial approval or a new licensing determination. Owner review is still required before release. Existing attribution is retained; original bank records and animations were not rewritten.

Mathematical spot-check reasoning used for the complete pilot:

| Problem | Answer | Check |
| --- | --- | --- |
| 1999/1 | A: division | 6÷3 + 4 − 1 = 5 |
| 1999/2 | C: 60° | Two hour intervals, each 30°; existing illustration is a clock face without hands |
| 1999/3 | D | 1.1 − 2.1 + 1 = 0, not 1 |
| 2026/1 | A: 18 | Triple groups contribute 0, 3, 6, 9 |
| 2026/2 | C: 53 | 20 ones + 12 twos + 3 threes |
| 2026/3 | D | Perimeters 30, 24, 24; wire length 24 |
| 2026/4 | E: 120% | 0.8 × 1.5 = 1.2 |
| 2026/5 | B: 30 min | 3 − 100/40 = 0.5 hours |
| 2026/6 | E: 2/5 | Reachable area (80 − 48)/80 |
| 2026/7 | C: 50 | 40/(1/2 + 3/10) |
| 2026/8 | D: 50 | 74/100 reduces to 37/50 |
| 2026/9 | B: 2/3 | Nested radicals give 12/18 |
| 2026/10 | A: Luke | Relative finish times: 0, 3, 5, 9, 11 |
| 2026/11 | B: 6π | Quarter-circle radii sum to 12 |
| 2026/13 | A: 10 | Square side displacement (3,1), squared length 10 |
| 2026/14 | B: 75 | Middle integer 25; all three sum to 75 |
| 2026/16 | D: 3/5 | Final even digit 0, 4, or 8 makes the even tens suffix divisible by four |
| 2026/18 | B: 2 | Valid runs: 29+31 and 5+7+9+11+13+15 |
| 2026/19 | D: 1/3 | 5x = 2L − x |
| 2026/20 | D: 13 | Ordered thickness compositions: 1 + 6 + 6 |
| 2026/21 | B: 1/4 | Outer probability: 1 → 0 → 1/2 → 1/4 |
| 2026/22 | A: 9 | Nine distinct values required below/equal to median; written construction achieves bound |
| 2026/23 | C: 20 + 4π | Center-hull perimeter 20 plus total curved length 4π |
| 2026/24 | E: 171 | Contributions 45+38+31+24+17+10+3, plus 3 for the extra seven at 49 |
| 2026/25 | E: 8 | Sorted positive corner-cut triples with pair sums at most five |

2026 problems 12, 15, and 17 remain bank-only because their current written reasoning needs more justification before dedicated publication. Other years were not reviewed for this pilot. Non-pilot items remain reachable through the existing bank and year filters; no new placeholder solution URLs are emitted.

## Verification and limitations

- `npm run build`: passes HTML, route, sitemap, metadata, local-image, icon, and redirect-inventory validation. Production: 85 pages / 84 sitemap entries. Preview-mode build: 85 pages / zero entries.
- `npm run qa:seo`: passes production-output HTTP checks, hydration, JavaScript-disabled written content, answer/bookmark/animation controls, stored-progress preservation, filter deep links, six lesson startup checks, and 390px mobile checks. Screenshots were visually inspected.
- Expanded release checks now visit all 85 catalog URLs, verify clean/lowercase/index aliases with query preservation, every functional-query header, social-asset MIME types, and metadata parity. A missing root `/index` alias was added. Local preview reads the generated query policy rather than maintaining a separate copy; build validation checks that Vercel's conditional headers match it.
- Archive regressions pass for 2022 Problem 3 and 2020 Problem 17: switching years/problems, all four original animation steps, final answer labels, backward navigation, and closing the player. Original scene and bank-data files are unchanged. SEO section spacing is now limited to top-level public sections instead of reaching into nested interactive content.
- `npm run qa:seo:preview`: passes the complete browser suite against preview-mode output, then rebuilds and checks production-mode output. Preview noindex survives hydration; production remains indexable. Both runs also simulate a failed lesson JSON download, verify that the public overview remains available, and confirm that retry recovers the activity. The command restores production output in a `finally` block if a preview check fails.
- `npm run validate:learn`: passes all 50 curriculum nodes, mappings, lesson specs, and 289 generated artifacts. Existing draft practice-count warnings remain for C4–C7.
- Full `qa:lesson` desktop/mobile flows pass for C1 (16 beats), C5 (18), F1 (9), C4 (17), and G4 (12), with retry behavior, no console errors, and no overflow.
- **N4 full lesson QA fails** at `authentic-factor-triples`: the existing `FactorTripleScene` renders token text at 6.5 × 1.35 = 8.775px, below the test's 9px minimum. Both values exist unchanged at baseline HEAD. N4 startup/hydration passes; its full-flow test is not a pass. Resolve or explicitly review this existing animation readability issue before production release. The test threshold was not weakened.
- Full TypeScript checking is not configured reliably in the baseline repository: React/Node declarations and a project type-check configuration are absent. Vite build success is not a substitute for a full type check.

Measured production entry JavaScript is approximately 278 KB raw / 87 KB gzip; main CSS is 48 KB raw / 10 KB gzip. Browser checks confirm homepage and Learn do not request the bank or scene library. The lazy full bank remains approximately 322 KB gzip and the scene library approximately 892 KB gzip. Individual scene splitting, actual Core Web Vitals, and field-performance measurements remain follow-up work; no Lighthouse score or ranking improvement is claimed.

Generated artifacts are ignored under `.seo-build/`: `report.json`, `qa-results.json`, `qa-preview-results.json`, and `mobile-{home,lesson,problem}.png`. Rebuilding replaces this directory, so rerun browser QA after the final build. The report records build mode and functional-query policy as well as page inventory.

## Implementation choices versus proposed filenames

`PublicContentPage.tsx` shares the lesson/year/problem/utility/404 layout instead of separate near-identical page files; breadcrumbs live there. Pure path normalization lives in `site.ts`, while the build catalog resolves records. `PageData` is a single optional-field interface rather than the proposed discriminated union. The obsolete `LessonPage` was removed and `usePageMeta` now accepts page data. The old prerender script and checked-in sitemap/robots files were replaced by build generation; Git can recover their previous versions.

Analytics page views remain enabled. Custom learning events are deferred until account-level availability is confirmed; no paid feature or external service was enabled. Search Console/Bing setup, creator/contact content, outreach, and production deployment remain separate owner/account tasks.

## Release checklist

1. Review local changes and the public pilot/recaps; resolve or accept the recorded N4 test issue. No production-ready claim is made while that gate remains open.
2. Run `npm run build`, `npm run validate:seo`, `npm run qa:seo`, and representative lesson QA. Use `npm run preview` to inspect generated HTML at `http://127.0.0.1:4173`; Vite development mode is not an HTTP SEO test.
3. Create a Vercel deployment preview after review. Confirm preview noindex, all supported routes, real missing-page/asset 404s, lowercase lesson and trailing-slash redirects, `.html` aliases, query preservation, and conditional `X-Robots-Tag` headers. Local preview emulates key policies but is not the Vercel edge router.
   The owner has authorized CLI setup, linking the existing project, and a preview deployment only. Vercel CLI 59.25.2 is available through `npx` without changing application dependencies. Browser authentication is pending; the project is not linked and nothing has been deployed. `.vercelignore` excludes local tooling, environment files, and review artifacts from upload. No hosting migration or alternative deployment service should be introduced.
4. Check Vercel domain settings: the audited apex redirect was 307 and may override repository configuration. Confirm permanent apex-to-www redirection and no redirect loop on the preferred host. Source-based redirect matching is case-sensitive according to [Vercel's configuration documentation](https://vercel.com/docs/project-configuration/vercel-json); still verify the actual preview before removing the production catch-all.
5. After owner approval, deploy production and repeat HTTP/raw-HTML/hydration checks. Verify production pages did not inherit preview noindex. Keep the previous deployment available for rollback; preserve newly published URLs if rollback becomes necessary later.
6. Submit `https://www.mathinking.org/sitemap.xml` through owner-controlled Search Console/Bing accounts, inspect representative URLs, and monitor selected canonicals, crawl errors, impressions, and clicks. No account baselines or submissions have been performed in this implementation.

## Publishing future content

Add or update the existing content record, review its mathematics, then update the explicit pilot ID list and review notes. Diagram-dependent publications require corresponding descriptions. Build validation rejects missing records, malformed paths, duplicate routes, missing diagram descriptions, and broken internal links. Related content and year hubs derive from the published inventory. For a new lesson ID, also add its lowercase alias to `vercel.json`; validation catches omissions. Never manually maintain a second sitemap or change an old lesson's status merely to alter search eligibility.
