import { motion, useReducedMotion } from "motion/react";
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

function asNumberList(value: JsonValue | undefined): number[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "number")) {
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

function asObject(value: JsonValue | undefined): JsonObject | null {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    return null;
  }
  return value as JsonObject;
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

function PathWalk({ data }: { data: JsonObject }) {
  const prefersReducedMotion = useReducedMotion();
  const positions = asStringList(data.positions);
  const paths = asObjectList(data.paths);

  if (!positions || positions.length < 2 || positions.length > 12 || !paths) {
    return (
      <VisualFallback message='A path-walk requires 2–12 "positions" and a "paths" array.' />
    );
  }

  const parsed = paths.map((path) => ({
    label: asString(path.label),
    moves: asNumberList(path.moves),
  }));
  const destination = positions.length - 1;
  if (
    parsed.some(
      (path) =>
        !path.label ||
        !path.moves ||
        path.moves.length === 0 ||
        path.moves.some((move) => !Number.isInteger(move) || move <= 0) ||
        path.moves.reduce((sum, move) => sum + move, 0) !== destination
    )
  ) {
    return (
      <VisualFallback message="Every path needs a label and positive whole-number moves that reach the last position." />
    );
  }

  const colors = ["#2563eb", "#0d9488", "#7c3aed", "#ea580c", "#db2777"];
  const xAt = (position: number) =>
    28 + (position / destination) * 364;

  return (
    <div className="fmj-lesson-path-walk">
      {parsed.map((path, pathIndex) => {
        let current = 0;
        const stops = [0];
        const commands = path.moves!.map((move) => {
          const start = current;
          current += move;
          stops.push(current);
          const startX = xAt(start);
          const endX = xAt(current);
          const lift = Math.min(27, 13 + move * 4);
          return `M ${startX} 45 Q ${(startX + endX) / 2} ${45 - lift} ${endX} 45`;
        });
        const color = colors[pathIndex % colors.length];

        return (
          <section key={`${path.label}-${pathIndex}`}>
            <strong>{path.label}</strong>
            <svg viewBox="0 0 420 68" role="img" aria-label={`${path.label} moves from ${positions[0]} to ${positions.at(-1)}`}>
              <line x1="28" y1="45" x2="392" y2="45" stroke="#cbd5e1" strokeWidth="2" />
              {positions.map((position, index) => (
                <g key={`${position}-${index}`}>
                  <circle cx={xAt(index)} cy="45" r="5" fill="white" stroke="#64748b" strokeWidth="2" />
                  <text x={xAt(index)} y="64" textAnchor="middle" fontSize="10" fontWeight="800" fill="#475569">
                    {position}
                  </text>
                </g>
              ))}
              <motion.path
                d={commands.join(" ")}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                initial={prefersReducedMotion ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: pathIndex * 0.18 }}
              />
              {stops.map((stop, index) => (
                <motion.circle
                  key={`${stop}-${index}`}
                  cx={xAt(stop)}
                  cy="45"
                  r="4"
                  fill={color}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: pathIndex * 0.18 + index * 0.18 }}
                />
              ))}
            </svg>
          </section>
        );
      })}
    </div>
  );
}

function SlotFiller({ data }: { data: JsonObject }) {
  const groups = asObjectList(data.groups);
  const total = asString(data.total);
  if (!groups) {
    return <VisualFallback message='A slot-filler requires a "groups" array.' />;
  }

  const parsed = groups.map((group) => ({
    label: asString(group.label),
    pattern: asString(group.pattern),
    calculation: asString(group.calculation),
  }));
  if (parsed.some((group) => !group.label || !group.pattern || !group.calculation)) {
    return (
      <VisualFallback message="Every slot-filler group needs a label, pattern, and calculation." />
    );
  }

  return (
    <div className="fmj-lesson-slot-filler">
      <div>
        {parsed.map((group) => (
          <section key={group.label!}>
            <h4>{group.label}</h4>
            <strong>{group.pattern}</strong>
            <code>{group.calculation}</code>
          </section>
        ))}
      </div>
      {total && <p>{total}</p>}
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

function VennBuilder({ data }: { data: JsonObject }) {
  const leftLabel = asString(data.leftLabel);
  const rightLabel = asString(data.rightLabel);
  const universeLabel = asString(data.universeLabel) ?? "Universe";
  const regions = asObject(data.regions);
  const leftOnly = regions ? asStringList(regions.leftOnly) : null;
  const intersection = regions ? asStringList(regions.intersection) : null;
  const rightOnly = regions ? asStringList(regions.rightOnly) : null;
  const neither = regions ? asStringList(regions.neither) : null;

  if (!leftLabel || !rightLabel || !regions || !leftOnly || !intersection || !rightOnly || !neither) {
    return (
      <VisualFallback message='A venn-builder requires set labels and string arrays for the leftOnly, intersection, rightOnly, and neither regions.' />
    );
  }

  const region = (label: string, items: string[], className: string) => (
    <section className={className}>
      <strong>{label}</strong>
      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <span className="fmj-lesson-venn-empty">place items here</span>
      )}
    </section>
  );

  return (
    <div className="fmj-lesson-venn-builder">
      <p className="fmj-lesson-venn-universe">{universeLabel}</p>
      <div className="fmj-lesson-venn-stage">
        <svg viewBox="0 0 600 300" aria-hidden="true" focusable="false">
          <circle cx="230" cy="150" r="132" className="fmj-lesson-venn-left-circle" />
          <circle cx="370" cy="150" r="132" className="fmj-lesson-venn-right-circle" />
        </svg>
        <strong className="fmj-lesson-venn-left-label">{leftLabel}</strong>
        <strong className="fmj-lesson-venn-right-label">{rightLabel}</strong>
        <div className="fmj-lesson-venn-regions">
          {region(`Only ${leftLabel}`, leftOnly, "fmj-lesson-venn-left-only")}
          {region("Both", intersection, "fmj-lesson-venn-intersection")}
          {region(`Only ${rightLabel}`, rightOnly, "fmj-lesson-venn-right-only")}
        </div>
      </div>
      {region("Neither", neither, "fmj-lesson-venn-neither")}
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
      case "path-walk":
        return <PathWalk data={visual.data} />;
      case "branch-tree":
        return <BranchTree data={visual.data} />;
      case "sort-into-cases":
        return <SortIntoCases data={visual.data} />;
      case "outcome-grid":
        return <OutcomeGrid data={visual.data} />;
      case "venn-builder":
        return <VennBuilder data={visual.data} />;
      case "slot-filler":
        return <SlotFiller data={visual.data} />;
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
