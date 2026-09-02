import type { JsonValue, LessonVisualSpec } from "../../types/lesson";

interface VisualPrimitiveHostProps {
  visual: LessonVisualSpec;
}

type JsonObject = { [key: string]: JsonValue };

function asString(value: JsonValue | undefined): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asStringList(value: JsonValue | undefined): string[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }
  return value;
}

function asObjectList(value: JsonValue | undefined): JsonObject[] | null {
  if (
    !Array.isArray(value) ||
    !value.every(
      (item) => item !== null && !Array.isArray(item) && typeof item === "object"
    )
  ) {
    return null;
  }
  return value as JsonObject[];
}

function VisualFallback({ message }: { message: string }) {
  return (
    <div className="fmj-lesson-fallback" role="alert">
      <strong>Visual unavailable</strong>
      <p>{message}</p>
    </div>
  );
}

function ChoiceGrid({ data }: { data: JsonObject }) {
  const groups = asObjectList(data.groups);
  if (!groups) {
    return <VisualFallback message='A choice-grid requires a "groups" array.' />;
  }

  const parsed = groups.map((group) => ({
    label: asString(group.label),
    choices: asStringList(group.choices),
  }));
  if (parsed.some((group) => !group.label || !group.choices)) {
    return (
      <VisualFallback message="Every choice-grid group needs a label and string choices." />
    );
  }

  return (
    <div className="fmj-lesson-choice-grid">
      {parsed.map((group) => (
        <section key={group.label!}>
          <h4>{group.label}</h4>
          <div className="fmj-lesson-chip-row">
            {group.choices!.map((choice, index) => (
              <span key={`${choice}-${index}`}>{choice}</span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BranchTree({ data }: { data: JsonObject }) {
  const root = asString(data.root);
  const paths = Array.isArray(data.paths)
    ? data.paths.map((path) => asStringList(path)).filter((path) => path !== null)
    : [];

  if (!root || paths.length === 0 || paths.length !== (data.paths as JsonValue[])?.length) {
    return (
      <VisualFallback message='A branch-tree requires a "root" and an array of string "paths".' />
    );
  }

  return (
    <div className="fmj-lesson-branch-tree">
      <strong className="fmj-lesson-tree-root">{root}</strong>
      <div className="fmj-lesson-tree-paths">
        {paths.map((path, pathIndex) => (
          <div key={`${path!.join("-")}-${pathIndex}`} className="fmj-lesson-tree-path">
            {path!.map((node, nodeIndex) => (
              <span key={`${node}-${nodeIndex}`}>
                <span aria-hidden="true">→</span>
                <strong>{node}</strong>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function SortIntoCases({ data }: { data: JsonObject }) {
  const cases = asObjectList(data.cases);
  if (!cases) {
    return <VisualFallback message='A sort-into-cases visual requires a "cases" array.' />;
  }

  const parsed = cases.map((item) => ({
    label: asString(item.label),
    items: asStringList(item.items),
  }));
  if (parsed.some((item) => !item.label || !item.items)) {
    return (
      <VisualFallback message="Every case needs a label and an array of string items." />
    );
  }

  return (
    <div className="fmj-lesson-case-grid">
      {parsed.map((item) => (
        <section key={item.label!}>
          <h4>{item.label}</h4>
          <ul>
            {item.items!.map((value, index) => (
              <li key={`${value}-${index}`}>{value}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function OutcomeGrid({ data }: { data: JsonObject }) {
  const rows = asStringList(data.rows);
  const columns = asStringList(data.columns);
  const cells = Array.isArray(data.cells)
    ? data.cells.map((row) => asStringList(row))
    : null;
  const highlighted = new Set(asStringList(data.highlightedCells) ?? []);

  if (
    !rows ||
    !columns ||
    !cells ||
    cells.length !== rows.length ||
    cells.some((row) => !row || row.length !== columns.length)
  ) {
    return (
      <VisualFallback message="An outcome-grid requires rows, columns, and a matching string cell matrix." />
    );
  }

  return (
    <div className="fmj-lesson-table-scroll">
      <table className="fmj-lesson-outcome-grid">
        <thead>
          <tr>
            <th scope="col" aria-label="Row and column labels" />
            {columns.map((column) => (
              <th key={column} scope="col">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row}>
              <th scope="row">{row}</th>
              {cells[rowIndex]!.map((cell, columnIndex) => (
                <td
                  key={`${rowIndex}:${columnIndex}`}
                  className={highlighted.has(`${rowIndex}:${columnIndex}`) ? "highlighted" : ""}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Runtime host for the small visual subset needed by the first lesson
 * benchmarks. Lesson data stays serializable and malformed data fails visibly.
 */
export function VisualPrimitiveHost({ visual }: VisualPrimitiveHostProps) {
  const content = (() => {
    switch (visual.primitive) {
      case "choice-grid":
        return <ChoiceGrid data={visual.data} />;
      case "branch-tree":
        return <BranchTree data={visual.data} />;
      case "sort-into-cases":
        return <SortIntoCases data={visual.data} />;
      case "outcome-grid":
        return <OutcomeGrid data={visual.data} />;
      default:
        return (
          <VisualFallback
            message={`The ${visual.primitive} primitive is not implemented in the minimal lesson renderer.`}
          />
        );
    }
  })();

  return (
    <figure
      className="fmj-lesson-visual"
      aria-label={visual.ariaLabel}
      data-continuity-key={visual.continuityKey}
    >
      {content}
    </figure>
  );
}
