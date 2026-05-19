import { useMemo, useState } from "react";
import type { Problem } from "../../types/amc";
import type { ProblemAttempt, ProblemProgress } from "../../types/progress";
import { getProblemSourceLabel } from "../../lib/problemUtils";
import { Button } from "../common/Button";
import { ProblemStatement } from "./ProblemStatement";
import { AnimationRenderer } from "../animation/AnimationRenderer";

interface ProblemWorkspaceProps {
  problem: Problem;
  progress: ProblemProgress;
  onRecordAttempt: (problem: Problem, selectedAnswer: string) => ProblemAttempt;
  onToggleBookmark: (problemId: string) => void;
  onNext?: () => void;
}

export function ProblemWorkspace({
  problem,
  progress,
  onRecordAttempt,
  onToggleBookmark,
  onNext,
}: ProblemWorkspaceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [attemptResult, setAttemptResult] = useState<ProblemAttempt | null>(null);
  const [visibleHintCount, setVisibleHintCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const isBookmarked = progress.bookmarkedIds.includes(problem.id);
  const hints = useMemo(
    () =>
      problem.hints && problem.hints.length > 0
        ? problem.hints
        : [
            "Identify what the problem is asking for.",
            "Write down the key numbers or relationships.",
            "Try eliminating answer choices that do not fit.",
          ],
    [problem]
  );

  function submitAnswer() {
    if (!selectedAnswer) return;
    const result = onRecordAttempt(problem, selectedAnswer);
    setAttemptResult(result);
  }

  function resetForNext() {
    setSelectedAnswer("");
    setAttemptResult(null);
    setVisibleHintCount(0);
    setShowSolution(false);
    setShowAnimation(false);
    onNext?.();
  }

  return (
    <article className="fmj-workspace">
      <div className="fmj-workspace-header">
        <div>
          <p className="fmj-source-mini">{getProblemSourceLabel(problem)}</p>
          <h2>{problem.title}</h2>
        </div>
        <button
          type="button"
          className={`fmj-bookmark ${isBookmarked ? "active" : ""}`}
          onClick={() => onToggleBookmark(problem.id)}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark problem"}
        >
          ★
        </button>
      </div>

      <ProblemStatement problem={problem} />

      <section className="fmj-answer-picker">
        <h3>Your answer</h3>
        <div className="fmj-answer-buttons">
          {problem.choices?.map((choice) => (
            <button
              key={choice.label}
              type="button"
              className={selectedAnswer === choice.label ? "selected" : ""}
              onClick={() => setSelectedAnswer(choice.label)}
            >
              {choice.label}
            </button>
          ))}
        </div>
        <div className="fmj-workspace-actions">
          <Button onClick={submitAnswer} disabled={!selectedAnswer}>
            Check answer
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              setVisibleHintCount((count) => Math.min(hints.length, count + 1))
            }
            disabled={visibleHintCount >= hints.length}
          >
            Show hint
          </Button>
          <Button variant="secondary" onClick={() => setShowSolution((value) => !value)}>
            {showSolution ? "Hide solution" : "Show solution"}
          </Button>
        </div>

        {attemptResult && (
          <div
            className={`fmj-attempt-result ${
              attemptResult.isCorrect ? "correct" : "incorrect"
            }`}
          >
            {attemptResult.isCorrect
              ? "Correct!"
              : `Not quite. You chose ${attemptResult.selectedAnswer}.`}
          </div>
        )}
      </section>

      {visibleHintCount > 0 && (
        <section className="fmj-hint-box">
          <h3>Hints</h3>
          <ol>
            {hints.slice(0, visibleHintCount).map((hint, index) => (
              <li key={`${hint}-${index}`}>{hint}</li>
            ))}
          </ol>
        </section>
      )}

      {showSolution && (
        <section className="fmj-solution-content fmj-solution-reveal">
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
        </section>
      )}

      <section className="fmj-animation-collapsible">
        <button
          type="button"
          className="fmj-animation-toggle"
          onClick={() => setShowAnimation((value) => !value)}
        >
          {showAnimation ? "Hide animated explanation" : "Play animated explanation"}
        </button>

        {showAnimation && <AnimationRenderer problem={problem} />}
      </section>

      {onNext && (
        <div className="fmj-next-row">
          <Button variant="secondary" onClick={resetForNext}>
            Next problem
          </Button>
        </div>
      )}
    </article>
  );
}
