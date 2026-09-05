import type { CurriculumGraph, CurriculumMeta, CurriculumNode } from "../../types/curriculum";

import metaJson from "./meta.json";
import foundationsJson from "./foundations.json";
import algebraJson from "./algebra.json";
import numberTheoryJson from "./number-theory.json";
import countingProbabilityJson from "./counting-probability.json";
import geometryJson from "./geometry.json";
import problemSolvingJson from "./problem-solving.json";

export const curriculumMeta = metaJson as CurriculumMeta;

export const curriculumNodes: CurriculumNode[] = [
  ...(foundationsJson as CurriculumNode[]),
  ...(algebraJson as CurriculumNode[]),
  ...(numberTheoryJson as CurriculumNode[]),
  ...(countingProbabilityJson as CurriculumNode[]),
  ...(geometryJson as CurriculumNode[]),
  ...(problemSolvingJson as CurriculumNode[]),
];

export const curriculumById: Record<string, CurriculumNode> = Object.fromEntries(
  curriculumNodes.map((node) => [node.id, node])
);

export const curriculumGraph: CurriculumGraph = {
  meta: curriculumMeta,
  nodes: curriculumNodes,
  byId: curriculumById,
};

export function getCurriculumNode(id: string): CurriculumNode | undefined {
  return curriculumById[id];
}

export function getPrerequisiteNodes(id: string): CurriculumNode[] {
  const node = getCurriculumNode(id);
  if (!node) return [];
  return node.hardPrerequisites
    .map((prerequisiteId) => getCurriculumNode(prerequisiteId))
    .filter((candidate): candidate is CurriculumNode => Boolean(candidate));
}

export function getUnlockedNodes(id: string): CurriculumNode[] {
  const node = getCurriculumNode(id);
  if (!node) return [];
  return node.unlocks
    .map((unlockedId) => getCurriculumNode(unlockedId))
    .filter((candidate): candidate is CurriculumNode => Boolean(candidate));
}
