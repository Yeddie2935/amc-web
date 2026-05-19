import type { DifficultyLevel } from "../../types/amc";
import { getDifficultyLabel } from "../../lib/problemUtils";

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`fmj-badge fmj-difficulty-badge level-${difficulty}`}>
      {getDifficultyLabel(difficulty)}
    </span>
  );
}
