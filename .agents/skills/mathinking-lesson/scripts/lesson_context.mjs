#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const curriculumFiles = [
  "foundations.json",
  "algebra.json",
  "number-theory.json",
  "counting-probability.json",
  "geometry.json",
  "problem-solving.json",
];

const mappingFiles = curriculumFiles.map((file) => `problem-mapping-${file}`);

function findRepoRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(current, "package.json")) &&
      fs.existsSync(path.join(current, "docs", "lesson-generator-contract.md"))
    ) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error("Run this script from inside the Mathinking repository.");
    }
    current = parent;
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function collectJsonFiles(directory, ignoredDirectory = null) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") || entry.name === ignoredDirectory) return [];
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectJsonFiles(fullPath, ignoredDirectory);
    return entry.isFile() && entry.name.endsWith(".json") ? [fullPath] : [];
  });
}

function relative(repoRoot, file) {
  return file ? path.relative(repoRoot, file) : null;
}

function findLessonFile(lessonFiles, lessonId) {
  return lessonFiles.find((file) => {
    try {
      return readJson(file).lessonId === lessonId;
    } catch {
      return false;
    }
  });
}

function closingBeatSummary(lesson) {
  if (!lesson || !Array.isArray(lesson.beats)) return [];
  return lesson.beats.slice(-3).map((beat) => ({
    id: beat.id,
    phase: beat.phase,
    kind: beat.kind,
    transitionIn: beat.transitionIn,
    transitionOut: beat.transitionOut,
    prompt: beat.prompt,
    entryBridge: beat.entryBridge,
    exitBridge: beat.exitBridge,
    takeaway: beat.takeaway,
    resolution: beat.resolution,
    problemId: beat.problemId,
  }));
}

const lessonId = String(process.argv[2] ?? "").trim().toUpperCase();
if (!/^[A-Z][0-9]+$/.test(lessonId)) {
  console.error("Usage: node .agents/skills/mathinking-lesson/scripts/lesson_context.mjs <LESSON_ID>");
  process.exit(1);
}

const repoRoot = findRepoRoot(process.cwd());
const curriculumDirectory = path.join(repoRoot, "src", "data", "curriculum");
const lessonsDirectory = path.join(repoRoot, "src", "data", "lessons");
const generatedDirectory = path.join(lessonsDirectory, "generated-problems");

const nodes = curriculumFiles.flatMap((file) =>
  readJson(path.join(curriculumDirectory, file))
);
const mappings = mappingFiles.flatMap((file) =>
  readJson(path.join(curriculumDirectory, file))
);
const node = nodes.find((candidate) => candidate.id === lessonId);
const mapping = mappings.find((candidate) => candidate.lessonId === lessonId);

if (!node) {
  console.error(`Unknown curriculum lesson ID: ${lessonId}`);
  process.exit(2);
}
if (!mapping) {
  console.error(`No deep problem mapping exists for ${lessonId}.`);
  process.exit(3);
}

const nodeFile = curriculumFiles.find((file) =>
  readJson(path.join(curriculumDirectory, file)).some(
    (candidate) => candidate.id === lessonId
  )
);
const mappingFile = mappingFiles.find((file) =>
  readJson(path.join(curriculumDirectory, file)).some(
    (candidate) => candidate.lessonId === lessonId
  )
);
const lessonFiles = collectJsonFiles(lessonsDirectory, "generated-problems");
const lessonFile = findLessonFile(lessonFiles, lessonId);
const predecessorId = node.narrativePredecessor;
const predecessorNode = predecessorId
  ? nodes.find((candidate) => candidate.id === predecessorId)
  : null;
const predecessorFile = predecessorId
  ? findLessonFile(lessonFiles, predecessorId)
  : null;
const predecessorLesson = predecessorFile ? readJson(predecessorFile) : null;
const predecessorArtifactsFile = predecessorId
  ? path.join(generatedDirectory, `${predecessorId}.json`)
  : null;
const mappedProblemIds = [
  mapping.bestBankCandidate?.problemId,
  ...(mapping.additionalBankCandidates ?? []).map((candidate) => candidate.problemId),
].filter(Boolean);

const context = {
  lessonId,
  mappingGate: {
    reviewStatus: mapping.reviewStatus,
    approved: mapping.reviewStatus === "approved",
  },
  files: {
    curriculumNode: relative(repoRoot, path.join(curriculumDirectory, nodeFile)),
    deepMapping: relative(repoRoot, path.join(curriculumDirectory, mappingFile)),
    existingLesson: relative(repoRoot, lessonFile),
    generatedArtifacts: relative(
      repoRoot,
      path.join(generatedDirectory, `${lessonId}.json`)
    ),
    lessonRegistry: "src/data/lessons/index.ts",
    problemBank: "src/data/sampleProblems.ts",
    sceneRegistry: "src/components/animation/sceneRegistry.ts",
    lessonTypes: "src/types/lesson.ts",
    lessonValidator: "tools/validate-lesson-spec.mjs",
  },
  curriculumNode: node,
  deepMapping: mapping,
  mappedProblemIds,
  narrativePredecessor: predecessorId
    ? {
        node: predecessorNode,
        lessonPath: relative(repoRoot, predecessorFile),
        generatedArtifactsPath:
          predecessorArtifactsFile && fs.existsSync(predecessorArtifactsFile)
            ? relative(repoRoot, predecessorArtifactsFile)
            : null,
        continuity: predecessorLesson?.continuity ?? null,
        closingBeats: closingBeatSummary(predecessorLesson),
      }
    : null,
  narrativeSuccessors: nodes
    .filter((candidate) => candidate.narrativePredecessor === lessonId)
    .map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      narrativeTransition: candidate.narrativeTransition,
    })),
  existingLessonIds: lessonFiles
    .map((file) => {
      try {
        return readJson(file).lessonId;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort(),
};

console.log(JSON.stringify(context, null, 2));

if (mapping.reviewStatus !== "approved") {
  console.error(`Mapping gate: ${lessonId} is ${mapping.reviewStatus}, not approved.`);
  process.exitCode = 4;
}
