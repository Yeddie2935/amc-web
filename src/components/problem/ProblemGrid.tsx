import type { Problem } from "../../types/amc";
import { EmptyState } from "../common/EmptyState";
import { ProblemCard } from "./ProblemCard";

interface ProblemGridProps {
  problems: Problem[];
  selectedProblemId?: string;
  onSelectProblem: (problem: Problem) => void;
}

export function ProblemGrid({
  problems,
  selectedProblemId,
  onSelectProblem,
}: ProblemGridProps) {
  if (problems.length === 0) {
    return (
      <EmptyState
        title="No problems found"
        message="Try changing the search, category, difficulty, or source filter."
      />
    );
  }

  return (
    <div className="fmj-problem-grid">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          isSelected={problem.id === selectedProblemId}
          onSelect={onSelectProblem}
        />
      ))}
    </div>
  );
}
