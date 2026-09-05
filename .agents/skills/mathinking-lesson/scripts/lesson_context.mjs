#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadResolvedProblemMappings,
  problemMappingFiles,
} from "../../../../tools/problem-mapping-resolver.mjs";

const curriculumFiles = [
  "foundations.json",
  "algebra.json",
  "number-theory.json",
  "counting-probability.json",
  "geometry.json",
  "problem-solving.json",
];
const mappingFiles = problemMappingFiles;

export function findRepoRoot(start) {
  let current = path.resolve(start);
  while (true) {
    if (
      fs.existsSync(path.join(current, "package.json")) &&
      fs.existsSync(path.join(current, "docs", "lesson-generator-contract.md"))
    ) return current;
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

function learnerFacingClosingBeats(lesson) {
  if (!lesson || !Array.isArray(lesson.beats)) return [];
  return lesson.beats.slice(-3).map((beat) => ({
    id: beat.id,
    phase: beat.phase,
    kind: beat.kind,
    transitionIn: beat.transitionIn,
    transitionOut: beat.transitionOut,
    heading: beat.heading,
    body: beat.body,
    prompt: beat.prompt,
    name: beat.name,
    conciseDefinition: beat.conciseDefinition,
    entryBridge: beat.entryBridge,
    exitBridge: beat.exitBridge,
    takeaway: beat.takeaway,
    resolution: beat.resolution,
    problemId: beat.problemId,
  }));
}

function extractJsonObjectAt(source, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return JSON.parse(source.slice(start, index + 1));
    }
  }
  throw new Error("Unterminated problem object in sampleProblems.ts.");
}

export function findBankProblem(repoRoot, problemId) {
  const problemBankPath = path.join(repoRoot, "src", "data", "sampleProblems.ts");
  const source = fs.readFileSync(problemBankPath, "utf8");
  const escapedId = problemId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`"id"\\s*:\\s*"${escapedId}"`).exec(source);
  if (!match) return null;
  const objectStart = source.lastIndexOf("\n  {", match.index);
  if (objectStart < 0) return null;
  return extractJsonObjectAt(source, objectStart + 3);
}

function resolveScenePaths(repoRoot, animationType) {
  if (!animationType) return [];
  const registryPath = path.join(
    repoRoot,
    "src",
    "components",
    "animation",
    "sceneRegistry.ts"
  );
  const source = fs.readFileSync(registryPath, "utf8");
  const imports = new Map(
    [...source.matchAll(/import\s+\{\s*(\w+Scene)\s*\}\s+from\s+"(\.\/scenes\/[^\"]+)"/g)].map(
      (match) => [match[1], match[2]]
    )
  );
  const escapedType = animationType.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const typeMatch = new RegExp(`["']${escapedType}["']`).exec(source);
  if (!typeMatch) return [];
  const nearby = source.slice(typeMatch.index, typeMatch.index + 1800);
  const componentNames = [...nearby.matchAll(/return\s+(\w+Scene)\b/g)].map(
    (match) => match[1]
  );
  for (const componentName of componentNames) {
    const importPath = imports.get(componentName);
    if (!importPath) continue;
    const scenePath = path.join(
      repoRoot,
      "src",
      "components",
      "animation",
      `${importPath.slice(2)}.tsx`
    );
    if (fs.existsSync(scenePath)) return [relative(repoRoot, scenePath)];
  }
  return [];
}

function compactBankProblem(repoRoot, problemId) {
  const problem = findBankProblem(repoRoot, problemId);
  if (!problem) {
    return {
      problemId,
      found: false,
      sourcePath: "src/data/sampleProblems.ts",
      sourceLocator: `\"id\": \"${problemId}\"`,
    };
  }
  return {
    problemId,
    found: true,
    sourcePath: "src/data/sampleProblems.ts",
    sourceLocator: `\"id\": \"${problemId}\"`,
    title: problem.title,
    statement: problem.statement,
    choices: problem.choices,
    answer: problem.answer,
    shortAnswer: problem.shortAnswer,
    difficulty: problem.difficulty,
    category: problem.category,
    subcategory: problem.subcategory,
    solutionSteps: problem.solutionSteps,
    animation: problem.animation
      ? {
          type: problem.animation.type,
          data: problem.animation.data,
          timelineStepCount: problem.solutionSteps?.length
            ? problem.solutionSteps.length
            : problem.animationFrames?.length
              ? problem.animationFrames.length
              : 3,
          scenePaths: resolveScenePaths(repoRoot, problem.animation.type),
        }
      : null,
  };
}

export function mappingGateFor(mapping) {
  return {
    reviewStatus: mapping?.reviewStatus ?? "missing",
    approved: mapping?.reviewStatus === "approved",
    exitCode: !mapping ? 3 : mapping.reviewStatus === "approved" ? 0 : 4,
  };
}

export function loadContextMappings(repoRoot) {
  const curriculumDirectory = path.join(repoRoot, "src", "data", "curriculum");
  return loadResolvedProblemMappings(curriculumDirectory).mappings;
}

function loadRepositoryContext(repoRoot, lessonId) {
  const curriculumDirectory = path.join(repoRoot, "src", "data", "curriculum");
  const lessonsDirectory = path.join(repoRoot, "src", "data", "lessons");
  const generatedDirectory = path.join(lessonsDirectory, "generated-problems");
  const nodes = curriculumFiles.flatMap((file) =>
    readJson(path.join(curriculumDirectory, file))
  );
  const mappings = loadContextMappings(repoRoot);
  const node = nodes.find((candidate) => candidate.id === lessonId);
  const mapping = mappings.find((candidate) => candidate.lessonId === lessonId);
  if (!node) {
    const error = new Error(`Unknown curriculum lesson ID: ${lessonId}`);
    error.exitCode = 2;
    throw error;
  }
  if (!mapping) {
    const error = new Error(`No deep problem mapping exists for ${lessonId}.`);
    error.exitCode = 3;
    throw error;
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
    ...(mapping.additionalBankCandidates ?? []).map(
      (candidate) => candidate.problemId
    ),
  ].filter(Boolean);
  const successorNodes = nodes.filter(
    (candidate) => candidate.narrativePredecessor === lessonId
  );
  const prerequisiteNodes = (node.hardPrerequisites ?? [])
    .map((id) => nodes.find((candidate) => candidate.id === id))
    .filter(Boolean);
  return {
    curriculumDirectory,
    generatedDirectory,
    nodes,
    mappings,
    node,
    mapping,
    nodeFile,
    mappingFile,
    lessonFiles,
    lessonFile,
    predecessorId,
    predecessorNode,
    predecessorFile,
    predecessorLesson,
    predecessorArtifactsFile,
    mappedProblemIds,
    successorNodes,
    prerequisiteNodes,
  };
}

export function createLessonContext({ repoRoot, lessonId, mode = "compact" }) {
  const data = loadRepositoryContext(repoRoot, lessonId);
  const {
    curriculumDirectory,
    generatedDirectory,
    node,
    mapping,
    nodeFile,
    mappingFile,
    lessonFiles,
    lessonFile,
    predecessorId,
    predecessorNode,
    predecessorFile,
    predecessorLesson,
    predecessorArtifactsFile,
    mappedProblemIds,
    successorNodes,
    prerequisiteNodes,
  } = data;
  const gate = mappingGateFor(mapping);
  const bankProblems = mappedProblemIds.map((problemId) =>
    compactBankProblem(repoRoot, problemId)
  );
  const files = {
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
    primitiveRenderer: "src/components/lesson/VisualPrimitiveHost.tsx",
    lessonValidator: "tools/validate-lesson-spec.mjs",
    browserQa: "tools/qa-lesson.mjs",
  };
  const narrativePredecessor = predecessorId
    ? {
        id: predecessorId,
        title: predecessorNode?.title ?? null,
        lessonPath: relative(repoRoot, predecessorFile),
        generatedArtifactsPath:
          predecessorArtifactsFile && fs.existsSync(predecessorArtifactsFile)
            ? relative(repoRoot, predecessorArtifactsFile)
            : null,
        curriculumCoreInsight: predecessorNode?.coreInsight ?? null,
        continuity: predecessorLesson?.continuity ?? null,
        finalLearnerFacingBeats: learnerFacingClosingBeats(predecessorLesson),
      }
    : null;
  const narrativeSuccessors = successorNodes.map((candidate) => ({
    id: candidate.id,
    title: candidate.title,
    narrativeTransition: candidate.narrativeTransition,
  }));

  if (mode === "full") {
    return {
      packetVersion: 2,
      mode,
      lessonId,
      mappingGate: gate,
      files,
      curriculumNode: node,
      deepMapping: mapping,
      mappedProblemIds,
      mappedBankProblems: bankProblems,
      narrativePredecessor: narrativePredecessor
        ? { ...narrativePredecessor, node: predecessorNode }
        : null,
      narrativeSuccessors,
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
  }

  return {
    packetVersion: 2,
    mode: "compact",
    lessonId,
    mappingGate: gate,
    curriculum: {
      id: node.id,
      title: node.title,
      strand: node.strand,
      lessonType: node.lessonType,
      coreInsight: node.coreInsight,
      hardPrerequisites: node.hardPrerequisites,
      misconceptionTargets: node.commonMisconceptions,
      narrativePredecessor: node.narrativePredecessor,
      narrativeTransition: node.narrativeTransition,
      unlocks: node.unlocks,
      transferConnections: node.transferConnections,
    },
    prerequisiteSummaries: prerequisiteNodes.map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      coreInsight: candidate.coreInsight,
    })),
    approvedMapping: {
      preferredTeachingSource: mapping.preferredSource,
      targetLearnerRealization: mapping.targetLearnerRealization,
      bestBankCandidate: mapping.bestBankCandidate ?? null,
      additionalBankCandidates: mapping.additionalBankCandidates ?? [],
      generatedTeachingPlan: mapping.generatedTeachingPlan ?? null,
    },
    mappedProblemIds,
    mappedBankProblems: bankProblems,
    continuity: {
      predecessor: narrativePredecessor,
      successors: narrativeSuccessors,
    },
    files,
  };
}

function usage() {
  return [
    "Usage: node .agents/skills/mathinking-lesson/scripts/lesson_context.mjs <LESSON_ID> [--compact|--full]",
    "",
    "--compact  Routine authoring packet (default).",
    "--full     Expanded diagnostic packet.",
  ].join("\n");
}

async function main() {
  const lessonId = String(process.argv[2] ?? "").trim().toUpperCase();
  const modeFlag = process.argv[3] ?? "--compact";
  if (!/^[A-Z][0-9]+$/.test(lessonId) || !["--compact", "--full"].includes(modeFlag)) {
    console.error(usage());
    process.exitCode = 1;
    return;
  }
  try {
    const context = createLessonContext({
      repoRoot: findRepoRoot(process.cwd()),
      lessonId,
      mode: modeFlag === "--full" ? "full" : "compact",
    });
    console.log(JSON.stringify(context, null, 2));
    if (!context.mappingGate.approved) {
      console.error(
        `Mapping gate: ${lessonId} is ${context.mappingGate.reviewStatus}, not approved.`
      );
      process.exitCode = context.mappingGate.exitCode;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = error.exitCode ?? 1;
  }
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) await main();
