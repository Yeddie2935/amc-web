# Generated Learn lesson artifacts

This directory is reserved for declarative outputs of the Mathinking lesson generator.

- `<strand>/<lesson-id>.json` — one `LessonSpec` per curriculum node.
- `generated-problems/<lesson-id>.json` — `GeneratedProblemArtifact[]` used for purpose-built teaching and fresh practice.

The authoritative TypeScript contract is `src/types/lesson.ts`.
The implementation/pedagogy contract is `docs/lesson-generator-contract.md`.

Generated lesson files must remain JSON-serializable data. Do not embed React components or functions in lesson specs; rendering belongs in `src/components/lesson/`.

Until a lesson is human-reviewed, keep `status: "draft"` or `status: "validated"`. `approved` is reserved for lessons whose mathematical validation, visual QA, and pedagogical timing have all been reviewed.
