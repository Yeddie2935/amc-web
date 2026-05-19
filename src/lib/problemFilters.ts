import { normalizeSkillId, type SkillId } from "./skills";

export type PracticeProblemLike = {
  id?: string;
  category?: string | string[];
  skill?: string | string[];
  topic?: string | string[];
  skills?: string[];
  tags?: string[];
};

function asArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x): x is string => typeof x === "string");
  if (typeof value === "string") return [value];
  return [];
}

export function getProblemSkillIds(problem: PracticeProblemLike): SkillId[] {
  const rawValues = [
    ...asArray(problem.skills),
    ...asArray(problem.category),
    ...asArray(problem.skill),
    ...asArray(problem.topic),
    ...asArray(problem.tags),
  ];

  const normalized = rawValues
    .map((value) => normalizeSkillId(value))
    .filter((value): value is SkillId => value !== null);

  return Array.from(new Set(normalized));
}

export function problemMatchesSkill(
  problem: PracticeProblemLike,
  selectedSkill: SkillId | string | null
): boolean {
  const normalizedSelectedSkill = normalizeSkillId(selectedSkill);

  // No selected lane means "all practice".
  if (!normalizedSelectedSkill) return true;

  const problemSkillIds = getProblemSkillIds(problem);

  // Untagged questions belong only in Other / Mixed until they are classified.
  if (normalizedSelectedSkill === "other" && problemSkillIds.length === 0) {
    return true;
  }

  return problemSkillIds.includes(normalizedSelectedSkill);
}

export function filterProblemsBySkill<T extends PracticeProblemLike>(
  problems: T[],
  selectedSkill: SkillId | string | null
): T[] {
  const normalizedSelectedSkill = normalizeSkillId(selectedSkill);
  if (!normalizedSelectedSkill) return problems;
  return problems.filter((problem) => problemMatchesSkill(problem, normalizedSelectedSkill));
}
