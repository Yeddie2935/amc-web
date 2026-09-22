import type { Problem } from "../../types/amc";
import type { ProblemProgress } from "../../types/progress";
import publication from "../../seo/content-overrides.json";
import {
  getDifficultyLabel,
  getProblemSourceLabel,
  getProblemStatus,
} from "../../lib/problemUtils";

interface CompactProblemListProps {
  problems: Problem[];
  selectedProblemId?: string;
  progress: ProblemProgress;
  onSelectProblem: (problem: Problem) => void;
}

export function CompactProblemList({
  problems,
  selectedProblemId,
  progress,
  onSelectProblem,
}: CompactProblemListProps) {
  if (problems.length === 0) {
    return (
      <div className="fmj-empty-state">
        <h3>No problems found</h3>
        <p>Try adjusting the filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="fmj-compact-list">
      {problems.map((problem) => {
        const status = getProblemStatus(problem, progress);
        return (
          <div className="fmj-compact-row-wrapper" key={problem.id}><button
            type="button"
            className={`fmj-compact-row ${
              selectedProblemId === problem.id ? "selected" : ""
            }`}
            onClick={() => onSelectProblem(problem)}
          >
            <div>
              <strong>{getProblemSourceLabel(problem)}</strong>
              <span>{problem.category} · {problem.subcategory}</span>
            </div>
            <div className="fmj-compact-row-meta">
              <span>{getDifficultyLabel(problem.difficulty).replace(" · ", " ")}</span>
              <em className={`status-${status}`}>{status}</em>
            </div>
          </button>{publication.problemIds.includes(problem.id) && <a href={`/problems/${problem.id}`}>Open full solution</a>}</div>
        );
      })}
    </div>
  );
}
