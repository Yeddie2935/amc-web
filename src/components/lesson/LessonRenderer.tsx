import { useState } from "react";
import type {
  GeneratedProblemArtifact,
  LessonBeat,
  LessonSpec,
  ReflectionLessonBeat,
} from "../../types/lesson";
import { Button } from "../common/Button";
import { LessonInteraction } from "./LessonInteraction";
import { LessonProblemBeat } from "./LessonProblemBeat";
import { VisualPrimitiveHost } from "./VisualPrimitiveHost";
import "./lessonRenderer.css";

export interface LessonRendererProps {
  lesson: LessonSpec;
  /** Generated artifacts are supplied by the future lesson data loader. */
  generatedProblemArtifacts?: readonly GeneratedProblemArtifact[];
}

interface BeatFrameProps {
  beat: LessonBeat;
  index: number;
  isActive: boolean;
  completed: boolean;
  isLast: boolean;
  generatedProblemArtifacts: readonly GeneratedProblemArtifact[];
  onComplete: () => void;
}

function humanize(value: string) {
  return value.replaceAll("-", " ");
}

function ReflectionBeat({
  beat,
  completed,
  onResolved,
}: {
  beat: ReflectionLessonBeat;
  completed: boolean;
  onResolved: () => void;
}) {
  const [revealed, setRevealed] = useState(completed);

  return (
    <div className="fmj-lesson-reflection">
      <h3>{beat.prompt}</h3>
      {beat.takeaway && !revealed && (
        <Button
          variant="secondary"
          onClick={() => {
            setRevealed(true);
            onResolved();
          }}
        >
          Reveal takeaway
        </Button>
      )}
      {beat.takeaway && revealed && (
        <p className="fmj-lesson-reveal" role="status">
          {beat.takeaway}
        </p>
      )}
    </div>
  );
}

function UnknownBeat({ beat }: { beat: never }) {
  const kind = (beat as { kind?: unknown }).kind;
  return (
    <div className="fmj-lesson-fallback" role="alert">
      <strong>Beat unavailable</strong>
      <p>Unknown beat kind: {typeof kind === "string" ? kind : "missing"}.</p>
    </div>
  );
}

function BeatContent({
  beat,
  completed,
  generatedProblemArtifacts,
  onResolved,
}: {
  beat: LessonBeat;
  completed: boolean;
  generatedProblemArtifacts: readonly GeneratedProblemArtifact[];
  onResolved: () => void;
}) {
  switch (beat.kind) {
    case "copy":
      return (
        <div className="fmj-lesson-copy">
          {beat.heading && <h3>{beat.heading}</h3>}
          <p>{beat.body}</p>
          {beat.math?.map((expression, index) => (
            <code key={`${expression}-${index}`}>{expression}</code>
          ))}
        </div>
      );

    case "visual":
      return (
        <div>
          <VisualPrimitiveHost visual={beat.visual} />
          {beat.caption && <p className="fmj-lesson-visual-caption">{beat.caption}</p>}
        </div>
      );

    case "interaction":
      return (
        <LessonInteraction
          beat={beat}
          completed={completed}
          onResolved={onResolved}
        />
      );

    case "concept":
      return (
        <div className="fmj-lesson-concept">
          <p className="fmj-eyebrow">New idea</p>
          <h3>{beat.name}</h3>
          <p>{beat.conciseDefinition}</p>
          {beat.formalization && <code>{beat.formalization}</code>}
          {beat.memoryHook && <p className="fmj-lesson-memory-hook">{beat.memoryHook}</p>}
        </div>
      );

    case "problem":
      return (
        <LessonProblemBeat
          beat={beat}
          generatedProblemArtifacts={generatedProblemArtifacts}
          completed={completed}
          onResolved={onResolved}
        />
      );

    case "reflection":
      return (
        <ReflectionBeat
          beat={beat}
          completed={completed}
          onResolved={onResolved}
        />
      );

    default:
      return <UnknownBeat beat={beat} />;
  }
}

function BeatFrame({
  beat,
  index,
  isActive,
  completed,
  isLast,
  generatedProblemArtifacts,
  onComplete,
}: BeatFrameProps) {
  const requiresResolution =
    beat.kind === "interaction" ||
    beat.kind === "problem" ||
    (beat.kind === "reflection" && Boolean(beat.takeaway));
  const [resolved, setResolved] = useState(completed || !requiresResolution);

  return (
    <article
      className={`fmj-lesson-beat ${isActive ? "active" : ""} ${
        completed ? "completed" : ""
      }`}
      data-beat-kind={beat.kind}
      data-phase={beat.phase}
      aria-current={isActive ? "step" : undefined}
    >
      <header className="fmj-lesson-beat-header">
        <span>{index + 1}</span>
        <p>{humanize(beat.phase)}</p>
      </header>

      {beat.transitionIn && (
        <p className="fmj-lesson-transition fmj-lesson-transition-in">
          {beat.transitionIn}
        </p>
      )}

      <BeatContent
        beat={beat}
        completed={completed}
        generatedProblemArtifacts={generatedProblemArtifacts}
        onResolved={() => setResolved(true)}
      />

      {completed && beat.transitionOut && (
        <p className="fmj-lesson-transition fmj-lesson-transition-out">
          {beat.transitionOut}
        </p>
      )}

      {isActive && (
        <div className="fmj-lesson-advance">
          <Button disabled={!resolved} onClick={onComplete}>
            {isLast ? "Finish lesson" : "Continue"}
          </Button>
          {!resolved && (
            <small>Respond or reveal your thinking before continuing.</small>
          )}
        </div>
      )}
    </article>
  );
}

/**
 * Renders declarative lesson beats in order. Beat `kind` selects the renderer;
 * pedagogical `phase` is retained as metadata and display context only.
 */
export function LessonRenderer({
  lesson,
  generatedProblemArtifacts = [],
}: LessonRendererProps) {
  const [progress, setProgress] = useState({
    lessonId: lesson.lessonId,
    completedThrough: -1,
  });
  const completedThrough =
    progress.lessonId === lesson.lessonId ? progress.completedThrough : -1;

  const beatIds = lesson.beats.map((beat) => beat.id);
  const hasInvalidBeatIds =
    beatIds.some((id) => typeof id !== "string" || !id.trim()) ||
    new Set(beatIds).size !== beatIds.length;

  if (lesson.beats.length === 0) {
    return (
      <section className="fmj-lesson-renderer">
        <div className="fmj-lesson-fallback" role="alert">
          <strong>Lesson unavailable</strong>
          <p>This lesson does not contain any beats.</p>
        </div>
      </section>
    );
  }

  if (hasInvalidBeatIds) {
    return (
      <section className="fmj-lesson-renderer">
        <div className="fmj-lesson-fallback" role="alert">
          <strong>Lesson unavailable</strong>
          <p>Lesson beat IDs must be non-empty and unique.</p>
        </div>
      </section>
    );
  }

  const lastIndex = lesson.beats.length - 1;
  const activeIndex = Math.min(completedThrough + 1, lastIndex);
  const visibleThrough = Math.min(activeIndex, lastIndex);
  const lessonComplete = completedThrough >= lastIndex;

  return (
    <section className="fmj-lesson-renderer" aria-labelledby={`${lesson.lessonId}-title`}>
      <header className="fmj-lesson-heading">
        <p className="fmj-eyebrow">Interactive lesson</p>
        <h2 id={`${lesson.lessonId}-title`}>{lesson.title}</h2>
        <div
          className="fmj-lesson-progress"
          role="progressbar"
          aria-label="Lesson progress"
          aria-valuemin={0}
          aria-valuemax={lesson.beats.length}
          aria-valuenow={Math.min(completedThrough + 1, lesson.beats.length)}
        >
          <span
            style={{
              width: `${(Math.min(completedThrough + 1, lesson.beats.length) / lesson.beats.length) * 100}%`,
            }}
          />
        </div>
      </header>

      <div className="fmj-lesson-story">
        {lesson.beats.slice(0, visibleThrough + 1).map((beat, index) => (
          <BeatFrame
            key={`${lesson.lessonId}-${beat.id}`}
            beat={beat}
            index={index}
            isActive={!lessonComplete && index === activeIndex}
            completed={index <= completedThrough}
            isLast={index === lastIndex}
            generatedProblemArtifacts={generatedProblemArtifacts}
            onComplete={() => {
              setProgress((current) => ({
                lessonId: lesson.lessonId,
                completedThrough:
                  current.lessonId === lesson.lessonId
                    ? Math.max(current.completedThrough, index)
                    : index,
              }));
            }}
          />
        ))}
      </div>

      {lessonComplete && (
        <div className="fmj-lesson-complete" role="status">
          <strong>Lesson complete</strong>
          <p>The full mathematical story remains above for review.</p>
        </div>
      )}
    </section>
  );
}
