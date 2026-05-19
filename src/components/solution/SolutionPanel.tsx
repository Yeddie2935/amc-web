import { useState } from "react";
import type { Problem } from "../../types/amc";
import { Button } from "../common/Button";

interface SolutionPanelProps {
  problem: Problem;
}

export function SolutionPanel({ problem }: SolutionPanelProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="fmj-solution-panel">
      <div className="fmj-section-heading-row">
        <div>
          <h3>Answer & Solution</h3>
          <p>The answer is hidden until the student chooses to reveal it.</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsRevealed((value) => !value)}
        >
          {isRevealed ? "Hide answer" : "Show answer"}
        </Button>
      </div>

      {!isRevealed && (
        <div className="fmj-solution-locked">
          <strong>Answer hidden</strong>
          <span>Try the problem first, then reveal the explanation.</span>
        </div>
      )}

      {isRevealed && (
        <div className="fmj-solution-content">
          <p className="fmj-answer-line">
            <strong>Answer:</strong> {problem.answer}
            {problem.shortAnswer ? ` · ${problem.shortAnswer}` : ""}
          </p>

          <ol className="fmj-solution-steps">
            {problem.solutionSteps.map((step, index) => (
              <li key={`${step.title}-${index}`}>
                <h4>{step.title}</h4>
                <p>{step.body}</p>
                {step.equation && <code>{step.equation}</code>}
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
