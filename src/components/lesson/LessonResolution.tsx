import type { ReactNode } from "react";
import type { LessonResolutionSpec } from "../../types/lesson";
import { VisualPrimitiveHost } from "./VisualPrimitiveHost";

interface LessonResolutionProps {
  resolution: LessonResolutionSpec;
  problemAnimation?: ReactNode;
}

export function LessonResolution({
  resolution,
  problemAnimation,
}: LessonResolutionProps) {
  return (
    <section className="fmj-lesson-resolution" aria-label="Worked explanation">
      <p className="fmj-eyebrow">Why it works</p>

      {resolution.animation?.kind === "problem-animation" &&
        (problemAnimation ?? (
          <div className="fmj-lesson-fallback" role="alert">
            <strong>Animation unavailable</strong>
            <p>This question does not provide a problem animation.</p>
          </div>
        ))}

      {resolution.visual && <VisualPrimitiveHost visual={resolution.visual} />}

      {resolution.steps && resolution.steps.length > 0 && (
        <ol className="fmj-lesson-resolution-steps">
          {resolution.steps.map((step, index) => (
            <li key={`${step.title ?? step.body}-${index}`}>
              {step.title && <strong>{step.title}</strong>}
              <p>{step.body}</p>
              {step.math && <code>{step.math}</code>}
            </li>
          ))}
        </ol>
      )}

      {resolution.takeaway && (
        <p className="fmj-lesson-resolution-takeaway">
          {resolution.takeaway}
        </p>
      )}
    </section>
  );
}
