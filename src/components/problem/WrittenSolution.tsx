import type { Problem } from "../../types/amc";
export function WrittenSolution({ problem }: { problem: Problem }) {
  return <div className="fmj-solution-content">
    <p className="fmj-answer-line"><strong>Answer:</strong> {problem.answer}{problem.shortAnswer ? ` · ${problem.shortAnswer}` : ""}</p>
    <ol className="fmj-solution-steps">{problem.solutionSteps.map((step,i) => <li key={i}><h3>{step.title}</h3><p>{step.body}</p>{step.equation && <code>{step.equation}</code>}</li>)}</ol>
  </div>;
}
