import type { Problem } from "../../types/amc";

const ANIMATION_TITLE_MAP: Record<string, string> = {
  equation: "Equation",
  "clock-angle": "Clock Angle",
  "number-line": "Number Line",
  "area-model": "Area Model",
  "bar-model": "Bar Model",
  venn: "Venn Diagram",
  "graph-read": "Graph",
  probability: "Probability",
  ranking: "Ranking",
  "cube-net": "Cube Net",
  generic: "Visual Explanation",
};

function formatKey(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatValue(value: unknown) {
  if (value === undefined || value === null) {
    return "—";
  }

  if (Array.isArray(value)) {
    return value.map(String).join(", ");
  }

  return String(value);
}

function renderDataRows(data: Record<string, unknown>) {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <div className="template-empty">No structured animation data available.</div>;
  }

  return (
    <div className="template-data-list">
      {entries.map(([key, value]) => (
        <div key={key} className="template-data-entry">
          <span className="template-data-key">{formatKey(key)}</span>
          <span className="template-data-value">{formatValue(value)}</span>
        </div>
      ))}
    </div>
  );
}

function renderTemplateContent(animation: Problem["animation"], step: number) {
  const data = animation?.data ?? {};
  const equation = formatValue(data.equation);

  switch (animation?.type) {
    case "equation":
      return (
        <>
          <div className="template-equation">
            <code>{equation}</code>
          </div>
          {step >= 2 && data.answer && (
            <div className="template-answer">{`Answer: ${formatValue(data.answer)}`}</div>
          )}
        </>
      );
    case "number-line":
      return (
        <div className="template-number-line">
          <div className="template-line" />
          <span className="template-marker">{formatValue(data.value ?? data.steps ?? "?")}</span>
          {data.roundTo && <div className="template-note">{formatValue(data.roundTo)}</div>}
        </div>
      );
    case "clock-angle":
      return (
        <div className="template-clock-card">
          <div className="template-clock-face">
            <span className="template-clock-hand hour" />
            <span className="template-clock-hand minute" />
            <span className="template-clock-center" />
          </div>
          {data.answer && <div className="template-answer">{`Answer: ${formatValue(data.answer)}`}</div>}
        </div>
      );
    case "bar-model":
      return (
        <div className="template-bar-card">
          <div className="template-bar">
            <span className="template-bar-segment">{formatValue(data.total)}</span>
          </div>
          {renderDataRows(data)}
        </div>
      );
    case "area-model":
      return (
        <div className="template-area-card">
          <div className="template-rectangle" />
          {renderDataRows(data)}
        </div>
      );
    case "probability":
      return (
        <div className="template-probability-card">
          <span className="template-probability-fraction">
            {formatValue(data.favorable)} / {formatValue(data.totalOutcomes ?? data.total)}
          </span>
          <span className="template-probability-text">{formatValue(data.probability)}</span>
        </div>
      );
    case "ranking":
      return (
        <div className="template-ranking-card">
          {renderDataRows(data)}
          {step >= 2 && data.answer && (
            <div className="template-answer">{`Answer: ${formatValue(data.answer)}`}</div>
          )}
        </div>
      );
    case "generic":
      return renderDataRows(data);
    default:
      return renderDataRows(data);
  }
}

interface AnimationTemplateVisualProps {
  problem: Problem;
  step: number;
}

export function AnimationTemplateVisual({ problem, step }: AnimationTemplateVisualProps) {
  if (!problem.animation) {
    const frames = problem.animationFrames ?? [
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

    const current = frames[Math.min(step, frames.length - 1)];

    return (
      <div className="fmj-visual-card fallback-visual">
        <div className="fallback-steps">
          {frames.slice(0, 3).map((frame, index) => (
            <span key={frame.title || index} className={index === step ? "active" : ""}>
              {index + 1}. {frame.title}
            </span>
          ))}
        </div>
        <div className="fallback-hint">
          <p>{current.visualHint}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fmj-visual-card template-visual">
      <div className="template-card">
        <div className="template-card-heading">
          {ANIMATION_TITLE_MAP[problem.animation.type] ?? "Animated Visual"}
        </div>

        <div className="template-card-body">
          {renderTemplateContent(problem.animation, step)}
        </div>
      </div>
    </div>
  );
}
