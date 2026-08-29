import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const DOWN = "#0ea5e9";
const UP = "#f97316";
const DIM = "#94a3b8";

type Dir = "U" | "D" | "L" | "R";
interface EdgeSpec {
  d: Dir;
  l: number | "X";
}

const DELTA: Record<Dir, [number, number]> = { D: [0, 1], U: [0, -1], R: [1, 0], L: [-1, 0] };

/**
 * A closed rectilinear (all-right-angles) outline with one unknown vertical
 * side X. Since the outline starts and ends at the same height, the vertical
 * edges going down must sum to the same total as the ones going up — the
 * scene walks the given edge list into real vertices, highlights the two
 * groups in turn, sums each, and solves the resulting equation for X. Five
 * beats: (0) the shape; (1) the drops highlight and sum; (2) the rises
 * highlight and sum; (3) the two totals are set equal and simplified;
 * (4) X is solved and the badge lands. Data: { edges: [{d:"D"|"U"|"L"|"R",
 * l:number|"X"}, ...] } — one entry per edge, starting and ending at the
 * same point.
 */
export function RectilinearBalanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rawEdges = Array.isArray(data.edges) ? data.edges : [];
  const edges: EdgeSpec[] = rawEdges.map((e) => {
    const o = (e ?? {}) as Record<string, unknown>;
    const d = (o.d === "U" || o.d === "D" || o.d === "L" || o.d === "R" ? o.d : "R") as Dir;
    const l = o.l === "X" ? "X" : Number(o.l) || 1;
    return { d, l };
  });

  // walk the edges into real vertices
  let x = 0;
  let y = 0;
  const verts: { x: number; y: number }[] = [{ x, y }];
  const downs: { idx: number; l: number | "X" }[] = [];
  const ups: { idx: number; l: number | "X" }[] = [];
  edges.forEach((e, i) => {
    if (e.d === "D") downs.push({ idx: i, l: e.l });
    if (e.d === "U") ups.push({ idx: i, l: e.l });
  });

  const downKnown = downs.filter((d) => d.l !== "X").reduce((s, d) => s + (d.l as number), 0);
  const upKnown = ups.filter((d) => d.l !== "X").reduce((s, d) => s + (d.l as number), 0);
  const xInDowns = downs.some((d) => d.l === "X");
  const xValue = xInDowns ? upKnown - downKnown : downKnown - upKnown;

  // now lay out real coordinates, substituting the solved value for X
  edges.forEach((e) => {
    const len = e.l === "X" ? xValue : e.l;
    const [dx, dy] = DELTA[e.d];
    x += dx * len;
    y += dy * len;
    verts.push({ x, y });
  });

  const downTotal = downKnown + (xInDowns ? xValue : 0);
  const upTotal = upKnown + (!xInDowns ? xValue : 0);
  const answerAgrees = problem.shortAnswer == null || Number(problem.shortAnswer) === xValue;

  const minX = Math.min(...verts.map((v) => v.x));
  const maxX = Math.max(...verts.map((v) => v.x));
  const minY = Math.min(...verts.map((v) => v.y));
  const maxY = Math.max(...verts.map((v) => v.y));
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const UNIT = Math.min(150 / spanX, 150 / spanY);
  const padX = 30;
  const padY = 20;
  const px = (v: number) => (v - minX) * UNIT + padX;
  const py = (v: number) => (v - minY) * UNIT + padY;
  const cx = ((minX + maxX) / 2 - minX) * UNIT + padX;
  const cy = ((minY + maxY) / 2 - minY) * UNIT + padY;

  const W = spanX * UNIT + padX * 2;
  const H = spanY * UNIT + padY * 2;

  const pathD = verts.map((v, i) => `${i === 0 ? "M" : "L"} ${px(v.x).toFixed(1)} ${py(v.y).toFixed(1)}`).join(" ") + " Z";

  const last = totalSteps - 1;
  const showDowns = step >= 1;
  const showUps = step >= 2;
  const showEq = step >= 3;
  const isFinal = step >= last;

  const label = (i: number) => {
    const a = verts[i];
    const b = verts[i + 1];
    const mx = px((a.x + b.x) / 2);
    const my = py((a.y + b.y) / 2);
    const away = { x: mx - cx, y: my - cy };
    const mag = Math.hypot(away.x, away.y) || 1;
    const lx = mx + (away.x / mag) * 13;
    const ly = my + (away.y / mag) * 13;
    return { x: lx, y: ly + 3 };
  };

  const groupColor = (i: number) => {
    if (showUps && ups.some((u) => u.idx === i)) return UP;
    if (showDowns && downs.some((d) => d.idx === i)) return DOWN;
    return INK;
  };

  const downsExpr = downs.map((d) => (d.l === "X" ? "X" : String(d.l))).join(" + ");
  const upsExpr = ups.map((u) => String(u.l)).join(" + ");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 300 }}>
        {edges.map((e, i) => {
          const a = verts[i];
          const b = verts[i + 1];
          const isUnknown = e.l === "X";
          const color = groupColor(i);
          return (
            <g key={i}>
              <motion.line
                x1={px(a.x)}
                y1={py(a.y)}
                x2={px(b.x)}
                y2={py(b.y)}
                stroke={isFinal && isUnknown ? WIN : color}
                strokeWidth={color === INK ? 2 : 3}
                strokeLinecap="square"
                initial={false}
                animate={{ stroke: isFinal && isUnknown ? WIN : color }}
                transition={{ duration: 0.3 }}
              />
              {(e.d === "U" || e.d === "D") && (
                <text
                  x={label(i).x}
                  y={label(i).y}
                  textAnchor="middle"
                  fontSize={isUnknown ? 12 : 10}
                  fontWeight={isUnknown ? 800 : 700}
                  fill={isFinal && isUnknown ? WIN : isUnknown ? MARK : "#64748b"}
                  fontFamily={numberFont}
                >
                  {isUnknown ? (isFinal ? String(xValue) : "X") : String(e.l)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{ minHeight: 18, textAlign: "center" }}>
        {!showDowns && (
          <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: DIM }}>all angles are right angles</span>
        )}
      </div>

      <AnimatePresence>
        {showDowns && (
          <motion.div
            key="downs"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 800, color: DOWN, textAlign: "center" }}
          >
            drops: {downsExpr}
            {!showEq ? "" : ` = ${downTotal}`}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showUps && (
          <motion.div
            key="ups"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 800, color: UP, textAlign: "center" }}
          >
            rises: {upsExpr} = {upTotal}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEq && (
          <motion.div
            key="eq"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: isFinal ? WIN : INK, textAlign: "center" }}
          >
            {xInDowns ? `${downKnown} + X = ${upTotal}` : `${downTotal} = ${upKnown} + X`}
            {isFinal ? `  →  X = ${xValue}` : ""}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !answerAgrees && (
          <motion.div
            key="warn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: numberFont, fontSize: 10, fontWeight: 700, color: "#dc2626", textAlign: "center" }}
          >
            computed X = {xValue}, which does not match the stored answer
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
