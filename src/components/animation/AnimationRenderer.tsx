import { useEffect, useMemo, useState } from "react";
import type { Problem, AnimationFrame } from "../../types/amc";
import { Button } from "../common/Button";

const DEFAULT_ANIMATION_FRAMES: AnimationFrame[] = [
  {
    title: "Understand",
    narration: "Identify the key information in the problem.",
    visualHint: "Highlight the important numbers and relationships.",
  },
  {
    title: "Solve",
    narration: "Use the main math idea to work toward the answer.",
    visualHint: "Show the calculation, diagram relationship, or counting setup.",
  },
  {
    title: "Check",
    narration: "Compare the result with the answer choices.",
    visualHint: "Circle the final answer choice.",
  },
];

interface AnimationRendererProps {
  problem: Problem;
}

export function AnimationRenderer({ problem }: AnimationRendererProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [problem.id]);

  const frames = problem.animationFrames ?? DEFAULT_ANIMATION_FRAMES;

  const safeStep = Math.min(step, frames.length - 1);
  const current = frames[safeStep];

  return (
    <div className="fmj-fixed-animation">
      <div className="fmj-fixed-stage">
        <StoryboardVisual problem={problem} step={safeStep} />
      </div>

      <div className="fmj-fixed-caption">
        <strong>{current.title}</strong>
        <p>{current.narration}</p>
        <small>{current.visualHint}</small>
      </div>

      <div className="fmj-animation-controls">
        <Button
          variant="secondary"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={safeStep === 0}
        >
          Back
        </Button>
        <Button
          onClick={() =>
            setStep((value) => (value >= frames.length - 1 ? 0 : value + 1))
          }
        >
          {safeStep >= frames.length - 1 ? "Replay" : "Next"}
        </Button>
      </div>
    </div>
  );
}

function StoryboardVisual({ problem, step }: { problem: Problem; step: number }) {
  const frames = problem.animationFrames ?? DEFAULT_ANIMATION_FRAMES;
  const safeStep = Math.min(step, frames.length - 1);
  const isFinalStep = safeStep >= frames.length - 1;

  const correctChoice = useMemo(
    () => problem.choices?.find((choice) => choice.label === problem.answer),
    [problem.choices, problem.answer]
  );

  const solutionForStep = useMemo(() => {
    const steps = problem.solutionSteps ?? [];
    if (steps.length === 0) return null;
    if (isFinalStep) return steps[steps.length - 1];
    if (safeStep < steps.length) return steps[safeStep];
    return steps[steps.length - 1];
  }, [problem.solutionSteps, safeStep, isFinalStep]);

  const currentFrame = frames[safeStep];

  return (
    <div className="fmj-visual-card storyboard-visual">
      <div className="storyboard-track">
        {frames.map((frame, index) => {
          const state =
            index === safeStep ? "active" : index < safeStep ? "done" : "upcoming";
          return (
            <div key={`${frame.title}-${index}`} className={`storyboard-step ${state}`}>
              <span className="storyboard-step-num">{index + 1}</span>
              <span className="storyboard-step-title">{frame.title}</span>
            </div>
          );
        })}
      </div>

      <div className="storyboard-board" data-step={safeStep}>
        {solutionForStep ? (
          <div className="storyboard-explainer" key={`explainer-${safeStep}`}>
            <span className="storyboard-explainer-label">{solutionForStep.title}</span>
            <p>{solutionForStep.body}</p>
            {solutionForStep.equation && (
              <div className="storyboard-equation-row">
                <code>{solutionForStep.equation}</code>
              </div>
            )}
          </div>
        ) : (
          <div className="storyboard-explainer" key={`hint-${safeStep}`}>
            <span className="storyboard-explainer-label">{currentFrame?.title}</span>
            <p>{currentFrame?.narration}</p>
          </div>
        )}

        {isFinalStep && (
          <div className="storyboard-answer-ribbon">
            <span className="storyboard-answer-label">Answer</span>
            <strong>{problem.answer}</strong>
            <span className="storyboard-answer-text">
              {correctChoice?.text ?? problem.shortAnswer ?? ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

