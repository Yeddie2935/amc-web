import type { Problem } from "../../types/amc";
import { CategoryBadge } from "./CategoryBadge";
import { DifficultyBadge } from "./DifficultyBadge";

interface ProblemStatementProps {
  problem: Problem;
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  return (
    <article className="fmj-problem-statement">
      <div className="fmj-problem-card-top">
        <CategoryBadge category={problem.category} />
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>

      <h2>{problem.title}</h2>

      {problem.needsDiagram && (
        <p className="fmj-diagram-note">
          This problem may rely on a diagram. The final site should use a clean
          recreated diagram instead of a scanned PDF page.
        </p>
      )}

      <p className="fmj-statement-text">{problem.statement}</p>

      {problem.imageUrls && problem.imageUrls.length > 0 && (
        <div className="fmj-problem-images">
          {problem.imageUrls.map((url, index) => (
            <figure key={url} className="fmj-problem-image-frame">
              <img src={url} alt={`${problem.title} diagram ${index + 1}`} />
              <figcaption>Diagram {index + 1}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {problem.choices && (
        <ul className="fmj-choice-list">
          {problem.choices.map((choice) => (
            <li key={choice.label}>
              <strong>{choice.label}.</strong> {choice.text}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
