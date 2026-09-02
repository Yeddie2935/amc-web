# Lesson generator implementation sequence

Use this file as the first implementation brief for Codex after the curriculum/mapping PR is merged or checked out.

Read first:

1. `docs/lesson-generator-contract.md`
2. `src/types/lesson.ts`
3. `src/data/curriculum/meta.json`
4. the target curriculum node JSON
5. its deep problem mapping JSON

Do not redesign the curriculum, remap the bank, or replace the generator policies unless a concrete implementation conflict is found.

## Milestone 1 — controlled animation stage

Extract the scene-resolution portion of the current `AnimationRenderer` into a reusable component that accepts externally controlled `step` / `totalSteps`.

Target API:

```tsx
<ProblemAnimationStage problem={problem} step={step} totalSteps={totalSteps} />
```

Requirements:

- reuse the existing scene registry;
- no autoplay or player controls inside the stage;
- preserve current `AnimationRenderer` behavior by refactoring it to use the stage;
- no visual regressions in current problem explanations.

## Milestone 2 — minimal lesson renderer

Implement `LessonRenderer` for the `LessonSpec` contract.

Start only with primitives needed by the C4/C5 benchmark. Do not implement the entire primitive catalog up front.

Likely initial primitives:

- `branch-tree` or simple path/list visualization;
- `sort-into-cases`;
- `slot-filler` / zero-position representation;
- `outcome-grid`;
- controlled bank problem animation stage.

Implement shared handling for:

- copy beats;
- concept beats;
- interactions;
- problem beats;
- reflections;
- transitions/continuity keys.

## Milestone 3 — C4 Casework benchmark

Generate/author one declarative C4 `LessonSpec` and its required generated teaching artifact(s).

Benchmark behavior:

1. learner explores a small step-count/listing problem;
2. lesson creates the question “How do we know we got them all?”;
3. learner groups possibilities into exhaustive/non-overlapping cases;
4. only then name `casework`;
5. naturally transition into a suitable three-digit-zero counting application;
6. end with fresh generated practice + authentic transfer.

Run `npm run validate:learn` after every meaningful iteration.

## Milestone 4 — C5 Complementary Counting benchmark

C5 must explicitly reuse C4's model rather than start over.

Benchmark behavior:

1. callback to the prior zero-position/casework representation;
2. change the condition from a clean exact case to an “at least one” style condition;
3. make overlap/case explosion visible;
4. prompt the learner to count the opposite;
5. reveal complementary counting only after the cleaner structure is experienced;
6. integrate the mapped authentic problem only where it improves the story;
7. seed P3 Complementary Probability.

C4 -> C5 is the release gate for generator quality.

## Milestone 5 — generated-problem pipeline

Implement generation storage/validation before bulk lesson generation.

Initial behavior can be semi-automatic: generator writes draft problem artifacts, then deterministic validators mark them validated.

Required validators where applicable:

- independent answer recomputation;
- solution step verification;
- uniqueness / MC option audit;
- prerequisite audit;
- wording/diagram audit hook;
- bank-paraphrase similarity guard.

Do not generate practice live for students. Pre-generate validated pools.

## Milestone 6 — lesson generator CLI

Implement:

```bash
npm run generate:lesson -- C4
```

The first version may call an LLM manually/outside the runtime or emit a structured context/prompt bundle for an agent. The important invariant is deterministic orchestration around the model:

1. load curriculum/mapping context;
2. choose bank-vs-generated source according to the approved mapping;
3. draft beat outline;
4. materialize teaching problem(s);
5. draft LessonSpec;
6. generate missing practice pool items;
7. validate;
8. leave unresolved items as explicit warnings.

Do not let the model silently override curriculum data.

## Milestone 7 — visual QA

After C4/C5 render correctly:

- add desktop/mobile screenshot capture;
- render every beat, not only the first screen;
- add overflow/console checks;
- establish screenshot baselines for approved lessons.

## Milestone 8 — expand cautiously

Generate a small cross-strand batch before all 50:

- F3 Ratios & Proportions;
- A2 Linear Equations;
- N5 Remainders & Modular Arithmetic;
- C4/C5 benchmark pair;
- G4 Area Decomposition;
- G11 Nets & Spatial Visualization.

Review whether the primitive system generalizes. Only then bulk-generate the remaining curriculum.

## Definition of success

The generator is successful when human review is mostly about the timing/quality of the mathematical insight, not repairing boilerplate, broken integrations, incorrect problems, or disconnected lesson structure.

A generated lesson should be cheap to revise with feedback like:

> “Beat 3 tells them the cases too early. Make the learner sort the possibilities first.”

It should not require rewriting the lesson manually.
