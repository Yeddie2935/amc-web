# Medium, continuity, and worked resolutions

## Select the medium deliberately

For every major learner realization, record one primary medium and why it is clearest.

| Medium | Use when | Avoid when |
| --- | --- | --- |
| Interaction | Making, sorting, placing, choosing, or predicting creates the insight. | The response is mechanical or merely acknowledges prose. |
| Animation | Motion, temporal order, transformation, or a representation change is mathematically important. | A still arrangement communicates the complete idea. |
| Static visual | A table, diagram, arrangement, comparison, or partition exposes structure. | It adds decoration but no explanatory information. |
| Text | The relationship is already visible or another representation adds little. | Prose would have to carry a structure the learner could see. |

Do not animate everything. Motion must encode a useful process. Static visuals should be common in worked solutions and practice because the learner can inspect them at their own pace.

## Preserve representation

Across adjacent beats, reuse the same objects, ordering, labels, colors, and `continuityKey` when the mathematics continues unchanged. A representation change should itself have a pedagogical reason.

Inspect the renderer before promising state persistence: `continuityKey` identifies continuity but does not automatically make unrelated components share interaction state. Preserve data identity and visual language even when true shared state is not implemented.

At a bank-problem boundary, carry forward the useful representation when possible. Do not reset to a generic player or unrelated diagram.

## Keep question and visual synchronized

At every learner decision, ask:

1. What exact question is visible?
2. What mathematical state does the visual show?
3. Does that state help answer this question rather than the prior or next one?

Move a visual into the relevant resolution if it explains the answer rather than supports the attempt. Remove synthetic setup questions that duplicate the authentic problem.

For controlled bank animation:

- render `ProblemAnimationStage`, never the full `AnimationRenderer`;
- keep `controlledByLesson: true`;
- keep autoplay and player controls off;
- validate every selected zero-based step index against the problem's explanation-step count;
- align one learner prompt with each selected step when using a guided slice;
- preview every selected step, including first and last;
- use an existing scene only when it accurately depicts the problem and current prompt.

## Worked-resolution standard

Substantial questions should follow:

`question -> learner response -> immediate feedback -> worked visual/animation -> short reasoning steps -> takeaway -> Continue`

Use the shared `resolution` fields in `src/types/lesson.ts`. Do not force every resolution to use every field:

- `visual`: a static or self-animating `LessonVisualSpec` that explains this question;
- `animation`: the problem beat's controlled bank animation;
- `steps`: a short ordered argument, with math where useful;
- `takeaway`: the transferable idea, not merely the numeric answer.

Immediate feedback says whether the learner's choice works and, when appropriate, points to what to reconsider. The resolution teaches why. Avoid duplicating the same sentence in both.

Generated and authentic problems deserve comparable-quality resolutions. Provenance does not determine teaching quality.

For independent practice, prefer a concise worked static visual. Use animation only when the solution depends on seeing a process or transformation. Text-only resolution is acceptable when a diagram would not clarify anything.

## Generic primitive gate

Use an existing primitive if it can faithfully express the mathematical structure. Before adding one, confirm:

- it represents a reusable mathematical interaction or visual model;
- its data contract is lesson-agnostic and serializable;
- malformed data produces a visible fallback;
- it has an accessible label and works at desktop/mobile widths;
- it does not branch on lesson ID;
- animation, if any, remains meaningful with reduced motion.

Prefer extending a fitting generic primitive over creating a near-duplicate. Do not implement the full vocabulary speculatively.
