# Content rights notes

This project should not automatically scrape and republish AMC 8 problem statements.

Recommended approach:

1. Start with original practice problems.
2. Add AMC 8 metadata and authorized links.
3. Only store full AMC 8 question text after confirming permission/licensing or another valid legal basis.
4. Keep attribution fields in the data model: contest, year, problem number, source label, and source URL.
5. Store AI-generated explanations separately from the original problem text.

Implementation status in this folder:

- `data/problems.sample.js` contains original sample problems only.
- `data/problem-schema.md` defines fields for future AMC 8 metadata or licensed content.
