import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#cbd5e1";
const WIN = "#16a34a";
const WARN = "#f59e0b";
const BAD = "#dc2626";

// pip layout for a die face, in a 3x3 of offsets
const PIPS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-1, -1], [1, 1]],
  3: [[-1, -1], [0, 0], [1, 1]],
  4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]],
  6: [[-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]],
};

function Die({ n, cx, cy, size }: { n: number; cx: number; cy: number; size: number }) {
  const r = size * 0.09;
  const d = size * 0.27;
  return (
    <g>
      <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={size * 0.2} fill="#fff" stroke="#94a3b8" strokeWidth={1.4} />
      {(PIPS[n] ?? []).map(([px, py], i) => (
        <circle key={i} cx={cx + px * d} cy={cy + py * d} r={r} fill={INK} />
      ))}
    </g>
  );
}

/**
 * Two dice rolled, the product required to be a multiple of k, asking which sum
 * is impossible. Every roll is a cell of a sides x sides table holding its
 * product; the cells whose product is a multiple of k light up, and each sum is
 * a diagonal of that table — so the impossible sum is simply the diagonal that
 * misses every lit cell. Lit cells, the diagonals and which of them are empty
 * are all computed, and the scene flags it if the choices do not single one out.
 * Data: { sides, multipleOf, candidates:[...] }.
 */
export function DiceSumGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const sides = Math.round(num(data.sides, 6));
  const mult = Math.round(num(data.multipleOf, 6));
  const cands = (Array.isArray(data.candidates) ? data.candidates : []).map((v) => Math.round(num(v, 0))).filter((v) => v > 1);

  const lit = (a: number, b: number) => (a * b) % mult === 0;
  let litCount = 0;
  for (let a = 1; a <= sides; a++) for (let b = 1; b <= sides; b++) if (lit(a, b)) litCount++;

  // cells on the sum diagonal, and whether any of them is lit
  const diagCells = (s: number) => {
    const out: [number, number][] = [];
    for (let a = 1; a <= sides; a++) {
      const b = s - a;
      if (b >= 1 && b <= sides) out.push([a, b]);
    }
    return out;
  };
  const reaches = (s: number) => diagCells(s).some(([a, b]) => lit(a, b));
  const empties = cands.filter((s) => !reaches(s));
  const culprit = empties.length ? empties[0] : null;
  const unique = empties.length === 1;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showLit = step >= 1 || isFinal;
  const showDiags = step >= 2 || isFinal;

  // ---- geometry ----
  const c = 40;
  const X0 = 56;
  const Y0 = 64;
  const W = 340;
  const H = Y0 + sides * c + 14;
  const cxOf = (b: number) => X0 + (b - 0.5) * c;
  const cyOf = (a: number) => Y0 + (a - 0.5) * c;

  // the diagonal x + y = K clipped to the grid box, then pushed out at both ends
  const diagLine = (s: number) => {
    const K = X0 + Y0 + (s - 1) * c;
    const hiX = Math.min(X0 + sides * c, K - Y0);
    const loX = Math.max(X0, K - (Y0 + sides * c));
    const e = 9;
    return { x1: loX - e, y1: K - loX + e, x2: hiX + e, y2: K - hiX - e };
  };

  // the empty diagonal stays amber until its own beat convicts it
  const diags = cands.map((s, i) => {
    const ok = reaches(s);
    return {
      s,
      i,
      ok,
      isCulprit: s === culprit,
      tone: ok ? WIN : isFinal ? BAD : WARN,
      wash: ok ? "#dcfce7" : isFinal ? "#fee2e2" : "#fef3c7",
      ink: ok ? "#166534" : isFinal ? BAD : "#92400e",
      ...diagLine(s),
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 330 }}>
        {/* the two dice, as the row and column headers */}
        {Array.from({ length: sides }).map((_, i) => (
          <motion.g
            key={`ch${i}`}
            initial={{ opacity: 0, scale: 0.4, rotate: -35 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.05 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <Die n={i + 1} cx={cxOf(i + 1)} cy={18} size={24} />
          </motion.g>
        ))}
        {Array.from({ length: sides }).map((_, i) => (
          <motion.g
            key={`rh${i}`}
            initial={{ opacity: 0, scale: 0.4, rotate: 35 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 + i * 0.05 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <Die n={i + 1} cx={X0 - 20} cy={cyOf(i + 1)} size={24} />
          </motion.g>
        ))}

        {/* the sum diagonals run under the grid, so they never cross a digit:
            what shows is the chain of gaps where the cells meet corner to corner */}
        <AnimatePresence>
          {showDiags &&
            diags.map((d) => (
              <motion.line
                key={`d${d.s}`}
                x1={d.x1}
                y1={d.y1}
                x2={d.x2}
                y2={d.y2}
                stroke={d.tone}
                strokeWidth={d.isCulprit && isFinal ? 19 : 15}
                strokeLinecap="round"
                initial={{ opacity: 0, pathLength: 0 }}
                animate={{ opacity: isFinal && !d.isCulprit ? 0.3 : 1, pathLength: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, delay: d.i * 0.12 }}
              />
            ))}
        </AnimatePresence>

        {/* one cell per roll, holding the product */}
        {Array.from({ length: sides }).map((_, ai) =>
          Array.from({ length: sides }).map((__, bi) => {
            const a = ai + 1;
            const b = bi + 1;
            const on = lit(a, b);
            const onCulprit = isFinal && culprit != null && a + b === culprit;
            const fill = showLit ? (on ? "#dcfce7" : onCulprit ? "#fee2e2" : "#f8fafc") : "#eef2ff";
            const edge = showLit ? (on ? WIN : onCulprit ? BAD : "#e8edf3") : "#c7d2fe";
            const ink = showLit ? (on ? "#166534" : onCulprit ? BAD : DIM) : INK;
            return (
              <motion.g
                key={`${a}-${b}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.15 + (ai + bi) * 0.035 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect
                  x={cxOf(b) - c / 2 + 4}
                  y={cyOf(a) - c / 2 + 4}
                  width={c - 8}
                  height={c - 8}
                  rx={6}
                  fill={fill}
                  stroke={edge}
                  strokeWidth={on && showLit ? 1.8 : 1.1}
                />
                <text x={cxOf(b)} y={cyOf(a) + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={ink} fontFamily={numberFont}>
                  {a * b}
                </text>
              </motion.g>
            );
          })
        )}

        {/* each diagonal is tagged with the sum it stands for */}
        <AnimatePresence>
          {showDiags &&
            diags.map((d) => (
              <motion.g
                key={`c${d.s}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: isFinal && !d.isCulprit ? 0.35 : 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.3 + d.i * 0.12 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <circle cx={d.x2 + 8} cy={d.y2 - 8} r={11} fill={d.wash} stroke={d.tone} strokeWidth={1.8} />
                <text x={d.x2 + 8} y={d.y2 - 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={d.ink} fontFamily={numberFont}>
                  {d.s}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* on the last beat, ring the rolls that add to the impossible sum */}
        <AnimatePresence>
          {isFinal &&
            culprit != null &&
            diagCells(culprit).map(([a, b], i) => (
              <motion.rect
                key={`x${a}`}
                x={cxOf(b) - c / 2 + 4}
                y={cyOf(a) - c / 2 + 4}
                width={c - 8}
                height={c - 8}
                rx={6}
                fill="none"
                stroke={BAD}
                strokeWidth={2.4}
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.3 + i * 0.07 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
        </AnimatePresence>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#991b1b" : showLit ? "#166534" : "#4338ca",
          background: isFinal ? "#fee2e2" : showLit ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#fecaca" : showLit ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showLit
          ? `${sides} × ${sides} = ${sides * sides} rolls, each with its product`
          : !showDiags
          ? `${litCount} of them have a product that is a multiple of ${mult}`
          : !isFinal
          ? `each sum is a diagonal — ${cands.filter(reaches).join(", ")} all cross a green cell`
          : culprit != null
          ? `sum ${culprit}: ${diagCells(culprit).map(([a, b]) => a * b).join(", ")} — none is a multiple of ${mult}`
          : `every listed sum is reachable`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: unique ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {unique
              ? `the only diagonal of the five with no green cell`
              : `these choices do not single out one sum: ${empties.join(", ") || "none"}`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
