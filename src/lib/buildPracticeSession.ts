import { filterProblemsBySkill, type PracticeProblemLike } from "./problemFilters";
import type { SkillId } from "./skills";

export function buildPracticeSession<T extends PracticeProblemLike>(
  allProblems: T[],
  selectedSkill: SkillId | string | null,
  limit = 10
): T[] {
  // IMPORTANT: filter first, then take 10.
  // If you take the first 10 first, every skill lane can accidentally show the same default set.
  return filterProblemsBySkill(allProblems, selectedSkill).slice(0, limit);
}
