# Problem selection, authoring, and mathematical verification

## Treat mappings as authorization

The curriculum node and approved deep mapping are authoritative. Do not alter their lesson order, core insight, prerequisites, narrative predecessor, mapped bank choice, or role while generating a lesson.

Use only an approved mapping's `bestBankCandidate` as an integrated `anchor`, `guided`, or `contrast` problem. Additional candidates may inform transfer selection only within the repository contract; broad bank search is discovery, not authorization to replace the mapping.

For every integrated bank problem, preserve and interpret:

- `whyNow` as author rationale;
- `entryBridge` as the intended mathematical handoff, rewritten naturally if needed without changing its meaning;
- `reusedRepresentation` as the continuity target;
- `animationPlan` as the controlled slice plan;
- `learnerPrompts` as synchronization requirements;
- `exitBridge` as the idea to harvest.

Never show these mapping fields verbatim merely because they exist. Learner copy must sound natural.

## Choose the teaching source backward from the realization

Follow `preferredSource` and `generatedTeachingPlan`. A mapped bank problem may lead discovery only when it cleanly creates the target realization at the learner's level.

When a bank problem is not ideal for discovery, create a Mathinking-original teaching problem. Design backward:

1. write the exact realization in one sentence;
2. choose the smallest mathematical universe that makes it visible;
3. choose manipulable objects or a simple representation;
4. introduce one source of productive uncertainty;
5. ensure the intended interaction can resolve that uncertainty;
6. verify that the surface is not a light paraphrase of a bank problem.

Prefer clean small numbers and short outcome spaces. Complexity belongs only when it creates the intended tension.

## Integrate authentic problems seamlessly

Before the bank beat, create the relevant question or representation—not a duplicate problem. Transition in as part of the mathematical conversation. Avoid “Here is an AMC problem!” and other abrupt source announcements.

The bank problem itself should own its mathematical question. Its animation or visual must depict the state being discussed. Show provenance subtly according to `sourceLabelTiming`.

Afterward, state why the representation or strategy worked and connect it to the transferable method.

## Build final practice

For benchmark lessons, default to five independent problems:

- 2 Mathinking-original near-transfer;
- 2 Mathinking-original mixed-transfer;
- 1 authentic bank transfer.

Do not immediately reuse an integrated teaching problem. Near transfer should preserve the central decision while changing the surface. Mixed transfer should combine only with declared prerequisites and should change the representation or decision path. Include at least one item where choosing the method or representation is the main challenge.

Original practice must not be a renamed or renumbered AMC question. Store it through `GeneratedProblemArtifact`, mark the source and license as Original, and keep validation status truthful.

## Verify independently

For every generated teaching or practice artifact:

1. recompute the answer without relying on its written solution;
2. verify every written step;
3. enumerate all outcomes when the space is small;
4. verify answer uniqueness and multiple-choice distractor distinctness;
5. audit wording for ambiguity, hidden assumptions, and unit conventions;
6. audit required knowledge against prerequisites;
7. compare against relevant bank problems for paraphrase risk;
8. record at least two genuinely independent validation methods where practical.

Useful independent methods include exhaustive enumeration versus a product/sum argument, direct algebra versus substitution, coordinate geometry versus area decomposition, or symbolic computation versus hand derivation. Two descriptions of the same calculation are not independent.

Keep deterministic verification commands small and reviewable. Do not modify source data merely to make a validator pass.

For authentic problems, independently confirm the stored answer and verify that the lesson's resolution matches the source problem's actual constraints and animation data.
