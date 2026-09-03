---
name: mathinking-lesson
description: Author, revise, and validate declarative Mathinking curriculum lessons by lesson ID using this repository's approved curriculum mappings, lesson schema, bank animations, and C4 quality benchmark. Use for requests such as "Build C5" or "revise lesson N3"; do not use for general site redesign or curriculum remapping.
---

# Mathinking Lesson

Build one requested Mathinking lesson as a coherent mathematical investigation. Produce declarative `LessonSpec` and `GeneratedProblemArtifact` data, plus only the generic renderer infrastructure genuinely required to display it.

Do not redesign the site, curriculum order, or approved problem mapping. Do not begin adjacent lessons unless the user requests them. Keep new lesson status `draft` until the repository's validation and human-review gates justify otherwise.

## Required reading

Before designing or editing a lesson, read these canonical repository sources in full:

- `docs/lesson-generator-contract.md`
- `docs/lesson-generator-implementation-plan.md`
- `src/types/lesson.ts`
- `src/types/curriculum.ts`
- `src/types/curriculumProblemMapping.ts`
- `src/data/curriculum/meta.json`
- `src/components/lesson/LessonRenderer.tsx`
- `src/components/lesson/LessonInteraction.tsx`
- `src/components/lesson/LessonProblemBeat.tsx`
- `src/components/lesson/LessonResolution.tsx`
- `src/components/lesson/VisualPrimitiveHost.tsx`
- `src/components/animation/ProblemAnimationStage.tsx`
- `src/components/animation/sceneRegistry.ts`
- `tools/validate-lesson-spec.mjs`

Read all of the following skill references before authoring. They are complementary, not alternatives:

- [pedagogy.md](references/pedagogy.md)
- [medium-and-resolutions.md](references/medium-and-resolutions.md)
- [problem-selection.md](references/problem-selection.md)
- [c4-benchmark.md](references/c4-benchmark.md)
- [validation-and-qa.md](references/validation-and-qa.md)

## Assemble the lesson context

Require a curriculum lesson ID. Normalize it to uppercase, then run:

```bash
node .agents/skills/mathinking-lesson/scripts/lesson_context.mjs <LESSON_ID>
```

Use the returned paths to read, in full:

1. the requested curriculum node;
2. its approved deep problem mapping;
3. the requested lesson if it already exists;
4. the narrative predecessor lesson when implemented;
5. predecessor closing beats, resolutions, and relevant generated artifacts;
6. mapped bank entries, solution steps, animation metadata, resolved scenes, and selected scene components;
7. current lesson primitives and validation rules.

Also inspect prerequisites and immediate narrative successors enough to know what may be assumed and what tension may be left unresolved.

If the mapping is missing or not approved, do not invent or alter one. Stop lesson authoring and report the mapping gate. If a referenced bank problem or animation is inconsistent with the approved mapping, preserve the mapping and report the repository inconsistency.

Before writing learner-facing prose, summarize privately or in a concise work update:

- what the learner already knows;
- the misconception or tension to surface;
- the precise new realization to create;
- the unresolved question that should lead forward;
- the planned source and medium for each major realization.

## Design before authoring

Outline the mathematical story using only phase, purpose, expected realization, medium, problem source, and transition. Do not draft explanatory paragraphs yet.

The usual investigation arc is:

`puzzle -> try -> notice -> discover -> name -> play -> competition application -> independent practice -> consolidate -> forward hook`

Adapt this arc to the lesson type and mathematics. Pedagogical `phase` and renderer `kind` are separate; never infer a fixed UI from phase names.

For every major realization, explicitly select interaction, animation, static visual, or text using [medium-and-resolutions.md](references/medium-and-resolutions.md). Make the learner see or manipulate the reason when that improves understanding.

Choose generated versus bank teaching sources using the approved mapping and [problem-selection.md](references/problem-selection.md). An authentic problem must answer: “Why this problem, right now?”

## Author the artifacts

Keep lesson content serializable and declarative. Put no React functions or lesson-ID branches in lesson data or renderers.

- Store the lesson at `src/data/lessons/<strand>/<LESSON_ID>.json` using the repository's existing strand naming.
- Store original teaching/practice artifacts at `src/data/lessons/generated-problems/<LESSON_ID>.json`.
- Register the lesson bundle in `src/data/lessons/index.ts` through the generic registry.
- Preserve exact curriculum-owned fields required by validation.
- Give substantial interactions and problems worked resolutions using the shared resolution architecture.
- Keep author-only rationale in `purpose`, `whyNow`, mapping, or generation notes; never leak it into rendered transitions, prompts, or bridges.

Use existing primitives and animations first. When a missing primitive is essential, add the smallest generic, reusable primitive with runtime fallback and accessible labeling. Never add `if (lessonId === ...)` renderer behavior.

## Review gates

Before validation, perform three separate reviews:

1. **Mathematics:** independently recompute every generated answer, verify every solution path and choice, and record genuinely independent methods in each artifact.
2. **Pedagogy:** confirm discovery precedes terminology, each misconception is actually surfaced or repaired, substantial questions have worked resolutions, and the ending consolidates before opening the next tension.
3. **Continuity:** read learner-facing copy in order. It should sound like one tutor remembering shared work, and each visual must answer the question currently on screen.

Then follow [validation-and-qa.md](references/validation-and-qa.md). Fix failures caused by the lesson. Review `git diff` for mapping, curriculum, or unrelated changes before reporting.

## Completion report

Report:

- files changed;
- the mathematical story and discovery sequence;
- generated and authentic problem roles;
- added generic primitives, if any;
- how predecessor and successor continuity are handled;
- independent mathematical verification;
- validator, build, diff-check, and browser-QA results;
- schema or renderer limitations encountered.

Do not silently continue to the next lesson.
