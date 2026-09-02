import type { CurriculumProblemMapping } from "../../types/curriculumProblemMapping";

import foundationsJson from "./problem-mapping-foundations.json";
import algebraJson from "./problem-mapping-algebra.json";
import numberTheoryJson from "./problem-mapping-number-theory.json";
import countingProbabilityJson from "./problem-mapping-counting-probability.json";
import geometryJson from "./problem-mapping-geometry.json";
import problemSolvingJson from "./problem-mapping-problem-solving.json";

export const curriculumProblemMappings: CurriculumProblemMapping[] = [
  ...(foundationsJson as CurriculumProblemMapping[]),
  ...(algebraJson as CurriculumProblemMapping[]),
  ...(numberTheoryJson as CurriculumProblemMapping[]),
  ...(countingProbabilityJson as CurriculumProblemMapping[]),
  ...(geometryJson as CurriculumProblemMapping[]),
  ...(problemSolvingJson as CurriculumProblemMapping[]),
];

export const curriculumProblemMappingByLesson: Record<string, CurriculumProblemMapping> =
  Object.fromEntries(curriculumProblemMappings.map((mapping) => [mapping.lessonId, mapping]));

export function getCurriculumProblemMapping(lessonId: string): CurriculumProblemMapping | undefined {
  return curriculumProblemMappingByLesson[lessonId];
}

export function getApprovedIntegratedBankProblem(lessonId: string) {
  const mapping = getCurriculumProblemMapping(lessonId);
  if (!mapping || mapping.reviewStatus !== "approved") return undefined;
  const candidate = mapping.bestBankCandidate;
  if (!candidate) return undefined;
  if (candidate.role === "transfer") return undefined;
  return candidate;
}
