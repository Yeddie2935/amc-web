# Problem data schema

Use this schema for both original problems and link-first AMC 8 metadata.

```js
{
  id: "orig-alg-001",                  // unique stable id
  title: "Ribbon Ratio",              // display title
  sourceType: "original",             // original | amc-link | licensed-amc
  sourceLabel: "Original launch problem",
  sourceUrl: "https://...",           // optional for AMC link-first entries
  year: 2023,                          // optional
  contest: "AMC 8",                   // optional
  problemNumber: 12,                   // optional
  category: "Algebra",                // Algebra | Geometry | Number Theory | Counting & Probability
  subcategory: "Ratios",
  difficulty: 1,                       // 1 to 5
  tags: ["ratio", "linear equations"],
  question: "...",                    // omit or keep short for link-first copyrighted entries
  choices: ["A", "B", "C", "D", "E"],
  answerIndex: 3,                      // 0-based index
  explanation: {
    idea: "Main insight in one sentence.",
    steps: ["Step 1", "Step 2"],
    animationFrames: ["Frame 1", "Frame 2"] // rendered into the mini animation player
  }
}
```

## Recommended launch content policy

1. Use `sourceType: "original"` for your own created practice problems.
2. Use `sourceType: "amc-link"` for AMC 8 entries that only store metadata and a link to an authorized source.
3. Use `sourceType: "licensed-amc"` only when you have permission to host the full problem text and answer choices.

## Difficulty model for the MVP

- Level 1: one-step computation or direct concept check.
- Level 2: two-step calculation or a common AMC 8 foundation pattern.
- Level 3: standard AMC 8 problem requiring a plan.
- Level 4: multi-step problem with hidden structure or casework.
- Level 5: difficult AMC 8 style problem with clever insight, multiple constraints, or non-obvious counting/geometry.
