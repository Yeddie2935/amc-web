import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const curriculumDir = path.join(root, "src", "data", "curriculum");
const lessonsDir = path.join(root, "src", "data", "lessons");
const generatedDir = path.join(lessonsDir, "generated-problems");

const curriculumFiles = [
  "foundations.json",
  "algebra.json",
  "number-theory.json",
  "counting-probability.json",
  "geometry.json",
  "problem-solving.json",
];
const mappingFiles = [
  "problem-mapping-foundations.json",
  "problem-mapping-algebra.json",
  "problem-mapping-number-theory.json",
  "problem-mapping-counting-probability.json",
  "problem-mapping-geometry.json",
  "problem-mapping-problem-solving.json",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function collectJsonFiles(dir, { excludeDirNames = [] } = {}) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludeDirNames.includes(entry.name)) {
        out.push(...collectJsonFiles(full, { excludeDirNames }));
      }
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

function sameStringSet(a = [], b = []) {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((value, index) => value === right[index]);
}

const nodes = curriculumFiles.flatMap((file) => readJson(path.join(curriculumDir, file)));
const nodeById = new Map(nodes.map((node) => [node.id, node]));
const mappings = mappingFiles.flatMap((file) => readJson(path.join(curriculumDir, file)));
const mappingByLesson = new Map(mappings.map((mapping) => [mapping.lessonId, mapping]));

const sampleProblemsSource = fs.readFileSync(path.join(root, "src", "data", "sampleProblems.ts"), "utf8");
const bankIds = new Set(
  [...sampleProblemsSource.matchAll(/"id"\s*:\s*"(amc8-[^"]+)"/g)].map((match) => match[1])
);

const generatedFiles = collectJsonFiles(generatedDir);
const generatedArtifacts = generatedFiles.flatMap((file) => {
  const value = readJson(file);
  return Array.isArray(value) ? value : [value];
});
const generatedById = new Map(generatedArtifacts.map((artifact) => [artifact?.problem?.id, artifact]));

const lessonFiles = collectJsonFiles(lessonsDir, { excludeDirNames: ["generated-problems"] });
const errors = [];
const warnings = [];

for (const file of lessonFiles) {
  const relative = path.relative(root, file);
  let lesson;
  try {
    lesson = readJson(file);
  } catch (error) {
    errors.push(`${relative}: invalid JSON (${error.message}).`);
    continue;
  }

  const label = lesson.lessonId ?? relative;
  const node = nodeById.get(lesson.curriculumNodeId);
  if (lesson.schemaVersion !== "1.0.0") errors.push(`${label}: schemaVersion must be 1.0.0.`);
  if (!node) {
    errors.push(`${label}: unknown curriculumNodeId ${lesson.curriculumNodeId}.`);
    continue;
  }
  if (lesson.lessonId !== node.id) {
    errors.push(`${label}: lessonId should equal curriculum node id ${node.id}.`);
  }
  if (lesson.lessonType !== node.lessonType) {
    errors.push(`${label}: lessonType differs from curriculum node.`);
  }
  if (lesson.coreInsight !== node.coreInsight) {
    errors.push(`${label}: coreInsight must match the curriculum contract exactly.`);
  }
  if (!sameStringSet(lesson.hardPrerequisites, node.hardPrerequisites)) {
    errors.push(`${label}: hardPrerequisites differ from curriculum graph.`);
  }
  if (lesson.narrativePredecessor !== node.narrativePredecessor) {
    errors.push(`${label}: narrativePredecessor differs from curriculum graph.`);
  }

  const beats = Array.isArray(lesson.beats) ? lesson.beats : [];
  if (beats.length === 0) errors.push(`${label}: lesson requires at least one beat.`);
  const beatIds = new Set();
  for (const beat of beats) {
    if (!beat.id?.trim()) errors.push(`${label}: every beat requires an id.`);
    if (beatIds.has(beat.id)) errors.push(`${label}: duplicate beat id ${beat.id}.`);
    beatIds.add(beat.id);
    if (!beat.purpose?.trim()) errors.push(`${label}/${beat.id}: beat requires purpose.`);

    if (beat.resolution !== undefined) {
      const resolution = beat.resolution;
      const hasVisual = resolution?.visual !== undefined;
      const hasAnimation = resolution?.animation !== undefined;
      const hasSteps = Array.isArray(resolution?.steps) && resolution.steps.length > 0;
      const hasTakeaway = Boolean(resolution?.takeaway?.trim());
      if (!hasVisual && !hasAnimation && !hasSteps && !hasTakeaway) {
        errors.push(`${label}/${beat.id}: resolution must contain a visual, animation, steps, or takeaway.`);
      }
      if (resolution?.steps !== undefined) {
        if (!Array.isArray(resolution.steps) || resolution.steps.length === 0) {
          errors.push(`${label}/${beat.id}: resolution steps must be a nonempty array when supplied.`);
        } else {
          for (const [stepIndex, step] of resolution.steps.entries()) {
            if (!step?.body?.trim()) {
              errors.push(`${label}/${beat.id}: resolution step ${stepIndex + 1} requires body text.`);
            }
          }
        }
      }
      if (hasVisual && (!resolution.visual?.primitive || !resolution.visual?.data)) {
        errors.push(`${label}/${beat.id}: resolution visual requires a primitive and data.`);
      }
      if (hasAnimation) {
        if (beat.kind !== "problem") {
          errors.push(`${label}/${beat.id}: only problem beats may use a problem-animation resolution.`);
        }
        if (resolution.animation?.kind !== "problem-animation") {
          errors.push(`${label}/${beat.id}: resolution animation kind must be problem-animation.`);
        }
        if (
          resolution.animation?.placement !== undefined &&
          !["before-steps", "after-steps"].includes(resolution.animation.placement)
        ) {
          errors.push(
            `${label}/${beat.id}: resolution animation placement must be before-steps or after-steps.`
          );
        }
        if (beat.animation?.mode === "none") {
          errors.push(`${label}/${beat.id}: problem-animation resolution requires a renderable animation plan.`);
        }
      }
    }

    if (beat.kind === "problem") {
      if (!beat.whyNow?.trim() || !beat.entryBridge?.trim() || !beat.exitBridge?.trim()) {
        errors.push(`${label}/${beat.id}: problem beats require whyNow, entryBridge, and exitBridge.`);
      }
      if (!Array.isArray(beat.learnerPrompts) || beat.learnerPrompts.length === 0) {
        errors.push(`${label}/${beat.id}: problem beat requires learnerPrompts.`);
      }

      if (beat.source === "bank") {
        if (!bankIds.has(beat.problemId)) {
          errors.push(`${label}/${beat.id}: unknown bank problem ${beat.problemId}.`);
        }
        if (["anchor", "guided", "contrast"].includes(beat.role)) {
          const mapping = mappingByLesson.get(node.id);
          const authorized =
            mapping?.reviewStatus === "approved" &&
            mapping?.bestBankCandidate?.problemId === beat.problemId &&
            mapping?.bestBankCandidate?.role === beat.role;
          if (!authorized) {
            errors.push(
              `${label}/${beat.id}: integrated bank problem ${beat.problemId} (${beat.role}) is not authorized by the approved deep mapping.`
            );
          }
          if (!beat.animation?.controlledByLesson) {
            errors.push(`${label}/${beat.id}: integrated bank animations must be controlled by the lesson.`);
          }
        }
      } else if (beat.source === "generated") {
        const artifact = generatedById.get(beat.problemId);
        if (!artifact) {
          errors.push(`${label}/${beat.id}: generated problem ${beat.problemId} has no artifact.`);
        } else {
          if (artifact.lessonId !== lesson.lessonId) {
            errors.push(`${label}/${beat.id}: generated problem belongs to ${artifact.lessonId}.`);
          }
          const validation = artifact.validation ?? {};
          if (validation.status === "draft") {
            errors.push(`${label}/${beat.id}: generated problem ${beat.problemId} is still draft.`);
          }
          for (const field of [
            "answerVerified",
            "solutionVerified",
            "prerequisiteAuditPassed",
            "wordingReviewed",
            "notParaphraseOfBank",
          ]) {
            if (validation[field] !== true) {
              errors.push(`${label}/${beat.id}: generated problem ${beat.problemId} failed ${field}.`);
            }
          }
          if (validation.uniquenessVerified === false) {
            errors.push(`${label}/${beat.id}: generated problem ${beat.problemId} failed uniqueness validation.`);
          }
        }
      } else {
        errors.push(`${label}/${beat.id}: problem source must be bank or generated.`);
      }

      const animation = beat.animation ?? {};
      if (animation.mode === "slice") {
        if (!Array.isArray(animation.stepIndices) || animation.stepIndices.length === 0) {
          errors.push(`${label}/${beat.id}: slice animation needs stepIndices.`);
        } else {
          const seen = new Set();
          for (const index of animation.stepIndices) {
            if (!Number.isInteger(index) || index < 0) errors.push(`${label}/${beat.id}: invalid animation step ${index}.`);
            if (seen.has(index)) errors.push(`${label}/${beat.id}: duplicate animation step ${index}.`);
            seen.add(index);
          }
        }
      }
    }
  }

  for (const target of lesson.misconceptionTargets ?? []) {
    if (!target.misconception?.trim()) errors.push(`${label}: misconception target missing text.`);
    if (!Array.isArray(target.beatIds) || target.beatIds.length === 0) {
      errors.push(`${label}: misconception target requires beatIds.`);
    }
    for (const beatId of target.beatIds ?? []) {
      if (!beatIds.has(beatId)) errors.push(`${label}: misconception references unknown beat ${beatId}.`);
    }
  }

  for (const nextId of lesson.continuity?.nextLessonIds ?? []) {
    if (!nodeById.has(nextId)) errors.push(`${label}: continuity references unknown next lesson ${nextId}.`);
  }

  const firstConceptIndex = beats.findIndex((beat) => beat.kind === "concept" || beat.phase === "name");
  if (firstConceptIndex === 0) {
    warnings.push(`${label}: concept/name reveal is the first beat; verify discovery-first is intentionally waived.`);
  }

  const teachingProblemIds = beats
    .filter((beat) => beat.kind === "problem" && beat.role !== "transfer")
    .map((beat) => beat.problemId);
  for (const problemId of teachingProblemIds) {
    if (!(lesson.practice?.excludeProblemIds ?? []).includes(problemId)) {
      errors.push(`${label}: teaching problem ${problemId} must be excluded from immediate final practice.`);
    }
  }

  const practiceRules = lesson.practice?.sessionSelection ?? [];
  const practiceCount = practiceRules.reduce((sum, rule) => sum + Number(rule.count ?? 0), 0);
  if (practiceCount <= 0) errors.push(`${label}: practice session must select at least one item.`);

  const threshold = lesson.mastery?.recommendedAccuracyThreshold;
  if (typeof threshold !== "number" || threshold < 0 || threshold > 1) {
    errors.push(`${label}: mastery threshold must be between 0 and 1.`);
  }
  for (const evidenceId of lesson.mastery?.evidenceBeatIds ?? []) {
    if (!beatIds.has(evidenceId)) errors.push(`${label}: mastery references unknown beat ${evidenceId}.`);
  }

  const practiceArtifacts = generatedArtifacts.filter(
    (artifact) => artifact.lessonId === lesson.lessonId && artifact.purpose === "practice" && artifact.validation?.status !== "draft"
  );
  const counts = {
    near: practiceArtifacts.filter((artifact) => artifact.transferLevel === "near").length,
    mixed: practiceArtifacts.filter((artifact) => artifact.transferLevel === "mixed").length,
    challenge: practiceArtifacts.filter((artifact) => artifact.transferLevel === "challenge").length,
  };
  const minimums = lesson.practice?.generatedPoolMinimum ?? {};
  for (const level of ["near", "mixed", "challenge"]) {
    const required = Number(minimums[level] ?? 0);
    if (["validated", "approved"].includes(lesson.status) && counts[level] < required) {
      errors.push(`${label}: only ${counts[level]} validated ${level} practice items; requires ${required}.`);
    } else if (lesson.status === "draft" && counts[level] < required) {
      warnings.push(`${label}: draft has ${counts[level]}/${required} validated ${level} practice items.`);
    }
  }
}

if (warnings.length) {
  console.warn("Lesson spec warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("Lesson spec validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Lesson specs valid: ${lessonFiles.length} lesson file(s), ${generatedArtifacts.length} generated problem artifact(s).`);
