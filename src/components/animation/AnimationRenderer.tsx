import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Problem } from "../../types/amc";
import { Button } from "../common/Button";
import { getExplanationSteps } from "./explanation";
import { resolveScene, isWalkthroughScene } from "./sceneRegistry";

const STEP_DURATION_MS = 3200;

interface AnimationRendererProps {
  problem: Problem;
}

export function AnimationRenderer({ problem }: AnimationRendererProps) {
  const steps = getExplanationSteps(problem);
  const totalSteps = steps.length;
  const lastStep = totalSteps - 1;

  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Restart the timeline whenever the problem changes.
  useEffect(() => {
    setStep(0);
    setIsPlaying(true);
  }, [problem.id]);

  // Autoplay: advance one step per tick and stop on the last frame.
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= lastStep) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, STEP_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [isPlaying, lastStep]);

  const Scene = resolveScene(problem);
  const current = steps[Math.min(step, lastStep)];
  const atEnd = step >= lastStep;
  // The walkthrough stage already shows the step's prose/equation, so only
  // repeat the body in the caption for diagram scenes (their narration).
  const walkthrough = isWalkthroughScene(problem);
  const showBody = !walkthrough || Boolean(current.equation);

  function togglePlay() {
    // Replaying from the end restarts at the beginning.
    if (atEnd && !isPlaying) setStep(0);
    setIsPlaying((value) => !value);
  }

  return (
    <div className="fmj-fixed-animation">
      <div className="fmj-fixed-stage" data-step={step}>
        <Scene problem={problem} step={step} totalSteps={totalSteps} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="fmj-fixed-caption"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <strong>
            Step {step + 1}: {current.title}
          </strong>
          {showBody && <p>{current.body}</p>}
        </motion.div>
      </AnimatePresence>

      <div className="fmj-animation-controls">
        <Button
          variant="secondary"
          onClick={() => {
            setIsPlaying(false);
            setStep((value) => Math.max(0, value - 1));
          }}
          disabled={step === 0}
        >
          Back
        </Button>
        <Button onClick={togglePlay}>
          {isPlaying ? "Pause" : atEnd ? "Replay" : "Play"}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setIsPlaying(false);
            setStep((value) => Math.min(lastStep, value + 1));
          }}
          disabled={atEnd}
        >
          Next
        </Button>
      </div>

      <div className="fmj-animation-dots" aria-label="Animation progress">
        {steps.map((explanationStep, index) => (
          <button
            key={`${explanationStep.title}-${index}`}
            type="button"
            className={index === step ? "active" : ""}
            aria-label={`Go to step ${index + 1}: ${explanationStep.title}`}
            onClick={() => {
              setIsPlaying(false);
              setStep(index);
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
