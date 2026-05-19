import type { Problem } from "../../types/amc";
import { ProblemAnimation } from "./ProblemAnimation";

interface AnimationExplainerProps {
  problem: Problem;
}

export function AnimationExplainer({ problem }: AnimationExplainerProps) {
  return (
    <section className="fmj-animation-panel">
      <div className="fmj-section-heading-row">
        <div>
          <h3>Animated Explanation</h3>
          <p>Step through a visual explanation of the problem.</p>
        </div>
      </div>

      <ProblemAnimation problem={problem} />
    </section>
  );
}
