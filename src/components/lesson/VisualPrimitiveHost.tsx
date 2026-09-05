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

function asNumber(value: JsonValue | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asBoolean(value: JsonValue | undefined): boolean | null {
  return typeof value === "boolean" ? value : null;
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

function NumberLine({ data }: { data: JsonObject }) {
  const min = asNumber(data.min);
  const max = asNumber(data.max);
  const tickStep = asNumber(data.tickStep) ?? 1;
  const interval = data.interval === undefined ? null : asObject(data.interval);
  const label = asString(data.label);

  if (
    min === null ||
    max === null ||
    min >= max ||
    tickStep <= 0 ||
    (max - min) / tickStep > 24 ||
    (data.interval !== undefined && !interval)
  ) {
    return (
      <VisualFallback message="A number-line requires min < max, a positive tickStep, at most 25 ticks, and an optional interval object." />
    );
  }

  const lowerValue = interval?.lower;
  const upperValue = interval?.upper;
  const lower = lowerValue === null ? null : asNumber(lowerValue);
  const upper = upperValue === null ? null : asNumber(upperValue);
  const lowerClosed = interval ? asBoolean(interval.lowerClosed) : null;
  const upperClosed = interval ? asBoolean(interval.upperClosed) : null;
  const intervalLabel = interval ? asString(interval.label) : null;
  const hasLower = lower !== null;
  const hasUpper = upper !== null;
  const invalidInterval = Boolean(
    interval &&
      ((lowerValue === undefined || upperValue === undefined) ||
        (lowerValue !== null && lower === null) ||
        (upperValue !== null && upper === null) ||
        (hasLower && (lower! < min || lower! > max || lowerClosed === null)) ||
        (hasUpper && (upper! < min || upper! > max || upperClosed === null)) ||
        (hasLower && hasUpper && lower! > upper!))
  );

  if (invalidInterval) {
    return (
      <VisualFallback message="A number-line interval needs lower and upper bounds (use null for an unbounded side), with closed/open flags for finite endpoints." />
    );
  }

  const ticks: number[] = [];
  for (let value = min; value <= max + tickStep / 1000; value += tickStep) {
    ticks.push(Number(value.toFixed(10)));
  }
  const xAt = (value: number) => 50 + ((value - min) / (max - min)) * 520;
  const shadeStart = xAt(lower ?? min);
  const shadeEnd = xAt(upper ?? max);
  const description = interval
    ? `${intervalLabel ?? "Allowed interval"}: ${hasLower ? `${lowerClosed ? "including" : "greater than"} ${lower}` : "extends left without bound"}, ${hasUpper ? `${upperClosed ? "including" : "less than"} ${upper}` : "extends right without bound"}.`
    : `Number line from ${min} to ${max}.`;

  return (
    <div className="fmj-lesson-number-line">
      <svg viewBox="0 0 620 108" role="img" aria-label={description}>
        <line x1="42" y1="48" x2="578" y2="48" className="fmj-number-line-axis" />
        <path d="M 42 48 L 51 42 L 51 54 Z" className="fmj-number-line-axis-fill" />
        <path d="M 578 48 L 569 42 L 569 54 Z" className="fmj-number-line-axis-fill" />
        {interval && (
          <g>
            <line x1={shadeStart} y1="48" x2={shadeEnd} y2="48" className="fmj-number-line-interval" />
            {!hasLower && <path d="M 45 48 L 58 39 L 58 57 Z" className="fmj-number-line-interval-fill" />}
            {!hasUpper && <path d="M 575 48 L 562 39 L 562 57 Z" className="fmj-number-line-interval-fill" />}
            {hasLower && (
              <circle cx={shadeStart} cy="48" r="8" className={lowerClosed ? "fmj-number-line-endpoint closed" : "fmj-number-line-endpoint"} />
            )}
            {hasUpper && (
              <circle cx={shadeEnd} cy="48" r="8" className={upperClosed ? "fmj-number-line-endpoint closed" : "fmj-number-line-endpoint"} />
            )}
          </g>
        )}
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={xAt(tick)} y1="39" x2={xAt(tick)} y2="57" className="fmj-number-line-tick" />
            <text x={xAt(tick)} y="81" textAnchor="middle" className="fmj-number-line-label">{tick}</text>
          </g>
        ))}
      </svg>
      {(label || intervalLabel) && <p>{intervalLabel ?? label}</p>}
    </div>
  );
}

function DataGraph({ data }: { data: JsonObject }) {
  const xMin = asNumber(data.xMin);
  const xMax = asNumber(data.xMax);
  const yMin = asNumber(data.yMin);
  const yMax = asNumber(data.yMax);
  const xStep = asNumber(data.xStep) ?? 1;
  const yStep = asNumber(data.yStep) ?? 1;
  const xLabel = asString(data.xLabel) ?? "x";
  const yLabel = asString(data.yLabel) ?? "y";
  const rawPoints = asObjectList(data.points) ?? [];
  const line = data.line === undefined ? null : asObject(data.line);
  const riseRun = data.riseRun === undefined ? null : asObject(data.riseRun);

  if (
    xMin === null || xMax === null || yMin === null || yMax === null ||
    xMin >= xMax || yMin >= yMax || xStep <= 0 || yStep <= 0 ||
    (xMax - xMin) / xStep > 20 || (yMax - yMin) / yStep > 20 ||
    (data.points !== undefined && !asObjectList(data.points)) ||
    (data.line !== undefined && !line) ||
    (data.riseRun !== undefined && !riseRun)
  ) {
    return <VisualFallback message="A data-graph requires valid x/y bounds, positive steps, at most 21 grid lines per axis, and optional points, line, and riseRun objects." />;
  }

  const points = rawPoints.map((point) => ({
    x: asNumber(point.x), y: asNumber(point.y), label: asString(point.label),
  }));
  const slope = line ? asNumber(line.slope) : null;
  const intercept = line ? asNumber(line.intercept) : null;
  const lineLabel = line ? asString(line.label) : null;
  const runFromX = riseRun ? asNumber(riseRun.fromX) : null;
  const runFromY = riseRun ? asNumber(riseRun.fromY) : null;
  const run = riseRun ? asNumber(riseRun.run) : null;
  const rise = riseRun ? asNumber(riseRun.rise) : null;
  const riseRunLabel = riseRun ? asString(riseRun.label) : null;
  const invalidDetails =
    points.some((point) => point.x === null || point.y === null || point.x < xMin || point.x > xMax || point.y < yMin || point.y > yMax) ||
    Boolean(line && (slope === null || intercept === null)) ||
    Boolean(riseRun && (runFromX === null || runFromY === null || run === null || rise === null || run === 0));
  if (invalidDetails) {
    return <VisualFallback message="Data-graph points must lie within the graph; a line needs numeric slope/intercept; riseRun needs numeric fromX, fromY, nonzero run, and rise." />;
  }

  const W = 620, H = 360, left = 62, top = 24, plotW = 510, plotH = 276;
  const px = (x: number) => left + ((x - xMin) / (xMax - xMin)) * plotW;
  const py = (y: number) => top + plotH - ((y - yMin) / (yMax - yMin)) * plotH;
  const xs: number[] = [], ys: number[] = [];
  for (let x = xMin; x <= xMax + xStep / 1000; x += xStep) xs.push(Number(x.toFixed(10)));
  for (let y = yMin; y <= yMax + yStep / 1000; y += yStep) ys.push(Number(y.toFixed(10)));
  const lineY0 = slope !== null && intercept !== null ? slope * xMin + intercept : null;
  const lineY1 = slope !== null && intercept !== null ? slope * xMax + intercept : null;
  const rrEndX = runFromX !== null && run !== null ? runFromX + run : null;
  const rrEndY = runFromY !== null && rise !== null ? runFromY + rise : null;

  return (
    <div className="fmj-lesson-data-graph">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Coordinate graph with horizontal axis ${xLabel} from ${xMin} to ${xMax} and vertical axis ${yLabel} from ${yMin} to ${yMax}.`}>
        <defs><clipPath id="fmj-data-graph-plot"><rect x={left} y={top} width={plotW} height={plotH} /></clipPath></defs>
        <rect x={left} y={top} width={plotW} height={plotH} className="fmj-data-graph-field" />
        {xs.map((x) => <g key={`x-${x}`}><line x1={px(x)} y1={top} x2={px(x)} y2={top + plotH} className={x === 0 ? "fmj-data-graph-axis" : "fmj-data-graph-grid"} /><text x={px(x)} y={top + plotH + 22} textAnchor="middle">{x}</text></g>)}
        {ys.map((y) => <g key={`y-${y}`}><line x1={left} y1={py(y)} x2={left + plotW} y2={py(y)} className={y === 0 ? "fmj-data-graph-axis" : "fmj-data-graph-grid"} /><text x={left - 10} y={py(y) + 4} textAnchor="end">{y}</text></g>)}
        <text x={left + plotW / 2} y={H - 8} textAnchor="middle" className="fmj-data-graph-axis-label">{xLabel}</text>
        <text transform={`translate(16 ${top + plotH / 2}) rotate(-90)`} textAnchor="middle" className="fmj-data-graph-axis-label">{yLabel}</text>
        <g clipPath="url(#fmj-data-graph-plot)">
          {lineY0 !== null && lineY1 !== null && <line x1={px(xMin)} y1={py(lineY0)} x2={px(xMax)} y2={py(lineY1)} className="fmj-data-graph-line" />}
          {riseRun && runFromX !== null && runFromY !== null && rrEndX !== null && rrEndY !== null && <g><path d={`M ${px(runFromX)} ${py(runFromY)} H ${px(rrEndX)} V ${py(rrEndY)}`} className="fmj-data-graph-rise-run" /><text x={(px(runFromX) + px(rrEndX)) / 2} y={py(runFromY) + 18} textAnchor="middle">run {run}</text><text x={px(rrEndX) + 9} y={(py(runFromY) + py(rrEndY)) / 2} textAnchor="start">rise {rise}</text></g>}
          {points.map((point, index) => <g key={`${point.x}-${point.y}-${index}`}><circle cx={px(point.x!)} cy={py(point.y!)} r="6" className="fmj-data-graph-point" />{point.label && <text x={px(point.x!) + 9} y={py(point.y!) - 9}>{point.label}</text>}</g>)}
        </g>
      </svg>
      {(lineLabel || riseRunLabel) && <p>{[lineLabel, riseRunLabel].filter(Boolean).join(" · ")}</p>}
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
      case "number-line":
        return <NumberLine data={visual.data} />;
      case "data-graph":
        return <DataGraph data={visual.data} />;
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
