import { filterProblemsBySkill, type PracticeProblemLike } from "./problemFilters";
import type { SkillId } from "./skills";

function shuffle<T>(items: T[]): T[] {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
}

export function buildPracticeSession<
  T extends PracticeProblemLike & { difficulty?: number }
>(
  allProblems: T[],
  selectedSkill: SkillId | string | null,
  selectedDifficulty: number | null = null,
  limit = 10
): T[] {
  const filteredBySkill = filterProblemsBySkill(allProblems, selectedSkill);
  const filteredByDifficulty = selectedDifficulty
    ? filteredBySkill.filter((problem) => problem.difficulty === selectedDifficulty)
    : filteredBySkill;

  return shuffle(filteredByDifficulty).slice(0, limit);
}
