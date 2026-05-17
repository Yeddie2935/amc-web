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
