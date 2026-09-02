# Mathinking Lesson Generator Contract

This document is the implementation contract for turning the Mathinking curriculum graph and deep problem mapping into interactive Learn lessons.

The generator is not responsible for inventing the curriculum. It consumes the human-designed curriculum graph, problem mapping, and authoring policies already stored under `src/data/curriculum/`.

## Product goal

A Mathinking lesson should feel like a coherent mathematical investigation:

**concrete tension -> learner attempt -> visible structure -> concept name -> play with the idea -> authentic competition application -> fresh independent practice -> mastery evidence**

The lesson must not feel like explanatory text with random AMC questions inserted between sections.

## Inputs

For one curriculum node, the generator must load:

1. The `CurriculumNode`.
2. The approved `CurriculumProblemMapping`.
3. The narrative predecessor and prerequisite nodes.
4. The immediate unlocks / likely next lessons.
5. The approved bank problem and additional bank candidates.
6. Broad full-bank retrieval results for discovery only.
7. Existing problem animation metadata / explanation steps for any bank candidate.
8. Existing reusable lesson visual primitives.
9. Any explicitly linked historical Mathinking draft or source lesson.

The curriculum and mapping contracts are authoritative. Broad automatic retrieval is recall-only and may not authorize integration by itself.

## Outputs

A generation run produces three artifact classes:

- one `LessonSpec`;
- zero or more `GeneratedProblemArtifact`s used as purpose-built teaching examples;
- a validated generated practice pool plus referenced authentic bank transfer problems.

The generated lesson remains `draft` until all validation gates pass. Passing automated validation may move it to `validated`; `approved` requires a pedagogical human review.

## Lesson structure

`LessonPhase` describes the pedagogical purpose of a beat. `LessonBeatKind` describes how it renders. They are intentionally separate.

For example, the `try` phase may be:

- an `interaction` using a choice grid;
- a `problem` using a purpose-built Original problem;
- a `problem` using selected steps of an AMC animation;
- a `visual` the learner manipulates before answering.

Do not require every lesson to contain every preferred phase. Connector lessons may be shorter. Foundation lessons may spend longer in discovery. Technique lessons should usually make a previous method strain or fail before naming the new technique.

## Visual primitive library v1

The generator should prefer a small reusable visual language over one-off UI implementations. Initial primitives are defined in `src/types/lesson.ts`:

- `choice-grid` — independent choice/product structure;
- `branch-tree` — sequential choices and probability/counting trees;
- `sort-into-cases` — casework and classification;
- `outcome-grid` — sample spaces and complements;
- `venn-builder` — sets, overlap, inclusion-exclusion;
- `object-lineup` — factorial/ordered arrangements;
- `slot-filler` — positions, permutations, digit construction;
- `bars-and-groups` — fractions, ratios, averages, proportional reasoning;
- `number-line` — magnitude, inequalities, fractions;
- `factor-tree` — prime structure;
- `remainder-clock` — modular arithmetic and cycles;
- `area-cut-rearrange` — decomposition, conservation of area;
- `angle-explorer` — angle relationships;
- `shape-scale` — similarity and scale factors;
- `balance-scale` — equality and equations;
- `pattern-extender` — sequences and recursive structure;
- `probability-tree` — event sequences;
- `data-graph` — graph/table interpretation;
- `solid-fold` — nets and spatial visualization;
- `drag-match` — flexible correspondence activity;
- `custom` — escape hatch only when no reusable primitive captures the concept cleanly.

A new primitive is justified when multiple future lessons can reuse its mathematical interaction model. Do not create a new primitive merely because one lesson has a unique story context.

## Generator pipeline

### Stage 1 — assemble lesson context

Build a compact context packet containing:

- current node core insight;
- exact target learner realization from the deep mapping;
- prerequisites that may be assumed;
- narrative predecessor and transition;
- misconceptions;
- next lessons the current lesson should seed;
- best bank candidate and integration plan;
- generated teaching plan when applicable;
- top broad-bank candidates for optional transfer;
- available animation steps / scene type for mapped bank problems.

The context packet should exclude unrelated curriculum nodes and low-scoring bank problems to reduce drift.

### Stage 2 — choose the teaching source

Follow `teachingExamplePolicy` in curriculum metadata.

If `preferredSource` is `bank`, the mapped authentic problem may drive the discovery only if its approved deep mapping includes a convincing `whyNow`, `entryBridge`, `learnerPrompts`, and `exitBridge`.

If `preferredSource` is `generated`, generate a Mathinking-original teaching problem backward from `targetLearnerRealization`. It may be simpler than an AMC question. Clean small numbers and manipulable structure are features, not defects, when they expose the concept better.

Record why the chosen source is pedagogically superior to the strongest alternative.

### Stage 3 — outline the narrative before writing copy

Create a beat outline containing only:

- phase;
- purpose;
- expected realization;
- visual/problem source;
- transition into the next beat.

Do not write explanatory prose yet.

The outline must satisfy:

1. the learner encounters a concrete object/problem before formal terminology when feasible;
2. the narrative predecessor is used meaningfully when one exists;
3. the new idea solves a tension the learner has already experienced;
4. the concept name/formula does not arrive before its model;
5. any integrated bank problem is prepared before it appears and harvested afterward;
6. at least one later beat requires transfer rather than imitation.

### Stage 4 — materialize teaching problems and interactions

For generated teaching problems:

- create a `GeneratedProblemArtifact` with `sourceType: "Original"` and `license: "Original"`;
- use the existing `Problem` schema whenever the example behaves like a normal problem;
- use inline `interaction` beats for micro-prompts that are really part of a visual manipulation rather than stand-alone problems;
- never create a generated question by merely changing names/numbers in an AMC problem.

For bank problems:

- reference the original problem ID;
- preserve authentic provenance;
- allow the lesson to reveal scenario/diagram before the full prompt when pedagogically useful;
- let the lesson own the animation timeline for integrated use.

### Stage 5 — animation integration

The current scene contract already accepts `problem`, `step`, and `totalSteps`. Integrated lessons should therefore render a controlled stage around the existing scene rather than instantiate `AnimationRenderer`, whose current player owns autoplay and controls.

Implementation target:

```tsx
<ProblemAnimationStage
  problem={problem}
  step={lessonControlledStep}
  totalSteps={totalSteps}
/>
```

`ProblemAnimationStage` should resolve and render the same scene registry used by `AnimationRenderer` but expose no autonomous timeline. A `LessonProblemBeat` with `animation.mode = "slice"` can then select only the pedagogically useful steps and interleave learner prompts between them.

The lesson must not reset visual language at the bank-problem boundary without a reason. Prefer carrying colors, objects, labels, or a `continuityKey` from the preceding beat when possible.

### Stage 6 — write concise copy

Only after the visual/problem sequence is fixed should the generator write learner-facing copy.

Copy rules:

- explain only what the learner cannot reasonably discover from the visual/interaction;
- prefer one or two short sentences per beat over textbook paragraphs;
- use questions before declarative explanations when prediction is possible;
- name the concept after the learner has seen the pattern;
- do not repeat information already shown clearly by an animation;
- avoid praise filler and vague encouragement;
- do not announce an AMC problem as an interruption. Source labeling may appear subtly after the conceptual bridge or on completion.

### Stage 7 — generate final practice

The teaching narrative ends before final practice.

Default session:

- 2 generated near-transfer problems;
- 2 generated mixed-transfer problems;
- 1 authentic bank transfer problem.

Before publication, the lesson should have at least:

- 6 validated generated near-transfer problems;
- 6 validated generated mixed-transfer problems;
- 2 validated generated challenge problems.

This minimum gives repeated sessions freshness without requiring live unvalidated generation. Mature lessons can expand these pools substantially.

Generated practice should vary surface context, numbers, representation, and solution path while preserving the intended mathematical demand. Mixed transfer may combine the current lesson with declared prerequisites. Challenge transfer may use one additional concept only when explicitly labeled.

### Stage 8 — mathematical validation

Every generated problem must pass independent validation before entering the pool.

Required checks:

1. recompute the answer independently of the generated solution text;
2. verify every solution step is mathematically valid;
3. verify uniqueness when the format expects a unique answer;
4. audit prerequisite usage against the curriculum graph;
5. reject ambiguous wording or diagrams;
6. reject accidental multiple-choice duplicates / multiple correct options;
7. reject generated problems that are close paraphrases of bank questions.

Use deterministic verification whenever practical: enumeration, exact arithmetic, symbolic checks, geometry coordinate checks, or a second independently written solver. Human review remains appropriate for proof-style reasoning or visual ambiguity.

### Stage 9 — pedagogical validation

A lesson fails validation if any of the following are true:

- terminology/formula is revealed before the intended discovery without a strong reason;
- the lesson does not actually address the node's core insight;
- a declared misconception is listed but never surfaced/repaired;
- the narrative predecessor is referenced ceremonially rather than used;
- an integrated problem cannot answer “why this problem, right now?”;
- the entry/exit bridge around an integrated problem is missing;
- a problem requires undeclared prerequisite knowledge;
- the learner could succeed by copying a just-shown procedure without any transfer;
- prose duplicates the animation rather than complementing it;
- an authentic bank problem is forced into the lesson when a generated example would teach the idea more cleanly.

### Stage 10 — visual QA

Render every beat at minimum desktop and mobile widths.

Check:

- no clipped equations, labels, or SVG content;
- no controls below inaccessible scroll regions;
- readable text sizes;
- visual state persists correctly across continuity beats;
- bank animation slices render correctly at every selected step;
- answer feedback does not cause major layout jumps;
- keyboard access exists for non-pointer interactions where practical;
- reduced-motion behavior remains understandable;
- no console errors.

Screenshot regression should eventually cover every approved lesson beat, just as the problem animation corpus should be regression-tested.

### Stage 11 — publish gate

A lesson may become `validated` only when:

- schema validation passes;
- all referenced curriculum/problem IDs exist;
- all generated teaching problems are validated;
- generated practice pool minimums are met;
- integrated bank problem mapping is approved;
- math validation passes;
- pedagogy validation passes;
- visual QA passes.

A lesson becomes `approved` only after a human pedagogical skim confirms that the timing of the discovery/aha feels right.

## Validation invariants for `LessonSpec`

The implementation validator should enforce at least:

- `curriculumNodeId` exists and matches core insight / prerequisites unless an override is explicitly documented;
- all beat IDs are unique;
- every misconception target references valid beat IDs;
- every problem beat references an existing bank problem or generated artifact;
- bank problem beats used as `anchor`, `guided`, or `contrast` appear in the approved deep mapping;
- integrated problem beats contain `whyNow`, `entryBridge`, `exitBridge`, and learner prompts;
- `animation.mode = slice` requires non-empty unique step indices;
- integrated problem animation has `controlledByLesson = true`;
- generated practice items are validated before selection;
- teaching problem IDs are excluded from immediate final practice;
- mastery evidence references independent beats/practice, not only completion;
- recommended mastery threshold is between 0 and 1;
- at least one beat occurs before the first `concept`/`name` reveal unless the lesson documents why discovery-first is inappropriate.

## Suggested repository layout

```text
src/
  data/
    curriculum/                 # graph + deep problem mapping (already built)
    lessons/
      <strand>/
        <lesson-id>.json        # LessonSpec
      generated-problems/
        <lesson-id>.json        # GeneratedProblemArtifact[]
  types/
    lesson.ts                   # schema contract
  components/
    lesson/
      LessonRenderer.tsx
      ProblemAnimationStage.tsx
      primitives/
        ...
tools/
  generate-lesson.mjs
  generate-practice.mjs
  validate-lesson-spec.mjs
  validate-generated-problems.mjs
  render-lesson-screenshots.mjs
```

The exact file format may be TS instead of JSON if implementation ergonomics favor it, but generated artifacts must remain declarative and serializable. Lesson specs must not contain arbitrary React functions.

## Generator command target

A future CLI should support:

```bash
npm run generate:lesson -- C4
```

Expected behavior:

1. assemble context for C4;
2. produce/update a draft `LessonSpec`;
3. generate missing teaching/practice artifacts;
4. run mathematical/schema/pedagogical validation;
5. print unresolved warnings rather than silently guessing;
6. optionally render visual QA screenshots once the lesson renderer exists.

A future convenience alias for Codex/agent workflows may expose the same operation as `$mathinking-lesson C4`.

## Gold-standard benchmark

Before bulk generation, implement and review **C4 Casework -> C5 Complementary Counting** as a paired benchmark.

C4 should preserve the strongest idea from the historical draft: listing possibilities leads to the metacognitive question, “How do we know we got them all?” Casework emerges as a way to guarantee exhaustive, non-overlapping organization.

C5 should deliberately reuse the previous lesson's representation and make it strain: change a clean “exactly one zero” setup into “at least one zero,” allow overlapping cases to become visible, then motivate counting the easier complement.

The generator is ready for broader use only when it can reproduce that kind of continuity without manually authored glue.

## Implementation philosophy

Build the smallest reusable system that preserves the pedagogy.

Do not create a large generic course-authoring platform before the benchmark lessons work. Add primitives and validation rules only when real lesson generation exposes a recurring need.
