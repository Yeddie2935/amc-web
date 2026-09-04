---
name: mathinking-lesson
description: Author, revise, and validate declarative Mathinking curriculum lessons by lesson ID using the approved curriculum mapping, compact lesson context, reusable lesson QA, and the C4 quality bar. Use for requests such as "Build C5" or "revise lesson N3"; do not use for general site redesign or curriculum remapping.
---

# Mathinking Lesson

Build one requested lesson as a coherent mathematical investigation. Produce declarative `LessonSpec` and `GeneratedProblemArtifact` data, plus only generic renderer infrastructure genuinely required to display it.

Do not redesign the site, curriculum order, or approved problem mapping. Do not begin adjacent lessons unless requested. Keep a new lesson `draft` until repository validation and human review justify otherwise.

## Routine context: start here

Require and uppercase a curriculum lesson ID. From the repository root run:

```bash
node .agents/skills/mathinking-lesson/scripts/lesson_context.mjs <LESSON_ID> --compact
```

Treat this deterministic packet as the routine source of truth. It includes the curriculum authoring fields, prerequisites and misconceptions, narrative links, approved mapping and teaching plan, exact mapped bank problems with solution/animation metadata, predecessor closing continuity, successor hook information, existing lesson location, and targeted source paths.

Stop if `mappingGate.approved` is false. Do not invent, approve, or alter a mapping.

Before broader searching:

- Use the packet's exact paths and problem IDs.
- Use its predecessor closing beats when they provide enough conversational continuity. Open the predecessor lesson only when those excerpts leave a real ambiguity.
- Inspect a mapped scene file only when the lesson will actually use that animation.
- Inspect `src/types/lesson.ts` or a primitive implementation only when a specific data shape is unclear.
- If a routine design decision remains unclear, read the concise [routine quality card](references/routine-quality.md). Do not load the longer references by default.

Do not routinely reread the generator contract, implementation plan, full curriculum or mapping files, renderer sources, full animation registry, full problem bank, full C4 lesson, every Skill reference, or validator implementation. The quality rules below are the routine benchmark extraction.

Use `--full` only for context-script diagnostics; it is not a default lesson-authoring step.

## Non-negotiable quality bar

C4 remains the gold benchmark, but do not reread its full artifact without a concrete comparison need.

- Create discovery before terminology and student language before formal vocabulary.
- Write like a tutor who remembers the learner's prior work. Make transitions carry mathematical meaning, not merely sequence labels.
- Prefer structured interaction to unnecessary blank free response.
- Sorting known examples is not proof of completeness. Explicitly establish coverage and non-overlap when the technique requires them.
- Use interaction when manipulation creates insight; animation when meaningful motion, process, or representation change matters; a static visual when an inspectable diagram or table exposes structure; and text when another medium adds little. Do not animate everything.
- Preserve useful objects and representations across adjacent beats, using continuity keys where supported.
- Give every substantial question feedback, a worked resolution, and a takeaway.
- Synchronize each learner prompt with the exact visual or animation state it asks the learner to inspect.
- Never place a generated question immediately before an authentic bank problem that asks essentially the same thing.
- Only an approved deep mapping authorizes integrated bank use. Explain why each authentic problem belongs at that moment.
- Independently recompute every generated answer and verify every solution path and answer choice. Artifact validation methods must be genuinely independent.
- Surface and repair the mapped misconceptions; do not merely list them in metadata.
- Consolidate the lesson's main idea before creating a forward hook.
- Keep lesson content serializable and declarative. Never add lesson-ID-specific React branches.

## Design before prose

Use the compact packet to record:

- what the learner may already know;
- the misconception or tension to surface;
- the precise new realization;
- the unresolved question that leads forward;
- the source and medium for each major realization.

Then outline beats using only phase, purpose, expected realization, medium, source, and transition. Adapt the usual arc rather than forcing it:

`puzzle -> try -> notice -> discover -> name -> play -> competition application -> independent practice -> consolidate -> forward hook`

Pedagogical `phase` and renderer `kind` are separate. Choose the medium for the mathematics, not for variety.

## Targeted inspection and authoring

For mapped problems, use the exact entries in `mappedBankProblems`. Query the bank by the returned ID only if more source context is required. If using its animation, inspect only the returned scene path and the declared slice/whole timeline.

Use existing primitives first. Open the primitive host or type definition only to confirm a chosen shape. If a missing primitive is essential, switch to the escalation path before implementing the smallest generic accessible primitive with a runtime fallback.

Store and register artifacts through the existing generic paths:

- lesson: `src/data/lessons/<strand>/<LESSON_ID>.json`;
- generated artifacts: `src/data/lessons/generated-problems/<LESSON_ID>.json`;
- registry: `src/data/lessons/index.ts`.

Preserve exact curriculum-owned fields. Keep author rationale in `purpose`, `whyNow`, mapping, or generation notes; do not leak it into learner-facing copy.

Do not modify neighboring lessons, curriculum nodes, or mappings. Do not repeatedly rediscover paths already in the context packet. Do not invent temporary QA tooling or run standalone TypeScript checks outside the repository-supported validation path.

## Review and validation

Before automated checks, review separately:

1. **Mathematics:** independently recompute generated answers, solutions, and choices.
2. **Pedagogy:** verify discovery order, misconception repair, medium choice, resolutions, and consolidation.
3. **Continuity:** read learner-facing copy in sequence and confirm each visual answers the current prompt.

Every routine lesson runs, in this order:

```bash
npm run validate:learn
npm run build
git diff --check
npm run qa:lesson -- <LESSON_ID>
```

The generic browser harness owns its preview and Chrome processes, exercises desktop and mobile paths, checks interaction gates and retry behavior, verifies resolution timing and controlled animation slices, and reports runtime/layout failures compactly. Add `--screenshots` only when useful.

Extra screenshot-by-screenshot or manual renderer inspection is required only when:

- a primitive was added or changed;
- an animation integration was added or changed;
- generic QA reports a problem;
- the lesson uses an unusual layout;
- the user requests deeper QA.

For an ordinary declarative lesson reusing existing infrastructure, the generic QA pass is sufficient before human pedagogical review.

## Escalation path

Inspect deeper source only when a concrete blocker makes it relevant, such as:

- a genuinely new reusable visual primitive;
- unclear schema or renderer behavior;
- an inconsistent approved mapping or missing mapped bank asset;
- animation behavior that disagrees with its declared plan;
- validation failure caused by architecture rather than lesson data;
- required renderer infrastructure that does not exist;
- a revision request about the underlying generator contract.

Open the smallest relevant source set. For example, inspect one scene plus its registry branch for an animation problem, or one response renderer plus its type for unclear interaction behavior. Read [pedagogy.md](references/pedagogy.md), [medium-and-resolutions.md](references/medium-and-resolutions.md), or [problem-selection.md](references/problem-selection.md) only for a specific deeper design question; [validation-and-qa.md](references/validation-and-qa.md) only for QA failures; [c4-benchmark.md](references/c4-benchmark.md) only for a specific benchmark comparison; and the contract/implementation plan only for contract or architecture work. Do not convert escalation into an indiscriminate repository audit.

## Completion report

Report files changed; mathematical story; generated/authentic roles; any generic primitive work; predecessor/successor continuity; independent math verification; validator/build/diff/browser-QA results; and schema or renderer limitations. Do not silently continue to another lesson.
