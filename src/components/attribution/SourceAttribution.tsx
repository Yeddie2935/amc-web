import type { Problem } from "../../types/amc";
import { getProblemSourceLabel } from "../../lib/problemUtils";

interface SourceAttributionProps {
  problem: Problem;
  compact?: boolean;
}

export function SourceAttribution({
  problem,
  compact = false,
}: SourceAttributionProps) {
  if (compact) {
    return (
      <p className="fmj-source-compact">
        Source: {getProblemSourceLabel(problem)} · License: {problem.license}
      </p>
    );
  }

  return (
    <div className="fmj-source-box">
      <p>
        <strong>Source:</strong> {problem.sourceName}
      </p>
      <p>
        <strong>Problem:</strong> {getProblemSourceLabel(problem)}
      </p>
      <p>
        <strong>License:</strong> {problem.license}
      </p>
      {problem.sourceUrl && (
        <p>
          <a href={problem.sourceUrl} target="_blank" rel="noreferrer">
            Visit source
          </a>
        </p>
      )}
      {problem.sourceType === "AMC" && (
        <p className="fmj-small-text">
          Used for non-commercial educational purposes. This site is not
          affiliated with or endorsed by the Mathematical Association of America.
        </p>
      )}
    </div>
  );
}
