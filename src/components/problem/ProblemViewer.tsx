import type { Problem } from "../../types/amc";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { ProblemStatement } from "./ProblemStatement";
import { SolutionPanel } from "../solution/SolutionPanel";
import { AnimationExplainer } from "../solution/AnimationExplainer";

interface ProblemViewerProps {
  problem: Problem;
  onNext?: () => void;
}

export function ProblemViewer({ problem, onNext }: ProblemViewerProps) {
  return (
    <Card className="fmj-problem-viewer">
      <ProblemStatement problem={problem} />
      <SolutionPanel problem={problem} />
      <AnimationExplainer problem={problem} />

      {onNext && (
        <div className="fmj-next-row">
          <Button onClick={onNext}>Next problem</Button>
        </div>
      )}
    </Card>
  );
}
