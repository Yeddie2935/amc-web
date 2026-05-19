import type { Problem } from "../../types/amc";
import { getProblemSourceLabel } from "../../lib/problemUtils";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";

interface ProblemCardProps {
  problem: Problem;
  isSelected?: boolean;
  onSelect: (problem: Problem) => void;
}

export function ProblemCard({
  problem,
  isSelected = false,
  onSelect,
}: ProblemCardProps) {
  return (
    <button
      className={`fmj-problem-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(problem)}
      type="button"
    >
      <div className="fmj-problem-card-top">
        <CategoryBadge category={problem.category} />
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <h3>{problem.title}</h3>
      <p className="fmj-problem-meta">{getProblemSourceLabel(problem)}</p>
      <p className="fmj-problem-preview">{problem.statement}</p>

      <div className="fmj-tag-row">
        {problem.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="fmj-tag">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
