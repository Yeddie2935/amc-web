# Fun Math Journey Source

This is the first runnable MVP for the AMC 8-style learning website.

## What is included

- A responsive landing page and problem browser.
- Four topic lanes: Algebra, Geometry, Number Theory, Counting & Probability.
- Five difficulty levels.
- Search/filter controls.
- Multiple-choice solving flow.
- Local progress tracking with `localStorage`.
- Step-by-step explanations plus a generated mini animation player with Play / Previous / Next controls.
- Original sample problems only, to avoid copyright issues.

## Run locally

From inside the `Source` folder:

```bash
python3 -m http.server 5173
```

Then open:

```text
http://localhost:5173
```

You can also use any static server. Opening `index.html` directly may not work in every browser because the app uses ES module imports.

## Validate problem data

If Node.js is installed:

```bash
node tools/validateProblems.mjs
```

## Add problems

Edit:

```text
data/problems.sample.js
```

Follow the schema in:

```text
data/problem-schema.md
```

## AMC 8 content approach

Do not scrape and republish AMC 8 problems automatically. Use one of these approaches:

1. Original practice problems for launch.
2. Link-first AMC entries with metadata and authorized source links.
3. Full AMC problem text only after permission/licensing is confirmed.

## Suggested next implementation steps

1. Add at least 50 original launch problems.
2. Replace the sample data file with a real `problems.js` or a backend API.
3. Add user accounts only after anonymous progress works well.
4. Add concept lessons before each topic lane.
5. Expand the mini animation renderer into exported short videos from the `animationFrames` field.

## SEO Improvement Plan

The site currently has minimal SEO setup. Below is a prioritized plan to improve visibility in search engines like Google.

### Priority 1 — Quick wins (1–2 hours, high impact)

**1. Meta tags in `index.html`**

Add title, description, canonical URL, and Open Graph tags:

```html
<meta name="description" content="Free AMC 8 prep with 600+ problems across 5 difficulty levels. Learn, practice, and track your progress in algebra, geometry, number theory, and more." />
<meta property="og:title" content="Fun Math Journey — AMC 8 Practice" />
<meta property="og:description" content="Free AMC 8 prep with 600+ problems across 5 difficulty levels." />
<meta property="og:image" content="/og-image.png" />
```

**2. `robots.txt`**

Add a `robots.txt` to the `public/` folder so Google knows what to crawl (currently missing).

**3. `sitemap.xml`**

Add a `sitemap.xml` listing all 6 routes (`/`, `/learn`, `/practice`, `/archive`, `/dashboard`, `/problems`) so Google indexes them.

### Priority 2 — Structured data (2–3 hours, medium impact)

Add JSON-LD schema markup to help Google understand what the site is:

- `WebSite` schema with `SearchAction` (enables sitelinks search box in Google results)
- `EducationalOrganization` or `Course` schema for the practice and learn pages

### Priority 3 — Per-page titles and descriptions (3–4 hours)

Every page currently shares one `<title>Fun Math Journey</title>`. Each route should update `document.title` and the meta description dynamically:

| Route | Title |
|---|---|
| `/learn` | Learn AMC 8 Math — Fun Math Journey |
| `/practice` | Practice AMC 8 Problems — Fun Math Journey |
| `/archive` | AMC 8 Archive — Fun Math Journey |
| `/problems` | AMC 8 Problem Bank (600+ Problems) — Fun Math Journey |
| `/dashboard` | My Progress — Fun Math Journey |

### Priority 4 — SPA crawlability (larger effort, highest ceiling)

Google can crawl JavaScript SPAs but it is slower and less reliable. Options:

- **Prerendering** via `vite-plugin-prerender` — generates static HTML snapshots at build time (low effort, good for 6 static routes)
- **SSR migration** to Next.js or Astro — much larger effort, but best long-term SEO outcome

### Priority 5 — Content and authority (ongoing)

- Add a blog or "Tips" page with original content targeting keywords like "AMC 8 preparation" and "AMC 8 algebra problems"
- Get backlinks from math communities (Art of Problem Solving forums, Reddit r/mathcompetitions)
- Submit the site to Google Search Console and monitor crawl coverage and click-through rates
