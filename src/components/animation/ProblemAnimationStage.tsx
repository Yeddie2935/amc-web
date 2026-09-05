import type { Problem } from "../../types/amc";
import { resolveScene } from "./sceneRegistry";

export interface ProblemAnimationStageProps {
  problem: Problem;
  step: number;
  totalSteps: number;
}

/**
 * Renders a problem's animation scene at an externally controlled timeline
 * position. Timeline state, autoplay, captions, and controls belong to the
 * component embedding this stage.
 */
export function ProblemAnimationStage({
  problem,
  step,
  totalSteps,
}: ProblemAnimationStageProps) {
  const Scene = resolveScene(problem);

  return (
    <div className="fmj-fixed-stage" data-step={step}>
      <Scene problem={problem} step={step} totalSteps={totalSteps} />
    </div>
  );
}
