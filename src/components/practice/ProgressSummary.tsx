import type { Problem } from "../../types/amc";

interface ProgressSummaryProps {
  problems: Problem[];
}

export function ProgressSummary({ problems }: ProgressSummaryProps) {
  const amcCount = problems.filter((problem) => problem.sourceType === "AMC").length;
  const originalCount = problems.filter(
    (problem) => problem.sourceType === "Original"
  ).length;
  const averageDifficulty =
    problems.length === 0
      ? 0
      : problems.reduce((sum, problem) => sum + problem.difficulty, 0) /
        problems.length;

  return (
    <section className="fmj-progress-summary">
      <article>
        <strong>{problems.length}</strong>
        <span>Total problems</span>
      </article>
      <article>
        <strong>{amcCount}</strong>
        <span>AMC problems</span>
      </article>
      <article>
        <strong>{originalCount}</strong>
        <span>Original problems</span>
      </article>
      <article>
        <strong>{averageDifficulty.toFixed(1)}</strong>
        <span>Avg. difficulty</span>
      </article>
    </section>
  );
}
