import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const curriculumDir = path.join(repoRoot, "src", "data", "curriculum");

const strandFiles = [
  "foundations.json",
  "algebra.json",
  "number-theory.json",
  "counting-probability.json",
  "geometry.json",
  "problem-solving.json",
];

const allowedStrands = new Set([
  "foundations",
  "algebra",
  "numberTheory",
  "countingProbability",
  "geometry",
  "problemSolving",
]);
const allowedLessonTypes = new Set(["foundation", "technique", "connector"]);

function readJson(fileName) {
  return JSON.parse(fs.readFileSync(path.join(curriculumDir, fileName), "utf8"));
}

const meta = readJson("meta.json");
const nodes = strandFiles.flatMap((fileName) => readJson(fileName));
const errors = [];
const ids = new Set();
const byId = new Map();

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${label} must be a non-empty string`);
  }
}

if (nodes.length !== meta.target?.expectedNodeCount) {
  errors.push(
    `Expected ${meta.target?.expectedNodeCount} curriculum nodes, found ${nodes.length}`
  );
}

for (const node of nodes) {
  requireNonEmptyString(node.id, "node.id");
  requireNonEmptyString(node.title, `${node.id}.title`);
  requireNonEmptyString(node.coreInsight, `${node.id}.coreInsight`);
  requireNonEmptyString(node.narrativeTransition, `${node.id}.narrativeTransition`);

  if (ids.has(node.id)) errors.push(`Duplicate node id: ${node.id}`);
  ids.add(node.id);
  byId.set(node.id, node);

  if (!allowedStrands.has(node.strand)) {
    errors.push(`${node.id}.strand is invalid: ${node.strand}`);
  }
  if (!allowedLessonTypes.has(node.lessonType)) {
    errors.push(`${node.id}.lessonType is invalid: ${node.lessonType}`);
  }

  for (const field of [
    "hardPrerequisites",
    "unlocks",
    "transferConnections",
    "commonMisconceptions",
  ]) {
    if (!Array.isArray(node[field])) errors.push(`${node.id}.${field} must be an array`);
  }

  if (!Array.isArray(node.commonMisconceptions) || node.commonMisconceptions.length < 2) {
    errors.push(`${node.id} should include at least two common misconceptions`);
  }
}

for (const node of nodes) {
  for (const prerequisiteId of node.hardPrerequisites ?? []) {
    if (!byId.has(prerequisiteId)) {
      errors.push(`${node.id} references missing prerequisite ${prerequisiteId}`);
      continue;
    }
    if (prerequisiteId === node.id) {
      errors.push(`${node.id} cannot require itself`);
    }
    const prerequisite = byId.get(prerequisiteId);
    if (!prerequisite.unlocks.includes(node.id)) {
      errors.push(
        `${node.id} requires ${prerequisiteId}, but ${prerequisiteId}.unlocks does not include ${node.id}`
      );
    }
  }

  for (const unlockedId of node.unlocks ?? []) {
    if (!byId.has(unlockedId)) {
      errors.push(`${node.id} unlocks missing node ${unlockedId}`);
      continue;
    }
    const unlocked = byId.get(unlockedId);
    if (!unlocked.hardPrerequisites.includes(node.id)) {
      errors.push(
        `${node.id}.unlocks includes ${unlockedId}, but ${unlockedId} does not require ${node.id}`
      );
    }
  }

  if (node.narrativePredecessor !== null && !byId.has(node.narrativePredecessor)) {
    errors.push(
      `${node.id} references missing narrative predecessor ${node.narrativePredecessor}`
    );
  }

  for (const transferId of node.transferConnections ?? []) {
    if (!byId.has(transferId)) {
      errors.push(`${node.id} references missing transfer connection ${transferId}`);
    }
    if (transferId === node.id) {
      errors.push(`${node.id} cannot transfer to itself`);
    }
  }
}

for (const [from, to] of meta.goldNarrativeEdges ?? []) {
  if (!byId.has(from) || !byId.has(to)) {
    errors.push(`Gold narrative edge ${from} -> ${to} references a missing node`);
  }
  const target = byId.get(to);
  if (target && target.narrativePredecessor !== from) {
    errors.push(
      `Gold narrative edge ${from} -> ${to} disagrees with ${to}.narrativePredecessor (${target.narrativePredecessor})`
    );
  }
}

// Kahn topological sort over hard-prerequisite edges.
const indegree = new Map(nodes.map((node) => [node.id, 0]));
const adjacency = new Map(nodes.map((node) => [node.id, []]));
for (const node of nodes) {
  for (const prerequisiteId of node.hardPrerequisites ?? []) {
    if (!byId.has(prerequisiteId)) continue;
    adjacency.get(prerequisiteId).push(node.id);
    indegree.set(node.id, indegree.get(node.id) + 1);
  }
}

const queue = [...indegree.entries()]
  .filter(([, degree]) => degree === 0)
  .map(([id]) => id);
let visited = 0;
while (queue.length > 0) {
  const id = queue.shift();
  visited += 1;
  for (const next of adjacency.get(id)) {
    const degree = indegree.get(next) - 1;
    indegree.set(next, degree);
    if (degree === 0) queue.push(next);
  }
}
if (visited !== nodes.length) {
  const cyclic = [...indegree.entries()]
    .filter(([, degree]) => degree > 0)
    .map(([id]) => id)
    .join(", ");
  errors.push(`Hard-prerequisite graph contains a cycle involving: ${cyclic}`);
}

if (errors.length > 0) {
  console.error(`Curriculum validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const byStrand = Object.fromEntries(
  [...allowedStrands].map((strand) => [
    strand,
    nodes.filter((node) => node.strand === strand).length,
  ])
);

console.log(`Curriculum valid: ${nodes.length} nodes, ${visited} in DAG.`);
console.log(byStrand);
