# Mathinking SEO audit and enhancement plan

Implementation companions: [SEO technical specification](seo-technical-spec.md) and [local implementation results / release checklist](seo-implementation.md).

Audit date: September 22, 2026. Scope: public production responses, selected JavaScript-rendered pages, the local React/Vite source, and current Google Search documentation. Findings below describe the pre-implementation baseline. The owner subsequently merged and deployed the SEO implementation; see the [post-merge live regression report](seo-live-regression.md) for current verification and the small homepage follow-up.

Source re-examined after the user's pull on September 22, 2026, at commit `2cba8fc` (`Merge pull request #9 from Yeddie2935/homepage-dual-lesson-showcase`). This revision incorporates the new homepage, lesson directory, practice navigation, and unified header/footer branding. Live measurements below are retained from the earlier same-day audit; they were not remeasured for this source-only revision.

## 1. Recommended direction

Make Mathinking's individual problems, visual explanations, and lessons into useful search entry pages. The existing SEO layer describes a small practice application, while the product now contains a much larger educational library.

The recommended positioning is **“Free AMC 8 lessons that make the reasoning visible, with visual solutions and focused practice.”** The updated homepage already expresses this through its headline, “Don't memorize the trick. See why it works,” and its five-stage method: Try → Notice → Name → Transfer → Practice. Preserve that message and the current homepage structure. Search titles and descriptions should explicitly mention AMC 8 lessons and practice, while lesson introductions and previews demonstrate how students discover the underlying ideas.

Treat lessons and exact-problem explanations as complementary search entry points. The curriculum provides a reason to return and progress; the archive answers specific problem searches. Animations support both. The SEO rewrite should expose this existing teaching experience rather than turn the homepage back into a generic problem-bank landing page.

Keep React, Vite, Vercel, the current content data, and the interactive learning experience. Add reliable public-page HTML at build time, consistent metadata, and dedicated content URLs. A framework migration, runtime rendering server, database, or CMS is unnecessary for this plan.

Metadata changes alone will not address the central problems: most problem content has no dedicated URL, initial HTML contains no educational content, and lesson canonicals identify the homepage instead of the lesson.

## 2. Evidence and important limits

The earlier checkout discrepancy is resolved by the pull. The current `LearnPage.tsx` now matches the previously observed production directory: “Explore all 50 lessons,” direct lesson links, six curriculum sections, core insights, prerequisite labels, and the browser title “Learn Competition Math — Mathinking.” Skill and difficulty navigation now lives on `/practice`. Header and footer both use Mathinking.

Compared with the previously inspected commit `a4c6f17`, the pull changes six files: homepage, Learn, Practice, header, footer, and homepage CSS. The SEO template/build script, metadata hook, routing, sitemap, robots file, lesson renderer, problem navigation, content data, and hosting rewrite are unchanged. Consequently the technical findings below still apply. A deployment-commit check remains a normal release check, not an outstanding source-sync blocker.

The initial HTML of that same live page still says “Learn AMC 8 Math — Fun Math Journey.” This confirms that the SEO build has fallen behind the product.

The audit did not access Google Search Console, Bing Webmaster Tools, or private analytics. Actual indexed-page counts, query demand, search impressions, click-through rates, conversions, and field Core Web Vitals remain unknown. Public search queries returned no results for the domain during this audit; that is not proof that Google has indexed zero pages. Headless Chrome observations are browser checks, not Googlebot URL Inspection results.

## 3. Strengths to bring into search and marketing

| Asset | Evidence | How to use it |
| --- | --- | --- |
| Substantial AMC 8 archive | The live bank reports 675 problems. The local exported bank contains 675 distinct problems: 27 years, 25 problems each, covering 1999–2020 and 2022–2026. | Year-specific pages and exact problem pages can answer precise searches. Generate public counts from the deployed data instead of maintaining marketing numbers manually. |
| Written explanations and visual solutions | All 675 local records contain solution steps and animation configurations. The player supports stepping, pausing, and replaying. | Lead with understanding through visual explanation. Publish the written reasoning alongside the interactive scene. Configuration coverage is not a completed quality review of every animation. |
| A real lesson curriculum | Both the updated source and sampled production directory link to 50 lessons, grouped into foundations, algebra, number theory, counting/probability, geometry, and problem-solving. The directory already displays core insights and prerequisite labels. | Preserve the directory and add substantive introductions and worked examples to individual lesson pages. All 50 lesson specifications remain marked `draft`; reconcile those labels with the public availability claim and actual review history instead of assuming the lessons are unpublished. |
| A demonstrated teaching method | The homepage now explains Try, Notice, Name, Transfer, and Practice; it shows complementary counting (C5) and divisor counting (N4) with mathematical reasoning and direct lesson links. | Build search descriptions, share cards, and educational posts around these real examples. Preserve their readable explanations in initial HTML. These homepage previews are HTML/CSS examples, not interactive animation players or videos. |
| Clear entry paths and curriculum navigation | The homepage links to starter lessons F1, C4, and G4 and to six section anchors in Learn. Its numerical statistics are derived from curriculum/problem data. | Reuse the existing starting guidance and links. Generate remaining hard-coded lesson counts from published content data. Section anchors are navigation within `/learn`, not separate indexable topic pages. |
| Structured learning information | Lesson data already includes core insights, objectives, prerequisites, and misconceptions. | Turn selected fields into learner-facing explanations and related links. Do not expose internal authoring notes such as validation instructions or `whyNow` text. |
| Low-friction practice | The source provides difficulty filters, hints, bookmarks, missed-question review, and browser-local progress. | Explain that students can start practicing directly and save progress on their current browser. Avoid implying account sync or a proven adaptive tutoring system. |
| Existing foundations | HTTPS, functioning robots and sitemap endpoints, seven sets of initial page metadata, navigation anchors, attribution, and Vercel Analytics are already present. | Extend these foundations and maintain the existing learning workflows. |

The primary audiences are students seeking either a concept or a specific explanation, parents looking for accessible AMC 8 preparation, and teachers or math-club leaders selecting material to share. The current “See why it works” promise should connect these audiences to the curriculum and its practice bank. The archive size supports that promise.

## 4. Findings, ranked by impact

P0 means an immediate correctness repair; P1 means core discoverability work; P2 means growth and refinement. Priorities are engineering judgments, not measured estimates of ranking improvement.

| Priority | Finding and evidence | Recommended response |
| --- | --- | --- |
| P0 | **Host signals conflict.** `https://mathinking.org/` returns a 307 redirect to `https://www.mathinking.org/`, but live canonical tags, structured data, Open Graph URLs, and sitemap URLs use the non-www host. | Default to the existing destination, `https://www.mathinking.org`, everywhere. Use a permanent 301/308 redirect from the alternate host, preserving path and query. Check Search Console's selected canonical before changing an established host preference. |
| P0 | **Lesson canonical is wrong even after rendering.** `/learn/C1` initially receives the homepage title and canonical. After JavaScript, its title becomes “Addition vs Multiplication — Fun Math Journey,” but its canonical remains the homepage. | Generate a self-canonical and lesson-specific metadata in the initial HTML. Keep browser metadata synchronized with the same page record. |
| P0 | **Preview image is broken.** `/og-image.png` returns HTTP 200 with `text/html`, not an image. `/favicon.ico` does too. | Add actual image assets and favicon declarations. Verify MIME type, dimensions, and successful decoding; HTTP 200 alone is insufficient. |
| P0 | **Missing URLs return the homepage with HTTP 200.** A deliberately nonexistent URL behaved this way. The source uses a catch-all rewrite and a homepage fallback. | Serve a useful 404 page with a real 404 response for unknown routes and missing assets. Preserve explicit supported routes and static-file precedence. |
| P1 | **“Prerendering” currently edits only the head.** `tools/prerender.mjs` copies the Vite HTML shell and changes metadata. Sampled live content pages have an empty `#root`, no headings, and no links before JavaScript. | Generate substantive public-page HTML during the build. Google can render JavaScript, so this is not a claim that the site is universally invisible; it is an avoidable dependency and limits non-rendering consumers. |
| P1 | **Individual problems and contest years lack dedicated routes in the inspected source.** Archive years and problem rows are buttons that change React state. | Add stable year and problem URLs and real links. Keep the practice workflow, but allow every promoted explanation to be loaded and shared directly. Confirm production routing before implementing. |
| P1 | **Important teaching content requires interaction.** The source mounts written solutions only after “Show solution.” The live C1 lesson initially exposes only its opening activity; it has no H1. | Add a useful lesson introduction and a readable explanation/example available without completing activities. On problem pages, render solution text in the HTML, optionally within native `<details>`. Preserve the interactive teaching sequence. |
| P1 | **The sitemap represents only seven application screens.** The live sitemap omits lessons and includes `/dashboard`. | Generate it from a reviewed public-content manifest, including lessons, problems, and year pages as they become ready. Exclude private/personal utility pages and unreviewed content. |
| P1 | **SEO metadata trails the completed visible rebrand.** Header, footer, homepage browser metadata, and Learn browser metadata now use Mathinking. `index.html`, every build-generated title, and browser metadata for lessons, practice, archive, problem bank, dashboard, and tips still use Fun Math Journey. | Extend the existing Mathinking identity to the remaining metadata and structured data through one shared source. No new branding decision or header/footer redesign is required. |
| P1 | **Structured search claims do not match the live behavior.** JSON-LD advertises `/problems?q=...`, but opening `/problems?q=geometry` still displays all 675 problems and selects an algebra problem. The local bank initializes default filters without reading `q`. Four Course objects all point to `/practice`. | Remove the unsupported SearchAction and the generic course block. Implement URL-based search if useful to users, independently of schema. Describe actual visible entities and pages. |
| P1 | **Large initial script.** The live homepage's main JavaScript asset transferred approximately 1.70 MB with compression in the original audit request. The pre-pull local build artifact was roughly 6.8 MiB; that is not a measurement of a fresh build at `2cba8fc`. Eager page/scene imports remain, and the new homepage imports the full problem bank to display its count. | Split public pages from practice, lesson, and animation code. Supply homepage counts as lightweight generated metadata and load the chosen scene/data when needed. Rebuild and measure mobile performance before setting precise bundle targets. These observations alone do not establish a Core Web Vitals failure. |
| P2 | **The major homepage/Learn copy cleanup is complete, with smaller gaps remaining.** The obsolete animation-template and “eventually contain” wording is gone. Practice still says “Practice mode should feel different from archive browsing,” and Problem Bank says “Designed for a large archive…”. Some counters say “loaded problems.” | Preserve the new homepage method, previews, and starting guidance. Replace remaining implementation-oriented wording with clear student benefits; use “AMC 8 problems” or “problems available.” |

Google's guidance supports providing meaningful rendered content and links with actual `href` destinations. Canonical declarations, redirects, and sitemap URLs should express the same preferred URLs. See [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), and [canonical consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).

## 5. Proposed public pages and search intent

These query examples are intent hypotheses, not keyword-volume research. Validate them with Search Console as pages earn impressions. Existing lesson URLs should remain stable; a descriptive title and page content matter more here than replacing `C1` with a slug.

| Page | Example search intent | Required content and next action |
| --- | --- | --- |
| `/` | free AMC 8 lessons; learn AMC 8 math; visual AMC 8 solutions | Preserve the current headline, five-stage method, C5/N4 previews, data-derived statistics, and starter links. Include these in initial HTML and align metadata with the lesson-led experience. |
| `/archive` | AMC 8 past problems and solutions | Year index with a short explanation of the archive and real links to each year. |
| `/archive/2026` — new | 2026 AMC 8 solutions | Contest-year overview and links to the available 25 problems; a focused practice action. Generate only years actually present. |
| `/problems/amc8-2026-01` — new | 2026 AMC 8 problem 1 solution | Problem identity and statement, diagram, answer, worked explanation, visual player, attribution, related lesson, and next problem. |
| `/learn` | AMC 8 math lessons | Preserve the existing 50-lesson directory and six strand sections. Add a concise “start here” route using the existing homepage suggestions; turn prerequisite IDs into useful lesson links where appropriate. |
| `/practice` | AMC 8 practice by topic and difficulty | Preserve the new skill-lane/difficulty directory and practice session flow; provide a stable, readable introduction and connect learners to relevant concept lessons. |
| `/learn/C1` — existing | addition vs multiplication counting; AMC 8 counting principle | One H1, concise concept introduction, prerequisites, objectives, an accessible worked example, lesson activity, and related problems. |
| `/topics/geometry` — new, later | AMC 8 geometry practice | Original topic explanation, relevant reviewed lessons, selected solved examples, and practice links. Start with four strong topics rather than every possible filter combination. |
| `/tips` | how to prepare for AMC 8 | Improve the existing guide with concrete lesson/problem links, realistic study options, authorship, review date, and authoritative references for contest facts. |
| `/about` — new, small | Mathinking; who creates these explanations | Purpose, real creator/reviewer information, approach to explanations, correction/contact route, and relationship to AMC/MAA. Do not invent credentials. |

Keep `/learn/C1` as the canonical lesson even if it appears under several topics. Use `/topics/...` for topic hubs so they do not collide with the current `/learn/:lessonId` route matcher. Match specific new routes before the existing broad `/problems` and `/archive` branches.

The curriculum's six strands already organize Learn, and the bank's skill categories now organize Practice. Preserve that distinction and add an explicit mapping when linking lessons to practice. “Foundations” and “Problem Solving” do not map one-to-one to the practice bank's “Other” and “Logic.” Avoid silently mixing the two taxonomies in titles or filters. Keep `/learn#learn-...` links working; new topic hubs are optional later additions and should offer more than a copy of those directory sections.

Each public problem page should link back to its contest year, to an applicable concept lesson, and to a small, relevant set of related problems. Each topic or lesson should link to its best illustrative problems. This supports discovery and gives visitors a useful next step.

## 6. What belongs in the rewritten SEO layer

Create a shared site configuration and page manifest, derived from the existing data plus a small editorial overlay. Each indexable record should contain: stable ID, public path, page type, title, description, canonical URL, index policy, social image, breadcrumb labels, content references, reviewed publication state, and a genuine content-modified date when available.

Use those records for initial HTML metadata, browser metadata, sitemap generation, internal links, and appropriate JSON-LD. Validate URL uniqueness and referenced content during the build. Escape text and JSON-LD safely. A content record must not automatically become indexable merely because it exists.

Suggested copy for review:

| Location | Proposed wording |
| --- | --- |
| Homepage title | `Free AMC 8 Lessons & Visual Math Practice \| Mathinking` |
| Homepage description | `Discover why the math works with 50 guided AMC 8 lessons, visual explanations, and focused practice. Build ideas, then apply them to real contest problems.` |
| Homepage H1 | Keep `Don't memorize the trick. See why it works.` The existing nearby “Free AMC 8 learning” text supplies the topic context. |
| Learn title | `50 Guided AMC 8 Math Lessons \| Mathinking` — generate the count from the published catalog. |
| Practice title | `AMC 8 Practice by Topic & Difficulty \| Mathinking` |
| Archive title | `AMC 8 Past Problems & Solutions by Year \| Mathinking` |
| Year title | `2026 AMC 8 Problems & Solutions \| Mathinking` |
| Problem title pattern | `{year} AMC 8 Problem {number}: Solution \| Mathinking` |
| Lesson title | `Addition vs Multiplication: Counting for AMC 8 \| Mathinking` |
| Lesson description | `Learn when to add or multiply choices using worked examples and an interactive AMC 8 counting lesson. Then practice related problems.` |

Write descriptions around the actual page. Derive count-bearing copy from the published catalog; the homepage statistics already do this, but some CTA, Learn, and metadata strings hard-code 50. Add “animated” to problem copy only where the published scene has passed review. Keep titles concise and distinctive; do not append a long keyword list. The search engine may choose different title or snippet text.

For public problem pages, use student-facing solution steps and equations, not animation implementation hints. For lesson pages, convert the core insight, objectives, and common misconceptions into readable prose. Give diagrams descriptions of their mathematical content rather than only “diagram 1.” Reserve diagram dimensions to reduce layout movement.

Structured data should be deliberately small:

- Homepage: `WebSite` with the chosen name, canonical URL, and genuine alternate name if one is used publicly. Add accurate organization/publisher information where it represents the actual operator.
- Nested public pages: `BreadcrumbList` matching visible breadcrumbs.
- Educational pages: optional semantic `LearningResource` or page metadata when accurate; this is not a promise of a Google rich result.
- Remove the current SearchAction unless its behavior is actually supported and useful elsewhere. Google's sitelinks search box was retired in November 2024.
- Do not invest in deprecated practice-problem or course-info rich results. Practice-problem documentation was removed in January 2026. Course-info removal does not mean every use of Schema.org `Course` is invalid, but the current four generic entries do not represent distinct courses.
- Interactive SVG scenes are not automatically videos; use `VideoObject` only if actual qualifying video content is later published.

Relevant current documentation: [site names](https://developers.google.com/search/docs/appearance/site-names), [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [structured-data content policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [search-box retirement](https://developers.google.com/search/blog/2024/10/sitelinks-search-box), and [feature deprecations](https://developers.google.com/search/updates).

## 7. Rendering and indexing without changing the platform

Extend the existing build to render public content components into real HTML documents. Prefer a small, data-driven build rendering entry for the public shell: heading, explanation, diagrams, breadcrumbs, and related links. Keep browser-dependent progress and animation behavior in interactive components. The route and page-data resolver should be shared between build output and the client.

Start with one existing lesson and one new problem page as a technical trial. The current `App` reads `window.location` and `main.tsx` uses `createRoot`; simply inserting HTML into `#root` does not solve the problem if React immediately removes or replaces that content. Use either a matching hydratable public component or separate interactive mount points inside the static page. Verify that the same educational content survives client startup. This is the main implementation design decision to settle in the trial.

A browser snapshot build is a fallback if it substantially reduces implementation effort. It must capture the normal public experience and provide persistent readable content; taking snapshots of today's blank shells or first lesson activity alone is insufficient. Serve the same content to people and crawlers.

Do not render all draft lesson beats into a hidden SEO block. Add a coherent public explanation or overview that readers can actually use, while preserving the existing investigation sequence.

Index policy:

| URL class | Policy |
| --- | --- |
| Reviewed public hubs, years, problems, lessons, guide, about/attribution | Eligible for indexing; correct self-canonical; include substantive pages in the sitemap. |
| `/practice` | Recommend indexing the clean base URL as a public topic/difficulty practice directory now that it contains that stable content. Render its introduction and directory in initial HTML, with a self-canonical. Keep personalized session details outside its core indexable content. |
| Practice filter/session URLs and personal dashboard | Default to `noindex`; omit from sitemap. Keep links to public content. Do not assume filtered content is equivalent enough to canonicalize all variants to the homepage. |
| `/problems?q=...` and arbitrary search results | Exclude from sitemap and normally `noindex`. Make search work for users if retained. |
| Tracking parameters on an otherwise identical public page | Canonicalize to the clean content URL. |
| Draft/unreviewed lessons | Review current production status first; use an explicit publication/index flag. Do not automatically remove all 50 live lessons based solely on this checkout's draft labels. |
| Invalid IDs and unknown routes | Real HTTP 404, useful recovery links, no sitemap entry. |

Keep pages crawlable when relying on a robots `noindex` directive; blocking them in robots.txt prevents crawlers from reading the directive. Generate the sitemap from canonical, indexable, successful pages. Include `lastmod` only when it reflects substantive content changes. Google's ignored `priority` and `changefreq` fields are not useful optimization work. See [robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## 8. Phased implementation backlog

Effort ranges are rough developer working days against the updated checkout. Source synchronization is complete for this review. These estimates exclude a full mathematical review of hundreds of explanations and ongoing marketing work. The rendering trial may change the estimate.

| Phase | Deliverables | Effort | Completion gate |
| --- | --- | --- | --- |
| 0 — Establish the baseline | Record deployment/build settings; inspect Search Console and existing Vercel Analytics; confirm preferred host and publication/review status. Retain the established Mathinking brand. | 0.5–1 day | Baseline URL sample and written index policy. The source-sync concern is resolved; lack of analytics access does not prevent code preparation. |
| 1 — Correctness | Shared metadata records for existing pages; consistent brand/host; lesson canonical repair; real OG image/favicon; missing-route handling; dashboard policy. | 1–3 days | Direct requests and post-JS checks agree; assets decode; unknown pages return 404. |
| 2 — Public content trial | Build-render one lesson and one problem; add readable explanation content, real links, breadcrumbs, and compatible client startup. | 2–4 days | Useful raw HTML and working interactions on both pages, including mobile and direct refresh. |
| 3 — Initial search library | Add full SEO/content treatment to 5–10 existing lesson pages, including C5 and N4 where review supports it; add 25–50 reviewed problem pages and their year hubs; generate sitemap and related links. Expose the existing homepage/directory content and improve the guide. | 2–4 days plus content review | No orphan pages, no duplicate canonicals, no published claims beyond reviewed content. All existing lesson URLs and navigation remain usable while the richer treatment expands. |
| 4 — Performance and measurement | Split page/scene/data loading, reserve visual space, add lightweight engagement events using existing analytics where supported. | 1–3 days | Measure representative mobile pages; confirm public landing pages do not download the entire scene library. |
| 5 — Expand and promote | Extend to the remaining reviewed problems and lessons; add four substantive topic hubs, an About page, and an outreach routine. | Ongoing | Expansion follows content quality, indexing feedback, and user engagement. |

The first rewrite should include phases 1–3, with the largest obvious loading improvement pulled forward from phase 4. Apply correct metadata/canonicals to all existing lessons in phase 1; the smaller phase-3 group is a pilot for richer public explanations, not a recommendation to hide the other lessons. Avoid releasing hundreds of near-identical pages whose only distinction is the title. The original worked reasoning and visuals are what make the pages useful.

Likely implementation areas: `index.html`, `tools/prerender.mjs`, `src/hooks/usePageMeta.ts`, `src/App.tsx`, `src/main.tsx`, public-page components, `ProblemWorkspace`, `CompactProblemList`, `LessonRenderer`, `public/robots.txt`, sitemap generation, and `vercel.json`. Add a compact SEO manifest/build module and page templates; reuse existing content records. Update the README's older SEO plan after implementation so it no longer points development toward outdated priorities.

## 9. Marketing based on the actual product

Use the existing C5 and N4 homepage previews as the first marketing examples: “How many 3-digit numbers contain at least one 0?” and “How many divisors does 72 have?” Both already provide a concrete question, visible reasoning, and a direct lesson destination. Reuse their explanations in share cards or educational posts and link to `/learn/C5` and `/learn/N4`. Review those lesson pages' public introductions and metadata first. Do not label the static homepage previews as playable animations.

For subsequent animated demonstrations, choose a reviewed problem where motion clarifies something difficult to see in static algebra—for example, a geometry dissection, a counting tree, or a changing ratio. Its public page should provide the full reasoning and a related practice action. Organize messaging around the existing Try → Notice → Name → Transfer → Practice method, connecting conceptual learning to contest practice.

| Audience/channel | Useful material | Destination and measurement |
| --- | --- | --- |
| Students searching for an exact problem | A direct answer, readable reasoning, and the matching animation | Individual problem page; measure animation starts, solution use, and subsequent attempts. |
| Parents and homeschool groups | A clear beginner path or a practical four-week study sequence | Improved `/tips` and reviewed starter lessons; measure lesson starts and return visits where available. |
| Teachers and math clubs | Small curated sets with a concept, difficulty, solution link, and optional printable explanation | Topic/lesson page; measure tagged referral visits and practice starts. |
| Short-form video or educational social posts | A brief visual puzzle, a pause to think, and the key insight with captions | Link to the exact matching explanation, not just the homepage. Use actual video assets if this channel is adopted. |
| Relevant resource directories and educator sites | A concise description of a free resource plus one high-quality example | Relevant hub or lesson; track referral engagement. Seek editorially useful mentions, not purchased or mass-produced links. |

Suggested first-month routine after public pages are ready: publish one useful visual explanation each week, share it through one or two channels where educational contributions are welcome, and make a small number of tailored contacts with relevant teachers or club organizers. Outreach is a future action; nothing was posted or sent during this audit.

Use brand-consistent preview cards, an easy copy-link action, and stable URLs. Preserve source attribution and the existing non-affiliation statement. Provide a real correction/contact route and identify authors/reviewers accurately. Explain browser-local progress plainly. Avoid unsubstantiated score-improvement claims, “official AMC” positioning, or claims that the visual approach is unique in the market.

Start the editorial calendar with complementary counting and divisor counting, then the homepage's established entry lessons: F1 number sense, C4 casework, and G4 area decomposition. Ratios, remainders, and a beginner AMC 8 study path can follow. Improve the existing guide before creating multiple overlapping preparation articles. Search Console queries should inform later expansion; do not generate hundreds of generic math articles to chase keywords.

## 10. Measurement and release acceptance

Use Google Search Console and Bing Webmaster Tools for discovery/indexing feedback, plus existing Vercel Analytics for site usage. Verification is not assessable from the absence of an HTML tag—DNS verification may already be configured. Reuse existing accounts and instrumentation before adding another analytics service.

Capture a pre-release baseline, then review technical coverage weekly and search performance over 28-day windows, allowing for AMC seasonality. Track impressions, clicks, click-through rate by page/query, valid indexed public pages, unexpected exclusions, and engagement after organic landings. Aggregate position is supporting context, not the sole success metric. Event candidates are `lesson_start`, `animation_start`, `solution_open`, and `practice_attempt`; use fixed content IDs and avoid sending answer text or personal information.

The first success target is reliable discoverability: intended public pages have useful initial content and correct canonical/index signals. Indexing and rankings are search-engine decisions, so neither 100% indexing nor a particular traffic increase is promised.

Before release, verify:

1. Raw HTML for a homepage, topic, year, problem, lesson, and guide contains the correct title, description, canonical, H1, readable core content, and internal links.
2. The same content remains available after JavaScript starts; answer selection, animation controls, lesson progression, and local progress still work. Preserve the homepage's C5/N4 previews and links, F1/C4/G4 starting points, six Learn section anchors, and Practice's skill/difficulty navigation.
3. Direct deep links and refreshes work. Mixed-case lesson IDs and trailing-slash variants resolve consistently to the chosen canonical. Alternate hosts permanently redirect without losing the path/query.
4. Invalid routes, unknown lesson/problem IDs, and missing assets return real 404 responses. A legitimate lesson does not inherit the homepage canonical.
5. Every sitemap entry is a canonical, indexable, successful public page; dashboard, arbitrary search results, drafts, and duplicate variants are absent.
6. OG images and favicon URLs return the intended image types and display correctly in a preview check. Schema validates and matches visible content; use Rich Results Test only for supported features and a Schema.org validator for general markup.
7. There is a crawlable path from a hub to each released content page. Search Console URL Inspection is checked for representative pages after deployment, including rendered content and selected canonical.
8. Mobile loading and interaction are measured. Aim for good field Core Web Vitals at the 75th percentile: LCP ≤2.5 seconds, INP ≤200 ms, CLS ≤0.1. Lab tests support diagnosis but are not substitutes for field data. See [Google's Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals).

The recommended first milestone is a consistent Mathinking identity, corrected host/lesson canonical signals, and a small reviewed library of fully readable public pages. That establishes a reusable publishing system for the content already being created.

## Evidence locations for the later rewrite

Live observations below come from the original September 22 audit, using direct HTTP requests and headless Chrome with a fresh browser profile for each rendered page. The post-pull review checked the changed source against these observations rather than running the live audit again:

| Sample | Observed result |
| --- | --- |
| `https://mathinking.org/` | 307 redirect to the www homepage. |
| `https://www.mathinking.org/learn` | Initial title uses Fun Math Journey; browser title uses Mathinking; browser DOM contains links to all 50 lessons. |
| `https://www.mathinking.org/learn/C1` | Initial and rendered canonical both point to `https://mathinking.org/`; rendered page has an H2 and its first activity, but no H1. |
| `https://www.mathinking.org/problems?q=geometry` | Browser shows “Showing 675 of 675 problems”; no individual problem anchors were present in the sampled DOM. |
| `https://www.mathinking.org/license` | Initial HTML inherits homepage title and canonical. |
| `https://www.mathinking.org/sitemap.xml` | Seven entries, all using the non-www host, including dashboard and excluding lesson URLs. |
| `https://www.mathinking.org/og-image.png` and `/favicon.ico` | HTTP 200, `text/html; charset=utf-8`. |
| `https://www.mathinking.org/seo-audit-missing-page-20260922` | HTTP 200 with homepage metadata. |

Local implementation references: [metadata-only build script](../tools/prerender.mjs), [HTML template and JSON-LD](../index.html), [browser metadata hook](../src/hooks/usePageMeta.ts), [routing](../src/App.tsx), [hosting rewrite](../vercel.json), [problem navigation](../src/components/problem/CompactProblemList.tsx), [solution visibility](../src/components/problem/ProblemWorkspace.tsx), [lesson progression](../src/components/lesson/LessonRenderer.tsx), [content bank](../src/data/sampleProblems.ts), and [lesson registry](../src/data/lessons/index.ts).

Updated product references: [homepage method, previews, and starting points](../src/pages/HomePage.tsx), [50-lesson directory](../src/pages/LearnPage.tsx), [practice skill/difficulty directory](../src/pages/PracticePage.tsx), [Mathinking header](../src/components/layout/SiteHeader.tsx), and [Mathinking footer](../src/components/layout/SiteFooter.tsx).
