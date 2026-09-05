#!/bin/bash
set -u

LESSONS=("C9" "C10" "P1" "P2" "P3")

echo "=== Mathinking unattended lesson batch ==="

# Safety: start only from a clean working tree.
if [ -n "$(git status --porcelain)" ]; then
  echo "ERROR: Working tree is not clean."
  echo "Commit or stash changes before running this batch."
  exit 1
fi

for lesson in "${LESSONS[@]}"; do
  echo
  echo "======================================"
  echo "BUILDING $lesson"
  echo "======================================"

  codex exec --approve-for-me \
    "\$mathinking-lesson Build $lesson.

This is an unattended routine lesson build.

Build only $lesson. Use the optimized compact-context workflow and existing Mathinking lesson Skill.

Preserve all previously completed lessons. Do not alter curriculum nodes or approved problem mappings. Do not redesign unrelated infrastructure.

You may add the smallest generic reusable renderer/primitive infrastructure only if genuinely required by the mathematics.

Apply all current Skill rules, including:
- continuity should reactivate prior knowledge briefly and then advance;
- interactions must not reveal their answers before the learner acts;
- discovery before terminology;
- worked visual resolutions;
- elegant alternate methods may appear after the primary method when genuinely useful;
- consolidate before the forward hook.

Run the Skill's normal mathematical, pedagogical, continuity, validation, build, diff, and browser-QA gates.

Do not commit and do not push. Finish after $lesson."

  CODEX_STATUS=$?

  if [ $CODEX_STATUS -ne 0 ]; then
    echo
    echo "ERROR: Codex failed while building $lesson."
    echo "Stopping before the next lesson."
    exit 1
  fi

  node tools/verify-authored-lesson.mjs "$lesson" || exit 1

  echo
  echo "=== Independent final gates for $lesson ==="

  npm run validate:learn || exit 1
  npm run build || exit 1
  git diff --check || exit 1
  npm run qa:lesson -- "$lesson" || exit 1

  # Never allow unattended curriculum/mapping changes.
  if git diff --name-only | grep -q '^src/data/curriculum/'; then
    echo "ERROR: $lesson modified curriculum/mapping data."
    echo "Stopping without committing."
    exit 1
  fi

  echo
  echo "=== Committing $lesson ==="

  git add -A
  git commit -m "Add $lesson lesson" || {
    echo "ERROR: Could not commit $lesson."
    exit 1
  }

  echo "✓ $lesson complete and committed."
done

echo
echo "======================================"
echo "BATCH COMPLETE"
echo "======================================"
git log --oneline -5
echo
echo "C9, C10, P1, P2, and P3 are committed locally."
echo "Nothing was pushed automatically."
