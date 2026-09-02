import { useState } from "react";
import type {
  InteractionLessonBeat,
  LessonResponseSpec,
} from "../../types/lesson";
import { Button } from "../common/Button";
import { VisualPrimitiveHost } from "./VisualPrimitiveHost";

interface LessonInteractionProps {
  beat: InteractionLessonBeat;
  completed: boolean;
  onResolved: () => void;
}

interface FeedbackProps {
  correct: boolean;
  children: string;
}

function Feedback({ correct, children }: FeedbackProps) {
  return (
    <p
      className={`fmj-lesson-feedback ${correct ? "correct" : "incorrect"}`}
      role="status"
    >
      {children}
    </p>
  );
}

function UnsupportedResponse({
  kind,
  disabled,
  onResolved,
}: {
  kind: "sort" | "match";
  disabled: boolean;
  onResolved: () => void;
}) {
  return (
    <div className="fmj-lesson-fallback" role="alert">
      <strong>Interaction unavailable</strong>
      <p>
        The minimal lesson renderer does not yet support {kind} responses.
      </p>
      {!disabled && (
        <Button variant="secondary" onClick={onResolved}>
          Continue without response
        </Button>
      )}
    </div>
  );
}

function UnknownResponse({
  response,
  disabled,
  onResolved,
}: {
  response: never;
  disabled: boolean;
  onResolved: () => void;
}) {
  const kind = (response as { kind?: unknown }).kind;
  return (
    <div className="fmj-lesson-fallback" role="alert">
      <strong>Interaction unavailable</strong>
      <p>Unknown response kind: {typeof kind === "string" ? kind : "missing"}.</p>
      {!disabled && (
        <Button variant="secondary" onClick={onResolved}>
          Continue without response
        </Button>
      )}
    </div>
  );
}

export function LessonInteraction({
  beat,
  completed,
  onResolved,
}: LessonInteractionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const response = beat.response;

  function finish(correct: boolean) {
    setSubmitted(true);
    if (correct || !beat.allowRetry) onResolved();
  }

  function renderResponse(responseSpec: LessonResponseSpec) {
    switch (responseSpec.kind) {
      case "none": {
        return (
          <div className="fmj-lesson-response-actions">
            <Button
              variant="secondary"
              disabled={completed || submitted}
              onClick={() => {
                setSubmitted(true);
                onResolved();
              }}
            >
              Reveal
            </Button>
            {submitted && beat.correctFeedback && (
              <Feedback correct>{beat.correctFeedback}</Feedback>
            )}
          </div>
        );
      }

      case "single-choice": {
        const selectedId = selectedIds[0] ?? "";
        const correct = selectedId === responseSpec.correctId;
        const locked = completed || (submitted && (correct || !beat.allowRetry));
        const feedback = correct
          ? beat.correctFeedback ?? responseSpec.feedback?.[selectedId] ?? "That works."
          : responseSpec.feedback?.[selectedId] ?? beat.incorrectFeedback ?? "Try that choice again.";

        return (
          <>
            <div className="fmj-lesson-choice-buttons">
              {responseSpec.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={selectedId === option.id ? "selected" : ""}
                  aria-pressed={selectedId === option.id}
                  disabled={locked}
                  onClick={() => {
                    setSelectedIds([option.id]);
                    if (beat.allowRetry) setSubmitted(false);
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
            <div className="fmj-lesson-response-actions">
              <Button
                disabled={!selectedId || locked}
                onClick={() => finish(correct)}
              >
                Check answer
              </Button>
            </div>
            {submitted && <Feedback correct={correct}>{feedback}</Feedback>}
          </>
        );
      }

      case "multi-select": {
        const expected = new Set(responseSpec.correctIds);
        const correct =
          selectedIds.length === expected.size &&
          selectedIds.every((id) => expected.has(id));
        const locked = completed || (submitted && (correct || !beat.allowRetry));
        const feedback = correct
          ? beat.correctFeedback ?? responseSpec.feedback ?? "That set works."
          : beat.incorrectFeedback ?? "Check the full set and try again.";

        return (
          <>
            <div className="fmj-lesson-choice-buttons">
              {responseSpec.options.map((option) => {
                const selected = selectedIds.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    className={selected ? "selected" : ""}
                    aria-pressed={selected}
                    disabled={locked}
                    onClick={() => {
                      setSelectedIds((current) =>
                        selected
                          ? current.filter((id) => id !== option.id)
                          : [...current, option.id]
                      );
                      if (beat.allowRetry) setSubmitted(false);
                    }}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
            <div className="fmj-lesson-response-actions">
              <Button
                disabled={selectedIds.length === 0 || locked}
                onClick={() => finish(correct)}
              >
                Check selection
              </Button>
            </div>
            {submitted && <Feedback correct={correct}>{feedback}</Feedback>}
          </>
        );
      }

      case "numeric": {
        const value = Number(input);
        const tolerance = responseSpec.tolerance ?? 0;
        const correct =
          input.trim() !== "" &&
          Number.isFinite(value) &&
          Math.abs(value - responseSpec.answer) <= tolerance;
        const locked = completed || (submitted && (correct || !beat.allowRetry));
        const feedback = correct
          ? beat.correctFeedback ?? responseSpec.feedback ?? "That value works."
          : beat.incorrectFeedback ?? "Check the value and try again.";

        return (
          <>
            <label className="fmj-lesson-input-label">
              <span>Your answer{responseSpec.units ? ` (${responseSpec.units})` : ""}</span>
              <input
                type="number"
                value={input}
                disabled={locked}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (beat.allowRetry) setSubmitted(false);
                }}
              />
            </label>
            <div className="fmj-lesson-response-actions">
              <Button disabled={!input.trim() || locked} onClick={() => finish(correct)}>
                Check answer
              </Button>
            </div>
            {submitted && <Feedback correct={correct}>{feedback}</Feedback>}
          </>
        );
      }

      case "free-response": {
        return (
          <>
            <label className="fmj-lesson-input-label">
              <span>Your thinking</span>
              <textarea
                rows={4}
                value={input}
                disabled={completed || submitted}
                onChange={(event) => setInput(event.target.value)}
              />
            </label>
            <div className="fmj-lesson-response-actions">
              <Button
                disabled={!input.trim() || completed || submitted}
                onClick={() => {
                  setSubmitted(true);
                  onResolved();
                }}
              >
                Reveal comparison
              </Button>
            </div>
            {submitted && responseSpec.revealAfterSubmit && (
              <p className="fmj-lesson-reveal" role="status">
                {responseSpec.revealAfterSubmit}
              </p>
            )}
          </>
        );
      }

      case "sort":
      case "match":
        return (
          <UnsupportedResponse
            kind={responseSpec.kind}
            disabled={completed}
            onResolved={onResolved}
          />
        );

      default:
        return (
          <UnknownResponse
            response={responseSpec}
            disabled={completed}
            onResolved={onResolved}
          />
        );
    }
  }

  return (
    <div className="fmj-lesson-interaction">
      <h3>{beat.prompt}</h3>
      {beat.visual && <VisualPrimitiveHost visual={beat.visual} />}
      {renderResponse(response)}
    </div>
  );
}
