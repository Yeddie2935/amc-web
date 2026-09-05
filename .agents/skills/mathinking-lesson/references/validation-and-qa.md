# Validation, preview, and browser QA

## Register and validate the data

Ensure the new lesson and artifact JSON are loaded by `src/data/lessons/index.ts` without lesson-specific renderer logic. Keep lesson registry code declarative.

Run, in order:

```bash
npm run validate:learn
npm run build
git diff --check
```

Fix failures caused by the lesson. Report existing warnings separately rather than hiding them. Inspect the final diff and confirm that curriculum nodes and approved mapping files did not change.

`tools/validate-lesson-spec.mjs` is the executable contract. Read it before authoring and update it only for a genuinely generic schema invariant introduced by the work.

## Preview the actual route

Start the existing development server and open:

```text
/learn/<LESSON_ID>
```

Use the repository's existing lesson lookup and `LessonRenderer`. Do not create a lesson-specific page.

Prefer an existing browser/QA harness when the repository provides one. Otherwise use the environment's browser tooling directly. Do not commit a one-off lesson-specific headless script. Add reusable QA infrastructure only when it provides repeatable value across lessons.

## Exercise the whole lesson

Complete every beat in order. Test at least one incorrect retry where retry behavior matters, then the correct path. Verify:

- progression is blocked until required interaction;
- resolution is not revealed prematurely;
- immediate feedback precedes the worked explanation;
- completed beats remain readable as one story;
- each sort or selection shows the intended resulting structure;
- every generated and bank problem resolves through the shared architecture;
- practice remains independent rather than guided imitation;
- the final recap and narrative hook both render;
- completion state is reachable;
- no console or runtime errors occur.

For every visual, state the current learner-facing question and confirm that the image answers that question. Inspect desktop and mobile widths for clipping, horizontal overflow, illegible labels, inaccessible controls, and large disruptive layout jumps.

For controlled animation, verify:

- no autoplay;
- no full problem-player controls;
- first, intermediate, and final selected steps render;
- Previous/Next visual controls stay within the declared slice;
- prompts remain synchronized at every step;
- the scene depicts the authentic problem rather than a generic unrelated fallback;
- reduced-motion mode remains mathematically understandable.

## Final audit

Read the rendered learner-facing text from top to bottom. Search specifically for leaked words such as “mapping,” “implementation,” “case headers,” “organizer,” “the learner,” or formal predecessor narration. A valid author-only occurrence is fine; a rendered occurrence must be intentional student language.

Re-run independent answer checks after the final content edit. Then run all three validation commands again and report exact results, expected warnings, runtime findings, and any generic primitive added.
