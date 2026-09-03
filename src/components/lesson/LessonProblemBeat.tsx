import { useState } from "react";
import { sampleProblems } from "../../data/sampleProblems";
import { getProblemSourceLabel } from "../../lib/problemUtils";
import type { Problem } from "../../types/amc";
import type {
  GeneratedProblemArtifact,
  LessonProblemAnimationPlan,
  LessonProblemBeat as LessonProblemBeatSpec,
} from "../../types/lesson";
import { ProblemAnimationStage } from "../animation/ProblemAnimationStage";
import { getExplanationSteps } from "../animation/explanation";
import { Button } from "../common/Button";
import { ProblemStatement } from "../problem/ProblemStatement";

interface LessonProblemBeatProps {
  beat: LessonProblemBeatSpec;
  generatedProblemArtifacts: readonly GeneratedProblemArtifact[];
  completed: boolean;
  onResolved: () => void;
}

type AnimationStepSelection =
  | { stepIndices: number[]; error?: never }
  | { stepIndices?: never; error: string };

const bankProblemById = new Map(
  sampleProblems.map((problem) => [problem.id, problem] as const)
);

export function selectLessonAnimationSteps(
  animation: LessonProblemAnimationPlan | null | undefined,
  totalSteps: number
): AnimationStepSelection {
  if (!animation) return { error: "The problem beat is missing an animation plan." };
  if (animation.mode === "none") return { stepIndices: [] };
  if (!animation.controlledByLesson) {
    return {
      error: "Lesson animation must declare controlledByLesson before it can render here.",
    };
  }
  if (animation.autoplay) {
    return { error: "Autoplay is not supported by the lesson-controlled timeline." };
  }
  if (animation.showPlayerControls) {
    return {
      error: "Full animation-player controls are not supported inside a lesson beat.",
    };
  }
  if (!Number.isInteger(totalSteps) || totalSteps <= 0) {
    return { error: "The referenced problem has no valid animation timeline." };
  }
  if (animation.mode === "whole") {
    return { stepIndices: Array.from({ length: totalSteps }, (_, index) => index) };
  }
  if (animation.mode !== "slice") {
    return { error: "The problem beat uses an unknown animation mode." };
  }

  const indices = animation.stepIndices;
  if (!indices || indices.length === 0) {
    return { error: "A sliced animation requires at least one step index." };
  }
  if (new Set(indices).size !== indices.length) {
    return { error: "Animation slice step indices must be unique." };
  }
  if (
    indices.some(
      (index) => !Number.isInteger(index) || index < 0 || index >= totalSteps
    )
  ) {
    return {
      error: `Animation slice indices must be between 0 and ${totalSteps - 1}.`,
    };
  }

  return { stepIndices: [...indices] };
}

function LessonAnimation({
  problem,
  animation,
  prompts,
}: {
  problem: Problem;
  animation: LessonProblemAnimationPlan;
  prompts: string[];
}) {
  const [position, setPosition] = useState(0);
  const totalSteps = getExplanationSteps(problem).length;
  const selection = selectLessonAnimationSteps(animation, totalSteps);

  if (selection.error) {
    return (
      <>
        <div className="fmj-lesson-fallback" role="alert">
          <strong>Animation unavailable</strong>
          <p>{selection.error}</p>
        </div>
        {prompts.length > 0 && (
          <ol className="fmj-lesson-prompt-list">
            {prompts.map((prompt, index) => (
              <li key={`${prompt}-${index}`}>{prompt}</li>
            ))}
          </ol>
        )}
      </>
    );
  }
  if (selection.stepIndices.length === 0) {
    return prompts.length > 0 ? (
      <ol className="fmj-lesson-prompt-list">
        {prompts.map((prompt, index) => (
          <li key={`${prompt}-${index}`}>{prompt}</li>
        ))}
      </ol>
    ) : null;
  }

  const safePosition = Math.min(position, selection.stepIndices.length - 1);
  const step = selection.stepIndices[safePosition];
  const promptMatchesTimeline = prompts.length === selection.stepIndices.length;

  return (
    <section className="fmj-lesson-animation" aria-label="Guided problem animation">
      {promptMatchesTimeline && (
        <p className="fmj-lesson-animation-prompt" aria-live="polite">
          {prompts[safePosition]}
        </p>
      )}

      <ProblemAnimationStage problem={problem} step={step} totalSteps={totalSteps} />

      {selection.stepIndices.length > 1 && (
        <div className="fmj-lesson-animation-controls">
          <Button
            variant="secondary"
            disabled={safePosition === 0}
            onClick={() => setPosition((current) => Math.max(0, current - 1))}
          >
            Previous visual
          </Button>
          <span aria-live="polite">
            Visual {safePosition + 1} of {selection.stepIndices.length}
          </span>
          <Button
            variant="secondary"
            disabled={safePosition === selection.stepIndices.length - 1}
            onClick={() =>
              setPosition((current) =>
                Math.min(selection.stepIndices.length - 1, current + 1)
              )
            }
          >
            Next visual
          </Button>
        </div>
      )}

      {!promptMatchesTimeline && prompts.length > 0 && (
        <ol className="fmj-lesson-prompt-list">
          {prompts.map((prompt, index) => (
            <li key={`${prompt}-${index}`}>{prompt}</li>
          ))}
        </ol>
      )}
    </section>
  );
}

function SourceLabel({ problem }: { problem: Problem }) {
  return (
    <p className="fmj-source-mini">
      {problem.sourceType === "Original"
        ? "Mathinking original problem"
        : getProblemSourceLabel(problem)}
    </p>
  );
}

export function LessonProblemBeat({
  beat,
  generatedProblemArtifacts,
  completed,
  onResolved,
}: LessonProblemBeatProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const problem =
    beat.source === "bank"
      ? bankProblemById.get(beat.problemId)
      : generatedProblemArtifacts.find(
          (artifact) => artifact.problem.id === beat.problemId
        )?.problem;

  if (!problem) {
    return (
      <div className="fmj-lesson-problem-shell">
        <div className="fmj-lesson-fallback" role="alert">
          <strong>Problem unavailable</strong>
          <p>
            {beat.source === "bank"
              ? `No bank problem was found for ${beat.problemId}.`
              : `No generated problem artifact was supplied for ${beat.problemId}.`}
          </p>
          {!completed && (
            <Button variant="secondary" onClick={onResolved}>
              Continue without problem
            </Button>
          )}
        </div>
      </div>
    );
  }

  const sourceLabelTiming = beat.sourceLabelTiming ?? "after";
  const showSourceBefore = sourceLabelTiming === "before";
  const showSourceAfter = sourceLabelTiming === "after";
  const showSourceOnCompletion =
    sourceLabelTiming === "completion" && completed;
  const animation = (
    <LessonAnimation
      problem={problem}
      animation={beat.animation}
      prompts={Array.isArray(beat.learnerPrompts) ? beat.learnerPrompts : []}
    />
  );
  const statement = <ProblemStatement problem={problem} />;
  const normalizedAnswer = selectedAnswer.trim().toLowerCase();
  const acceptedAnswers = [problem.answer, problem.shortAnswer]
    .filter((answer): answer is string => Boolean(answer))
    .map((answer) => answer.trim().toLowerCase());
  const correct = acceptedAnswers.includes(normalizedAnswer);

  function checkAnswer() {
    if (!selectedAnswer.trim()) return;
    setSubmitted(true);
    if (correct || beat.role !== "transfer") onResolved();
  }

  const answerPicker = (
    <section className="fmj-lesson-problem-answer" aria-label="Problem response">
      <h3>Your answer</h3>
      {problem.choices ? (
        <div className="fmj-answer-buttons">
          {problem.choices.map((choice) => (
            <button
              key={choice.label}
              type="button"
              className={selectedAnswer === choice.label ? "selected" : ""}
              aria-pressed={selectedAnswer === choice.label}
              disabled={completed || (submitted && correct)}
              onClick={() => {
                setSelectedAnswer(choice.label);
                setSubmitted(false);
              }}
            >
              {choice.label}
            </button>
          ))}
        </div>
      ) : (
        <label className="fmj-lesson-input-label">
          <span>Enter your answer</span>
          <input
            value={selectedAnswer}
            disabled={completed || (submitted && correct)}
            onChange={(event) => {
              setSelectedAnswer(event.target.value);
              setSubmitted(false);
            }}
          />
        </label>
      )}
      <div className="fmj-lesson-response-actions">
        <Button
          disabled={!selectedAnswer.trim() || completed || (submitted && correct)}
          onClick={checkAnswer}
        >
          Check answer
        </Button>
      </div>
      {submitted && (
        <p
          className={`fmj-lesson-feedback ${correct ? "correct" : "incorrect"}`}
          role="status"
        >
          {correct
            ? "Correct. Compare your reasoning with the lesson's next step."
            : beat.role === "transfer"
              ? "Not yet. Recheck your reasoning and calculation."
              : "Keep this attempt. You can revise it or continue to compare."}
        </p>
      )}
    </section>
  );

  return (
    <div className="fmj-lesson-problem-shell">
      {showSourceBefore && <SourceLabel problem={problem} />}
      <p className="fmj-lesson-problem-bridge">{beat.entryBridge}</p>

      {beat.presentation === "animation-first" ? (
        <>
          {animation}
          {statement}
        </>
      ) : (
        <>
          {statement}
          {animation}
        </>
      )}

      {answerPicker}
      {showSourceAfter && <SourceLabel problem={problem} />}
      {showSourceOnCompletion && <SourceLabel problem={problem} />}
      {completed && (
        <p className="fmj-lesson-problem-exit">{beat.exitBridge}</p>
      )}
    </div>
  );
}
